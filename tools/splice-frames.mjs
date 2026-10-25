// Copies the exported app screens in site/frames/ into site/index.html, so
// the page ships them inline (no layout shift, no extra requests) and the
// deploy still has no build step. Run it again whenever the frames change:
//
//   node tools/splice-frames.mjs
//
// Each slot in index.html sits between <!-- frame:NAME --> and
// <!-- /frame:NAME -->; its content is replaced with NAME-night.html and
// NAME-day.html. A slot whose files are missing is left as it is.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../site/", import.meta.url));
const page = root + "index.html";
const SLOT = /(<!-- frame:([\w-]+) -->\n)[\s\S]*?(<!-- \/frame:\2 -->)/g;

const ENTITIES = { "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
const textOf = (html) => html.replace(/<[^>]*>/g, "").replace(/&[#\w]+;/g, (e) => ENTITIES[e] ?? "?");

// The widest line in cells, so CSS can fit the grid to the box.
function columns(html) {
  return Math.max(...textOf(html).split("\n").map((line) => [...line].length));
}

function variant(name, theme) {
  const file = `${root}frames/${name}-${theme}.html`;
  return existsSync(file) ? readFileSync(file, "utf8").trim() : null;
}

const spliced = [];
const missing = [];
const html = readFileSync(page, "utf8").replace(SLOT, (whole, open, name, close) => {
  const night = variant(name, "night");
  const day = variant(name, "day");
  if (!night || !day) { missing.push(name); return whole; }
  spliced.push(name);
  const cols = Math.max(columns(night), columns(day));
  return `${open}<div class="fv-set" style="--cols:${cols}"><div class="fv-night">${night}</div><div class="fv-day">${day}</div></div>\n${close}`;
});

writeFileSync(page, html);
console.log(`spliced: ${spliced.join(", ") || "none"}`);
if (missing.length) console.log(`no frames yet (slot kept): ${missing.join(", ")}`);
