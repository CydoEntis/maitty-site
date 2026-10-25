// Runs before first paint so a Day visitor never sees a Night flash.
// The saved choice wins; otherwise the system preference.
(() => {
  let theme = null;
  try { theme = localStorage.getItem("maitty-theme"); } catch (e) { /* storage blocked: fall back to the system */ }
  if (theme !== "night" && theme !== "day") theme = matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
  document.documentElement.dataset.theme = theme;
})();
