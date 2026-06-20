---
title: "Cloudflare vs a VPS: when each one actually wins"
description: "A serverless edge platform and a rented server solve hosting in different ways. Here is how the cost models compare and when to pick which."
category: "Infra"
tags: ["cloudflare", "vps", "serverless", "hosting", "lang:en"]
date: 2026-06-18
draft: true
---

Cloudflare grew from a CDN and DNS provider into a full application platform. That
changes a common question. You no longer have to reach for a rented server by
default. For many services, a serverless edge setup does the same job, scales
better, and costs less. It is not a clean win in every case, so here is a practical
comparison.

## The core difference

A VPS is a machine you rent by the month. It runs all the time, whether anyone
visits or not. You pay the same on a quiet night and during a traffic spike.

Cloudflare runs your code on demand, close to the user, and bills for actual usage.
When nothing happens, you pay almost nothing. The cost follows the traffic.

```
VPS (e.g. Hetzner):   fixed monthly bill, 24/7
                      ████████████████████████████   same cost, any load

Cloudflare:           pay per request / usage
                      ░░░░░██░░░░░░░░████░░░░░░░██░░   cheap when idle,
                                                      grows with traffic
```

That single difference drives most of the decision.

## What Cloudflare gives you

These pieces compose into a real service, not just a static site:

- Pages and Workers: the frontend plus backend logic, running on the edge.
- D1: a SQL database (SQLite).
- KV: a fast key-value store for sessions, cache, or counters.
- R2: object storage like S3, with no egress fees, which is often the biggest saving.
- Queues, Durable Objects, and Cron Triggers: background jobs, coordination, and state.
- Workers AI and Vectorize: models and a vector database for RAG.

You can build a shop or a content service on this. Payments still come from an
outside provider such as Stripe, but that is true on any stack, including WordPress.

## Where a VPS still wins

A serverless platform is not always the right tool.

- Steady, heavy, predictable load. If a box runs hot all day every day, a fixed
  monthly price can beat per-request billing.
- Full control. Root access, your own runtime, long-running processes, unusual
  software, or a heavy Postgres for analytics all fit a VPS better.
- Portability. Plain Linux moves between providers. Edge primitives do not.

## Cost intuition

For small or spiky traffic, Cloudflare often costs cents, helped by a usable free
tier. A VPS has a floor: you pay the monthly rate even at zero traffic. A strong
Hetzner box is cheap for what it is, but several of them add up to a real bill.

The trade flips at scale. Very high, constant traffic can make per-request pricing
climb, and a fleet of owned servers may come out cheaper per unit of work. Read the
pricing per service before you assume one side always wins.

## The honest caveats

- Different model, not a drop-in. There is no persistent server and no PHP or MySQL
  in the classic sense. You write TypeScript against Cloudflare primitives. Lifting
  an existing WordPress site one to one does not work. It is closer to a rebuild,
  usually headless.
- D1 has limits on size and query volume. It is great for small and medium services,
  not a replacement for a large Postgres under heavy analytical load.
- Lock-in is real. Workers are fairly portable. D1, KV, and Durable Objects are less
  so.
- Cold starts and per-request CPU limits exist. They are usually unnoticeable, but
  heavy computation has more room on a VPS.

## A practical hybrid

You do not have to choose one side for everything. A common split keeps static pages
and edge logic on Cloudflare, while a heavy worker or a large database lives on a
VPS.

```
[Browser]
   │  static pages + light API
   ▼
[Cloudflare Pages + Workers] ──► D1 / KV / R2
   │  heavy or stateful jobs
   ▼
[VPS: big Postgres, long-running worker]
```

## Bottom line

```
content site or blog            -> static host + a generator (this site)
dynamic features, no backend    -> stay static, fetch data client-side
a real service with a database  -> Cloudflare Pages + Workers + D1
heavy, constant, full control   -> a VPS
```

Pick by the shape of the load and how much control you need. For variable traffic and
fast iteration without running infrastructure, Cloudflare tends to win on price and
scaling. For heavy, steady workloads or when you want your own machine, a VPS still
earns its place. Plenty of setups use both.
