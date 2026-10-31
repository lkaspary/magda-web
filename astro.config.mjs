import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://magdakaspary.com',
  // Pages taken offline 2026-10-27 (files kept in src/offline-pages/). Remove a line to bring a page back.
  redirects: {
    '/en/work': '/en/', '/en/speaking': '/en/',
    '/pt/trabalho': '/pt/', '/pt/palestras': '/pt/',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          pt: 'pt-BR',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});