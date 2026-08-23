import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isProd = process.env.CF_PAGES === '1' || process.argv.includes('build');

export default defineConfig({
  output: isProd ? 'server' : 'static',
  adapter: isProd ? (await import('@astrojs/cloudflare')).default() : undefined,
  site: 'https://interdisciplinarist.com',
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
