// Drives the hero demo: pick a session, answer the one that waits, and watch
// it work, finish, and hand the question to the next session.
import { announce } from "../../lib/announce";
import { STATES } from "../../lib/states";
import { onTick, reduced, spinGlyph } from "../../lib/ticker";
import {
  ASK, AGE_S, DEFAULT_AGE_S, FIRST, INITIAL, K, ORDER,
  busyTimeText, clockText, lookOf, msg, paneGlyph, said, staticGlyph, sub, subOf, tool,
  type Session, type SessionId,
} from "./demo-data";
import { transcriptHtml } from "./transcript";

const WORK_MS = 4200;
const TOAST_MS = 3200;
const NEXT_ASK_MS = 3800;
const BUSY_STARS = "·✢✳✶✻✽";

const root = document.querySelector<HTMLElement>("[data-demo]")!;
const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
const S = structuredClone(INITIAL);
let sel: SessionId = FIRST;
const t0 = Date.now();

function update(id: SessionId, patch: Partial<Session>) {
  S[id] = { ...S[id], ...patch };
}

function setGlyph(el: HTMLElement, spinning: boolean, still: string) {
  el.toggleAttribute("data-spin", spinning);
  el.textContent = spinning ? spinGlyph() : still;
}

// A session shows as a list row and, on phones, as a chip; only rows carry a sub line.
function paintRow(id: SessionId) {
  const s = S[id];
  const look = lookOf(s);
  root.querySelectorAll<HTMLElement>(`[data-session="${id}"]`).forEach((row) => {
    row.dataset.look = look;
    row.setAttribute("aria-current", String(id === sel));
    setGlyph(row.querySelector("[data-glyph]")!, look === "working", staticGlyph(look));
    const subEl = row.querySelector<HTMLElement>("[data-sub]");
    if (!subEl) return;
    subEl.textContent = subOf(s);
    subEl.hidden = !subEl.textContent;
  });
}

function paintNeedsCount() {
  const n = Object.values(S).filter((s) => s.state === "needs").length;
  const badge = $("[data-needs-badge]");
  badge.textContent = `●${n}`;
  badge.style.opacity = n ? "1" : ".25";
}

function secondsOf(s: Session) {
  return Math.floor((Date.now() - (s.since ?? t0)) / 1000) + (AGE_S[s.id] ?? DEFAULT_AGE_S);
}

function paintBusy(frame: number) {
  const s = S[sel];
  $("[data-busy-star]").textContent = `${reduced ? "✻" : BUSY_STARS[Math.floor(frame / 2) % BUSY_STARS.length]} `;
  $("[data-busy-time]").textContent = s.id === "gw" ? "" : busyTimeText(secondsOf(s));
  $("[data-pane-clock]").textContent = clockText(secondsOf(s));
}

function paintPane() {
  const s = S[sel];
  const ask = s.state === "needs" ? ASK[s.id] : undefined;
  root.querySelectorAll("[data-pane-name]").forEach((el) => { el.textContent = s.name; });
  $("[data-pane-status]").style.color = STATES[s.state].color;
  setGlyph($("[data-pane-glyph]"), s.state === "working", paneGlyph(s.state));
  $("[data-pane-word]").textContent = STATES[s.state].word;
  $("[data-pane-lines]").innerHTML = transcriptHtml(s.base.concat(s.extra ?? []));
  const busy = $("[data-pane-busy]");
  busy.hidden = s.state !== "working";
  const label = $("[data-busy-label]");
  label.textContent = s.id === "gw" ? "Waiting for 2 background agents to finish" : "Orchestrating…";
  label.style.color = s.id === "gw" ? K.adim : K.red;
  paintBusy(0);
  $("[data-pane-ask]").hidden = !ask;
  if (ask) {
    root.querySelectorAll("[data-ask-cmd]").forEach((el) => { el.textContent = ask.cmd; });
    $("[data-ask-desc]").textContent = ask.desc;
  }
}

function paint() {
  ORDER.forEach(paintRow);
  paintNeedsCount();
  paintPane();
}

// Scrolls only the phone strip sideways, never the page, so the current chip stays in view.
function revealChip(id: SessionId) {
  const strip = root.querySelector<HTMLElement>(".strip");
  const chip = strip?.querySelector<HTMLElement>(`[data-session="${id}"]`);
  if (!strip || !chip || strip.clientWidth === 0) return;
  const left = chip.offsetLeft - strip.offsetLeft;
  if (left < strip.scrollLeft) strip.scrollLeft = left;
  else if (left + chip.offsetWidth > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = left + chip.offsetWidth - strip.clientWidth;
}

function select(id: SessionId) {
  sel = id;
  if (S[id].state === "done") update(id, { seen: true });
  paint();
  revealChip(id);
}

function showToast(title: string, detail: string) {
  const toast = $("[data-toast]");
  $("[data-toast-title]").textContent = title;
  $("[data-toast-detail]").textContent = detail;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, TOAST_MS);
}

function finish(id: SessionId, declined: boolean) {
  const s = S[id];
  const ask = ASK[id]!;
  update(id, {
    state: "done",
    seen: sel === id,
    extra: declined ? [said("No. Leave it for now."), msg("Understood. I left everything as it was.")] : [tool("Bash", ask.cmd), sub(ask.ran, K.txt), msg(ask.fin)],
  });
  paint();
  showToast(`${s.name} finished`, `${s.meta.replace("✻ ", "")} · ${declined ? "stopped" : "checks passed"}`);
  announce(`${s.name} finished`);
  window.setTimeout(() => askNext(id === "bw" ? "wb" : "bw"), NEXT_ASK_MS);
}

function askNext(id: SessionId) {
  update(id, { state: "needs", extra: undefined, base: ASK[id]!.intro, seen: true });
  paint();
  announce(`${S[id].name} needs you`);
}

function answer(id: SessionId, choice: number) {
  const s = S[id];
  const ask = ASK[id];
  if (s.state !== "needs" || !ask) return;
  const declined = choice === 3;
  update(id, { state: "working", since: Date.now(), extra: declined ? [said("No. Leave the lockfile alone for now.")] : [tool("Bash", ask.cmd), sub("Running…")] });
  paint();
  announce(`${s.name} is working again`);
  window.setTimeout(() => finish(id, declined), WORK_MS);
}

root.addEventListener("click", (e) => {
  const target = e.target as Element;
  const row = target.closest<HTMLElement>("[data-session]");
  if (row) select(row.dataset.session as SessionId);
  const option = target.closest<HTMLElement>("[data-answer]");
  if (option) answer(sel, Number(option.dataset.answer));
});

root.addEventListener("keydown", (e) => {
  const i = ORDER.indexOf(sel);
  if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); select(ORDER[(i + 1) % ORDER.length]); }
  else if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); select(ORDER[(i + ORDER.length - 1) % ORDER.length]); }
  else if (["1", "2", "3"].includes(e.key)) answer(sel, Number(e.key));
});

onTick(root, (frame) => { if (S[sel].state === "working") paintBusy(frame); else $("[data-pane-clock]").textContent = clockText(secondsOf(S[sel])); });
revealChip(sel);
