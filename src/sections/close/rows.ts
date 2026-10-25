// "Close it, come back": how each session reads while the window is open,
// closed (the service keeps it), and just reopened.
import { STATES, type SessionState } from "../../lib/states";

export type Mode = "open" | "closed" | "reopened";

export const SESSIONS: [name: string, dir: string, state: SessionState][] = [
  ["swift-otter", "~/code/billing-api", "working"],
  ["calm-heron", "~/code/docs-site", "done"],
  ["bold-puffin", "~/code/acme-store", "needs"],
  ["claude 1", "~/code/scratch", "idle"],
  ["claude 2", "~/code/scratch", "idle"],
];

const NAME_COLOR: Record<SessionState, string> = { working: "var(--t-work)", done: "var(--t-green)", needs: "var(--t-strong)", idle: "var(--t-c9)" };

export type RowLook = { spin: boolean; glyph: string; gc: string; nc: string; tag: string; tc: string };

export function rowLook(state: SessionState, mode: Mode): RowLook {
  if (mode === "closed") {
    const idle = state === "idle";
    return { spin: !idle, glyph: idle ? "○" : "", gc: "var(--t-dim)", nc: "var(--t-dim)", tag: idle ? "saved" : "running", tc: "var(--t-dim)" };
  }
  const c = STATES[state].color;
  const look = { spin: state === "working", glyph: state === "idle" ? "○" : "●", gc: c, nc: NAME_COLOR[state] };
  return mode === "reopened" ? { ...look, tag: "resumed", tc: "var(--t-teal)" } : { ...look, tag: STATES[state].word, tc: c };
}
