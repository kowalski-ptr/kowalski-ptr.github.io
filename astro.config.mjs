// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// UWAGA: po założeniu repo zmień `site` na swój adres.
// Repo użytkownika (USERNAME.github.io) => base '/' (root), bez prefiksu.
// Zmienna SITE pozwala nadpisać adres w CI bez ruszania kodu.
const SITE = process.env.SITE_URL || 'https://kowalski-ptr.github.io';

export default defineConfig({
  site: SITE,
  base: '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // motyw kodu spójny z ciemnym blokiem code w palecie T3
      theme: 'github-dark',
      wrap: false,
    },
  },
});
