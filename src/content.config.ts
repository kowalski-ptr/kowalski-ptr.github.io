import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Notatki = pliki Markdown w src/content/posts (te same pliki edytuje TinaCMS).
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // kategoria główna (np. "AI / LLM", "Infra", "Rust")
    category: z.string().default('Notatka'),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // opcjonalny czas czytania nadpisywany ręcznie; jak brak — liczymy z treści
    readingTime: z.number().optional(),
  }),
});

export const collections = { posts };
