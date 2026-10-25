import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// A static site: the page is plain HTML that search engines read as is, and
// each demo's script is a same-origin module (the CSP has no inline scripts).
export default defineConfig({
  site: "https://maitty.app",
  output: "static",
  build: { inlineStylesheets: "never" },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
