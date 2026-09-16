---
title: "Why Fedora Won't Just Patch a Broken Firmware File (and How to Fix It Yourself When It Ships Broken)"
description: "A broken AMD GPU firmware blob killed USB-C display output after a routine update. Here's the supply-chain reasoning behind why the distro won't hand-patch a single binary file, and the six-step process to fix it yourself without waiting for upstream."
category: "Infra"
tags: ["linux", "firmware", "amdgpu", "fedora", "kernel", "dracut", "debugging", "lang:en"]
date: 2026-09-16
draft: true
---

# Why Fedora Won't Just Patch a Broken Firmware File (and How to Fix It Yourself When It Ships Broken)

A routine firmware package update broke USB-C display output on an AMD laptop GPU. The fix, once found, was three commands. Getting there required understanding a supply chain, a distribution's deliberate policy about not touching that supply chain, and one very easy mistake to make along the way. This is both stories: why the distro maintainer won't just hand-patch a broken file, and the actual debugging path that gets you a working display again without waiting for upstream.

## The supply chain: who does what

Think of it like a retail supply chain for a physical product.

**The vendor (AMD)** writes the firmware — a small program that runs *inside* the GPU itself, not inside Linux. It's delivered as a finished, closed binary file — a "blob" (short for binary large object: a package of bytes nobody outside the vendor can read or modify, because there's no available source code).

**Upstream (the kernel.org `linux-firmware` project)** is the shared, central repository where every hardware vendor — AMD, Intel, Realtek, Qualcomm, and others — drops their binary blobs. The maintainers of that repository periodically cut a **tag**: a dated snapshot (something like `20260910`) that they designate as an official release.

**The distribution (in this case, Fedora, maintained by its firmware package maintainer)** takes one of those tags, packages it as an RPM, and ships it to users. It changes nothing inside.

## "Only official tags, no local patches" — why that rule exists

This is a deliberate policy: the distribution acts as a courier, not a repair shop. It takes the sealed package from upstream and hands it onward exactly as received — no opening it, no swapping parts inside. This buys two things:

- Every user of every distribution pulling from the same tag has byte-identical firmware, which means problems are comparable and reproducible across the whole ecosystem, not just on one distro.
- When something breaks, there's exactly one place responsible for the fix — upstream — instead of a hundred distro-specific "improvements" that would each need independent tracking and could each drift out of sync with the next official release.

## "A manual revert of one file is the exception, not the rule"

The obvious shortcut is tempting: just take the old, working firmware file and drop it into the new package before shipping. Technically simple — and it's exactly what gets done on an individual machine to fix things locally (see below). But doing that at the *distribution* level means shipping a package that doesn't correspond to any official tag anymore — a hybrid of "the new tag, except for one file from three weeks ago." That kind of package is a one-off nobody else has tested, and it has to be actively remembered and re-applied so the next real update doesn't silently drop the fix. A maintainer would rather tell the vendor "fix this in your own repository, and I'll pick up the next tag" — which is exactly what happened here: the vendor reverted the bad change upstream, a new tag went out, and the distribution packaged that.

## The actual root cause: firmware that fails signature verification

AMD's chips have a small onboard guard called the **PSP (Platform Security Processor)**. Before the GPU runs any firmware at all, the PSP checks its digital signature — like a security guard checking a badge before letting someone through a door. The firmware blob shipped in the broken tag failed that check outright, throwing errors along the lines of "failed to load ucode DMCUB" and "Error getting DMUB FW meta info." The practical result: the GPU's display microcontroller (DMUB) never started at all, so the GPU had no way to negotiate a display link over USB-C.

That's an uncomfortable conclusion for the vendor: if anyone had run that exact file even once on the affected chip family before shipping it, the failure would have shown up in the very first second. Something got released without the most basic hardware smoke test on the platform it was meant for — a fact the vendor's own engineer acknowledged in the public bug discussion, essentially saying they'd investigate internally what went wrong.

## Why a fast local revert is riskier than it looks

This is where the earlier "we don't hand-patch a single file" argument comes back around, and it's not just abstract policy — it's a real, demonstrated risk. If the vendor itself shipped a file that was broken without catching it, then a distribution maintainer — who doesn't have physical access to test hardware across hundreds of GPU models — moving fast under pressure could just as easily make an equivalent mistake.

Here's a concrete example of exactly that trap, encountered firsthand while working through the fix on real hardware: the very first attempt reverted the wrong file — `dcn_3_1_5_dmcub.bin` — when the actually-affected chip family needed `yellow_carp_dmcub.bin` instead. AMD names its chip families with internal codenames inside the firmware package, and the naming is genuinely confusing when the package contains thousands of similarly-named files. A mistake like that costs one extra reboot when it's a single machine. The same mistake baked into a package shipped to every user of a distribution would go out to everyone.

## In one sentence

A distribution ships firmware the way a courier delivers a sealed package from a manufacturer: when the manufacturer puts a defective part inside, the courier doesn't break the seal and swap in an old part themselves — they wait for the manufacturer to send a corrected package, because the manufacturer is the one with the tools to actually verify everything fits together correctly this time.

---

## Fixing it yourself, without waiting for the next tag

The difficulty here isn't the commands — there are literally three of them. The difficulty is knowing *what* to swap and *where*, which requires reading kernel logs, understanding where the kernel actually pulls firmware from at boot, and avoiding one genuinely non-obvious trap. Here's the full path.

### Step 1 — proving it's firmware, not the kernel

Most people, after an update like this, see "my monitors stopped working" and start suspecting the dock, the cable, the desktop environment, or the new kernel version itself. The actual evidence lives in the kernel log (`journalctl -k`). The first line where things go wrong looks like this:

```
Loading DMUB firmware via PSP: version=0x0400004A
failed to load ucode DMCUB
```

Comparing the last several boots showed that the one boot that still worked (an older kernel build) logged `version=0x0400004C` instead, with no errors at all. Cross-referencing package update history (`rpm -qa --last`) showed the AMD GPU firmware package had updated the day before things broke. That gave a complete picture: one firmware file is the culprit, and the older kernel only still works because it has an older copy of that same file frozen inside itself — more on that in step 5.

### Step 2 — getting a copy of the working file

The old package is no longer installed on disk. But Fedora keeps every package it has ever built in a public build archive (Koji). Pulling the last known-good firmware package version from that archive and extracting it like a plain archive (`rpm2cpio` piped into `cpio`) — without installing it, just to pull out one file — gets you the working binary.

### Step 3 — the trap: which file, exactly

This is the mistake described above, and it's exactly the kind of thing a rushed distribution-level patch could get wrong too. The affected GPU is a "Rembrandt" family chip, and AMD's firmware package uses internal codenames for chip families — the correct file for this family is `yellow_carp_dmcub.bin` ("yellow carp"). Sitting right next to it in the same directory is `dcn_3_1_5_dmcub.bin`, for a similar but different chip family. The first attempt swapped the wrong one, rebooted, and nothing changed. Only comparing the version number embedded inside the file itself (specific bytes at a fixed offset in the file header) confirmed which file actually corresponded to the running hardware. Other people who reported the same upstream bug independently ran into the identical mix-up.

### Step 4 — swapping the file without touching the package

The fix does **not** overwrite the file inside the normal system firmware directory — the package manager owns that location and would silently restore the broken version on the next update. Instead, the kernel provides an official override mechanism: a separate "updates" directory that the kernel checks *first* when looking for any firmware file, before falling back to the standard location. Dropping the known-good file into that override path is enough — the original package stays completely untouched (a package integrity check reports no modifications), while the kernel picks up the overridden version anyway. This same override mechanism works for any firmware file on the system, not just this one.

### Step 5 — initramfs: why copying the file alone isn't enough

This is the step that trips up most people attempting this fix. The GPU driver initializes very early in the boot process — before the system even mounts its main disk — so the firmware it needs has to already be present in a small early-boot bundle called the **initramfs**. That bundle gets built once, at kernel-install time, and freezes a copy of every firmware file it thinks it needs at that moment. This explains the whole picture:

- The older kernel kept working because its initramfs was built *before* the bad update, and had the good file baked in.
- The newer kernel failed because its initramfs was rebuilt *after* the bad update, with the broken file baked in.
- Simply dropping a corrected file onto disk changes nothing on its own, because the GPU boots from the frozen initramfs contents, not from whatever happens to be on disk at that moment.

The final step is rebuilding the initramfs (`dracut -f`). The initramfs builder also checks the override directory first, so it picks up the corrected file automatically. Inspecting the rebuilt bundle's contents (`lsinitrd`) before rebooting confirmed the right file made it in.

### Step 6 — verification, and the way back out

After reboot: `DMUB hardware initialized: version=0x0400004C`, zero errors, monitors working normally. It's worth keeping a small revert script around (remove the override file, rebuild the initramfs again) — because this workaround has exactly one downside: it's permanent until you undo it. Once the distribution eventually ships a properly fixed firmware package, the old file in the override directory still takes priority over it, so it has to be deliberately removed or it will keep shadowing the real fix indefinitely.

## Why this is genuinely hard for most people, even though the commands are trivial

None of the individual commands are difficult. What's difficult is that nothing on screen ever says "this specific firmware file is broken, replace it with this one." You have to know how to read kernel logs, know that firmware ships as its own separate package independent of the kernel, know that a public build archive even exists, correctly decode a cryptic chip-family codename, know about the kernel's firmware-override directory, and understand that the initramfs holds its own frozen copy separate from whatever's on disk. Each piece individually is simple. The actual difficulty is needing all six pieces of knowledge simultaneously — skip any one of them, and you end up exactly where the first attempt here did: "I did the thing, and it still doesn't work."
