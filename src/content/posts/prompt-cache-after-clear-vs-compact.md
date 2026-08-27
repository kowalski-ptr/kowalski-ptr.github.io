---
title: "Does Prompt Cache Survive /clear? Yes — But Not for the Reason You'd Guess"
description: "A breakdown of what actually gets cached in an agentic coding session, why /clear doesn't throw it away, and why a hand-written handoff file beats /compact for starting a new session cheaply."
category: "AI / LLM"
tags: ["llm", "claude", "prompt-caching", "context-window", "agents", "workflow", "lang:en"]
date: 2026-08-05
draft: true
---

# Does Prompt Cache Survive /clear? Yes — But Not for the Reason You'd Guess

Short answer: the cache is shared, but the conversation context is NOT inherited — and that distinction is exactly why the whole approach pays off.

It's worth breaking this down carefully, because it's easy to draw the wrong conclusion here.

## What actually gets cached

Anthropic's prompt cache works on a token *prefix* — the match has to be byte-for-byte identical starting from the very first token. In an agentic coding session, that prefix is made up of: the harness's system prompt, the tool definitions, project and global configuration files (like `CLAUDE.md`), any files loaded into context, and stored user memories.

This block is identical after running `/clear`, because it's regenerated from the exact same files on disk, in the exact same working directory. So yes — this segment lands in the cache left behind by the previous session. (Cache entries have a TTL, typically around one hour, after which they expire and have to be rebuilt from scratch.)

## What you do NOT inherit

You don't inherit the conversation that happened before `/clear` — the tool calls, the model's responses, the contents of files it read along the way. And this is the important part: **that's an advantage, not a loss.**

Here's why. Every one of those tokens was being re-sent with *every single subsequent request* for as long as the conversation continued. The context kept growing, and every turn paid to carry the entire history along with it — even at the cheaper cache-read price, it was still a cost, and it kept compounding as the conversation got longer.

## Comparing this to /compact

This is the natural next question: how does clearing-with-a-handoff-file compare to using `/compact`, which is designed to shrink the conversation instead of wiping it?

| | `/compact` | `/clear` + handoff file |
|---|---|---|
| **One-time cost** | The model has to read the *entire* conversation to produce a summary — the single most expensive operation in a session's lifecycle | Reading one file (a short handoff note, roughly 10 KB) |
| **Cache state afterward** | The static prefix still hits, but everything after it is brand-new tokens (the summary itself) → a miss on the tail | The static prefix hits, and the tail is nearly empty |
| **What survives** | A summary the model itself produced — meaning whatever the model judged important, complete with whatever it happened to miss | A file written deliberately, with anchors, a symptom table, explicit assertions — written by a human, with intent |
| **Starting context window** | Starts already loaded with the summary | Starts clean |

## The actual engineering conclusion

The instinct that this saves money is correct, but the mechanism behind it isn't what it first seems. The savings don't come from "inheriting the cache" — you get that either way, since the prefix is identical regardless of which approach you use. The savings come from **not paying to compress the history, and not paying to keep carrying it forward.**

A handoff file is a compression step done by hand, once, without the model acting as its own summarizer. That's the whole difference. `/compact` makes the model re-read and re-encode the entire conversation to produce a summary; a handoff file is written once, deliberately, by a human who already knows what matters.

## The one condition that makes this work

The handoff file has to be written **before** running `/clear`, while the context is still alive and the model still has full access to everything that happened. If you run `/clear` without writing a handoff first, you lose everything, and rebuilding that context afterward means re-deriving it through searches and re-reading files from scratch — which ends up costing more than `/compact` would have.

If you already have a habit of writing a handoff note before clearing, this mode is functionally better for you than relying on `/compact`. The practical recommendation: keep using handoff-note-then-`/clear` as your default pattern.

## One caveat worth stating clearly

Running `/clear` doesn't reset any counter on the API side, and it doesn't free up the cache early — it simply means you stop using that cached prefix for the tail of a new conversation. The cache entry itself just expires naturally once its TTL runs out, independent of anything you do locally.
