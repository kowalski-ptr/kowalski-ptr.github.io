import { defineConfig } from 'tinacms';

// --- Tina Cloud (telefon/tablet/edycja online) ---
// Lokalnie te zmienne mogą być puste — Tina działa w trybie local.
// Po założeniu projektu w Tina Cloud uzupełnij .env:
//   PUBLIC_TINA_CLIENT_ID=...   (z dashboardu Tina Cloud)
//   TINA_TOKEN=...              (read-only token z Tina Cloud)
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  // panel buduje się do public/admin -> dostępny pod /admin
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        // Singleton: treść strony głównej (jeden plik src/content/home.json)
        name: 'home',
        label: 'Strona główna',
        path: 'src/content',
        format: 'json',
        match: { include: 'home' },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'string',
            name: 'eyebrow',
            label: 'Nadtytuł (mały, nad nagłówkiem)',
          },
          {
            type: 'string',
            name: 'title',
            label: 'Główny nagłówek',
            required: true,
          },
          {
            type: 'string',
            name: 'lead',
            label: 'Zdanie wstępne (lead)',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'aboutTitle',
            label: 'Boks w sidebarze — tytuł',
          },
          {
            type: 'string',
            name: 'aboutText',
            label: 'Boks w sidebarze — tekst',
            ui: { component: 'textarea' },
          },
        ],
      },
      {
        name: 'post',
        label: 'Notatki',
        path: 'src/content/posts',
        format: 'md',
        ui: {
          // domyślny slug pliku z tytułu
          filename: {
            slugify: (values) =>
              `${(values?.title || 'notatka')
                .toLowerCase()
                .replace(/[^a-z0-9ąćęłńóśźż]+/gi, '-')
                .replace(/^-+|-+$/g, '')}`,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Tytuł',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Opis (lista + SEO)',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'category',
            label: 'Kategoria',
            options: [
              'AI / LLM',
              'Infra',
              'Container',
              'Git',
              'Rust',
              'Go',
              'Bazy danych',
              'Networking',
              'Observability',
              'Meta',
              'Notatka',
            ],
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tagi',
            list: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Data publikacji',
            required: true,
          },
          {
            type: 'datetime',
            name: 'updated',
            label: 'Ostatnia aktualizacja',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Szkic (ukryty)',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Treść',
            isBody: true,
          },
        ],
      },
    ],
  },
});
