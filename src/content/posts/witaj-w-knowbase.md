---
title: Witaj w knowbase — jak działa ten notatnik
description: 'Krótki przewodnik: jak dodawać notatki, jak działa pisanie z laptopa, telefonu i botów, i dlaczego wszystko to pliki Markdown.'
category: Meta
tags:
  - astro
  - tinacms
  - workflow
date: 2026-06-18T00:00:00.000Z
draft: true
---

To pierwsza notatka w **knowbase**. Traktuj ją jako mini-instrukcję obsługi.

## Każda notatka to plik

Wszystko, co tu czytasz, to plik Markdown w `src/content/posts`. Żadnej bazy
danych, żadnego lock-inu. Dzięki temu masz trzy niezależne sposoby pisania:

* **Laptop** — `npm run dev`, panel pod `/admin`, edycja wizualna w TinaCMS.
* **Telefon / tablet** — ten sam panel `/admin` na wdrożonej stronie (Tina Cloud).
* **Boty na VPS** — zapisują plik `.md` i pushują przez git/API, bez Tiny.

## Frontmatter, który rozumie strona

```yaml
---
title: "Tytuł notatki"
description: "Jedno zdanie do listy i SEO."
category: "AI / LLM"
tags: ["rust", "llm"]
date: 2026-06-18
draft: false
---
```

Pole `draft: true` ukrywa notatkę z listy i builda — wygodne do szkiców.

## Co dalej

Usuń tę notatkę, gdy przestanie być potrzebna, i pisz swoje. Powodzenia.
