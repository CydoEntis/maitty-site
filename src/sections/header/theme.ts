// Every [data-theme-pick] button (the header toggle and the theme cards in
// "Make it yours") switches the page and remembers the choice.
const root = document.documentElement;
const picks = () => document.querySelectorAll<HTMLElement>("[data-theme-pick]");

function sync() {
  const theme = root.dataset.theme;
  picks().forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themePick === theme)));
}

function setTheme(theme: "night" | "day") {
  root.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme === "day" ? "#f6f8fa" : "#08111d";
  try { localStorage.setItem("maitty-theme", theme); } catch { /* storage blocked: the choice lasts this visit */ }
  sync();
}

document.addEventListener("click", (e) => {
  const pick = (e.target as Element).closest<HTMLElement>("[data-theme-pick]");
  if (pick) setTheme(pick.dataset.themePick === "day" ? "day" : "night");
});
sync();
