import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://7jpierre.github.io',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
