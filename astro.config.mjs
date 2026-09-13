import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://kokluatakickboks.com',
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { build: { cssCodeSplit: true } },
});
