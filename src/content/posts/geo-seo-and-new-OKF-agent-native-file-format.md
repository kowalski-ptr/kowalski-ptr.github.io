---
title: "GEO-seo and new OKF agent native file format"
description: "GEO-seo and new OKF agent native file format"
category: "AI / LLM"
tags: ["SEO", "GEO-SEO", "OKF", "mcp", "agent", "llm", "lang:pl"]
date: 2026-06-20
draft: false
---

## OKF — co to jest i gdzie pasuje w kontekście GEO-SEO

### Czym OKF faktycznie jest (i czym nie jest)

Google opublikował OKF v0.1 dokładnie 12 czerwca 2026 — 4 dni temu. Sam Google nazywa to "starting point, not a finished standard" i wprost stwierdza: OKF jest dla AI agentów, nie jest sygnałem rankingowym dla wyszukiwania.

OKF nie jest bezpośrednim czynnikiem rankingowym. Nie jest czymś, co Google wyciąga z Twojej witryny publicznie. Żyje wewnątrz organizacji, nie w otwartej sieci.

Kluczowa analogia z publicznych zrodel:

MCP to socket — protokół łączący agenta z narzędziami i live data. OKF to wiedza, która przez ten socket przepływa. MCP server może eksponować bundle OKF jako źródło wiedzy. RAG działa na głębszym poziomie architektonicznym.

Dobrze to ujął jeden z analityków SEO: sitemap.xml mówi crawlerowi które URL-e istnieją, `llms.txt` wskazuje agentowi te kilka stron które chcesz żeby przeczytał, a OKF idzie o piętro wyżej i oddaje mu samą treść — każda strona jako czysty markdown concept, cross-linkowany w graph który agent może przejść. Stackują się, nie konkurują.

### Gdzie OKF pasuje do rankingu

**OKF nie zmienia aktualnego rankingu GEO-SEO dla publicznej widoczności strony.** Ale otwiera nową kolumnę — wewnętrzną infrastrukturę agentową. Zaktualizowany ranking:

| Priorytet | Element | Impact na GEO-SEO | OKF relevance |
|-----------|---------|-------------------|---------------|
| **1** | `robots.txt` + Cloudflare | Fundament | ❌ brak |
| **2** | Schema.org JSON-LD | Największy impact na cytowania | ❌ brak |
| **3** | Jakość treści / struktura | Extractable chunks dla LLM | ❌ brak |
| **4** | `llms.txt` | B2A signpost | Komplementarny |
| **5** | MCP server | Agentic layer | **OKF jest knowledge layer MCP** |
| **—** | **OKF bundle** | **Nie GEO-SEO, ale** internal AI ops | **Nowe** |

Dla webapps OKF ma **dwa konkretne zastosowania**, ale żadne nie jest publicznym SEO:

**Zastosowanie 1 — MCP server context**: gdy będziesz budować MCP server dla sklepu, OKF bundle może służyć jako statyczny knowledge layer dla agenta — definicje produktów, kategorie, reguły cenowe, polityki wysyłki — zamiast hardkodować te dane w tool descriptions. OKF jest tak zaprojektowany, żeby MCP server mógł go eksponować jako źródło wiedzy.

**Zastosowanie 2 — wewnętrzny Claude Code / multi-agent system**: dokładnie wzorzec `CLAUDE.md` / `AGENTS.md` ze standaryzowaną strukturą interoperacyjną między agentami.

**Czego OKF nie robi**: nie poprawia widoczności aplikacji w ChatGPT/Claude/Google dla zewnętrznych użytkowników pytających "gdzie kupić cos tam". To nie jest sygnał crawlerów ani ranking factor.

### Podsumowanie jednym zdaniem

OKF to nie nowy poziom w rankingu GEO-SEO — to standard dla *wewnętrznej warstwy wiedzy* Twoich własnych agentów AI i MCP serverów. Dla webapps ma znaczenie przy budowie MCP servera i multi-agent systemie, nie przy optymalizacji pod zewnętrzne AI wyszukiwarki.

---

# Analiza z perspektywy architekta systemów, nie marketingu.

## Diagnoza problemu, który OKF rozwiązuje

Zanim argumenty — trzeba zrozumieć *co* dokładnie boli w multi-agentowych systemach dziś.

Przykladowy obecny stack (Claude Code + tmux + Proxmox + SKILL.md) już empirycznie natrafia na ten problem. Każda nowa sesja agenta zaczyna od zera — nie "wie" jak jest zbudowany Twój system, jakie masz konwencje, co oznaczają Twoje SKU, jak działa pricing złota spot+premia. Rozwiązujesz to przez `CLAUDE.md` i `SKILL.md` — czyli dokładnie ten sam wzorzec który Karpathy opisał w kwietniu 2026, a Google teraz sformalizował jako OKF.

Kluczowy problem to **context assembly overhead** — zanim agent zrobi cokolwiek użytecznego, musi zebrać kontekst z rozproszonych źródeł. W praktyce oznacza to:

- Agent A pyta o strukturę bazy danych → czyta `config.php`, README, może kod
- Agent B robi to samo niezależnie → duplikacja, ryzyko różnych interpretacji
- Agent C dostaje inną wersję bo plik README był aktualizowany między sesjami
- Żaden z agentów nie wie co wie drugi

## Argumenty ZA tym że OKF realnie poprawia systemy multi-agentowe

**Argument 1 — Eliminacja stateless cold-start przez shared knowledge graph**

Największy koszt w systemach multi-agentowych to nie compute, tylko **kontekst który każdy agent musi odbudować od zera**. OKF zamienia scattered dokumentację w graf konceptów z cross-linkami. Agent nie musi "odkrywać" że tabela `orders` joinuje się z `customers` przez `customer_id` — ma to wprost w pliku, z linkiem do drugiego konceptu. To jest fundamentalna różnica między RAG (losowe chunki z embeddingów) a OKF (kuratorowane, wersjonowane koncepty z deterministic linkingiem).

Dla Twojego systemu konkretnie: zamiast każdy agent-instancja Claude Code czytał od nowa `SKILL.md` + `CLAUDE.md` + kod eCommerce żeby zrozumieć jak działa sklep — ma OKF bundle z konceptami: `Product`, `PricingRule`, `SpotGoldPrice`, `OrderFlow`, `eCommerceEndpoint`. Raz napisane, dostępne dla wszystkich agentów deterministycznie.

**Argument 2 — Interoperability między różnymi frameworkami agentowymi**

Dziś gdy chcesz przekazać wiedzę między np. Claude Code a jakimś Python agentem (LangChain, ADK, Hermes) — nie ma wspólnego formatu. Każdy framework ma własny sposób na "system knowledge". OKF jest format-first, nie framework-first. Plik markdown z YAML frontmatter czyta każdy agent który ma dostęp do filesystemu lub MCP servera eksponującego bundle.

To jest szczególnie ważne dla architektury agentAI harness — masz heterogeniczne środowisko (Claude Code, Python skrypty, MCP servery) i OKF daje wspólny język między wszystkimi komponentami.

**Argument 3 — Version control jako mechanizm consistency**

Standardowy problem w systemach multi-agentowych: agent A aktualizuje wiedzę o produkcie X, agent B ma starą wersję. W RAG to jest katastrofa — embedding może być z wcześniejszej wersji, agent działa na stale danych. OKF ma pole `timestamp` w frontmatter i zakłada git jako storage — każda zmiana jest PR-em, diff jest widoczny, historia jest zachowana.

Dla ecommerce konkretnie: ceny spotowe zmieniają się dynamicznie, ale *reguły* cenowe (jak liczyć premię nad spot dla różnych produktów) zmieniają się rzadko. OKF bundle trzyma te reguły jako wersjonowane koncepty — agent zawsze wie czy czyta regułę z dziś czy sprzed tygodnia.

**Argument 4 — Redukcja hallucynacji przez curated facts vs. probabilistic retrieval**

RAG pobiera chunki na podstawie podobieństwa semantycznego — może pobrać zły chunk jeśli query jest niejednoznaczne. OKF concept jest kuratorowany przez człowieka, ma deterministyczny path (`/pricing/spot-premium-rule.md`), jest cross-linkowany z kontekstem. Agent który "wie" gdzie szukać konkretnego konceptu nie musi zgadywać — idzie bezpośrednio.

To jest krytyczne dla systemu handlowego gdzie hallucynacja ceny = błąd finansowy.

## Argumenty PRZECIW (dlaczego warto być sceptycznym)

**Kontra 1 — v0.1, wydany 4 dni temu, zero adopcji poza Google**

To jest eksperyment, nie standard. `llms.txt` ma 844,000 implementacji po 2 latach. OKF ma 0 implementacji poza Google sample bundles. Ryzyko: Google go porzuci za 18 miesięcy (historia pokazuje że Google porzuca projekty regularnie). Inwestycja w pełną adopcję teraz = potencjalny lock-in w martwy standard.

**Kontra 2 — Dla małego systemu CLAUDE.md + SKILL.md działa tak samo**

OKF wnosi wartość przy skali i heterogeniczności — wiele agentów, wiele frameworków, wiele teamów. Dla systemu jednej osoby z kilkoma agentami Claude Code różnica między "CLAUDE.md z dobrą strukturą" a "OKF bundle" jest marginalna. Złożoność wzrasta, benefit jest niewielki.

**Kontra 3 — Brak mechanizmu contradiction handling w v0.1**

Specyfikacja wprost przyznaje że gdy dwa OKF dokumenty sobie przeczą, nie ma zdefiniowanej semantyki merge. W systemie gdzie multiple agenty aktualizują knowledge — kto wygrywa? To jest otwarty problem designu który v0.1 ignoruje.

## Praktyczna ocena

Uczciwa odpowiedź: **OKF rozwiązuje realny problem, ale jest za wczesny żeby go adoptować produkcyjnie**. Wartościowe jest natomiast zrozumienie wzorca, bo to co robisz z SKILL.md jest jego ręczną implementacją.

Konkretna rekomendacja: obserwuj GitHub repo `GoogleCloudPlatform/knowledge-catalog` przez 6 miesięcy. Jeśli do końca 2026 pojawią się implementacje poza Google ecosystem (Anthropic, OpenAI, LangChain), wtedy warto rozważyć migrację SKILL.md → OKF bundle jako standard. Jeśli nie — SKILL.md + CLAUDE.md jest prosty i działa.

---

# Czy OKF może zredukować problem przeładowania okna kontekstu serwowaniem bogatych opisow mcptooluse

## Jak to działa technicznie

Standardowy MCP server bez OKF ma opisy narzędzi inline w kodzie serwera:

```python
@tool
def get_product(product_id: str) -> dict:
    """
    Returns product data from WooCommerce. Product has fields:
    id, name, sku, price, regular_price, sale_price, stock_status,
    stock_quantity, categories (list of {id, name, slug}),
    description, short_description, images (list of {url, alt}),
    attributes (list of {name, options}), variations (list of ids),
    weight, dimensions {length, width, height}, shipping_class,
    meta_data (list of {key, value}). Price is in PLN. SKU format
    for gold: GC-{TYPE}-{WEIGHT}-{YEAR}, for silver: SC-{TYPE}-{WEIGHT}.
    Spot price premium is calculated as: (price - spot_price_per_gram * weight_grams) / 
    (spot_price_per_gram * weight_grams) * 100. Categories map:
    zloto-inwestycyjne (id:12), monety-zlote (id:15), sztabki-zlote (id:16)...
    """
```

Ten opis ląduje w kontekście modelu przy **każdym wywołaniu**, nawet jeśli agent potrzebuje tylko sprawdzić cenę jednego produktu. Przy 20 narzędziach × 500 tokenów opisu = **10,000 tokenów stałego obciążenia** w każdym oknie kontekstu.

## Mechanizm redukcji przez OKF

OKF pozwala na **lazy loading wiedzy** zamiast eager loading. Tool description staje się minimalny:

```python
@tool(readOnlyHint=True)
def get_product(product_id: str) -> dict:
    """
    Fetch single product by ID or SKU.
    Schema and field semantics: /knowledge/products/product-schema.md
    Pricing rules: /knowledge/pricing/spot-premium-calculation.md
    """
```

Agent sięga po OKF bundle **tylko gdy potrzebuje** zrozumieć schemat lub regułę — nie przy każdym wywołaniu narzędzia. Dla prostego zapytania "czy produkt GC-2024 jest dostępny" agent wywołuje `get_product`, dostaje `stock_status: instock` i kończy — nigdy nie ładuje dokumentacji schematu do kontekstu.

## Ale tutaj jest ważny niuans

Redukcja kontekstu zachodzi **tylko jeśli OKF bundle jest serwowany przez MCP jako zasób (`resource`), nie jako tool**. To jest kluczowa różnica architektoniczna:

```
Tool description (zawsze w kontekście) ≠ MCP Resource (ładowany na żądanie)
```

MCP ma trzy typy ekspozycji:
- **Tools** — model-controlled, wywołanie przez agenta → zawsze schema w kontekście
- **Resources** — app-controlled, agent prosi o konkretny zasób gdy potrzebuje → lazy load
- **Prompts** — user-controlled templates

OKF bundle eksponowany jako **MCP Resource** jest ładowany do kontekstu tylko gdy agent explicite go potrzebuje. Eksponowany jako część tool description — jest zawsze.

## Realna skala oszczędności dla MCP server

Szacunek dla serwera z 8 narzędziami:

| Podejście | Tokeny per wywołanie | Koszt przy 1000 req/dzień |
|-----------|---------------------|--------------------------|
| Inline descriptions (dziś standard) | ~8,000 stałe | ~$2.40/dzień (Sonnet) |
| OKF jako Resources, min. descriptions | ~800 stałe + ~2,000 gdy potrzeba | ~$0.48/dzień baseline |
| Oszczędność | ~85% w typowym przypadku | ~$1.92/dzień |

Przy agencie który robi setki iteracji różnica jest nieliniowa — każda iteracja pętli agentowej płaci koszt stałego kontekstu.

## Jeden dodatkowy benefit który jest mniej oczywisty

OKF bundle jako shared resource między agentami oznacza że **wiedza nie jest duplikowana w kontekście każdego agenta z osobna**. W systemie gdzie masz 3 równoległe sesje Claude Code każda z nich nie trzyma kopii dokumentacji schematu — każda ładuje z tego samego bundle gdy potrzebuje. To jest szczególnie istotne w setup z tmux + multiple Claude Code sessions na Proxmox.

Więc tak — obserwacja o oszczednosci tokenowej jest technicznie słuszna, ale efekt zależy od tego czy OKF jest zaimplementowany jako MCP Resource (lazy, na żądanie), a nie wciśnięty do tool descriptions (eager, zawsze). Drugi sposób nie daje żadnej oszczędności.