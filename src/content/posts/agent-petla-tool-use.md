---
title: "Pętla tool-use w agencie: notatki z pierwszego production runu"
description: "Retry, idempotencja narzędzi i dlaczego streaming zmienia projekt pętli sterującej."
category: "AI / LLM"
tags: ["claude-api", "agents", "tool-use", "vps", "lang:pl"]
date: 2026-06-15
draft: false
---

Przykładowa notatka techniczna — pokazuje, jak wygląda dłuższy wpis z kodem.

## Minimalna pętla

```ts
while (!done) {
  const step = await model.next(ctx);
  if (step.tool) {
    const result = await runTool(step.tool);
    ctx.push(result);
  } else {
    done = true;
  }
}
```

## Trzy rzeczy, które ugryzły

1. **Idempotencja narzędzi.** Retry po timeoutcie potrafi wykonać akcję dwa
   razy. Klucz idempotencji na poziomie narzędzia rozwiązuje problem.
2. **Streaming zmienia projekt.** Gdy model strumieniuje, decyzję o wywołaniu
   narzędzia podejmujesz zanim skończy się odpowiedź — bufor i parser muszą to
   uwzględniać.
3. **Budżet kroków.** Twardy limit iteracji ratuje przed nieskończoną pętlą,
   gdy model „zapętla się" na tym samym narzędziu.

> Wniosek: pętla sterująca to nie szczegół — to serce agenta.
