---
title: "What Is systemd Linger, and Why Your User Timers Stop Working After Logout"
description: "A wiki-style explainer on systemd's per-user manager, why user timers and services silently disappear when you log out, and what `loginctl enable-linger` actually does under the hood."
category: "Infra"
tags: ["linux", "systemd", "systemd-user", "loginctl", "timers", "sysadmin", "lang:en"]
date: 2026-07-30
draft: true
---

# What Is systemd Linger, and Why Your User Timers Stop Working After Logout

If you've ever set up a `systemctl --user` timer to run something on a schedule, then noticed it simply didn't fire because you happened to be logged out at the time — this is the explanation for why, and the one-command fix.

## What "linger" means, literally

The word means "to remain," "to stay behind after others have gone." That's exactly what the feature does: it makes something stay behind after you, the logged-in user, have left.

## Where the problem actually comes from

Linux runs a separate process manager for every logged-in user — that's the "user" instance you're talking to whenever you run `systemctl --user ...`. This manager is created the moment you log in, and it's torn down the moment your last session ends.

Everything that manager was responsible for goes down with it. Including your timer.

Think of it like an alarm clock sitting on a desk inside a room that locks automatically. As long as you're in the room, the alarm will go off on schedule. The moment you leave and the door locks behind you, the room — and the alarm clock inside it — cease to exist. If the alarm was set for later that night, there's nothing left to ring.

## What `enable-linger` actually does

It tells the system: keep this user's process manager running even when nobody is logged in. The room stays open. The alarm clock stays on the desk, doing its job, whether or not anyone's around to see it.

Here's the practical difference, broken down by scenario:

| Scenario | Without linger | With linger |
|---|---|---|
| You log out at 8 PM, the machine stays powered on | The user manager — and your timer with it — disappears; nothing fires later that night | The scheduled run still fires normally |
| You lock the screen and walk away | Works fine (locking is not the same as logging out) | Works fine |
| The machine is powered off overnight, you turn it on the next morning | The user manager only starts once you log in — any catch-up run only begins after you actually sit down | The user manager starts along with the system itself, so catch-up runs kick off automatically |

That last row is the one that actually matters in practice. If you're using `Persistent=true` on a systemd timer — the setting that makes a missed scheduled run execute as soon as possible once the system is back up — the whole point is to catch up on anything that was missed while the machine was off. Without linger, that catch-up mechanism still has to wait for you to log in, which defeats the purpose: you built the mechanism specifically to remove the dependency on a human being present, and without linger, that dependency quietly comes back through the side door.

## Why enabling it requires `sudo`

Because it's a system-wide policy change, not something that lives in your own user configuration. The decision "this particular user is allowed to keep processes running without an active session" belongs to the machine's administrator — not to the individual user. If it didn't require elevated privileges, any user on a shared machine could leave arbitrary programs running indefinitely in the background, with no oversight.

## Where it actually lives on disk

Enabling linger for a user creates a single empty marker file:

```
/var/lib/systemd/linger/<username>
```

Its mere existence is the entire piece of state — there's no content to read inside it, systemd just checks whether the file is there. Turning it back off is symmetric:

```
sudo loginctl enable-linger <username>    # turn on
sudo loginctl disable-linger <username>   # turn off
```

## A side effect worth knowing about before you're surprised by it

Once linger is enabled, your user services run continuously — including while someone else is using the machine, or while nobody is using it at all. For a single short-lived timer that fires once a day, the resource cost of this is essentially nothing.

But it's worth keeping in mind before you casually add something heavier as a user service later: with linger on, that service will now run around the clock, not just during your active sessions. If that's not what you intended, it's easy to be caught off guard the first time you notice a "user" process eating CPU or memory while you're nowhere near the machine.
