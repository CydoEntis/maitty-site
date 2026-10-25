// A session's four states, worded and coloured as the app shows them.
// Amber means "needs you" and nothing else.
export type SessionState = "working" | "needs" | "done" | "idle";

export const STATES: Record<SessionState, { word: string; color: string; about: string }> = {
  working: { word: "working", color: "var(--t-teal)", about: "The agent is busy on its turn. The spinner moves while it works." },
  needs: { word: "needs you", color: "var(--t-amber)", about: "A question or approval is waiting. Amber means you, and nothing else." },
  done: { word: "done", color: "var(--t-green)", about: "The turn finished (and its checks passed, if you set any). Green until you look." },
  idle: { word: "idle", color: "var(--t-dim)", about: "Nothing running. Resting at anchor." },
};

export const STATE_KEYS = Object.keys(STATES) as SessionState[];
