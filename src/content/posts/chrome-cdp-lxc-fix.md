---
title: "Chrome CDP w kontenerze LXC, scraper się wieszał i jak to naprawiono"
description: "Chrome CDP w kontenerze LXC — dlaczego scraper się wieszał i jak to naprawiono"
category: "Container"
tags: ["chrome", "cdp", "LXC", "scrap", "problem", "tool-use", "vps", "lang:pl"]
date: 2026-06-19
draft: false
---

# Chrome CDP w kontenerze LXC — dlaczego scraper się wieszał i jak to naprawiono

**Kontekst:** wdrożenie scrapera FinancialJuice na serwer (Proxmox, kontener LXC, Debian 13, Chrome 149).

---

## 1. Objaw

Na lokalnym Linux scraper działał bezbłędnie. Po przeniesieniu na serwer (kontener LXC,
Chrome `google-chrome-stable` 149 pod Xvfb) padał **natychmiast** na starcie przeglądarki:

```
[chromium] not running, launching chromium-browser --remote-debugging-port=9222...
[error] Chromium launched but CDP port never became available
```

Proces Chrome **był żywy** (2–3 procesy w `ps`), ale:
- port CDP **9222 nigdy się nie bindował**,
- plik `DevToolsActivePort` w profilu **nie powstawał**,
- log Chrome był **pusty (0 bajtów)** — żadnego błędu, cichy zawis.

Co mylące: **headless** (`--headless=new`) potrafił się podnieść i wypisać
`DevTools listening on ws://127.0.0.1:9222`, a **headful** (którego wymaga FinancialJuice, bo
headless jest wykrywany) — nie. To kierowało podejrzenia na sandbox/zasoby, ale:
- `/dev/shm` miał 31 GB (nie za mały),
- `load average ~0`, RAM wolny (to nie wyczerpanie zasobów),
- `ldd` nie pokazywał brakujących bibliotek,
- restart kontenera nie pomagał.

## 2. Przyczyna źródłowa

Dwie nakładające się rzeczy, obie związane z tym, **jak skrypt uruchamiał Chrome**:

1. **Chrome 136+ blokuje zdalny debugging (CDP) po porcie TCP na domyślnym profilu.**
   Od wersji 136 Chrome wymaga jawnego `--user-data-dir` (innego niż domyślny), inaczej
   odmawia wystawienia DevTools po TCP:
   ```
   DevTools remote debugging requires a non-default data directory.
   Specify this using --user-data-dir.
   ```
   Skrypt odpalał gołe `chromium-browser --remote-debugging-port=9222` — bez `--user-data-dir`.

2. **Ręczny start „Chrome na porcie TCP + connect_over_cdp" jest kruchy w nieuprzywilejowanym
   LXC.** Nawet po dodaniu `--user-data-dir` headful Chrome potrafił cicho zawisać przy
   inicjalizacji (zanim zbindował port), nie pisząc nic do stderr — trudne do zdiagnozowania
   przez warstwy `ssh → pct exec → runuser → xvfb-run`.

Kluczowa obserwacja diagnostyczna: **`playwright.chromium.launch(channel="chrome", headless=False)`
działało od ręki** (`OK TITLE: Example Domain`), podczas gdy ręczny CDP-po-porcie — nie.
Różnica: **Playwright nie używa portu TCP — używa `--remote-debugging-pipe`** (komunikacja po
deskryptorze pliku, nie po sieci), co **omija ograniczenie Chrome 136+**, i sam dokłada komplet
flag oraz świeży profil.

## 3. Rozwiązanie

Zamiana wzorca „odpal Chrome na porcie TCP + `connect_over_cdp`" na
**`launch_persistent_context`** (Playwright sam uruchamia Chrome przez pipe, zarządza profilem):

```python
# BYŁO: kruche, blokowane w LXC/Chrome 136+
_ensure_chromium_running()                       # subprocess chromium --remote-debugging-port=9222
browser = await pw.chromium.connect_over_cdp("http://localhost:9222")
for context in browser.contexts: ...             # szukanie karty

# JEST: stabilne, kontenerowe
context = await pw.chromium.launch_persistent_context(
    CHROME_PROFILE_DIR,                          # TRWAŁY profil = sesja 'datasource' między biegami
    channel="chrome",                            # systemowy google-chrome-stable
    headless=False,                              # 'datasource' wykrywa headless -> headful pod Xvfb
    args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
)
for page in context.pages: ...                   # karta(y) z persistent contextu
# na końcu: await context.close()  (flush profilu, ubicie Chrome)
```

`CHROME_PROFILE_DIR` jest konfigurowalny przez env (`datasource_CHROME_PROFILE`), domyślnie
`~/.config/datasource-chrome-profile`.

### Dlaczego to lepsze
- **`--remote-debugging-pipe` zamiast portu TCP** → nie podlega blokadzie Chrome 136+.
- **Trwały profil** (`launch_persistent_context`) → sesja/cookies FinancialJuice **przeżywają
  między biegami** (auto-login tylko raz; potem profil trzyma zalogowanie).
- **Playwright sam zarządza flagami i cyklem życia** → koniec z ręcznym pollowaniem portu.
- **Stabilne w LXC** — to ścieżka, którą Playwright i tak testuje na CI w kontenerach.

### Flagi kontenerowe (konieczne w nieuprzywilejowanym LXC)
- `--no-sandbox` — kontener jest już granicą izolacji; sandbox namespace bywa zawodny w LXC
  (niewidoczne dla strony, nie wpływa na detekcję).
- `--disable-gpu`, `--disable-dev-shm-usage` — brak GPU + bezpieczne użycie pamięci współdzielonej.

## 4. Dodatkowe ustawienia środowiska (przy okazji)

- **`chromium-browser` → `google-chrome-stable`**: skrypt miał zahardkodowane `CHROMIUM_BIN =
  "chromium-browser"`; na serwerze zrobiono symlink `/usr/bin/chromium-browser →
  google-chrome-stable`. (Na przyszłość warto `CHROMIUM_BIN` uczynić konfigurowalnym z env —
  przy `launch_persistent_context(channel="chrome")` i tak nie jest już używany.)
- **Xvfb**: headful Chrome wymaga ekranu; uruchamiane przez `xvfb-run -a` (tworzy też cookie
  X-auth, którego brak przy gołym `Xvfb :99` potrafi mylić).
- **`OMP_NUM_THREADS=4`**: ucisza nieszkodliwe ostrzeżenia onnxruntime
  (`pthread_setaffinity_np failed`) przy embeddingach bge-m3 w kontenerze.

## 5. Wniosek na przyszłość

Jeśli scraper sterowany przez CDP przestaje działać po przeniesieniu na kontener/nową wersję
Chrome — **nie debuguj ręcznego startu „chrome --remote-debugging-port"**. Przełącz się na
**`launch_persistent_context` (pipe + zarządzany profil)**. To jednocześnie naprawia blokadę
Chrome 136+, daje trwałą sesję i eliminuje całą klasę kruchych problemów z portem CDP w LXC.
