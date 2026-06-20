---
title: "Wasm vs Docker: Edge runtime with AI"
description: "Wasm vs Docker: Edge runtime with AI"
category: "Container"
tags: ["wasm", "wasmer", "tool-use", "docker", "architecture", "lang:pl"]
date: 2026-06-19
draft: false
---

# Practical WASM usecase

Na stronie https://openai.com/index/wasmer/ jest opisana historia: How Wasmer used Codex to build a Node.js runtime for the edge
Teams use Codex with GPT‑5.5 to take on more ambitious projects and complete them 10x to 20x faster. 

Poniżej objasnienie kwestii przeag jakie daje WASM.

Oto kompleksowe wyjaśnienie tego, co Wasmer zbudował i dlaczego to przełom — zarówno technicznie, jak i z perspektywy workflow AI-first.

---

## Edge.js — co to jest i dlaczego ma znaczenie

### Problem, który rozwiązują

Node.js ma dwa strukturalne problemy od lat:

1. **Jest przyspawany do silnika V8** — brak możliwości wymiany silnika JS
2. **Nie można go bezpiecznie uruchomić bez Dockera lub wirtualizacji** — każda izolacja wymagała ciężkich kontenerów z długim cold startem

Inne runtimes jak Deno czy Cloudflare Workers próbowały rozwiązać ten problem, ale wymagało to przepisania aplikacji pod nowe API. Edge.js poszło inną drogą: zachowuje pełną kompatybilność z Node.js i izoluje tylko niebezpieczne części wykonania przez WebAssembly.

---

### Jak działa Edge.js technicznie

Edge.js używa Node API (N-API) jako warstwy abstrakcji — to samo API, które Node.js utrzymuje dla natywnych add-onów — co pozwala oderwać się od V8 jako jedynego silnika.

W trybie `--safe` WebAssembly jest używany do sandboxowania, co pozwala nawet potencjalnie niebezpiecznym programom działać bezpiecznie. Edge.js jest plugowalny z dowolnym silnikiem JS: V8, JavaScriptCore lub QuickJS. Kompatybilny z NPM, PNPM, Yarn i Bun.

Niebezpieczne operacje systemowe (dostęp do plików, sieć, wątki, fork procesów) są izolowane przez WASIX — Wasmerowy superset standardowego WASI z pełną obsługą POSIX.

---

### Konkretne korzyści z tego workflow

**1. Koniec z Dockerem przy wdrożeniu na edge**

Edge.js umożliwia uruchamianie istniejących aplikacji Node.js bezpiecznie i z czasami startowania niemożliwymi do osiągnięcia przy kontenerach. Cold start kontenera Dockera to sekundy. Edge.js z WebAssembly — milisekundy.

**2. Skala i ekonomia**

W 2026 roku edge computing stał się domyślną architekturą wdrożeń — edge functions osiągają 9x szybsze cold starty i 2x szybsze wykonanie w porównaniu z tradycyjnym serverless. 80% inferencji AI jest już przetwarzane lokalnie na edge, a nie w centralnych datacenter.

**3. Agenci AI i MCPs natywnie na edge**

To szczególnie istotne w kontekście pracy z multi-agent systemami — Edge.js był projektowany specjalnie z myślą o uruchamianiu aplikacji JS, MCP-ów i agentów bez Dockera. Oznacza to, że serwer MCP może żyć na edge node'zie blisko użytkownika, z sub-milisekundowym cold startem.

**4. Bez przepisywania kodu**

Istniejące aplikacje Node.js i natywne moduły działają niezmodyfikowane, podczas gdy syscalle i natywne moduły są sandboxowane przez WASIX. Zero migracji — drop-in replacement.

---

### Workflow AI-first: skrót z roku do 2 tygodni

To co mnie tu uderza z perspektywy "single-person AI-era corporation" — model pracy Wasmera:

Inżynierowie Wasmera przestali dotykać kodu bezpośrednio. Zamiast tego zaczęli *kierować* Codexem — wskazywali gdzie chcą dojść, a AI realizowała ścieżkę. To dokładnie ten shift widoczny przy budowaniu systemów w modelu jeden-operator-jedna-firma — od operatora do orchestratora.

Cały projekt Edge.js zajął 2 tygodnie zamiast szacowanego roku. Wasmer stał się pierwszym cloud hostem oferującym pełne wsparcie Node.js na warstwie edge.

---

### Roadmapa Edge.js — gdzie to zmierza

**v0.x** — production readiness: Linux, Windows, macOS, iOS, Android + audyty bezpieczeństwa. **v1.x** — performance: startup szybszy niż Node.js, Bun i Deno. **v2.x** — first-class TypeScript + developer experience.

Aktualnie Edge.js jest 5–20% wolniejszy od natywnego Node.js i 30% wolniejszy w trybie pełnego sandboxu — Wasmer deklaruje domknięcie tej luki przed v1.0.

---

### Relevancja dla stacku

Jeśli budujesz plugin marketplace z remote MCP execution — Edge.js to potencjalnie idealna warstwa hostingowa: zero Dockera, natywna kompatybilność z Node.js, izolacja sandboxem per-tenant z WebAssembly, sub-ms cold start. Warto śledzić jak Wasmer udostępni to na swojej platformie edge.

---
---

# Edge.js to zdecydowanie więcej niż tylko "MCP hosting". Wyjaśniam przez pryzmat konkretnych zastosowań.

---

## Edge.js — pełne spektrum potencjałów

Punktem wyjścia jest zrozumienie, że Edge.js to tak naprawdę **WebAssembly sandbox dla pełnego Node.js**. MCP/agenci to tylko jeden z wielu beneficjentów tego podejścia.

---

### 1. Multi-tenant SaaS — izolacja klientów bez Dockera

To prawdopodobnie największy potencjał biznesowy poza AI.

Przy kontenerach w multi-tenant SaaS deweloperzy muszą stale martwić się izolacją — co jeśli kod klienta A jakoś ucieknie i uzyska dostęp do danych klienta B? Z Wasm ten scenariusz po prostu nie istnieje. Sandbox jest na tyle rygorystyczny, że niezaufany kod może działać obok krytycznej infrastruktury z drastycznie mniejszym ryzykiem.

**Przykład praktyczny:** marketplace wtyczek, gdzie różni klienci/tenanci uruchamiają własne skrypty/logikę — każdy w izolowanym sandboxie, bez potrzeby stawiania osobnych kontenerów per klient. Koszty spadają o rząd wielkości.

---

### 2. System wtyczek (plugin system) dla własnych produktów

Najczystsza odpowiedź na pytanie "jak pozwolić użytkownikom rozszerzać aplikację kodem, w dowolnym języku, z domyślnym sandboxowaniem" — to właśnie WebAssembly. Plugin działa w Wasm sandbox, izolowany od hosta. Możesz ładować niezaufany kod bezpiecznie.

**Przykład:** Platforma e-commerce z systemem wtyczek dla partnerów (np. automatyczne wyliczanie spread/premium dla różnych klientów B2B) — każdy partner dostarcza własną logikę, która działa w sandboxie bez ryzyka dla reszty systemu.

---

### 3. Bezpieczne wykonywanie kodu generowanego przez AI

To bardzo aktualny i niedoceniany use case.

Kod generowany przez agentów AI stwarza często pomijane zagrożenie: możliwość, że agent wygeneruje niekontrolowane, potencjalnie niebezpieczne polecenia. WebAssembly może zapewnić doskonałą izolację i sandboxowanie dla niezaufanego kodu generowanego przez AI.

**Przykład:** agent AI generuje i wykonuje skrypty analityczne na danych biznesowych — bez ryzyka, że wygenerowany kod zmodyfikuje bazę danych lub wykona syscall poza scope'em.

---

### 4. Edge inference — AI bliżej użytkownika

Do 2026 roku 80% inferencji AI jest już przetwarzane lokalnie na edge, a nie w centralnych datacenterach. WebAssembly osiąga sub-milisekundowe cold starty, a nowe modele cenowe (np. Cloudflare $0.011 per 1000 Neuronów) czynią wdrożenia edge ekonomicznie uzasadnionymi w skali.

**Przykład:** serwer MCP z własną logiką biznesową — zamiast centralnego serwera, logika działa na edge node blisko użytkownika, z latency <5ms zamiast 100-200ms przy roundtripie.

---

### 5. Portabilność — jeden kod wszędzie

Write once, run anywhere: x86, ARM, RISC-V. Ten sam binarny działa na Mac, Linux, Windows i urządzeniach edge bez rekompilacji.

Trzy właściwości czynią Wasm atrakcyjnym dla serwerów: cold starty mierzone w pojedynczych milisekundach, rygorystyczny sandbox upraszczający multi-tenant safety, oraz małe rozmiary binarek idealne dla edge i środowisk z ograniczoną przepustowością.

---

### 6. WebAssembly Component Model — kompozycja między językami

WebAssembly Component Model (WCM), który pojawił się w 2025-2026, to największa zmiana w ekosystemie Wasm. Pozwala modułom Wasm na kompozycję i komunikację między sobą bez wspólnej pamięci.

Moduł w Rust może wywoływać moduł w Go, który wywołuje moduł w C++ — wszystko przez ustandaryzowane typy interfejsów. Component Model czyni kompozycję cross-językową praktyczną.

**Przykład:** Stack Python (analityka) + TypeScript (API) + specjalistyczne moduły logiki domenowej w Wasm — działające jako kompozytowe mikroserwisy bez kontenerów.

---

### Podsumowanie — mapa potencjałów

| Use case | Korzyść z Edge.js/Wasm |
|---|---|
| MCP/agenci AI | Zero Docker, sub-ms cold start |
| Multi-tenant SaaS | Izolacja per-klient bez VM |
| Plugin marketplace | Niezaufany kod w sandboxie |
| AI code execution | Bezpieczne uruchamianie kodu od agentów |
| Edge inference | AI blisko użytkownika, niskie latency |
| Cross-platform | Jeden binary wszędzie |
| Cross-language microservices | Kompozycja modułów bez silosów językowych |

WebAssembly w 2026 roku odnosi sukcesy precyzyjnie — w konkretnych niszach, gdzie jego zalety są decydujące: edge functions, serverless FaaS, bezpieczne systemy wtyczek i multi-tenant compute przy wysokiej gęstości. To nie są scenariusze eksperymentalne — to już produkcja.

Najistotniejsze to kombinacja: **plugin marketplace z per-tenant sandboxingiem** (bezpośredni fit dla własnych systemów multi-tenant) + **edge hosting MCP-ów** bez kosztów infrastrukturalnych Dockera.

---

# Czytelna mapa — od pytania "czy to zamknięty ekosystem?" po konkretne ścieżki instalacji na własnym VPS.

---

## WASM/WCM na własnym VPS — pełna mapa

### Krótka odpowiedź: ekosystem jest w 100% open source

Wasmer jest open-source runtimem do wykonywania WebAssembly na serwerze. Całość — runtime, language bindings i kompilatory — to otwarte oprogramowanie. Chmura Wasmera (Wasmer Edge) to opcjonalna warstwa hostingowa, nie warunek konieczny.

---

## Warstwa 1: Runtimes (silniki wykonawcze)

Masz do wyboru kilka w pełni open source runtimeów, instalowanych jedną komendą na każdym Linuxie:

**Wasmer** — najbogatszy ekosystem, WASIX (POSIX-compatible superset WASI), najlepszy DX:
```bash
curl https://get.wasmer.io -sSfL | sh
wasmer run python/python       # Python w Wasm!
wasmer run cowsay "hello"
```

**Wasmtime** — referencyjna implementacja standardów WASI Preview 2 + Component Model (WCM). Wasmtime to referencyjny runtime od Bytecode Alliance. Implementuje WASI Preview 2 i Component Model. Ten sam plik `.wasm` uruchomiony lokalnie w Wasmtime działa na Cloudflare Workers, AWS Lambda lub WasmEdge bez rekompilacji.
```bash
curl https://wasmtime.dev/install.sh -sSf | bash
wasmtime run --wasm component-model myapp.wasm
```

Cold start — prosty HTTP handler: Docker (Node.js) ~500ms, Docker (Go) ~100ms, AWS Lambda (Node) ~200ms, Wasm (Wasmtime) **~1ms**.

---

## Warstwa 2: WebAssembly Component Model (WCM) — jak używać

WCM w 2026 roku praktycznie rozwiązał "problem glue code" z wczesnych dni Wasm. Zamiast pisać ręczne FFI, definiujesz interfejsy przez WIT (WebAssembly Interface Types), a `wit-bindgen` generuje cały skomplikowany kod zarządzania pamięcią.

Toolchain do WCM (instalujesz na VPS lub lokalnie):

```bash
# Rust → Wasm Component
rustup target add wasm32-wasip2
cargo install cargo-component

# Budujesz komponent
cargo component new moj-plugin --lib
cargo component build --release

# Uruchamiasz na VPS
wasmtime run --wasm component-model=true moj-plugin.wasm
```

Ważne: target `wasm32-wasi` (bez p2) generuje legacy WASI Preview 1. Dla Component Model zawsze używaj `wasm32-wasip2`.

**Embedowanie Wasmtime w Pythonie/Node.js/Go** — bez osobnego procesu:
```python
# pip install wasmtime
from wasmtime import Store, Module, Instance
store = Store()
module = Module.from_file(store.engine, "plugin.wasm")
instance = Instance(store, module, [])
result = instance.exports(store)["run"](store, input_data)
```

---

## Warstwa 3: Spin (Fermyon) — framework serverless na własnym VPS

To najważniejsze narzędzie jeśli chcesz stawiać własny "mini Cloudflare Workers" na VPS.

Spin jest budowany w oparciu o Wasmtime. Możesz uruchomić aplikację Spin na własnej infrastrukturze przez `spin up`, wdrożyć na Fermyon Cloud, lub do klastra Kubernetes.

```bash
# Instalacja Spin CLI
curl -fsSL https://developer.fermyon.com/downloads/install.sh | bash

# Nowy projekt (JS, Python, Rust, Go...)
spin new --template http-js moj-serwer
cd moj-serwer && spin build

# Uruchom lokalnie na VPS
spin up
# → działa na localhost:3000, każdy request = fresh Wasm instance
```

Fermyon Platform to open-source, self-hosted platforma do WebAssembly microservices. Pod spodem używa Nomad (orkiestracja), Consul (routing), Traefik (reverse proxy) i Hippo (web UI). Fermyon Cloud jest rozszerzeniem tej platformy.

---

## Warstwa 4: SpinKube — jeśli masz Kubernetes

SpinKube to open source projekt łączący Spin Operator, containerd Spin shim i runtime class manager. Pozwala uruchamiać Wasm workloady w Kubernetes obok tradycyjnych kontenerów.

Fermyon Platform for Kubernetes może dostarczyć ponad 1500 serverless aplikacji na jeden node Kubernetes, z automatycznym scale-to-zero i cold startem poniżej milisekundy. ZEISS Group dzięki temu rozwiązaniu zmniejszyła koszty compute batch procesu o 60%.

---

## Warstwa 5: Extism — najprostszy plugin system w Node.js/Python

Jeśli chcesz tylko systemu wtyczek bez całego frameworka:

Do systemów wtyczek: Extism obsługuje całą złożoność komunikacji host-plugin. Wasmtime z Component Model daje więcej kontroli, ale wymaga więcej konfiguracji.

```javascript
// npm install @extism/extism
import { Plugin } from "@extism/extism";
const plugin = await Plugin.fromFile("./plugin.wasm");
const result = await plugin.call("process", inputData);
```

---

## Mapa decyzyjna dla VPS

```
Co chcesz zrobić?
│
├─ Uruchomić istniejącą Node.js apkę/MCP sandboxed
│   → Edge.js: curl install, drop-in za node
│
├─ Zbudować serverless HTTP handlers (jak Cloudflare Workers, lokalnie)
│   → Spin (Fermyon) — spin new + spin up
│
├─ System wtyczek dla swojego produktu
│   → Extism (Node.js/Python SDK) + Wasmtime pod spodem
│
├─ Embedować Wasm w istniejącym Pythonie/JS
│   → pip install wasmtime / npm install @bytecodealliance/wasmtime
│
└─ Orkiestracja wielu Wasm serwisów jak Kubernetes-lite
    → Spin + Fermyon Platform (self-hosted, Nomad + Consul)
```

Żadna z tych opcji nie wymaga chmury Wasmera — wszystko działa na własnym VPS jako zwykłe procesy lub systemd services.

# WASM vs Docker

To jest właśnie ten punkt decyzyjny, który w 2026 roku warto świadomie przechodzić przy każdym nowym projekcie.

Ale odpowiedź nie jest binarna — "Docker vs Wasm" to fałszywa dychotomia. Lepsze pytanie brzmi: **które warstwy projektu pasują do którego modelu?**

---

## Framework decyzyjny: Docker vs Wasm/Spin dla nowego projektu

### Kiedy Wasm/Spin wygrywa jednoznacznie

Use casy gdzie Wasm genuinely fits w 2026: edge functions (cold-start-sensitive, small-payload), plugin systems (chcesz pozwolić użytkownikom rozszerzać apkę kodem, w dowolnym języku, sandboxed by default), untrusted code execution (third-party scripts, customer-provided logic), cross-platform plugins (jeden binary wszędzie bez rekompilacji).

Konkretne sygnały że idź w Wasm:

- **Serverless / scale-to-zero** — płacisz tylko za rzeczywiste wywołania, cold start musi być <10ms
- **Multi-tenant** — różni klienci uruchamiają swoją logikę, potrzebujesz izolacji per-request
- **HTTP handlers / API endpoints** — stateless, krótkotrwałe, wysokie concurrency
- **Plugin marketplace** — własny system wtyczek per-tenant
- **MCP serwery** — każde wywołanie narzędzia to potencjalnie osobna Wasm instancja

### Kiedy Docker nadal wygrywa

Heavy computation (data processing, image manipulation, complex algorithms wymagające dużo CPU i pamięci), deep cloud integrations (bezpośredni VPC access, połączenia do RDS/DynamoDB), large dependencies (full Node.js API access, TCP/UDP connections, native binaries) — jeśli twój kod tego potrzebuje, edge runtimes nie wystarczą.

Sygnały że zostań przy Dockerze:

- **Długotrwałe procesy** — daemon, worker queue, background job z godzinami uptime
- **Stateful** — trzymasz stan w pamięci między requestami
- **Legacy stack** — PostgreSQL, Redis, Elasticsearch i podobne — to kontenery, nie Wasm
- **Duże zależności** — model ML (gigabajty), ffmpeg, heavy native libs
- **Pełny OS access** — potrzebujesz fork(), raw sockets, /proc, etc.

### Hybryda — najczęstszy scenariusz produkcyjny

Nowoczesne aplikacje coraz częściej używają obu, nie jednego z nich. Edge functions obsługują initial request processing (auth, routing, personalizację), podczas gdy tradycyjny serverless zarządza heavy computation.

---

## Praktyczna analiza

Naturalna architektura hybrydowa wyglądałaby tak:

```
┌─────────────────────────────────────────────────┐
│  WASM / Spin                                    │
│  • MCP serwery (per-tool isolation)             │
│  • Własne pluginy (per-tenant sandbox)           │
│  • HTTP API handlers (auth, routing, sygnały)   │
│  • Webhooks, price-check workers                │
├─────────────────────────────────────────────────┤
│  Docker (zostaje)                               │
│  • PostgreSQL / MariaDB                         │
│  • Redis                                        │
│  • WooCommerce (PHP legacy)                     │
│  • FluentCRM / Brevo bridge                     │
│  • Długotrwałe procesy analityczne (Python)     │
└─────────────────────────────────────────────────┘
```

---

## Checklist na start nowego projektu

Przy każdym nowym projekcie przejdź przez te 5 pytań:

**1. Czy to jest request/response pattern?**
Tak → rozważ Wasm/Spin. Nie (daemon, background worker) → Docker.

**2. Czy potrzebujesz izolacji między wywołaniami (multi-tenant / untrusted code)?**
Tak → Wasm wygrywa wyraźnie. Nie → Docker wystarczy.

**3. Czy cold start ma znaczenie?**
Tak (serverless, scale-to-zero) → Wasm (~1ms vs ~500ms Docker). Nie → obojętne.

**4. Czy zależności są "ciężkie" (>100MB, native libs, GPU)?**
Tak → Docker. Nie → Wasm jest lżejszy i przenośniejszy.

**5. Czy masz stan między requestami w pamięci?**
Tak → Docker. Nie (stateless) → Wasm naturalnie pasuje.

---

Warto tę analizę robić świadomie przy każdym nowym projekcie. Ale kluczowe jest to, że rzadko jest to wybór "albo-albo". Częściej chodzi o to, żeby wiedzieć które komponenty systemu naturalnie pasują do lekkiego Wasm sandboxu, a które potrzebują pełnokrwistego kontenera.