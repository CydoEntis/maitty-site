import { STATES, STATE_KEYS, type SessionState } from "../../lib/states";
import { onTick, spinGlyph } from "../../lib/ticker";

const FLIP_MS = 4000;
const SUB: Record<SessionState, string> = { working: "1 agent", needs: "asks: Allow Bash(pnpm install)?", done: "done · not seen", idle: "idle" };

const section = document.querySelector<HTMLElement>("[data-status]")!;
const row = section.querySelector<HTMLElement>("[data-demo-row]")!;
const glyph = section.querySelector<HTMLElement>("[data-demo-glyph]")!;
const t0 = Date.now();
let picked: SessionState | null = null;
let shown: SessionState | null = null;

const auto = (): SessionState => picked ?? (Math.floor((Date.now() - t0) / FLIP_MS) % 2 ? "needs" : "working");

function paint() {
  const state = auto();
  if (state === shown) return;
  shown = state;
  row.dataset.look = state;
  glyph.toggleAttribute("data-spin", state === "working");
  glyph.textContent = state === "working" ? spinGlyph() : state === "idle" ? "○" : "●";
  section.querySelector("[data-demo-sub]")!.textContent = SUB[state];
  section.querySelector("[data-state-about]")!.textContent = STATES[state].about;
  section.querySelectorAll<HTMLElement>("[data-state-pick]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.statePick === state));
  });
}

section.addEventListener("click", (e) => {
  const chip = (e.target as Element).closest<HTMLElement>("[data-state-pick]");
  if (!chip) return;
  const k = chip.dataset.statePick as SessionState;
  if (!STATE_KEYS.includes(k)) return;
  picked = picked === k ? null : k;
  shown = null;
  paint();
});

onTick(section, paint);
paint();
