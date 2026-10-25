// Writes the page's first render into site/index.html, so the page is whole
// before any script runs (no-JS visitors, crawlers, first paint). main.js
// takes over from there. Run it after changing view.js or logic.js:
//
//   node tools/prerender.mjs
//
// The render sits between <!-- app --> and <!-- /app --> in index.html.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const context = vm.createContext({});
for (const file of ["logic.js", "view.js"]) vm.runInContext(readFileSync(site + file, "utf8"), context, { filename: file });

// A fixed clock and the Night theme, so the output only changes when the page does.
const html = vm.runInContext("maittyView(new MaittyPage(0, 'night').renderVals(), () => '')", context);
const page = site + "index.html";
const SLOT = /(<!-- app -->\n)[\s\S]*?(<!-- \/app -->)/;
const before = readFileSync(page, "utf8");
if (!SLOT.test(before)) throw new Error("index.html has no <!-- app --> slot");
writeFileSync(page, before.replace(SLOT, (_, open, close) => `${open}${html}\n${close}`));
console.log("prerendered", html.length, "bytes");
