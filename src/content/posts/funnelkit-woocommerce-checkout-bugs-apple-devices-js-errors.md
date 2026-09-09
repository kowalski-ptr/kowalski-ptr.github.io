---
title: "Two Real Bugs in a FunnelKit + WooCommerce Checkout: A Missing Payment Button on Apple Devices, and JS Syntax Errors from wpautop"
description: "A field report from debugging a production WooCommerce checkout built with FunnelKit and Elementor: why the payment section and order button silently disappeared on every Apple device, and why two unrelated inline scripts kept throwing syntax errors — plus how both were fixed without touching the plugins themselves."
category: "Infra"
tags: ["wordpress", "woocommerce", "funnelkit", "elementor", "checkout", "javascript", "css", "debugging", "lang:en"]
date: 2026-09-11
draft: true
---

# Two Real Bugs in a FunnelKit + WooCommerce Checkout: A Missing Payment Button on Apple Devices, and JS Syntax Errors from wpautop

This is a write-up of two separate but related bugs found on a production WooCommerce checkout page built with the FunnelKit checkout builder on top of Elementor. Both bugs are interesting because neither one was actually a bug in the plugins' JavaScript — they were architectural interactions between plugins and WordPress's own content-processing pipeline. Anyone running a FunnelKit-based checkout, or really any page builder stacked on top of WordPress's legacy content filters, will likely run into some version of this.

## Bug #1: the payment section and "Place Order" button vanish — but only on Apple devices

### The symptom

On desktop and Android, the checkout page rendered perfectly: payment methods visible, order summary complete, "Place Order" button present and clickable. On every Apple device tested — iPhone Safari, iPhone in-app browsers, desktop Safari on macOS, and even desktop Chrome running on macOS — the payment section was completely missing, and there was an unexplained empty gap where the order total should have been. No button meant no way to complete a purchase.

This is the kind of bug that's brutal to catch in normal QA, because most testing happens on whatever hardware a team already has — usually Windows or Linux machines, sometimes an Android phone. Nobody happened to be testing checkout specifically from a Mac or an iPhone, so it shipped invisibly.

### The investigation

Using a headless browser with device emulation (checking real user-agent strings for iPhone, desktop Safari-on-macOS, desktop Chrome-on-macOS, Android, and desktop Linux), the pattern became clear immediately:

| Emulated device | Body class applied | Payment section display | "Place Order" button size |
|---|---|---|---|
| iPhone (iOS Safari UA) | `wfacp_mac` | `none` | 0×0 |
| Desktop, Safari-on-macOS UA | `wfacp_mac` | `none` | 0×0 |
| Desktop, Chrome-on-macOS UA | `wfacp_mac` | `none` | 0×0 |
| Android phone | `wfacp_pc` | `block` | normal, visible |
| Desktop Linux | `wfacp_pc` | `block` | normal, visible |

Every device that reported "Mac OS X" anywhere in its user-agent string — which includes not just actual Macs, but iPhones and iPads too, since iOS Safari includes "like Mac OS X" in its UA string for compatibility reasons — got tagged with one CSS class, while everything else got tagged with the other.

### The actual root cause

The checkout builder plugin ships its own base stylesheet that hides the payment section by default (`display:none`), expecting an inline override rule to reveal it. That built-in override, however, had already been found dead in an earlier round of debugging (it was getting mangled by WordPress's automatic paragraph formatter, `wpautop` — the same underlying mechanism that causes Bug #2 below).

Because that default override wasn't working, the actual thing revealing the payment section in production was a **custom CSS block added manually through the plugin's own settings panel**, scoped like this:

```css
body.wfacp_pc .wfacp-section.wfacp_payment { display: block !important; }
```

That class, `wfacp_pc` ("PC" as in "not Mac"), is assigned by the plugin's own client-side JavaScript, on page load, using a simple user-agent sniff:

```js
-1 != navigator.userAgent.indexOf("Mac OS X")
  ? $("body").addClass("wfacp_mac")
  : $("body").addClass("wfacp_pc")
```

The problem: Safari on macOS reports "Mac OS X" in its user-agent, and — critically — **so does mobile Safari on iPhone**, because Apple's mobile UA strings include "like Mac OS X" for legacy compatibility with sites written before iPhones existed. So the plugin's own detection logic classifies every Apple device, phone or desktop, as "Mac," and every one of the twelve custom CSS rules scoped to `body.wfacp_pc` silently does nothing on any Apple hardware. Hence: no payment section, no button, no order total — but only if you're using an Apple device to check out, which is exactly the population least likely to be caught by internal testing on a team using non-Apple hardware.

### The fix

Replace every instance of `body.wfacp_pc` in the custom CSS with `body.woocommerce-checkout` — a class WooCommerce itself applies server-side, present in the very first HTML response regardless of browser or user-agent, with equivalent CSS specificity (so nothing else in the cascade shifts). This sidesteps the flawed user-agent detection entirely by keying off a class that isn't inferred client-side from a notoriously unreliable signal.

After deployment: iPhone rendered the payment section and a correctly sized button; desktop Safari/Chrome on macOS matched the layout pixel-for-pixel with the working Linux/Android rendering; Android and Linux showed zero regression, as expected, since their body class never changed.

**Lesson:** never trust `navigator.userAgent` string-matching for anything meaningfully different between "the same browser engine, different device." Apple's UA strings are famously full of legacy compatibility tokens precisely so that older sites don't break — but that same design choice makes naive substring checks unreliable for anyone doing new detection today. If you need to distinguish rendering contexts, prefer a server-assigned class or a feature check over parsing the UA string.

## Bug #2: intermittent JavaScript syntax errors in two unrelated inline scripts

### The symptom

Two separate inline `<script>` blocks on the same checkout page — one belonging to the checkout builder's own UI tooltip logic, the other belonging to a Cloudflare Turnstile CAPTCHA integration on the login form — would occasionally throw `Unexpected token '<'` syntax errors in the browser console. Both scripts were, on inspection, completely valid JavaScript. The bug wasn't in either script's code.

### The actual root cause: WordPress's own content filter running at the wrong moment

This turned out to be a chain of five separate, individually-reasonable design decisions from three different pieces of software, which combined to produce broken output that none of the individual authors could have anticipated in isolation:

1. The checkout builder's page template renders the checkout page's content by passing it through WordPress's `the_content` filter — the same filter WordPress uses to process the body text of a blog post or page. This filter exists for formatting editorial prose, not for rendering full application UI, but the plugin repurposes it as a rendering hook.

2. At filter priority 5, the checkout builder swaps WordPress's global "current post" object to point at the checkout page.

3. At priority 9, the page builder (Elementor) renders the entire visual template — including the checkout form widget — into that content. During this render, two separate inline `<script>` blocks get injected into the HTML: one from the checkout plugin's own tooltip compatibility layer, and one from the CAPTCHA plugin's callback functions attached to the login form.

4. At priority 10, WordPress's built-in `wpautop` filter runs. Its job is to take a block of prose and wrap each line in `<p>` tags — useful for a paragraph of blog text, catastrophic for a `<script>` block, because it happily wraps lines *inside* `<script>` tags too, since it has no awareness that it's looking at code rather than prose. This is exactly why the wrapped scripts started throwing `Unexpected token '<'`: the parser hit a stray `<p>` tag sitting inside what was supposed to be a single JavaScript statement.

5. The page builder normally removes `wpautop` from the filter chain before it renders its own content, specifically to prevent this exact failure mode. But in this particular composition — checkout plugin swapping the global post, then the page builder rendering on top of that — the removal didn't take effect in time, and the safeguard silently failed to protect the very content it was meant to protect.

The deeper irony: WordPress's shortcode system is deliberately set to run at priority 11 — *after* `wpautop` — for exactly this reason, so shortcode output doesn't get mangled by paragraph wrapping. The checkout builder's approach of injecting a fully-rendered form earlier in the pipeline, at priority 9, sidesteps that protection entirely.

### A second, independent fragility that made things worse

The CAPTCHA integration had its own separate problem contributing to the same symptom: it builds part of its error-callback JavaScript by inserting an HTML-formatted message — containing an `<i>` tag for icon styling — directly into a JavaScript string literal, without properly escaping it (e.g., via `wp_json_encode` or an equivalent escaping function). So even independent of the `wpautop` issue, any stray paragraph tag inserted into that string would break out of the literal and corrupt the surrounding JavaScript.

### The fix

Rather than patching either third-party plugin directly — which would just get overwritten on the next update — a small, narrowly-scoped fix was added at a very late filter priority (99, running after everything else, including the page builder's own render). It strips `<p>` and `<br>` tags specifically from *inside* `<script>` tags only, leaving everything else in the rendered HTML untouched. After deployment: zero JavaScript syntax errors, with no changes made to either the checkout builder or the CAPTCHA plugin's own code.

### Lesson

If a page builder or checkout plugin is rendering full application UI through WordPress's editorial content filters (`the_content`), don't assume the standard safeguards (like `wpautop` removal) will reliably fire in every possible plugin-load-order and priority combination. When two or more plugins are independently swapping globals and re-entering the render pipeline, safeguards that work in isolation can silently stop working in combination — and the fix doesn't have to live inside any of the original plugins. A small, late-priority, narrowly-targeted cleanup filter is often safer and more maintainable than trying to patch someone else's rendering order.

## Cleanup

Once both fixes were verified in production — across Apple and non-Apple devices, with zero JavaScript console errors and a fully functional checkout on every platform tested — the temporary diagnostic tooling used to capture real-world telemetry during the investigation (a small must-use plugin logging button visibility and viewport data) was removed from the web root entirely, along with its log file and any rate-limiting state it had created. The narrowly-scoped script fix described above was intentionally left in place, since it addresses a real structural interaction between the plugins rather than a one-off symptom.
