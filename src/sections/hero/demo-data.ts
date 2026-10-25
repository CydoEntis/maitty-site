// The hero demo's sessions, as the app would show them. The projects and
// sessions are fictional; the glyphs, colours and wording match Maitty.
import type { SessionState } from "../../lib/states";

export type Seg = { t: string; c: string; fw?: number };
export type Line = { segs: Seg[]; pl?: string; bg?: string; mt?: string };

export type Session = {
  id: SessionId;
  name: string;
  state: SessionState;
  meta: string;
  agents: string;
  plus?: string;
  minus?: string;
  seen?: boolean;
  base: Line[];
  extra?: Line[];
  since?: number;
};

export type SessionId = "c1" | "c2" | "gw" | "wb" | "bw";
export type Ask = { cmd: string; desc: string; ran: string; fin: string; intro: Line[] };

export const K = {
  teal: "var(--t-teal)", work: "var(--t-work)", green: "var(--t-green)", amber: "var(--t-amber)", red: "var(--t-red)",
  dim: "var(--t-dim)", adim: "var(--t-adim)", txt: "var(--t-txt)", bash: "var(--t-bash)", strong: "var(--t-strong)", c9: "var(--t-c9)", user: "var(--t-user)",
};

const seg = (t: string, c: string = K.txt, fw = 400): Seg => ({ t, c, fw });
export const line = (segs: Seg[], o: Omit<Line, "segs"> = {}): Line => ({ segs, ...o });
export const tool = (name: string, arg: string) => line([seg("● ", K.green), seg(name, K.bash, 700), seg(`(${arg})`, K.bash)], { mt: "8px" });
export const sub = (t: string, c: string = K.adim) => line([seg("└ ", K.adim), seg(t, c)], { pl: "2ch" });
export const msg = (t: string) => line([seg("● ", K.txt), seg(t, K.txt)], { mt: "8px" });
export const said = (t: string) => line([seg("› ", K.txt), seg(t, K.txt)], { bg: K.user, mt: "8px" });

export const GROUPS: { name: string; dc: string; meta: string; ids: SessionId[] }[] = [
  { name: "scratch", dc: "var(--t-d1)", meta: "no git", ids: ["c1", "c2"] },
  { name: "billing-api", dc: "var(--t-d2)", meta: "⎇ main", ids: ["gw"] },
  { name: "docs-site", dc: "var(--t-d3)", meta: "", ids: ["wb"] },
  { name: "acme-store", dc: "var(--t-d4)", meta: "⎇ main", ids: ["bw"] },
];

export const ORDER: SessionId[] = ["c1", "c2", "gw", "wb", "bw"];

export const ASK: Partial<Record<SessionId, Ask>> = {
  bw: {
    cmd: "pnpm install --frozen-lockfile=false", desc: "Refresh dependencies and the lockfile", ran: "Done in 14.2s · 1,204 packages", fin: "Dependencies are fresh and the lockfile is committed.",
    intro: [
      line([seg("› ", K.txt), seg("CI says the lockfile is out of date. Can you fix it?", K.txt)], { bg: K.user }),
      tool("Bash", "pnpm install --frozen-lockfile"), sub('ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile"', K.red), sub("Allowed by auto mode classifier"),
      tool("Read", "package.json"), sub("Read 48 lines"),
      msg("The lockfile is out of date with package.json: zod was bumped to 3.23 without reinstalling. Reinstalling to fix it."),
    ],
  },
  wb: {
    cmd: "git push -u origin docs/quickstart", desc: "Push the quickstart branch so the PR can open", ran: "branch docs/quickstart set up to track origin/docs/quickstart", fin: "Pushed. The new quickstart is up for review.",
    intro: [tool("Bash", "npm run build"), sub("Built 48 pages in 6.2s"), msg("The quickstart is rewritten and every code sample builds. Pushing the branch next.")],
  },
};

export const INITIAL: Record<SessionId, Session> = {
  c1: { id: "c1", name: "claude 1", state: "idle", meta: "✻ 19m", agents: "", base: [msg("Done. The release notes are in CHANGELOG.md.")] },
  c2: { id: "c2", name: "claude 2", state: "idle", meta: "✻ 45m", agents: "", base: [msg("Nothing left to do here. Start a new task when you like.")] },
  gw: { id: "gw", name: "swift-otter", state: "working", meta: "✻ 1h", agents: "2 agents", base: [tool("Bash", "git fetch -q && git rebase origin/main"), sub("Successfully rebased and updated refs/heads/feat/refunds", K.txt), sub("Allowed by auto mode classifier"), msg("Refund webhooks now retry with backoff, and 214 tests pass. Two helpers are writing the integration tests.")] },
  wb: { id: "wb", name: "calm-heron", state: "done", seen: false, meta: "✻ 2m", plus: "+85", minus: "−83", agents: "", base: ASK.wb!.intro.slice(0, 2).concat([msg("The quickstart is rewritten, every code sample builds, and the broken links are fixed.")]) },
  bw: { id: "bw", name: "bold-puffin", state: "needs", meta: "✻ 37m", agents: "1 agent", base: ASK.bw!.intro },
};

export const FIRST: SessionId = "bw";

export const OPTIONS = ["1. Yes", "2. Yes, don't ask again", "3. No, tell Claude what to do"];

// How a row in the session list looks: done turns grey once you have seen it.
export type Look = SessionState;
export function lookOf(s: Session): Look {
  if (s.state === "done" && s.seen) return "idle";
  return s.state;
}

export function subOf(s: Session): string {
  if (s.state === "needs") return `asks: Allow Bash(${ASK[s.id]?.cmd.split(" ").slice(0, 2).join(" ") ?? ""})?`;
  return s.agents;
}

export function staticGlyph(look: Look): string {
  return look === "idle" ? "○" : "●";
}

// The pane's status word: a tick once the turn is done.
export function paneGlyph(state: SessionState): string {
  return state === "needs" ? "●" : state === "done" ? "✓" : "○";
}

// The working session's clock starts from a made-up age so the numbers look lived in.
export const AGE_S: Partial<Record<SessionId, number>> = { gw: 2484 };
export const DEFAULT_AGE_S = 74;

export function clockText(secs: number): string {
  return `${Math.floor(secs / 60)}m ${secs % 60}s · ↓ ${(secs * 0.09).toFixed(1)}k tokens`;
}

export function busyTimeText(secs: number): string {
  return ` (${secs % 60}s · ↓ ${((secs % 60) * 0.12).toFixed(1)}k tokens)`;
}
