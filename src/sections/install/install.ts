// The OS tabs and the copy buttons of every install block. The chosen OS lives
// on <html data-os>, so both blocks always agree.
import { announce } from "../../lib/announce";
import { COMMANDS, type Os } from "./commands";

const COPIED_MS = 2000;
const root = document.documentElement;
const isMac = /mac/i.test((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || "");
const COPY_KEY = isMac ? "⌘C" : "Ctrl+C";

const currentOs = (): Os => (root.dataset.os === "nix" ? "nix" : "win");

function syncTabs() {
  document.querySelectorAll<HTMLElement>("[data-os-tab]").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.osTab === currentOs())));
}

function copyWithSelection(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; /* the label tells the visitor to copy by hand */ }
  ta.remove();
  return ok;
}

async function copy(text: string): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) return copyWithSelection(text);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithSelection(text);
  }
}

function setLabel(button: HTMLElement, icon: string, label: string) {
  button.querySelector("[data-copy-icon]")!.textContent = icon;
  button.querySelector("[data-copy-label]")!.textContent = label;
}

let resetTimer: number | undefined;
function showCopied(ok: boolean) {
  const buttons = document.querySelectorAll<HTMLElement>("[data-copy]");
  buttons.forEach((b) => { b.dataset.copied = ok ? "ok" : "fail"; setLabel(b, ok ? "✓" : "", ok ? "copied" : `press ${COPY_KEY}`); });
  announce(ok ? "Install command copied" : `Copy failed. Select the command and press ${COPY_KEY}.`);
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => buttons.forEach((b) => { delete b.dataset.copied; setLabel(b, "⧉", "copy"); }), COPIED_MS);
}

document.addEventListener("click", (e) => {
  const target = e.target as Element;
  const tab = target.closest<HTMLElement>("[data-os-tab]");
  if (tab) { root.dataset.os = tab.dataset.osTab === "nix" ? "nix" : "win"; syncTabs(); }
  if (target.closest("[data-copy]")) copy(COMMANDS[currentOs()].cmd).then(showCopied);
});
syncTabs();
