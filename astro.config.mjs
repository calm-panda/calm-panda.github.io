import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User-site repository: deploy at the domain root.
export default defineConfig({
  site: 'https://calm-panda.github.io',
  base: '/',
  integrations: [sitemap()],
  compressHTML: true,
});
