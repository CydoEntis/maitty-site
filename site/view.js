// The page, ported 1:1 from the designer's prototype (design handoff
// "Maitty Landing v2"). view(v, on) returns the markup for the values that
// logic.js computes; on(fn) registers a click or key handler and returns its id.
// main.js morphs the live DOM to match, and tools/prerender.mjs writes the first
// render into index.html so the page is complete before any script runs.
(function (root) {
  "use strict";
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" };
  const tx = (x) => String(x).replace(/[&<>]/g, (c) => ESC[c]);
  const at = (x) => String(x).replace(/[&<>"]/g, (c) => ESC[c]);

  root.maittyView = (v, on) => `<div data-ref="rootRef" style="background:var(--bg);color:var(--text);font:400 17px/1.6 'Instrument Sans',system-ui,sans-serif;min-height:100vh;transition:background-color .4s,color .4s;overflow-x:hidden">

<header style="animation:mtDrop .6s ease-out both;position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px);height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px">
<a href="#top" aria-label="Maitty home" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--foam);font:800 15px 'Martian Mono',monospace;letter-spacing:.04em">
<img src="/img/maitty-logo.svg" alt="" width="40" height="34" style="display:block;width:40px;height:auto">
<span>M<span style="color:var(--teal)">AI</span>TTY</span>
</a>
<nav aria-label="Main" style="display:flex;align-items:center;gap:clamp(8px,2.2vw,22px);font:500 13px 'JetBrains Mono',monospace">
<a class="hv1" href="#install" style="color:var(--text);text-decoration:none">install</a>
<a class="hv1" href="https://github.com/CydoEntis/maitty/blob/main/docs/guide.md" style="color:var(--text);text-decoration:none">guide</a>
<a class="hv1" href="https://github.com/CydoEntis/maitty" style="color:var(--text);text-decoration:none">github</a>
<div role="group" aria-label="Theme" style="display:flex;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:var(--card)">
${v.themeBtns.map((b) => `
<button type="button" data-click="${on(b.pick)}" aria-pressed="${at(b.on)}" aria-label="${at(b.aria)}" title="${at(b.aria)}" style="width:44px;height:44px;display:grid;place-items:center;padding:0;border:0;cursor:pointer;background:${at(b.bg)};color:${at(b.fg)};transition:background-color .25s,color .25s"><span style="display:${at(b.moonD)};width:13px;height:13px;border-radius:50%;box-shadow:inset 4px -3px 0 0 currentColor;transform:rotate(-15deg)"></span><span style="display:${at(b.sunD)};width:7px;height:7px;border-radius:50%;background:currentColor;outline:2px dotted currentColor;outline-offset:2px"></span></button>
`).join("")}
</div>
</nav>
</div>
</header>

<main id="top">
<section data-ref="heroRef" aria-labelledby="hero-title" style="position:relative;padding:clamp(40px,7vw,84px) 0 0">
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;display:var(--sky-night)">
${v.stars.map((sr) => `<span style="position:absolute;left:${at(sr.x)};top:${at(sr.y)};width:${at(sr.s)};height:${at(sr.s)};border-radius:50%;background:#e8f1f8;--o:${at(sr.o)};opacity:${at(sr.o)};animation:mtTwinkle ${at(sr.d)} ease-in-out infinite;animation-play-state:var(--play,running)"></span>`).join("")}
<span style="position:absolute;right:7%;top:clamp(28px,5vw,64px);width:clamp(40px,5vw,64px);aspect-ratio:1;border-radius:50%;background:#e8f1f8;box-shadow:inset -.35em -.2em 0 0 #c9d6e3,0 0 60px 18px rgba(232,241,248,.10),0 0 140px 60px rgba(61,214,198,.06);font-size:clamp(14px,1.6vw,20px)"></span>
</div>
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;display:var(--sky-day)">
<span style="position:absolute;right:8%;top:clamp(28px,5vw,60px);width:clamp(44px,5.4vw,70px);aspect-ratio:1;border-radius:50%;background:#ffe4a3;box-shadow:0 0 0 10px rgba(255,228,163,.25),0 0 80px 30px rgba(255,228,163,.35)"></span>
<span style="position:absolute;right:16%;top:clamp(70px,9vw,120px);display:block;width:120px;height:30px;border-radius:30px;background:#ffffff;box-shadow:24px -14px 0 4px #ffffff,58px -6px 0 0 #ffffff,0 8px 20px rgba(11,23,36,.05);animation:mtCloud 26s ease-in-out infinite alternate;animation-play-state:var(--play,running)"></span>
<span style="position:absolute;left:44%;top:clamp(36px,5vw,70px);display:block;width:84px;height:22px;border-radius:22px;background:#ffffff;opacity:.9;box-shadow:18px -10px 0 2px #ffffff,40px -4px 0 0 #ffffff;animation:mtCloud 34s ease-in-out -10s infinite alternate-reverse;animation-play-state:var(--play,running)"></span>
</div>
<div style="position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px);display:grid;grid-template-columns:minmax(0,820px);justify-content:center;align-items:end">
<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:24px;min-width:0;padding-bottom:56px">
<h1 id="hero-title" style="margin:0;font:800 clamp(34px,5.4vw,68px)/1.02 'Martian Mono',monospace;letter-spacing:-.04em;color:var(--strong)"><span style="display:block;width:max-content;max-width:100%;margin:0 auto;animation:mtType .8s steps(10,end) .15s both">All agents</span><span style="display:block;width:max-content;max-width:100%;margin:0 auto;color:var(--teal);animation:mtType .7s steps(8,end) 1s both">on&nbsp;deck.<span aria-hidden="true" style="display:inline-block;width:.5em;height:.9em;margin-left:.08em;vertical-align:-.05em;background:var(--teal);animation:mtBlink 1.1s steps(1) 1.7s infinite"></span></span></h1>
<p style="margin:0;font-size:clamp(18px,1.8vw,22px);line-height:1.5;color:var(--text);max-width:32ch;text-wrap:pretty;animation:mtUp .7s cubic-bezier(.2,.7,.2,1) 1.25s both">Run your coding agents side by side, and always know which one needs you.</p>
<p style="margin:0;font:500 13px 'JetBrains Mono',monospace;color:var(--muted);animation:mtUp .7s cubic-bezier(.2,.7,.2,1) 1.4s both"><span style="color:var(--teal)">~</span> your first mate for a crew of coding agents · free &amp; open source (MIT)</p>
<div style="display:flex;flex-direction:column;align-items:center;gap:18px;width:100%;min-width:0;margin-top:8px;animation:mtUp .8s cubic-bezier(.2,.7,.2,1) 1.55s both">
<div style="width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:6px;overflow:hidden;box-shadow:none">
<div style="display:flex;align-items:stretch;background:var(--raised);border-bottom:1px solid var(--line)">
<div role="tablist" aria-label="Your operating system" style="display:flex">
${v.osTabs.map((t) => `
<button type="button" role="tab" aria-selected="${at(t.on)}" data-click="${on(t.pick)}" style="min-height:44px;padding:0 18px;border:0;border-right:1px solid var(--line);background:${at(t.bg)};color:${at(t.fg)};font:700 13px 'JetBrains Mono',monospace;cursor:pointer;transition:color .2s,background-color .2s">${tx(t.label)}</button>
`).join("")}
</div>
<span style="margin-left:auto;display:flex;align-items:center;padding:0 14px;font:500 12px 'JetBrains Mono',monospace;color:var(--dim)">${tx(v.shell)}</span>
</div>
<div role="tabpanel" style="padding:18px 18px 8px">
<code style="display:block;font:400 14px/1.65 'JetBrains Mono',monospace;color:var(--strong);white-space:pre-wrap;word-break:break-all"><span style="color:var(--teal);font-weight:700;user-select:none">${tx(v.prompt)} </span>${tx(v.cmd)}<span style="display:inline-block;width:.6em;height:1.1em;vertical-align:-.15em;background:var(--teal);margin-left:4px;animation:mtBlink 1.1s steps(1) infinite"></span></code>
</div>
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px 18px">
<span style="font-size:14px;color:var(--muted)">Then run <code style="font:600 13px 'JetBrains Mono',monospace;color:var(--strong);background:var(--raised);border:1px solid var(--line);padding:1px 6px;border-radius:3px">maitty</code> in any project folder.</span>
<button class="hv2 ac1" type="button" data-click="${on(v.copy)}" aria-label="Copy install command" style="display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border:2px solid var(--teal);border-radius:3px;background:${at(v.copyBg)};color:var(--ink);font:700 14px 'JetBrains Mono',monospace;cursor:pointer;box-shadow:4px 4px 0 var(--hard);transition:transform .12s,box-shadow .12s,background-color .2s">${tx(v.copyLabel)}</button>
</div>
</div>
<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px">
<a class="hv3 ac2" href="https://github.com/CydoEntis/maitty" style="display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border:2px solid var(--line);border-radius:3px;background:var(--card);color:var(--strong);text-decoration:none;font:700 14px 'JetBrains Mono',monospace;box-shadow:4px 4px 0 var(--line);transition:transform .12s,box-shadow .12s,border-color .2s"><span style="color:var(--teal)">›</span> View on GitHub</a>
</div>
</div>
</div>
</div>

<div style="position:relative">
<div aria-hidden="true" style="position:relative;z-index:3;height:64px;margin-bottom:-61px;background:var(--crest);-webkit-mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;animation:mtWave 16s linear infinite;"></div>
<div aria-hidden="true" style="position:relative;z-index:3;height:64px;background:var(--water);-webkit-mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;animation:mtWave 16s linear infinite;"></div>
<div style="position:relative;z-index:3;background:var(--water);padding-top:clamp(16px,3vw,32px)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px) clamp(72px,10vw,128px);position:relative;z-index:2">
<figure aria-label="Interactive Maitty demo in the Night theme" style="margin:0;background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);font:400 13px/18px 'JetBrains Mono',monospace;color:var(--t-txt)">
<div tabindex="0" data-keydown="${on(v.wsKey)}" aria-label="Demo. Arrow keys choose a session; 1, 2 or 3 answers." style="display:flex;flex-wrap:wrap;position:relative;min-height:470px">

<div style="flex:0 1 300px;min-width:240px;display:flex;flex-direction:column;border-right:1px solid var(--t-teal)">
<div style="display:flex;align-items:center;justify-content:space-between;height:24px;padding:0 10px;background:var(--t-bar)">
<span style="padding:0 6px;background:var(--t-chip);color:var(--t-strong)"><b>SESSIONS</b> 5</span>
<span style="color:var(--t-amber);font-weight:700;opacity:${at(v.needsOp)};transition:opacity .3s">●${tx(v.needsN)}</span>
</div>
<div style="padding:10px 0;display:flex;flex-direction:column;gap:12px">
${v.groups.map((g) => `
<div style="display:flex;flex-direction:column">
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding:0 10px 0 10px"><span style="color:${at(g.dc)};font-weight:700">–</span><b style="color:var(--t-strong)">${tx(g.name)}</b><span style="color:var(--t-dim)">${tx(g.meta)}</span></div>
${g.items.map((r) => `
<button class="hv4" type="button" data-click="${on(r.pick)}" aria-current="${at(r.on)}" style="display:block;width:100%;text-align:left;border:0;padding:0 10px 0 10px;background:${at(r.bg)};box-shadow:${at(r.bar)};font:inherit;color:inherit;cursor:pointer;transition:background-color .2s">
<span style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding-left:2ch"><span style="color:${at(r.gc)};font-weight:700">${tx(r.glyph)}</span><span style="color:${at(r.nc)};font-weight:${at(r.fw)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tx(r.name)}</span><span style="color:var(--t-dim);white-space:nowrap"><span style="color:var(--t-green)">${tx(r.plus)}</span> <span style="color:var(--t-red)">${tx(r.minus)}</span> ${tx(r.meta)}</span></span>
<span style="display:${at(r.subD)};padding-left:calc(4ch + 8px);color:${at(r.sc)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tx(r.sub)}</span>
</button>
`).join("")}
</div>
`).join("")}
</div>
<div style="margin-top:auto;display:flex;justify-content:space-between;padding:8px 10px;border-top:1px solid var(--t-line)">
<span style="padding:0 8px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">+</b> New</span>
<span style="padding:0 8px;background:var(--t-chip);color:var(--t-c9)">Menu</span>
</div>
</div>

<div style="flex:999 1 460px;min-width:0;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;background:var(--t-bar)">
<span style="padding:0 8px;background:var(--t-teal);color:var(--t-ink);font-weight:700">1  ${tx(v.pane.name)}</span>
<span style="color:var(--t-teal);font-weight:700">+</span>
<span style="margin-left:auto;color:${at(v.pane.c)};font-weight:700;transition:color .3s">${tx(v.pane.glyph)} ${tx(v.pane.word)}</span>
<span style="color:var(--t-dim)">✕</span>
</div>
<div style="flex:1;padding:12px 14px 6px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;overflow:hidden">
${v.pane.lines.map((l) => `
<div style="white-space:pre-wrap;word-break:break-word;padding-left:${at(l.pl)};background:${at(l.bg)};margin-top:${at(l.mt)};animation:mtUp .3s ease-out both">${l.segs.map((s) => `<span style="color:${at(s.c)};font-weight:${at(s.fw)}">${tx(s.t)}</span>`).join("")}</div>
`).join("")}
${v.pane.ask ? `
<div style="margin-top:10px;border-top:1px solid var(--t-teal);padding-top:8px;display:flex;flex-direction:column;gap:2px;animation:mtUp .3s ease-out both">
<b style="color:var(--t-teal)">Bash command</b>
<span style="padding-left:2ch;color:var(--t-strong)">${tx(v.pane.cmd)}</span>
<span style="padding-left:2ch;color:var(--t-adim)">${tx(v.pane.desc)}</span>
<span style="margin-top:8px;color:var(--t-txt)">Allow Bash(${tx(v.pane.cmd)})?</span>
${v.pane.opts.map((o) => `
<button class="hv5" type="button" data-click="${on(o.pick)}" style="display:grid;grid-template-columns:2ch minmax(0,1fr);text-align:left;border:0;padding:0;background:transparent;font:inherit;color:${at(o.c)};cursor:pointer"><span style="font-weight:700">${tx(o.arrow)}</span><span>${tx(o.label)}</span></button>
`).join("")}
</div>
` : ""}
</div>
<div style="padding:0 14px 10px">
<div style="border-top:1px solid var(--t-rule);border-bottom:1px solid var(--t-rule);padding:3px 0;margin-bottom:6px"><span style="color:var(--t-txt)">› </span><span style="display:inline-block;width:1px;height:14px;vertical-align:-2px;background:var(--t-txt);animation:mtBlink 1s steps(1) infinite"></span></div>
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 16px;padding-left:2ch">
<span><span style="color:var(--t-yel);font-weight:700">▸▸ auto mode on</span><span style="color:var(--t-adim)"> (shift+tab to cycle) · </span><span style="color:var(--t-txt)">← 1 agent</span></span>
<span style="color:var(--t-adim)">${tx(v.pane.clock)}</span>
</div>
</div>
</div>

${v.toast.show ? `
<div role="status" style="position:absolute;right:16px;bottom:72px;display:flex;align-items:stretch;min-width:250px;max-width:calc(100% - 32px);background:var(--t-bar);border:1px solid var(--t-line);animation:mtUp .3s ease-out both">
<span style="width:3px;background:var(--t-green)"></span>
<span style="padding:8px 12px;display:flex;flex-direction:column"><b style="color:var(--t-green)">✓ ${tx(v.toast.title)}</b><span style="color:var(--t-c9)">${tx(v.toast.detail)}</span></span>
</div>
` : ""}
</div>
</figure>
<p style="margin:16px 0 0;font:500 13px 'JetBrains Mono',monospace;color:var(--text);text-align:center"><span style="color:var(--needs)">●</span> bold-puffin is waiting for you. Answer it.</p>
</div>
</div>
</div>
</section>

<section aria-labelledby="p-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px)">
<h2 data-reveal="" id="p-title" style="margin:0 0 24px;font:700 clamp(26px,4.2vw,52px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong);max-width:24ch;text-wrap:balance">Five agents, five tabs, and one of them has been <span style="color:var(--needs)">waiting for you</span> for <span style="font-variant-numeric:tabular-nums">${tx(v.waiting)}</span>.</h2>
<p style="margin:0;font-size:clamp(18px,1.6vw,21px);max-width:54ch;color:var(--muted)">Maitty keeps the whole crew in one window, shows what each agent is doing, and rings the bell the moment one needs you.</p>
</div>
</section>

<section aria-labelledby="s-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line);background:var(--card)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(32px,5vw,64px);align-items:center">
<div>
<h2 data-reveal="" id="s-title" style="margin:0 0 16px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Know who needs you.</h2>
<p data-reveal="" style="margin:0 0 28px;max-width:50ch;color:var(--muted)">Every session shows its state, read from the agent's own hooks. When one waits, Maitty plays a sound and can send an alert to your phone.</p>
<div role="group" aria-label="Pick a state" style="display:flex;flex-wrap:wrap;gap:10px">
${v.stateCards.map((s) => `
<button class="hv6" type="button" data-click="${on(s.pick)}" aria-pressed="${at(s.on)}" style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;border:2px solid ${at(s.border)};border-radius:3px;background:${at(s.bg)};color:${at(s.c)};font:700 14px 'JetBrains Mono',monospace;cursor:pointer;transition:all .15s"><span>${tx(s.glyph)}</span>${tx(s.word)}</button>
`).join("")}
</div>
<p style="margin:16px 0 0;font-size:15px;color:var(--muted)">${tx(v.demoDesc)}</p>
</div>
<div aria-hidden="true" style="background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);font:400 14px/20px 'JetBrains Mono',monospace;color:var(--t-txt)">
<div style="height:26px;display:flex;align-items:center;padding:0 12px;background:var(--t-bar)"><span style="padding:0 6px;background:var(--t-chip);color:var(--t-strong)"><b>SESSIONS</b> 3</span></div>
<div style="padding:14px 0 18px;display:flex;flex-direction:column">
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding:0 14px"><span style="color:var(--t-d3);font-weight:700">–</span><b style="color:var(--t-strong)">acme-store</b><span style="color:var(--t-dim)">⎇ main</span></div>
<div style="padding:2px 14px;background:var(--t-sel);box-shadow:inset 2px 0 0 var(--t-teal)">
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding-left:2ch"><span style="color:${at(v.demo.gc)};font-weight:700">${tx(v.demo.glyph)}</span><span style="color:${at(v.demo.nc)};font-weight:700">bold-puffin</span><span style="color:var(--t-dim)">✻ 37m</span></div>
<div style="padding-left:calc(4ch + 8px);color:${at(v.demo.sc)}">${tx(v.demo.sub)}</div>
</div>
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding:2px 14px 0"><span></span><span style="display:grid;grid-template-columns:2ch minmax(0,1fr);gap:8px;padding-left:0"><span style="color:var(--t-teal);font-weight:700">${tx(v.spin)}</span><span style="color:var(--t-work);font-weight:700">keen-gull</span></span><span style="color:var(--t-dim)">✻ 4m</span></div>
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding:2px 14px 0"><span></span><span style="display:grid;grid-template-columns:2ch minmax(0,1fr);gap:8px"><span style="color:var(--t-dim)">○</span><span style="color:var(--t-c9)">claude 1</span></span><span style="color:var(--t-dim)">✻ 19m</span></div>
</div>
</div>
</div>
</section>

<section aria-labelledby="c-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(32px,5vw,64px);align-items:center">
<div>
<h2 data-reveal="" id="c-title" style="margin:0 0 16px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Close it, come back.</h2>
<p data-reveal="" style="margin:0 0 30px;color:var(--muted);max-width:46ch">A background service owns every session. Close the window, crash or reboot: your agents keep running, or come back in the right folders with their conversations resumed.</p>
<button class="hv2 ac1" type="button" data-click="${on(v.toggleClose)}" style="display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 20px;border:2px solid var(--teal);border-radius:3px;background:var(--teal);color:var(--ink);font:700 14px 'JetBrains Mono',monospace;cursor:pointer;box-shadow:4px 4px 0 var(--hard);transition:transform .12s,box-shadow .12s">${tx(v.closeLabel)}</button>
</div>
<div data-reveal="" style="transition-delay:.15s;background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);font:400 14px/20px 'JetBrains Mono',monospace;color:var(--t-txt);min-height:300px;display:flex;flex-direction:column">
<div style="height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;background:var(--t-bar)"><span style="padding:0 6px;background:${at(v.closeChipBg)};color:${at(v.closeChipFg)};font-weight:700;transition:all .3s">${tx(v.closeChip)}</span><span style="color:var(--t-dim)">${tx(v.closeBar)}</span></div>
<div style="padding:14px;display:flex;flex-direction:column;gap:4px;flex:1;opacity:${at(v.closeOp)};transition:opacity .5s">
${v.closeRows.map((r) => `
<div style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;padding:3px 6px;animation:mtUp .4s ease-out both;animation-delay:${at(r.delay)}">
<span style="color:${at(r.gc)};font-weight:700">${tx(r.glyph)}</span>
<span style="color:${at(r.nc)};font-weight:700">${tx(r.name)} <span style="color:var(--t-dim);font-weight:400">${tx(r.dir)}</span></span>
<span style="color:${at(r.tc)}">${tx(r.tag)}</span>
</div>
`).join("")}
</div>
<div style="padding:10px 14px;border-top:1px solid var(--t-line);color:${at(v.closeFootC)}">${tx(v.closeFoot)}</div>
</div>
</div>
</section>

<section aria-labelledby="b-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line);background:var(--card)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px)">
<h2 data-reveal="" id="b-title" style="margin:0 0 16px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">A branch per agent, review in place.</h2>
<p data-reveal="" style="margin:0 0 40px;max-width:60ch;color:var(--muted)">Each new agent gets its own Git worktree, so no two edit the same files. Files, changes and branches sit in a side panel; commit, merge or open a pull request without leaving.</p>
<div data-reveal="" style="transition-delay:.15s;background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);font:400 13px/18px 'JetBrains Mono',monospace;color:var(--t-txt);display:flex;flex-wrap:wrap">
<div style="flex:999 1 460px;min-width:0;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;background:var(--t-bar)"><span style="padding:0 8px;background:var(--t-teal);color:var(--t-ink);font-weight:700">1  keen-gull</span><span style="margin-left:auto;color:var(--t-dim)">⎇ feat/login · acme-store-worktrees/keen-gull</span></div>
<div style="padding:12px 0;overflow-x:auto">
<div style="padding:0 14px 6px;white-space:pre"><span style="color:var(--t-adim)">└ </span><span style="color:var(--t-txt)">Updated </span><span style="color:var(--t-strong)">${tx(v.diffPath)}</span><span style="color:var(--t-adim)"> (+${tx(v.diffA)} −${tx(v.diffR)})</span></div>
${v.diff.map((d) => `
<div style="display:grid;grid-template-columns:6ch 2ch minmax(0,1fr);gap:4px;padding:0 14px;white-space:pre;animation:mtUp .25s ease-out both"><span style="color:${at(d.nc)};text-align:right">${tx(d.n)}</span><span style="color:${at(d.nc)}">${tx(d.k)}</span><span>${d.segs.map((s) => `<span style="color:${at(s.c)}">${tx(s.t)}</span>`).join("")}</span></div>
`).join("")}
</div>
</div>
<div style="flex:1 1 280px;border-left:1px solid var(--t-teal);display:flex;flex-direction:column">
<div style="display:flex;gap:6px;height:24px;align-items:center;padding:0 10px;background:var(--t-bar)">
<span style="padding:0 6px;color:var(--t-dim)">files</span><span style="padding:0 6px;background:var(--t-teal);color:var(--t-ink);font-weight:700">changes</span><span style="padding:0 6px;color:var(--t-dim)">branches</span>
</div>
<div style="padding:10px 0;display:flex;flex-direction:column">
${v.files.map((fl) => `
<button class="hv4" type="button" data-click="${on(fl.pick)}" style="display:grid;grid-template-columns:2ch minmax(0,1fr) auto;gap:8px;width:100%;text-align:left;padding:3px 12px;border:0;background:${at(fl.bg)};box-shadow:${at(fl.bar)};color:var(--t-txt);font:inherit;cursor:pointer;transition:background-color .2s">
<span style="color:${at(fl.mc)};font-weight:700">${tx(fl.m)}</span>
<span style="color:var(--t-strong);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tx(fl.path)}</span>
<span><span style="color:var(--t-green)">+${tx(fl.a)}</span> <span style="color:var(--t-red)">−${tx(fl.r)}</span></span>
</button>
`).join("")}
</div>
<div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;border-top:1px solid var(--t-line)">
<span style="padding:0 8px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">c</b> commit</span>
<span style="padding:0 8px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">m</b> merge</span>
<span style="padding:0 8px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">p</b> pull request</span>
</div>
</div>
</div>
</div>
</section>

<section aria-labelledby="i-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px)">
<h2 data-reveal="" id="i-title" style="margin:0 0 40px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Inbox, alerts and checks.</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:20px">
<div style="background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;font:400 13px/18px 'JetBrains Mono',monospace;color:var(--t-txt);display:flex;flex-direction:column">
<div style="height:24px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:var(--t-bar)"><span style="padding:0 6px;background:var(--t-chip);color:var(--t-strong)"><b>INBOX</b> 3</span><span style="color:var(--t-dim)">most urgent first</span></div>
<div style="padding:8px 0 12px">
${v.inbox.map((it) => `
<div style="padding:8px 12px 2px;color:var(--t-dim);font-weight:700">${tx(it.group)}</div>
<button class="hv4" type="button" data-click="${on(it.pick)}" style="display:grid;grid-template-columns:2ch minmax(0,1fr);gap:8px;width:100%;text-align:left;padding:3px 12px;border:0;background:${at(it.bg)};box-shadow:${at(it.bar)};color:var(--t-txt);font:inherit;cursor:pointer">
<span style="color:${at(it.c)};font-weight:700">${tx(it.g)}</span>
<span style="display:flex;flex-direction:column;min-width:0"><b style="color:var(--t-strong)">${tx(it.name)}</b><span style="color:${at(it.c)}">${tx(it.text)}</span><span style="display:${at(it.actD)};margin-top:4px"><span style="padding:0 6px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">↵</b> open</span> <span style="padding:0 6px;background:var(--t-chip);color:var(--t-c9)"><b style="color:var(--t-teal)">r</b> reply</span></span></span>
</button>
`).join("")}
</div>
</div>
<div style="background:var(--card);border:1px solid var(--line);border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:14px">
<h3 style="margin:0;font:700 16px 'Martian Mono',monospace;color:var(--strong);letter-spacing:-.02em">Alerts</h3>
<p style="margin:0;color:var(--muted);font-size:16px">A sound when an agent waits, and an optional notification on your phone.</p>
${v.alerts.map((al) => `
<button class="hv7" type="button" role="switch" aria-checked="${at(al.on)}" data-click="${on(al.pick)}" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--line);border-radius:3px;background:var(--bg);color:var(--strong);font:500 14px 'JetBrains Mono',monospace;cursor:pointer;text-align:left;transition:border-color .2s"><span style="color:${at(al.c)};font-weight:700;white-space:pre">${tx(al.box)}</span>${tx(al.label)}</button>
`).join("")}
</div>
<div style="background:var(--card);border:1px solid var(--line);border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:14px">
<h3 style="margin:0;font:700 16px 'Martian Mono',monospace;color:var(--strong);letter-spacing:-.02em">Checks</h3>
<p style="margin:0;color:var(--muted);font-size:16px">Name a command, such as your tests. Maitty runs it after every turn, so a broken turn reads <b style="color:var(--fail);font-family:'JetBrains Mono',monospace">failed</b>, not <b style="color:var(--done);font-family:'JetBrains Mono',monospace">done</b>.</p>
<pre style="margin:0;padding:12px 14px;background:var(--t-bg);border:1px solid var(--t-line);border-radius:3px;font:400 13px/1.65 'JetBrains Mono',monospace;color:var(--t-txt);overflow-x:auto"><span style="color:var(--t-adim)"># config.toml</span>
[[check]]
<span style="color:var(--t-teal)">project</span> = <span style="color:var(--t-red)">"/home/me/code/my-app"</span>
<span style="color:var(--t-teal)">name</span>    = <span style="color:var(--t-red)">"test"</span>
<span style="color:var(--t-teal)">command</span> = <span style="color:var(--t-red)">"cargo test"</span></pre>
</div>
</div>
</div>
</section>

<section aria-labelledby="m-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line);background:var(--card)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(32px,5vw,64px);align-items:center">
<div>
<h2 data-reveal="" id="m-title" style="margin:0 0 16px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Agents that work together.</h2>
<p style="margin:0;color:var(--muted);max-width:46ch">Everything works from any shell, including from an agent running inside Maitty. Through MCP, agents can list, read, message and start other sessions, within limits you set.</p>
</div>
<div data-reveal="" style="transition-delay:.15s;background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);font:400 14px/20px 'JetBrains Mono',monospace;color:var(--t-txt)">
<div style="display:flex;align-items:center;gap:8px;height:26px;padding:0 10px;background:var(--t-bar)"><span style="padding:0 8px;background:var(--t-teal);color:var(--t-ink);font-weight:700">2  shell</span><span style="margin-left:auto;color:var(--t-dim)">~/code/billing-api</span></div>
<div style="padding:16px 16px 20px;min-height:290px">
${v.cli.map((ln) => `
<div style="margin-bottom:12px">
<div style="color:var(--t-strong);white-space:pre-wrap;word-break:break-word"><span style="color:var(--t-teal);font-weight:700">$ </span>${tx(ln.typed)}<span style="display:${at(ln.caret)};width:.6em;height:1.1em;vertical-align:-.15em;background:var(--t-teal);margin-left:2px;animation:mtBlink 1s steps(1) infinite"></span></div>
<div style="color:var(--t-adim);opacity:${at(ln.noteOp)};transition:opacity .3s"># ${tx(ln.note)}</div>
</div>
`).join("")}
</div>
</div>
</div>
</section>

<section aria-labelledby="y-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px)">
<h2 data-reveal="" id="y-title" style="margin:0 0 16px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Make it yours.</h2>
<p data-reveal="" style="margin:0 0 36px;max-width:56ch;color:var(--muted)">Four layouts, 60+ themes, square or rounded shapes, and every key configurable.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:24px">
<div style="display:flex;flex-direction:column;gap:14px">
<div role="tablist" aria-label="Layout" style="display:flex;flex-wrap:wrap;gap:8px">
${v.layoutBtns.map((lb) => `
<button type="button" role="tab" aria-selected="${at(lb.on)}" data-click="${on(lb.pick)}" style="height:44px;padding:0 14px;border:2px solid ${at(lb.border)};border-radius:3px;background:${at(lb.bg)};color:${at(lb.fg)};font:700 13px 'JetBrains Mono',monospace;cursor:pointer;transition:all .15s">${tx(lb.label)}</button>
`).join("")}
</div>
<div aria-hidden="true" style="display:grid;grid-template-columns:32% 1fr 1fr;grid-template-rows:110px 110px;gap:${at(v.lay.gap)};padding:${at(v.lay.pad)};background:var(--t-bg);border:1px solid var(--t-line);border-radius:10px;transition:all .35s;font:400 11px/16px 'JetBrains Mono',monospace;color:var(--t-txt);overflow:hidden">
<div style="grid-row:1/3;padding:6px 8px;border:${at(v.lay.b0)};border-radius:${at(v.lay.rad)};background:${at(v.lay.bg0)};transition:all .35s"><span style="padding:0 4px;background:var(--t-chip);color:var(--t-strong);font-weight:700">SESSIONS</span><br><span style="color:var(--t-amber)">●</span> bold-puffin<br><span style="color:var(--t-teal)">⠴</span> <span style="color:var(--t-work)">swift-otter</span><br><span style="color:var(--t-green)">●</span> <span style="color:var(--t-green)">calm-heron</span></div>
<div style="grid-row:1/3;padding:6px 8px;border:${at(v.lay.b1)};border-radius:${at(v.lay.rad)};background:${at(v.lay.bg1)};transition:all .35s"><span style="color:var(--t-green)">●</span> Bash(cargo test)<br><span style="color:var(--t-adim)">└ 214 passed</span></div>
<div style="padding:6px 8px;border:${at(v.lay.b2)};border-radius:${at(v.lay.rad)};background:${at(v.lay.bg2)};transition:all .35s"><span style="color:var(--t-teal)">$</span> pnpm dev</div>
<div style="padding:6px 8px;border:${at(v.lay.b3)};border-radius:${at(v.lay.rad)};background:${at(v.lay.bg3)};transition:all .35s"><span style="color:var(--t-teal)">$</span> lazygit</div>
</div>
<p style="margin:0;font:500 14px 'JetBrains Mono',monospace;color:var(--text)"><b style="color:var(--strong)">${tx(v.lay.name)}.</b> ${tx(v.lay.desc)}</p>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-content:start">
${v.themeCards.map((tc) => `
<button class="hv8" type="button" data-click="${on(tc.pick)}" aria-pressed="${at(tc.on)}" style="display:flex;flex-direction:column;gap:12px;padding:16px;border:2px solid ${at(tc.border)};border-radius:6px;background:${at(tc.bg)};color:${at(tc.fg)};cursor:pointer;text-align:left;transition:all .15s">
<span style="font:700 14px 'JetBrains Mono',monospace">${tx(tc.label)}</span>
<span style="display:flex;flex-direction:column;gap:2px;font:400 12px/1.6 'JetBrains Mono',monospace;padding:10px;background:${at(tc.panel)}">
<span><span style="color:${at(tc.teal)}">⠴</span> <span style="color:${at(tc.work)}">swift-otter</span></span>
<span><span style="color:${at(tc.needs)}">●</span> bold-puffin</span>
<span><span style="color:${at(tc.done)}">●</span> <span style="color:${at(tc.done)}">calm-heron</span></span>
</span>
<span style="font:500 12px 'JetBrains Mono',monospace;opacity:.8">${tx(tc.hint)}</span>
</button>
`).join("")}
</div>
</div>
</div>
</section>

<section aria-labelledby="a-title" style="padding:clamp(72px,10vw,128px) 0;border-top:1px solid var(--line);background:var(--card)">
<div style="max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,32px)">
<h2 data-reveal="" id="a-title" style="margin:0 0 36px;font:700 clamp(26px,3.6vw,44px)/1.12 'Martian Mono',monospace;letter-spacing:-.035em;color:var(--strong)">Works with your agents.</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:0 40px;margin-bottom:28px;border-top:1px solid var(--line)">
${v.agents.map((ag) => `
<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--line);font:700 15px 'JetBrains Mono',monospace;color:var(--strong)"><span style="color:var(--teal);width:1.2em">${tx(ag.mk)}</span>${tx(ag.name)}</div>
`).join("")}
</div>
<p style="margin:0;color:var(--muted)">Any command-line agent works; these report exact status. Connect one with <code style="font:600 14px 'JetBrains Mono',monospace;color:var(--strong);background:var(--raised);border:1px solid var(--line);padding:1px 6px;border-radius:3px">maitty integrate claude</code>.</p>
</div>
</section>

<section id="install" aria-labelledby="f-title" style="position:relative;padding:0;border-top:1px solid var(--line);overflow:hidden">
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;display:var(--sky-night)">
${v.stars.map((sr) => `<span style="position:absolute;left:${at(sr.x)};top:${at(sr.y)};width:${at(sr.s)};height:${at(sr.s)};border-radius:50%;background:#e8f1f8;--o:${at(sr.o)};opacity:${at(sr.o)};animation:mtTwinkle ${at(sr.d)} ease-in-out infinite;animation-play-state:var(--play,running)"></span>`).join("")}
<span style="position:absolute;right:7%;top:clamp(28px,5vw,64px);width:clamp(40px,5vw,64px);aspect-ratio:1;border-radius:50%;background:#e8f1f8;box-shadow:inset -.35em -.2em 0 0 #c9d6e3,0 0 60px 18px rgba(232,241,248,.10),0 0 140px 60px rgba(61,214,198,.06);font-size:clamp(14px,1.6vw,20px)"></span>
</div>
<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;display:var(--sky-day)">
<span style="position:absolute;right:8%;top:clamp(28px,5vw,60px);width:clamp(44px,5.4vw,70px);aspect-ratio:1;border-radius:50%;background:#ffe4a3;box-shadow:0 0 0 10px rgba(255,228,163,.25),0 0 80px 30px rgba(255,228,163,.35)"></span>
<span style="position:absolute;right:16%;top:clamp(70px,9vw,120px);display:block;width:120px;height:30px;border-radius:30px;background:#ffffff;box-shadow:24px -14px 0 4px #ffffff,58px -6px 0 0 #ffffff,0 8px 20px rgba(11,23,36,.05);animation:mtCloud 26s ease-in-out infinite alternate;animation-play-state:var(--play,running)"></span>
<span style="position:absolute;left:44%;top:clamp(36px,5vw,70px);display:block;width:84px;height:22px;border-radius:22px;background:#ffffff;opacity:.9;box-shadow:18px -10px 0 2px #ffffff,40px -4px 0 0 #ffffff;animation:mtCloud 34s ease-in-out -10s infinite alternate-reverse;animation-play-state:var(--play,running)"></span>
</div>
<div style="position:relative;z-index:1;display:flex;justify-content:center;padding:clamp(56px,8vw,96px) clamp(16px,4vw,32px) 0;margin-bottom:-56px">
<div style="width:min(100%,560px);animation:mtShip 7s ease-in-out infinite;animation-play-state:var(--play,running);transform-origin:50% 90%">
<img src="/img/hero-ship-960.webp" srcset="/img/hero-ship-480.webp 480w, /img/hero-ship-960.webp 960w, /img/hero-ship-1280.webp 1280w" sizes="(max-width: 600px) 92vw, 560px" decoding="async" alt="The Maitty ship, crewed by robot sailors" width="1502" height="909" loading="lazy" style="display:block;width:100%;height:auto;filter:var(--shipf)">
</div>
</div>
<div aria-hidden="true" style="position:relative;z-index:3;height:64px;margin-bottom:-61px;background:var(--crest);-webkit-mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;animation:mtWave 16s linear infinite;"></div>
<div aria-hidden="true" style="position:relative;z-index:3;height:64px;background:var(--water);-webkit-mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;mask:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 64' preserveAspectRatio='none'%3E%3Cpath d='M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 V64 H0 Z'/%3E%3C/svg%3E&quot;) 0 0/600px 64px repeat-x;animation:mtWave 16s linear infinite;"></div>
<div style="background:var(--water);padding:0 0 clamp(80px,11vw,140px)">
<div style="max-width:760px;margin:0 auto;padding:0 clamp(16px,4vw,32px);text-align:center;position:relative;z-index:4;display:flex;flex-direction:column;align-items:center;gap:22px">
<h2 data-reveal="" id="f-title" style="margin:0;font:800 clamp(30px,5vw,60px)/1.05 'Martian Mono',monospace;letter-spacing:-.04em;color:var(--strong)">Install M<span style="color:var(--teal)">ai</span>tty.</h2>
<p style="margin:0;font-size:19px;color:var(--text)">Free and open source. Windows, macOS and Linux. No account, no admin rights.</p>
<div style="width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:6px;overflow:hidden;box-shadow:none">
<div style="display:flex;align-items:stretch;background:var(--raised);border-bottom:1px solid var(--line)">
<div role="tablist" aria-label="Your operating system" style="display:flex">
${v.osTabs.map((t) => `
<button type="button" role="tab" aria-selected="${at(t.on)}" data-click="${on(t.pick)}" style="min-height:44px;padding:0 18px;border:0;border-right:1px solid var(--line);background:${at(t.bg)};color:${at(t.fg)};font:700 13px 'JetBrains Mono',monospace;cursor:pointer">${tx(t.label)}</button>
`).join("")}
</div>
<span style="margin-left:auto;display:flex;align-items:center;padding:0 14px;font:500 12px 'JetBrains Mono',monospace;color:var(--dim)">${tx(v.shell)}</span>
</div>
<div style="padding:18px;display:flex;flex-wrap:wrap;gap:14px;align-items:center">
<code style="flex:1 1 300px;min-width:0;font:400 14px/1.65 'JetBrains Mono',monospace;color:var(--strong);white-space:pre-wrap;word-break:break-all"><span style="color:var(--teal);font-weight:700;user-select:none">${tx(v.prompt)} </span>${tx(v.cmd)}</code>
<button class="hv2 ac1" type="button" data-click="${on(v.copy)}" aria-label="Copy install command" style="display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border:2px solid var(--teal);border-radius:3px;background:${at(v.copyBg)};color:var(--ink);font:700 14px 'JetBrains Mono',monospace;cursor:pointer;box-shadow:4px 4px 0 var(--hard);transition:transform .12s,box-shadow .12s,background-color .2s">${tx(v.copyLabel)}</button>
</div>
</div>
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px 28px">
<a class="hv9" href="https://github.com/CydoEntis/maitty#readme" style="color:var(--teal);font:600 14px 'JetBrains Mono',monospace">README</a>
<a class="hv9" href="https://github.com/CydoEntis/maitty/blob/main/docs/guide.md" style="color:var(--teal);font:600 14px 'JetBrains Mono',monospace">Guide</a>
<a class="hv9" href="https://github.com/CydoEntis/maitty/releases" style="color:var(--teal);font:600 14px 'JetBrains Mono',monospace">Releases</a>
</div>
</div>
</div>
</section>
</main>

<footer style="border-top:1px solid var(--line);background:var(--bg)">
<div style="max-width:1280px;margin:0 auto;padding:28px clamp(16px,4vw,32px) 36px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;font:500 13px 'JetBrains Mono',monospace">
<div style="display:flex;align-items:center;gap:12px;color:var(--strong)">
<img src="/img/maitty-logo.svg" alt="" width="34" height="29" style="width:34px;height:auto">
<b style="font-family:'Martian Mono',monospace;letter-spacing:.04em">M<span style="color:var(--teal)">AI</span>TTY</b>
<span style="color:var(--muted)"${v.ver ? "" : " hidden"}>version <a href="https://github.com/CydoEntis/maitty/releases/latest" style="color:var(--teal)">${tx(v.ver)}</a></span>
</div>
<nav aria-label="Footer" style="display:flex;flex-wrap:wrap;gap:8px 22px">
<a class="hv1" href="https://github.com/CydoEntis/maitty" style="color:var(--text)">GitHub</a>
<a class="hv1" href="https://github.com/CydoEntis/maitty/releases" style="color:var(--text)">Releases</a>
<a class="hv1" href="https://github.com/CydoEntis/maitty/blob/main/LICENSE" style="color:var(--text)">MIT License</a>
</nav>
</div>
</footer>
<div aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${tx(v.live)}</div>
</div>`;
})(globalThis);
