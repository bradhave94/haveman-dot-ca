import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite'

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://haveman.ca",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), mdx(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
