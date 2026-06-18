# // knowbase

Engineering notebook — notatki o kodzie, infrastrukturze i AI.
Stack: **Astro + TinaCMS + GitHub Pages**. Każda notatka to plik Markdown w repo.

---

## Szybki start (lokalnie)

```bash
npm install
npm run dev        # Tina + Astro razem -> http://localhost:4321  i panel /admin
```

- Strona: <http://localhost:4321>
- Panel edycji (Tina, tryb local): <http://localhost:4321/admin>

Sam Astro bez Tiny (gdyby był potrzebny):

```bash
npm run dev:astro
```

> Lokalny build robisz przez `npm run build` (sam Astro). Wariant z panelem
> online (`build:cloud`) wymaga creds Tina Cloud i jest używany dopiero w CI.

## Build i podgląd produkcyjny

```bash
npm run build        # astro build -> dist/  (lokalnie, bez chmury)
npm run preview      # serwuje dist/
npm run build:cloud  # tinacms build && astro build (CI, wymaga creds Tina Cloud)
```

---

## Pisanie notatek — 3 kanały

Wszystkie zapisują **ten sam plik** `.md` w `src/content/posts`.

| Kanał | Jak | Wymaga |
|---|---|---|
| **Laptop** | `npm run dev` → `/admin` (UI Tina) lub edycja pliku w edytorze | nic |
| **Telefon / tablet** | panel `/admin` na wdrożonej stronie | Tina Cloud (niżej) |
| **Boty / VPS** | zapis pliku `.md` + commit/push (git lub GitHub API) | token GitHub |

### Frontmatter notatki

```yaml
---
title: "Tytuł"
description: "Jedno zdanie (lista + SEO)"
category: "AI / LLM"        # patrz opcje w tina/config.ts
tags: ["rust", "llm"]
date: 2026-06-18
updated: 2026-06-19          # opcjonalnie
draft: false                # true = ukryta
---
```

---

## Wdrożenie na GitHub Pages

To jest **strona użytkownika** → repo musi nazywać się `kowalski-ptr.github.io`.

1. **Utwórz repo** `kowalski-ptr.github.io` i wypchnij kod:
   ```bash
   git init && git add . && git commit -m "init knowbase"
   git branch -M main
   git remote add origin git@github.com:kowalski-ptr/kowalski-ptr.github.io.git
   git push -u origin main
   ```
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Secrets and variables → Actions:**
   - *Variables* → `SITE_URL` = `https://kowalski-ptr.github.io`
   - *Secrets* (dla panelu online) → `PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`
4. Push na `main` → workflow `.github/workflows/deploy.yml` zbuduje i opublikuje.

> Zmień też `site` w `astro.config.mjs` (lub ustaw `SITE_URL`) na swój adres.
> Strony produktowe komercyjne trzymaj w osobnych repo:
> `https://kowalski-ptr.github.io/<repo>/` — to repo ich nie blokuje.

---

## Tina Cloud (edycja z telefonu/tabletu)

1. Wejdź na <https://app.tina.io>, zaloguj GitHubem, dodaj projekt z tego repo.
2. Skopiuj **Client ID** i wygeneruj **Token** (read-only).
3. Lokalnie: skopiuj `.env.example` → `.env` i wklej wartości.
4. W repo: dodaj je jako *Secrets* (krok 3 wyżej).
5. Po deployu panel działa pod `https://kowalski-ptr.github.io/admin` z każdego
   urządzenia; zapis = commit do repo.

Bez Tina Cloud wszystko działa lokalnie (tryb local) — tracisz tylko edycję online.

---

## Struktura

```
src/
  content/posts/      # notatki (.md) — źródło prawdy
  content.config.ts   # schema kolekcji (Astro)
  layouts/Base.astro
  components/         # Nav, Footer, NoteCard
  pages/             # index, notes/[slug], tags/, about, 404
  styles/global.css  # design tokens (motyw T3 parchment)
  lib/format.ts
tina/config.ts        # schema + UI TinaCMS
.github/workflows/    # deploy na Pages
```

## Motyw

Jasny „parchment" (T3): tło `#b8b2a1`, karty `#dcd6c7`, tekst `#1b1811`,
akcent terakota `#7d3d18`. Tokeny w `src/styles/global.css` (sekcja Semantic) —
zmieniasz je tam w jednym miejscu.
