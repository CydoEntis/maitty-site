// One clock for every moving demo. It ticks only while the tab is visible and
// motion is allowed, and skips a demo whose section is off screen.
const TICK_MS = 110;
const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
export const STILL_SPIN = "⠴";

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

type Tick = (frame: number) => void;
const subs: { el: Element; fn: Tick }[] = [];
let frame = 0;
let timer: number | undefined;

const onScreen = (el: Element) => !el.closest("[data-paused]");

function tick() {
  frame++;
  const glyph = SPIN[frame % SPIN.length];
  document.querySelectorAll("section:not([data-paused]) [data-spin]").forEach((el) => { el.textContent = glyph; });
  for (const s of subs) if (onScreen(s.el)) s.fn(frame);
}

function run() { timer ??= window.setInterval(tick, TICK_MS); }
function stop() { window.clearInterval(timer); timer = undefined; }

export function onTick(el: Element, fn: Tick) {
  subs.push({ el, fn });
}

export const spinGlyph = () => (reduced ? STILL_SPIN : SPIN[frame % SPIN.length]);

if (!reduced) {
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
  run();
}
