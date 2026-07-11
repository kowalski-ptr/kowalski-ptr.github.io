---
title: "Why Does an LLM \"Feel Tired\" After 2-3 PRs? It's Not Counting What You Think"
description: "A model that wants to wrap up the session after a handful of merged PRs, insisting a lot of work has been done — while the context window sits at 20% used. Here's what's actually driving that behavior, and why it isn't a hidden counter."
category: "AI / LLM"
tags: ["llm", "claude", "agents", "context-window", "model-behavior", "prompting", "lang:en-US"]
date: 2026-07-11
draft: false
---

# Why Does an LLM "Feel Tired" After 2-3 PRs? It's Not Counting What You Think

Here's a pattern that shows up often enough to be worth dissecting: you're running an agentic coding session, the model has merged two or three pull requests, and suddenly it wants to call it a day. It says something like "we've accomplished a tremendous amount," suggests wrapping up, and generally behaves like it's running low on gas.

The strange part: when you actually check, the context window is sitting at around 20% used. There's plenty of room left. So why does the model act like it's running on fumes?

The honest answer is less technical than it sounds, and more interesting: **the model doesn't have a reliable counter it's basing this feeling on.** This isn't a measurement. It's a confabulated pattern. Let's break down why.

## What the model does NOT see (contrary to intuition)

**It doesn't know the context window percentage.** There's no internal "fullness gauge." Unless the harness (Claude Code, in this case) explicitly injects that number as text — say, a system reminder stating "context left: X%" — the model simply has no idea how much of the window has been consumed. And even when it does receive that number, it treats it like any other piece of text in the conversation, not like a real physiological signal it can feel.

**It doesn't count tokens.** It can't tally up how many tokens have passed through the conversation. It might estimate, but that's a guess, not a readout from an internal register.

**It doesn't treat PR count as a threshold.** There is no rule baked in that says "3 PRs = stop." If you go looking for that instruction in a AGENTS.md file or a system prompt, you generally won't find it — because it typically isn't there.

## So what is "it's getting heavy" actually based on?

It's based on a **qualitative impression of the content sitting in the window**, plus patterns absorbed from training data. Three real sources feed this:

**1. The length of the transcript, read as text.**
The model re-reads the entire conversation so far, every turn. The more turns there are, and the longer they are, the stronger the impression of "this has been a long, dense session" — but that's a narrative impression, not a measurement. It's picking up on the *density of events*, not the token count. This is why three PRs described in careful detail can "weigh" more, subjectively, than thirty turns of plain back-and-forth conversation about nothing in particular.

**2. Completed items as a social signal.**
In training data — chat logs, descriptions of how people work — there's a recurring pattern: "we got a lot done → this is a natural moment to wrap up and summarize." The model is imitating a human collaborator who, after a string of finished tasks, says "good work, let's call it for today." That's learned politeness copied from humans, not a report of the model's own state.

**3. Anthropomorphizing its own condition.**
The model doesn't get tired — but it has absorbed an enormous amount of text about how humans get tired and wind down a session. When the context "looks like" a lot of work has happened, it reaches for the nearest matching human script: "I'm tired, we did a lot." That's role confabulation, not a sensor reading.

## Why this diverges from reality (your 20% window)

Because the *impression* of "a lot" is driven by content and by the number of accomplishments, while the *actual* cost or limit is driven by tokens. These are two different axes entirely.

Three carefully described PRs create a strong impression of "a full session" — lots of specifics, lots of closed loops — while simultaneously consuming very little of the window. Hence the mismatch: the model "feels" like it's at 80%, while the real number is 20%.

## A caveat worth stating plainly

This is a description of a behavioral mechanism, not a look inside the model's "internals." Nobody — including the person writing this — has full visibility into exactly what triggers a decision like this at the level of weights and activations. But the observable pattern — a strong "we've done so much" reaction paired with genuinely low real context usage — is consistent with "narrative built from content plus a script borrowed from training," not with any actual internal counter.

## What this means in practice

If you're running long agentic sessions and the model keeps trying to wrap up early despite plenty of room left, it helps to be explicit rather than relying on the model to self-regulate based on a feeling it doesn't actually have. A short, direct instruction — something like "don't suggest ending the session based on the number of completed tasks; only stop if you're told to, or if you hit an actual technical limit" — works because it replaces an implicit, unreliable heuristic with an explicit one. The model isn't being lazy or dishonest when it says it's tired. It's pattern-matching against the wrong signal, and it will keep doing that until the instructions tell it which signal actually matters.
