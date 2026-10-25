// Mounts the page: renders view.js from logic.js's values, morphs the live DOM
// to match (so focus and running animations survive a re-render), and does the
// browser-side work the prototype's componentDidMount did.
(() => {
  "use strict";

  const TICK_MS = 110;
  // Attributes set from outside the view; a re-render must leave them alone.
  const KEEP = new Set(["data-in", "data-paused"]);
  const html = document.documentElement;
  const page = new MaittyPage(Date.now(), html.dataset.theme === "day" ? "day" : "night");
  let handlers = [];
  const on = (fn) => { handlers.push(fn); return String(handlers.length - 1); };

  function morphAttrs(from, to) {
    for (const { name } of [...from.attributes]) if (!to.hasAttribute(name) && !KEEP.has(name)) from.removeAttribute(name);
    for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value);
  }

  function morph(from, to) {
    if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) { from.replaceWith(to); return; }
    if (from.nodeType !== Node.ELEMENT_NODE) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
    morphAttrs(from, to);
    const next = [...to.childNodes];
    next.forEach((child, i) => {
      const cur = from.childNodes[i];
      if (cur) morph(cur, child); else from.appendChild(child);
    });
    while (from.childNodes.length > next.length) from.lastChild.remove();
  }

  const app = document.getElementById("app");
  let queued = false;
  function render() {
    queued = false;
    handlers = [];
    const tpl = document.createElement("template");
    tpl.innerHTML = maittyView(page.renderVals(), on);
    morph(app.firstElementChild, tpl.content.firstElementChild);
  }
  page.changed = () => { if (!queued) { queued = true; requestAnimationFrame(render); } };

  page.saveTheme = (theme) => {
    html.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "day" ? "#f6f8fa" : "#08111d";
    try { localStorage.setItem("maitty-theme", theme); } catch (e) { /* storage blocked: the choice lasts this visit */ }
  };

  const handle = (attr) => (e) => {
    const el = e.target.closest(`[${attr}]`);
    const fn = el && handlers[Number(el.getAttribute(attr))];
    if (fn) fn(e);
  };
  app.addEventListener("click", handle("data-click"));
  app.addEventListener("keydown", handle("data-keydown"));

  function reveal() {
    const els = [...app.querySelectorAll("[data-reveal]:not([data-in])")];
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.setAttribute("data-in", ""); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // Each section pauses its own decoration while it is off screen.
  function pauseOffscreen() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.target.toggleAttribute("data-paused", !en.isIntersecting)));
    app.querySelectorAll("section").forEach((s) => io.observe(s));
  }

  function loadVersion() {
    let cached = null;
    try { cached = sessionStorage.getItem("maitty-ver"); } catch (e) { cached = null; }
    if (cached) { page.setState({ ver: cached }); return; }
    fetch("https://api.github.com/repos/CydoEntis/maitty/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("GitHub said " + r.status))))
      .then((rel) => {
        if (typeof rel.tag_name !== "string") throw new Error("no tag_name in the release");
        try { sessionStorage.setItem("maitty-ver", rel.tag_name); } catch (e) { /* storage blocked: fetch again next time */ }
        page.setState({ ver: rel.tag_name });
      })
      .catch((err) => console.warn("Version stays hidden:", err.message));
  }

  function startTicker() {
    let iv = null;
    const run = () => { if (!iv) iv = setInterval(() => page.setState((s) => ({ f: s.f + 1, now: Date.now() })), TICK_MS); };
    const stop = () => { clearInterval(iv); iv = null; };
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
    run();
  }

  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  page.setState({ os: /win/i.test(platform) ? "win" : "nix", reduce });
  render();
  if ("IntersectionObserver" in window) { reveal(); pauseOffscreen(); }
  if (!reduce) startTicker();
  loadVersion();
})();
