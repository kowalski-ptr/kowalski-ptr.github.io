---
title: "Two ways a static blog deploy breaks: Pages mode and one bad frontmatter"
description: "A green local build and a failing deploy usually come down to one of two causes on Astro plus GitHub Pages. Here is how to spot and fix each."
category: "Infra"
tags: ["github-pages", "astro", "ci-cd", "jekyll", "debugging", "lang:en"]
date: 2026-06-21
draft: false
---

A static blog on Astro and GitHub Pages is simple until a deploy goes red for no
obvious reason. The build worked yesterday. The local build still works. Yet the
pipeline fails. Two causes explain most of these moments. Both are easy to fix once
you know where to look.

## Cause 1: GitHub Pages switched to the wrong build mode

GitHub Pages has two ways to publish.

- Deploy from a branch (the legacy mode). GitHub runs its default builder, Jekyll,
  over the repository.
- GitHub Actions. Your own workflow builds the site and publishes the result.

Astro is not Jekyll. When the mode is set to Deploy from a branch, Jekyll tries to
process the repo as if it were a Jekyll site. It reads source files that it should
never touch, treats their top section as its own front matter, and fails to parse
them. The error log then points at files like components or layouts, which has
nothing to do with your actual content. That mismatch is the tell: Jekyll is
complaining about files that are not Jekyll's to read.

There is a second symptom. When Pages is in legacy mode, the deploy step of your own
GitHub Actions workflow gets rejected, because that step requires Pages to be set to
the GitHub Actions source. So the build half of your workflow passes, and the deploy
half fails. It looks like your pipeline broke, when the real problem is a setting.

The fix is to set the Pages source back to GitHub Actions. You can check and change
it from the repository settings, or from the API:

```bash
# check current mode
gh api repos/<owner>/<repo>/pages --jq '.build_type'

# set it to the GitHub Actions workflow
gh api -X PUT repos/<owner>/<repo>/pages -f build_type=workflow
```

Once the mode is `workflow`, the default Jekyll builder stops running and your
workflow's deploy step is accepted again.

## Cause 2: one invalid frontmatter field fails the whole build

A content collection validates each post's frontmatter against a schema. The
important part: a single invalid file stops the entire build, not just its own page.

Common ways frontmatter goes wrong:

- the opening and closing `---` block is missing, so the file has no frontmatter at all,
- a field name is misspelled, so a required field looks absent,
- a required field such as the title is missing,
- the date is not a valid date.

The build error names the file and the field, for example "title: Required" or
"date: Invalid date". That message is precise, so read it first. It tells you exactly
which post and which field to fix.

Three ways to avoid the problem:

- Copy the frontmatter block from a post that already works, then change the values.
  This avoids typos in field names and structure.
- Write through a CMS or a templated command that fills the fields for you. When the
  fields come from a form, they stay valid and you cannot misspell a key.
- Build locally before pushing. A local `npm run build` catches the same schema error
  in seconds, long before the pipeline does.

## The habit that makes both easy: push one post at a time

When a batch of new posts goes up in a single push and the build fails, the log shows
one error, but you still do not know which of the new files is at fault until you read
it carefully. With ten new posts, that is ten suspects.

Push one post per commit instead. If the build fails, the cause is the post you just
added. There is nothing else to check. The deploy is a little slower across many
posts, but each failure is isolated to a single file, and debugging stops being a
search.

## Checklist

- Deploy fails but the local build passes: check the Pages build mode first. It
  should be GitHub Actions, not Deploy from a branch.
- The log mentions files that are not your content (components, layouts): that is the
  default Jekyll builder running by mistake. Same fix as above.
- The log names a post and a field: fix that frontmatter field. Copy a working block
  if unsure.
- Adding several posts: push them one at a time so a failure points straight at the
  cause.
