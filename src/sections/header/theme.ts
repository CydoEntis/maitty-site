// Every [data-theme-pick] button (the header toggle and the theme cards in
// "Make it yours") switches the page and remembers the choice.
const root = document.documentElement;
const picks = () => document.querySelectorAll<HTMLElement>("[data-theme-pick]");

type Theme = "night" | "day";

const REVEAL_MS = 600;
const REVEAL_EASE = "cubic-bezier(.2, .7, .2, 1)";

function sync() {
  const theme = root.dataset.theme;
  picks().forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themePick === theme)));
}

function apply(theme: Theme) {
  root.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme === "day" ? "#f6f8fa" : "#08111d";
  try { localStorage.setItem("maitty-theme", theme); } catch { /* storage blocked: the choice lasts this visit */ }
  sync();
}

// The new theme grows as a circle from the top-right corner, where the toggle sits.
function reveal() {
  const radius = Math.hypot(innerWidth, innerHeight);
  root.animate(
    { clipPath: ["circle(0 at 100% 0)", `circle(${radius}px at 100% 0)`] },
    { duration: REVEAL_MS, easing: REVEAL_EASE, pseudoElement: "::view-transition-new(root)" },
  );
}

const isSkipped = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

function setTheme(theme: Theme) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (theme === root.dataset.theme || still || !document.startViewTransition) {
    // Without the reveal, switch every colour at once: reading a style flushes the change while transitions are off.
    root.toggleAttribute("data-theme-switching", true);
    apply(theme);
    void getComputedStyle(root).color;
    root.removeAttribute("data-theme-switching");
    return;
  }
  // Colour transitions would fade inside the new snapshot; data-theme-switching turns them off.
  const transition = document.startViewTransition(() => {
    root.toggleAttribute("data-theme-switching", true);
    apply(theme);
  });
  transition.ready.then(reveal, (e) => { if (!isSkipped(e)) throw e; });
  transition.finished.finally(() => root.removeAttribute("data-theme-switching"));
}

document.addEventListener("click", (e) => {
  const pick = (e.target as Element).closest<HTMLElement>("[data-theme-pick]");
  if (pick) setTheme(pick.dataset.themePick === "day" ? "day" : "night");
});
sync();
