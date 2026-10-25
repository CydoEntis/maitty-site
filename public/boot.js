// Runs before first paint, so a Day visitor never sees a Night flash and the
// install block opens on the right OS. A ?theme= link wins, then the saved
// choice, then the system preference. The js class lets CSS hide
// [data-reveal] content only when a script will reveal it again.
(() => {
  const root = document.documentElement;
  let theme = new URLSearchParams(location.search).get("theme");
  if (theme !== "night" && theme !== "day") {
    try { theme = localStorage.getItem("maitty-theme"); } catch (e) { theme = null; /* storage blocked: fall back to the system */ }
  }
  if (theme !== "night" && theme !== "day") theme = matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "day" ? "#f6f8fa" : "#08111d";
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
  root.dataset.os = /win/i.test(platform) ? "win" : "nix";
  if ("IntersectionObserver" in window) root.classList.add("js");
})();
