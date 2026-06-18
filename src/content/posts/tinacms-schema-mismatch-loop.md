---
title: "When TinaCMS won't build: the stale lock file loop"
description: "A schema change in TinaCMS broke the deploy with a 'local schema doesn't match remote' error. Here is what caused it and how to break out of the loop."
category: "Infra"
tags: ["tinacms", "astro", "github-pages", "ci-cd"]
date: 2026-06-18
draft: false
---

A static site built with Astro, TinaCMS, and GitHub Pages keeps its content as Markdown files in the repository. TinaCMS adds an editing UI on top of those files. The setup runs fine until the content schema changes. This post describes a failure that shows up the first time a new collection is added, and the steps that clear it.

## The setup

Content lives in the repo as Markdown. Astro reads those files at build time and renders the static pages. TinaCMS Cloud provides the online editor and commits edits back to the repo. Deployment runs through GitHub Actions. A push to `main` runs `tinacms build` and then `astro build`, and the output goes to GitHub Pages.

The editor schema is defined in `tina/config.ts`. There is also a generated file, `tina/tina-lock.json`, which holds the compiled GraphQL schema. TinaCMS Cloud uses that compiled schema when it indexes the repository.

## What broke

The trigger was a small feature: making the homepage text editable from the CMS. That meant adding a new collection (`home`) to `tina/config.ts` and a matching `home.json` content file.

After the change was pushed, the deploy failed at the `tinacms build` step:

> The local GraphQL schema doesn't match the remote GraphQL schema. Please push up your changes to GitHub to update your remote GraphQL schema.

The message points at the right area, but the obvious next step does nothing. The change was already pushed. Re-running the deploy gave the same error.

## The actual cause

Two facts combine into a loop.

First, `tinacms build` compares the local schema against the schema that TinaCMS Cloud has indexed. If they differ, it stops before doing anything else.

Second, that comparison runs before the lock file gets rewritten. So every build attempt failed at the check, and `tina/tina-lock.json` was never regenerated with the new `home` collection. The committed lock file stayed on the old schema.

TinaCMS Cloud reads its schema from that committed lock file when it indexes. The lock had no `home` type, so the indexed schema had no `home` type either. The local config did have it. The two never matched, and the step that would update the lock could not run, because the same mismatch stopped it first.

Adding `--local` did not help. That flag still performs the remote check.

A manual reindex from the TinaCMS Cloud dashboard did not fix it on its own. It reindexed the repository, but the repository still carried the stale lock file, so the indexed schema came back the same.

## The fix

The lock file has to be regenerated outside the failing remote check, then committed.

`tinacms dev` does that. It starts a local content layer, indexes the files on disk, and writes `tina/tina-lock.json` from the current config. It does not gate on the remote schema. Running it for a few seconds is enough to produce a fresh lock that includes the new collection.

The steps:

1. Start the dev server long enough for it to write the lock file:

   ```bash
   npx tinacms dev -c "sleep 60"
   ```

2. Confirm the new collection appears in the lock file, then stop the server:

   ```bash
   grep -c "home" tina/tina-lock.json
   ```

3. Commit and push the regenerated lock:

   ```bash
   git add tina/tina-lock.json
   git commit -m "regenerate tina-lock with home collection"
   git push origin main
   ```

4. Let TinaCMS Cloud reindex the new lock. A manual reindex from the dashboard speeds this up when the webhook is slow.

5. Check that the schemas agree. Once `npx tinacms build` stops reporting the mismatch, the deploy passes.

With the lock in sync, the deploy ran cleanly and the editable homepage went live.

## Takeaways

The `tina/tina-lock.json` file is part of the source, not a throwaway artifact. Any change to `tina/config.ts` needs a matching lock update committed alongside it. Doing both in the same change avoids the loop.

When the mismatch error does appear and a normal build cannot clear it, `tinacms dev` is the tool that regenerates the lock without the remote check.

A manual reindex is sometimes required. The automatic webhook from the TinaCMS GitHub App is not always reliable, which is why the dashboard keeps a reindex button for this case.
