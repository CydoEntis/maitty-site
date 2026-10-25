// Theme switch, tabs (install OS, side panel, layouts), copy, and the
// version in the footer. No motion lives here.
(() => {
  "use strict";

  const COMMANDS = {
    win: { cmd: "irm https://raw.githubusercontent.com/CydoEntis/maitty/main/install.ps1 | iex", prompt: "PS>", shell: "PowerShell" },
    nix: { cmd: "curl -fsSL https://raw.githubusercontent.com/CydoEntis/maitty/main/install.sh | sh", prompt: "$", shell: "sh · bash · zsh" },
  };
  const COPY_LABEL = "⧉ copy";
  const COPIED_MS = 1800;
  let os = "win";

  const live = (text) => { document.querySelector("[data-live]").textContent = text; };

  function showTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-set-theme]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setTheme === theme)));
    document.querySelector('meta[name="theme-color"]').content = theme === "day" ? "#f6f8fa" : "#08111d";
  }

  // Only a click is saved, so a visitor who never picks keeps following the system.
  function pickTheme(theme) {
    showTheme(theme);
    try { localStorage.setItem("maitty-theme", theme); } catch (e) { /* storage blocked: the choice lasts this visit */ }
  }

  function selectTab(tab) {
    const list = tab.closest('[role="tablist"]');
    list.querySelectorAll('[role="tab"]').forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel && t.getAttribute("aria-controls") !== tab.getAttribute("aria-controls")) panel.hidden = true;
    });
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.hidden = false;
    panel.setAttribute("aria-labelledby", tab.id);
  }

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  function onTabKey(e) {
    const tabs = [...e.currentTarget.querySelectorAll('[role="tab"]')];
    const i = tabs.indexOf(document.activeElement);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    let next = null;
    if (step) next = tabs[(i + step + tabs.length) % tabs.length];
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    next.focus();
    next.click();
  }

  // Both install blocks show the same OS, so picking one picks both.
  function setOs(next) {
    os = next;
    const c = COMMANDS[os];
    document.querySelectorAll("[data-install]").forEach((block) => {
      selectTab(block.querySelector(`[data-os="${os}"]`));
      block.querySelector("[data-cmd]").textContent = c.cmd;
      block.querySelector("[data-prompt]").textContent = c.prompt;
      block.querySelector("[data-shell]").textContent = c.shell;
    });
  }

  function detectOs() {
    const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    return /win/i.test(p) ? "win" : "nix";
  }

  function selectCommand(button) {
    const code = button.closest("[data-install]").querySelector("[data-cmd]");
    const range = document.createRange();
    range.selectNodeContents(code);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function copy(button) {
    const done = (ok) => {
      button.textContent = ok ? "✓ copied" : "press Ctrl+C";
      button.toggleAttribute("data-copied", ok);
      live(ok ? "Install command copied" : "Copy failed. The command is selected; press Ctrl+C.");
      setTimeout(() => { button.textContent = COPY_LABEL; button.removeAttribute("data-copied"); }, COPIED_MS);
    };
    if (!navigator.clipboard || !window.isSecureContext) { selectCommand(button); done(false); return; }
    navigator.clipboard.writeText(COMMANDS[os].cmd).then(() => done(true), () => { selectCommand(button); done(false); });
  }

  // The tag comes from GitHub's API, cached for the visit. If it fails the
  // version stays hidden; nothing else depends on it.
  function showVersion(tag) {
    const el = document.querySelector("[data-version]");
    el.querySelector("a").textContent = tag;
    el.hidden = false;
  }
  function loadVersion() {
    let cached = null;
    try { cached = sessionStorage.getItem("maitty-version"); } catch (e) { cached = null; }
    if (cached) { showVersion(cached); return; }
    fetch("https://api.github.com/repos/CydoEntis/maitty/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("GitHub said " + r.status))))
      .then((rel) => {
        if (typeof rel.tag_name !== "string") throw new Error("no tag_name in the release");
        try { sessionStorage.setItem("maitty-version", rel.tag_name); } catch (e) { /* storage blocked: fetch again next time */ }
        showVersion(rel.tag_name);
      })
      .catch((err) => console.warn("Version stays hidden:", err.message));
  }

  showTheme(document.documentElement.dataset.theme);
  document.querySelectorAll("[data-set-theme]").forEach((b) => b.addEventListener("click", () => pickTheme(b.dataset.setTheme)));
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    list.addEventListener("keydown", onTabKey);
    list.querySelectorAll('[role="tab"]').forEach((tab) => tab.addEventListener("click", () => (tab.dataset.os ? setOs(tab.dataset.os) : selectTab(tab))));
  });
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b)));
  setOs(detectOs());
  loadVersion();
})();
