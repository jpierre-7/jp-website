import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://7jpierre.github.io',
  base: '/jp-website',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
