import { announce } from "../../lib/announce";
import { spinGlyph } from "../../lib/ticker";
import { rowLook, type Mode } from "./rows";
import type { SessionState } from "../../lib/states";

const RESUMED_MS = 4000;
const STAGGER_MS = 110;
const FOOT: Record<Mode, [string, string]> = {
  open: ["close the window, then come back", "var(--t-adim)"],
  closed: ["background service · 3 agents still running, 2 saved", "var(--t-dim)"],
  reopened: ["✓ all hands back on deck: 3 kept running, 2 resumed", "var(--t-teal)"],
};

const section = document.querySelector<HTMLElement>("[data-close]")!;
const button = section.querySelector<HTMLElement>("[data-close-toggle]")!;
const rows = [...section.querySelectorAll<HTMLElement>("[data-close-row]")];
let mode: Mode = "open";
let backToOpen: number | undefined;

function replayEntrance(row: HTMLElement, i: number) {
  row.style.animation = "none";
  void row.offsetWidth;
  row.style.animation = "";
  row.style.animationDelay = `${i * STAGGER_MS}ms`;
}

function paint() {
  const closed = mode === "closed";
  section.toggleAttribute("data-closed", closed);
  button.textContent = closed ? "$ maitty   ↵ come back" : "✕ close the window";
  section.querySelector("[data-close-chip]")!.textContent = closed ? "service" : "SESSIONS 5";
  section.querySelector("[data-close-bar]")!.textContent = closed ? "window closed" : mode === "reopened" ? "reopened" : "open";
  const foot = section.querySelector<HTMLElement>("[data-close-foot]")!;
  [foot.textContent, foot.style.color] = FOOT[mode];
  rows.forEach((row, i) => {
    const look = rowLook(row.dataset.closeRow as SessionState, mode);
    const glyph = row.querySelector<HTMLElement>("[data-glyph]")!;
    glyph.toggleAttribute("data-spin", look.spin);
    glyph.textContent = look.spin ? spinGlyph() : look.glyph;
    glyph.style.color = look.gc;
    row.querySelector<HTMLElement>("[data-name]")!.style.color = look.nc;
    const tag = row.querySelector<HTMLElement>("[data-tag]")!;
    tag.textContent = look.tag;
    tag.style.color = look.tc;
    if (mode === "reopened") replayEntrance(row, i);
  });
}

button.addEventListener("click", () => {
  window.clearTimeout(backToOpen);
  if (mode === "closed") {
    mode = "reopened";
    announce("Sessions resumed");
    backToOpen = window.setTimeout(() => { mode = "open"; paint(); }, RESUMED_MS);
  } else {
    mode = "closed";
    announce("Window closed. Agents still running.");
  }
  paint();
});
