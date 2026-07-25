// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://axiom-ui.joinclass.jp",
  integrations: [react()],
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: [".."] } },
  },
});
