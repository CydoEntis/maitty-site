// The prototype's logic class, ported off its React runtime: the same state,
// the same scripted demo and the same values for view.js. DOM wiring (mount,
// timers, theme storage, the version fetch) lives in main.js.
(function (root) {
"use strict";
const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const COPY_KEY = typeof navigator !== 'undefined' && /mac/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '') ? '⌘C' : 'Ctrl+C';
const WIN = 'irm https://raw.githubusercontent.com/CydoEntis/maitty/main/install.ps1 | iex';
const NIX = 'curl -fsSL https://raw.githubusercontent.com/CydoEntis/maitty/main/install.sh | sh';
// Night theme, sampled from real captures
const K = { teal: 'var(--t-teal)', work: 'var(--t-work)', green: 'var(--t-green)', amber: 'var(--t-amber)', yel: 'var(--t-yel)', red: 'var(--t-red)', dim: 'var(--t-dim)', adim: 'var(--t-adim)', txt: 'var(--t-txt)', bash: 'var(--t-bash)', blue: 'var(--t-blue)', strong: 'var(--t-strong)', c9: 'var(--t-c9)', user: 'var(--t-user)', sel: 'var(--t-sel)' };
const seg = (t, c, fw) => ({ t, c: c || K.txt, fw: fw || 400 });
const line = (segs, o) => ({ segs, pl: (o && o.pl) || '0', bg: (o && o.bg) || 'transparent', mt: (o && o.mt) || '0' });
const tool = (name, arg) => line([seg('● ', K.green), seg(name, K.bash, 700), seg('(' + arg + ')', K.bash)], { mt: '8px' });
const sub = (t, c) => line([seg('└ ', K.adim), seg(t, c || K.adim)], { pl: '2ch' });
const msg = t => line([seg('● ', K.txt), seg(t, K.txt)], { mt: '8px' });
const GROUPS = [
  { name: 'scratch', dc: 'var(--t-d1)', meta: 'no git', ids: ['c1', 'c2'] },
  { name: 'billing-api', dc: 'var(--t-d2)', meta: '⎇ main', ids: ['gw'] },
  { name: 'docs-site', dc: 'var(--t-d3)', meta: '', ids: ['wb'] },
  { name: 'acme-store', dc: 'var(--t-d4)', meta: '⎇ main', ids: ['bw'] }
];
const ASK = {
  bw: { cmd: 'pnpm install --frozen-lockfile=false', desc: 'Refresh dependencies and the lockfile', ran: 'Done in 14.2s · 1,204 packages', fin: 'Dependencies are fresh and the lockfile is committed.', intro: [line([seg('› ', K.txt), seg('CI says the lockfile is out of date. Can you fix it?', K.txt)], { bg: K.user }), tool('Bash', 'pnpm install --frozen-lockfile'), sub('ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile"', K.red), sub('Allowed by auto mode classifier'), tool('Read', 'package.json'), sub('Read 48 lines'), msg('The lockfile is out of date with package.json: zod was bumped to 3.23 without reinstalling. Reinstalling to fix it.')] },
  wb: { cmd: 'git push -u origin docs/quickstart', desc: 'Push the quickstart branch so the PR can open', ran: 'branch docs/quickstart set up to track origin/docs/quickstart', fin: 'Pushed. The new quickstart is up for review.', intro: [tool('Bash', 'npm run build'), sub('Built 48 pages in 6.2s'), msg('The quickstart is rewritten and every code sample builds. Pushing the branch next.')] }
};
const INIT = {
  c1: { id: 'c1', name: 'claude 1', state: 'idle', meta: '✻ 19m', base: [msg('Done. The release notes are in CHANGELOG.md.')] },
  c2: { id: 'c2', name: 'claude 2', state: 'idle', meta: '✻ 45m', base: [msg('Nothing left to do here. Start a new task when you like.')] },
  gw: { id: 'gw', name: 'swift-otter', state: 'working', meta: '✻ 1h', agents: '2 agents', base: [tool('Bash', 'git fetch -q && git rebase origin/main'), sub('Successfully rebased and updated refs/heads/feat/refunds', K.txt), sub('Allowed by auto mode classifier'), msg('Refund webhooks now retry with backoff, and 214 tests pass. Two helpers are writing the integration tests.')] },
  wb: { id: 'wb', name: 'calm-heron', state: 'done', seen: false, meta: '✻ 2m', plus: '+85', minus: '−83', agents: '', base: ASK.wb.intro.slice(0, 2).concat([msg('The quickstart is rewritten, every code sample builds, and the broken links are fixed.')]) },
  bw: { id: 'bw', name: 'bold-puffin', state: 'needs', meta: '✻ 37m', agents: '1 agent', base: ASK.bw.intro }
};
const FILES = [
  { path: 'web/login.tsx', m: 'M', start: 12, lines: [[' ', 'export function LoginForm() {'], ['-', '  const onSubmit = () => signIn(email)'], ['+', '  const onSubmit = () => {'], ['+', '    if (!isEmail(email)) return setError("Enter a valid email")'], ['+', '    signIn(email)'], ['+', '  }'], [' ', '  return ('], [' ', '    <form onSubmit={onSubmit}>']] },
  { path: 'web/auth.ts', m: 'M', start: 3, lines: [[' ', 'export async function signIn(email: string) {'], ['-', '  const res = await fetch("/api/login", { method: "POST" })'], ['+', '  const res = await fetch("/api/login", {'], ['+', '    method: "POST",'], ['+', '    body: JSON.stringify({ email }),'], ['+', '  })'], [' ', '  if (!res.ok) throw new LoginError(res.status)']] },
  { path: 'web/login.test.tsx', m: 'A', start: 1, lines: [['+', 'import { render, screen } from "@testing-library/react"'], ['+', ''], ['+', 'it("rejects an invalid email", async () => {'], ['+', '  render(<LoginForm />)'], ['+', '  await type("email", "not-an-email")'], ['+', '  expect(screen.getByText(/valid email/)).toBeVisible()'], ['+', '})']] }
];
const KW = /("[^"]*")|\b(export|function|const|return|if|await|async|import|from|throw|new|it)\b/g;
const hl = t => { const out = []; let i = 0, m; KW.lastIndex = 0; while ((m = KW.exec(t))) { if (m.index > i) out.push({ t: t.slice(i, m.index), c: K.txt }); out.push({ t: m[0], c: m[1] ? K.red : K.teal }); i = m.index + m[0].length; } if (i < t.length) out.push({ t: t.slice(i), c: K.txt }); return out.length ? out : [{ t: ' ', c: K.txt }]; };
const CLI = [['maitty worktree feat/login -- codex', 'a new branch in its own worktree, with codex'], ['maitty send -p 3 "run the tests"', 'message session 3'], ['maitty handoff 3 --to claude', 'hand its task to another agent'], ['maitty ls --json', 'every session and its status']];
const LAYOUTS = {
  floating: { name: 'Floating', desc: 'Boxes with gaps, the default.', gap: '8px', pad: '8px', rad: '8px', b: ['1px solid var(--t-line)', '1px solid var(--t-teal)', '1px solid var(--t-line)', '1px solid var(--t-line)'], bg: ['var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)'] },
  tiled: { name: 'Tiled', desc: 'Boxes edge to edge.', gap: '0px', pad: '6px', rad: '0px', b: ['1px solid var(--t-line)', '1px solid var(--t-teal)', '1px solid var(--t-line)', '1px solid var(--t-line)'], bg: ['var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)'] },
  compact: { name: 'Compact', desc: 'Full-bleed zones with square edges.', gap: '1px', pad: '0px', rad: '0px', b: ['0 solid transparent', '0 solid transparent', '0 solid transparent', '0 solid transparent'], bg: ['var(--t-bg)', 'var(--t-alt)', 'var(--t-bg)', 'var(--t-alt)'] },
  grid: { name: 'Grid', desc: 'Each pane in its own colour, by its place.', gap: '8px', pad: '8px', rad: '8px', b: ['1px solid var(--t-line)', '1px solid var(--t-teal)', '1px solid var(--t-d2)', '1px solid var(--t-yel)'], bg: ['var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)', 'var(--t-bg)'] }
};
const AGENTS = [['✻', 'Claude Code'], ['◆', 'Codex'], ['✦', 'Gemini CLI'], ['◇', 'OpenCode'], ['·', 'Qwen'], ['·', 'Pi'], ['·', 'Kilo'], ['·', 'Kimi'], ['·', 'Mastra Code']];
const STATES = { working: { w: 'working', c: 'var(--t-teal)', d: 'The agent is busy on its turn. The spinner moves while it works.' }, needs: { w: 'needs you', c: 'var(--t-amber)', d: 'A question or approval is waiting. Amber means you, and nothing else.' }, done: { w: 'done', c: 'var(--t-green)', d: 'The turn finished (and its checks passed, if you set any). Green until you look.' }, idle: { w: 'idle', c: 'var(--t-dim)', d: 'Nothing running. Resting at anchor.' } };

class MaittyPage {
  constructor(now, theme) { this.state.t0 = now; this.state.now = now; this.state.theme = theme; }
  state = { theme: 'night', os: 'win', copied: false, f: 0, S: INIT, sel: 'bw', toast: null, demoPick: null, closed: false, reopened: false, layout: 'floating', file: 0, inboxSel: 0, sound: true, phone: false, ver: '', t0: 0, now: 0, live: '', reduce: false };
  timers = [];
  stars = Array.from({ length: 46 }, (_, i) => { const r = n => { const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); }; return { x: (r(1) * 100).toFixed(2) + '%', y: (r(2) * 62).toFixed(2) + '%', s: (r(3) < 0.18 ? 2.5 : r(3) < 0.6 ? 1.6 : 1.1) + 'px', o: (0.35 + r(4) * 0.55).toFixed(2), d: (3 + r(5) * 5).toFixed(1) + 's' }; });
  // main.js sets changed() to re-render and saveTheme() to store the choice.
  changed() {}
  saveTheme() {}
  setState(u) { this.state = { ...this.state, ...(typeof u === 'function' ? u(this.state) : u) }; this.changed(); }
  T(fn, ms) { this.timers.push(setTimeout(fn, ms)); }
  upd(id, patch) { this.setState(s => ({ S: { ...s.S, [id]: { ...s.S[id], ...patch } } })); }
  answer(id, k) {
    const x = this.state.S[id], a = ASK[id];
    if (!x || x.state !== 'needs' || !a) return;
    const no = k === 3;
    this.upd(id, { state: 'working', since: Date.now(), extra: no ? [line([seg('› ', K.txt), seg('No. Leave the lockfile alone for now.', K.txt)], { bg: K.user, mt: '8px' })] : [tool('Bash', a.cmd), sub('Running…')] });
    this.setState({ live: x.name + ' is working again' });
    this.T(() => {
      this.upd(id, { state: 'done', seen: this.state.sel === id, extra: no ? [line([seg('› ', K.txt), seg('No. Leave it for now.', K.txt)], { bg: K.user, mt: '8px' }), msg('Understood. I left everything as it was.')] : [tool('Bash', a.cmd), sub(a.ran, K.txt), msg(a.fin)] });
      this.setState({ toast: { title: x.name + ' finished', detail: (x.meta || '').replace('✻ ', '') + ' · ' + (no ? 'stopped' : 'checks passed') }, live: x.name + ' finished' });
      this.T(() => this.setState({ toast: null }), 3200);
      this.T(() => { const nx = id === 'bw' ? 'wb' : 'bw'; this.upd(nx, { state: 'needs', extra: null, base: ASK[nx].intro, seen: true }); this.setState({ live: this.state.S[nx].name + ' needs you' }); }, 3800);
    }, 4200);
  }
  select(id) { this.setState(s => ({ sel: id, S: s.S[id].state === 'done' ? { ...s.S, [id]: { ...s.S[id], seen: true } } : s.S })); }
  copyCmd() {
    const t = this.state.os === 'win' ? WIN : NIX;
    const done = ok => { this.setState({ copied: ok ? 'ok' : 'fail', live: ok ? 'Install command copied' : 'Copy failed. Select the command and press ' + COPY_KEY + '.' }); this.T(() => this.setState({ copied: false }), 2000); };
    const fb = () => { const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); return ok; };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(() => done(true), () => done(fb())); else done(fb());
  }
  setTheme(t) { this.setState({ theme: t }); this.saveTheme(t); }
  ocean(t, cols, rows) {
    const FILL = ' ▁▂▃▄▅▆▇█', out = [];
    for (let r = 0; r < rows; r++) {
      const rb = rows - 1 - r; let s = '';
      for (let x = 0; x < cols; x++) {
        const h = rows * 0.45 + 1.4 * Math.sin(x * 0.11 + t * 0.55) + 0.8 * Math.sin(x * 0.043 - t * 0.27 + 1.3) + 0.35 * Math.sin(x * 0.31 + t * 0.9);
        s += FILL[Math.round(Math.max(0, Math.min(1, h - rb)) * 8)];
      }
      out.push({ t: s, op: (0.3 + 0.7 * (r / (rows - 1))).toFixed(2) });
    }
    return out;
  }
  look(x, sp) {
    if (x.state === 'working') return { glyph: sp, gc: K.teal, nc: K.work, fw: 700, sub: x.agents, sc: K.dim };
    if (x.state === 'needs') return { glyph: '●', gc: K.amber, nc: K.strong, fw: 700, sub: 'asks: Allow Bash(' + (ASK[x.id] ? ASK[x.id].cmd.split(' ').slice(0, 2).join(' ') : '') + ')?', sc: K.amber };
    if (x.state === 'done' && !x.seen) return { glyph: '●', gc: K.green, nc: K.green, fw: 700, sub: x.agents || '', sc: K.dim };
    return { glyph: '○', gc: K.dim, nc: K.c9, fw: 400, sub: x.agents || '', sc: K.dim };
  }
  renderVals() {
    const st = this.state, f = st.f, sp = st.reduce ? '⠴' : SPIN[f % 10], el = (st.now - st.t0) / 1000;
    const S = st.S, sel = S[st.sel];
    const needsN = Object.values(S).filter(x => x.state === 'needs').length;
    const groups = GROUPS.map(g => ({ name: g.name, dc: g.dc, meta: g.meta, items: g.ids.map(id => { const x = S[id], lk = this.look(x, sp), on = id === st.sel; return { name: x.name, glyph: lk.glyph, gc: lk.gc, nc: lk.nc, fw: lk.fw, meta: x.meta, plus: x.plus || '', minus: x.minus || '', sub: lk.sub, subD: lk.sub ? 'block' : 'none', sc: lk.sc, on: on ? 'true' : 'false', bg: on ? K.sel : 'transparent', bar: on ? 'inset 2px 0 0 ' + K.teal : 'none', pick: () => this.select(id) }; }) }));
    const secs = Math.floor((st.now - (sel.since || st.t0)) / 1000) + (sel.id === 'gw' ? 2484 : 74);
    const clock = Math.floor(secs / 60) + 'm ' + (secs % 60) + 's · ↓ ' + (secs * 0.09).toFixed(1) + 'k tokens';
    let lines = (sel.base || []).concat(sel.extra || []);
    if (sel.state === 'working') lines = lines.concat([line([seg(st.reduce ? '✻' : '·✢✳✶✻✽'[Math.floor(f / 2) % 6] + ' ', K.red), seg(sel.id === 'gw' ? 'Waiting for 2 background agents to finish' : 'Orchestrating…', sel.id === 'gw' ? K.adim : K.red), seg(sel.id === 'gw' ? '' : ' (' + (secs % 60) + 's · ↓ ' + ((secs % 60) * 0.12).toFixed(1) + 'k tokens)', K.adim)], { mt: '8px' })]);
    const a = ASK[sel.id], stc = STATES[sel.state];
    const pane = { name: sel.name, glyph: sel.state === 'working' ? sp : sel.state === 'needs' ? '●' : sel.state === 'done' ? '✓' : '○', word: stc.w, c: stc.c, lines, ask: sel.state === 'needs' && !!a, cmd: a ? a.cmd : '', desc: a ? a.desc : '', clock, opts: a ? [['1. Yes', 1], ["2. Yes, don't ask again", 2], ['3. No, tell Claude what to do', 3]].map(([label, k]) => ({ label, arrow: k === 1 ? '❯' : ' ', c: k === 1 ? K.teal : K.txt, pick: () => this.answer(sel.id, k) })) : [] };
    const auto = st.demoPick || (Math.floor(el / 4) % 2 ? 'needs' : 'working');
    const demo = auto === 'working' ? { glyph: sp, gc: K.teal, nc: K.work, sub: '1 agent', sc: K.dim } : auto === 'needs' ? { glyph: '●', gc: K.amber, nc: K.strong, sub: 'asks: Allow Bash(pnpm install)?', sc: K.amber } : auto === 'done' ? { glyph: '●', gc: K.green, nc: K.green, sub: 'done · not seen', sc: K.green } : { glyph: '○', gc: K.dim, nc: K.c9, sub: 'idle', sc: K.dim };
    const stateCards = Object.keys(STATES).map(k => { const m = STATES[k], on = auto === k; return { glyph: k === 'working' ? sp : k === 'needs' || k === 'done' ? '●' : '○', word: m.w, c: on ? 'var(--ink)' : 'var(--text)', on: on ? 'true' : 'false', border: on ? m.c : 'var(--line)', bg: on ? m.c : 'var(--bg)', shadow: on ? '3px 3px 0 var(--hard)' : 'none', pick: () => this.setState({ demoPick: st.demoPick === k ? null : k }) }; });
    const ws = 600 + Math.floor(el), waiting = Math.floor(ws / 60) + ':' + String(ws % 60).padStart(2, '0');
    const crow = [['swift-otter', '~/code/billing-api', 'working'], ['calm-heron', '~/code/docs-site', 'done'], ['bold-puffin', '~/code/acme-store', 'needs'], ['claude 1', '~/code/scratch', 'idle'], ['claude 2', '~/code/scratch', 'idle']];
    const closeRows = crow.map(([name, dir, s], i) => { const c = STATES[s].c; return { name, dir, glyph: st.closed ? (s === 'idle' ? '○' : sp) : s === 'working' ? sp : s === 'idle' ? '○' : '●', gc: st.closed ? K.dim : c, nc: st.closed ? K.dim : s === 'working' ? K.work : s === 'done' ? K.green : s === 'idle' ? K.c9 : K.strong, tag: st.closed ? (s === 'idle' ? 'saved' : 'running') : st.reopened ? 'resumed' : STATES[s].w, tc: st.closed ? K.dim : st.reopened ? K.teal : c, delay: st.reopened ? (i * 110) + 'ms' : '0ms' }; });
    const fsel = FILES[st.file]; let n = fsel.start - 1;
    const diff = fsel.lines.map(([k, t]) => { if (k !== '-') n++; return { n: String(k === '-' ? n + 1 : n), k: k === ' ' ? '' : k === '-' ? '-' : '+', nc: k === '+' ? K.green : k === '-' ? K.red : K.adim, segs: k === '-' ? [{ t, c: K.adim }] : hl(t) }; });
    const files = FILES.map((fl, i) => ({ path: fl.path, m: fl.m, mc: fl.m === 'A' ? K.green : K.yel, a: fl.lines.filter(l => l[0] === '+').length, r: fl.lines.filter(l => l[0] === '-').length, bg: i === st.file ? K.sel : 'transparent', bar: i === st.file ? 'inset 2px 0 0 ' + K.teal : 'none', pick: () => this.setState({ file: i }) }));
    const inbox = [['NEEDS YOU', '●', K.amber, 'bold-puffin', 'asks: Allow Bash(pnpm install)?'], ['FAILED CHECKS', '✕', K.red, 'swift-otter', 'failed: test · exit 1'], ['NOT SEEN', '●', K.green, 'calm-heron', 'done · not seen']].map(([group, g, c, name, text], i) => ({ group, g, c, name, text, bg: i === st.inboxSel ? K.sel : 'transparent', bar: i === st.inboxSel ? 'inset 2px 0 0 ' + K.teal : 'none', actD: i === st.inboxSel ? 'block' : 'none', pick: () => this.setState({ inboxSel: i }) }));
    const alerts = [['sound', 'Sound when an agent waits'], ['phone', 'Notify my phone']].map(([k, label]) => ({ label, on: st[k] ? 'true' : 'false', box: st[k] ? '[✓]' : '[ ]', c: st[k] ? 'var(--teal)' : 'var(--dim)', pick: () => this.setState({ [k]: !st[k] }) }));
    const total = CLI.reduce((s2, l) => s2 + l[0].length + 18, 0);
    let pos = st.reduce ? 1e9 : (f * 1.6) % (total + 40);
    const cli = CLI.map(([cmd, note]) => { const shown = Math.max(0, Math.min(cmd.length, Math.floor(pos))); const full = pos >= cmd.length; const r = { typed: cmd.slice(0, shown), note, noteOp: full ? '1' : '0', caret: pos >= 0 && !full ? 'inline-block' : 'none' }; pos -= cmd.length + 18; return r; });
    if (!st.reduce && !cli.some(c => c.caret !== 'none')) { const done = cli.filter(c => c.noteOp === '1').length; if (done < cli.length) cli[done].caret = 'inline-block'; }
    const L = LAYOUTS[st.layout];
    const lay = { name: L.name, desc: L.desc, gap: L.gap, pad: L.pad, rad: L.rad, b0: L.b[0], b1: L.b[1], b2: L.b[2], b3: L.b[3], bg0: L.bg[0], bg1: L.bg[1], bg2: L.bg[2], bg3: L.bg[3] };
    const layoutBtns = Object.keys(LAYOUTS).map(k => { const on = st.layout === k; return { label: LAYOUTS[k].name.toLowerCase(), on: on ? 'true' : 'false', bg: on ? 'var(--teal)' : 'var(--bg)', fg: on ? 'var(--ink)' : 'var(--text)', border: on ? 'var(--teal)' : 'var(--line)', shadow: on ? '3px 3px 0 var(--hard)' : '3px 3px 0 var(--line)', pick: () => this.setState({ layout: k }) }; });
    const themeCards = [
      { k: 'night', label: 'Night', bg: '#08111d', fg: '#eef5fb', panel: '#0f1b2b', teal: '#3dd6c6', work: '#92e5e0', needs: '#f5c542', done: '#7fd99a' },
      { k: 'day', label: 'Day', bg: '#f6f8fa', fg: '#0b1724', panel: '#ffffff', teal: '#0b7a71', work: '#0b7a71', needs: '#b06a00', done: '#277a4c' }
    ].map(t => { const on = st.theme === t.k; return { ...t, on: on ? 'true' : 'false', border: on ? 'var(--teal)' : 'var(--line)', shadow: on ? '4px 4px 0 var(--teal)' : 'none', hint: on ? '● this page' : 'click to switch the page', pick: () => this.setTheme(t.k) }; });
    return {
      theme: st.theme, live: st.live, ver: st.ver, spin: sp,
      themeBtns: [['night', 'Night theme'], ['day', 'Day theme']].map(([k, aria]) => { const on = st.theme === k; return { aria, moonD: k === 'night' ? 'block' : 'none', sunD: k === 'day' ? 'block' : 'none', on: on ? 'true' : 'false', bg: on ? 'var(--teal)' : 'transparent', fg: on ? 'var(--ink)' : 'var(--muted)', pick: () => this.setTheme(k) }; }),
      stars: this.stars,
      osTabs: [['win', 'Windows'], ['nix', 'macOS · Linux']].map(([k, label]) => { const on = st.os === k; return { label, on: on ? 'true' : 'false', bg: on ? 'var(--card)' : 'transparent', fg: on ? 'var(--strong)' : 'var(--muted)', pick: () => this.setState({ os: k }) }; }),
      shell: st.os === 'win' ? 'PowerShell' : 'sh · bash · zsh', prompt: st.os === 'win' ? 'PS>' : '$', cmd: st.os === 'win' ? WIN : NIX,
      copy: () => this.copyCmd(), copyLabel: st.copied === 'ok' ? '✓ copied' : st.copied === 'fail' ? 'press ' + COPY_KEY : '⧉ copy', copyBg: st.copied === 'ok' ? 'var(--done)' : 'var(--teal)',
      groups, needsN, needsOp: needsN ? 1 : 0.25, pane,
      toast: { show: !!st.toast, title: st.toast ? st.toast.title : '', detail: st.toast ? st.toast.detail : '' },
      wsKey: e => { const ids = ['c1', 'c2', 'gw', 'wb', 'bw'], i = ids.indexOf(st.sel); if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); this.select(ids[(i + 1) % ids.length]); } else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); this.select(ids[(i + ids.length - 1) % ids.length]); } else if (['1', '2', '3'].includes(e.key)) this.answer(st.sel, Number(e.key)); },
      stateCards, demo, demoDesc: STATES[auto].d, waiting,
      toggleClose: () => { if (st.closed) { this.setState({ closed: false, reopened: true, live: 'Sessions resumed' }); this.T(() => this.setState({ reopened: false }), 4000); } else this.setState({ closed: true, reopened: false, live: 'Window closed. Agents still running.' }); },
      closeLabel: st.closed ? '$ maitty   ↵ come back' : '✕ close the window', closeChip: st.closed ? 'service' : 'SESSIONS 5', closeChipBg: st.closed ? 'var(--t-chip)' : 'var(--t-teal)', closeChipFg: st.closed ? 'var(--t-dim)' : 'var(--t-ink)',
      closeBar: st.closed ? 'window closed' : st.reopened ? 'reopened' : 'open', closeOp: st.closed ? 0.6 : 1, closeRows,
      closeFoot: st.closed ? 'background service · 3 agents still running, 2 saved' : st.reopened ? '✓ all hands back on deck: folders and conversations resumed' : 'close the window, then come back', closeFootC: st.closed ? K.dim : st.reopened ? K.teal : K.adim,
      files, diff, diffPath: fsel.path, diffA: fsel.lines.filter(l => l[0] === '+').length, diffR: fsel.lines.filter(l => l[0] === '-').length,
      inbox, alerts, cli, lay, layoutBtns, themeCards,
      agents: AGENTS.map(([mk, name]) => ({ mk, name }))
    };
  }
}

root.MaittyPage = MaittyPage;
})(globalThis);
