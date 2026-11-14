// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { writeFile } from "node:fs/promises";

const site = "https://axiom-ui.joinclass.jp";

// Writes dist/sitemap.xml from the built pages (no extra dependency).
const sitemap = {
  name: "sitemap",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      const urls = pages
        .map(({ pathname }) => new URL(pathname, site).href)
        .filter((url) => !url.includes("/404"))
        .sort();
      const body = urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
      await writeFile(new URL("sitemap.xml", dir), xml);
    },
  },
};

export default defineConfig({
  site,
  integrations: [react(), sitemap],
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: [".."] } },
  },
});
