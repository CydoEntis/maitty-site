// Runs before first paint so a Day visitor never sees a Night flash. A
// ?theme= link wins, then the saved choice, then the system preference.
// The js class lets CSS hide [data-reveal] content only when a script will
// reveal it again.
(() => {
  const root = document.documentElement;
  let theme = new URLSearchParams(location.search).get("theme");
  if (theme !== "night" && theme !== "day") {
    try { theme = localStorage.getItem("maitty-theme"); } catch (e) { theme = null; /* storage blocked: fall back to the system */ }
  }
  if (theme !== "night" && theme !== "day") theme = matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
  root.dataset.theme = theme;
  if ("IntersectionObserver" in window) root.classList.add("js");
})();
