// The worktree's changed files and their diffs, for the side-panel mock.
type Mark = " " | "-" | "+";

const FILES: { path: string; m: "M" | "A"; start: number; lines: [Mark, string][] }[] = [
  { path: "web/login.tsx", m: "M", start: 12, lines: [[" ", "export function LoginForm() {"], ["-", "  const onSubmit = () => signIn(email)"], ["+", "  const onSubmit = () => {"], ["+", '    if (!isEmail(email)) return setError("Enter a valid email")'], ["+", "    signIn(email)"], ["+", "  }"], [" ", "  return ("], [" ", "    <form onSubmit={onSubmit}>"]] },
  { path: "web/auth.ts", m: "M", start: 3, lines: [[" ", "export async function signIn(email: string) {"], ["-", '  const res = await fetch("/api/login", { method: "POST" })'], ["+", '  const res = await fetch("/api/login", {'], ["+", '    method: "POST",'], ["+", "    body: JSON.stringify({ email }),"], ["+", "  })"], [" ", "  if (!res.ok) throw new LoginError(res.status)"]] },
  { path: "web/login.test.tsx", m: "A", start: 1, lines: [["+", 'import { render, screen } from "@testing-library/react"'], ["+", ""], ["+", 'it("rejects an invalid email", async () => {'], ["+", "  render(<LoginForm />)"], ["+", '  await type("email", "not-an-email")'], ["+", "  expect(screen.getByText(/valid email/)).toBeVisible()"], ["+", "})"]] },
];

const KW = /("[^"]*")|\b(export|function|const|return|if|await|async|import|from|throw|new|it)\b/g;
type Seg = { t: string; c: string };

function highlight(t: string): Seg[] {
  const out: Seg[] = [];
  let i = 0;
  for (const m of t.matchAll(KW)) {
    if (m.index > i) out.push({ t: t.slice(i, m.index), c: "var(--t-txt)" });
    out.push({ t: m[0], c: m[1] ? "var(--t-red)" : "var(--t-teal)" });
    i = m.index + m[0].length;
  }
  if (i < t.length) out.push({ t: t.slice(i), c: "var(--t-txt)" });
  return out.length ? out : [{ t: " ", c: "var(--t-txt)" }];
}

const MARK_COLOR: Record<Mark, string> = { "+": "var(--t-green)", "-": "var(--t-red)", " ": "var(--t-adim)" };

export const CHANGES = FILES.map((f) => {
  let n = f.start - 1;
  const diff = f.lines.map(([k, t]) => {
    if (k !== "-") n++;
    return { n: String(k === "-" ? n + 1 : n), k: k === " " ? "" : k, c: MARK_COLOR[k], segs: k === "-" ? [{ t, c: "var(--t-adim)" }] : highlight(t) };
  });
  return {
    path: f.path,
    m: f.m,
    mc: f.m === "A" ? "var(--t-green)" : "var(--t-yel)",
    added: f.lines.filter((l) => l[0] === "+").length,
    removed: f.lines.filter((l) => l[0] === "-").length,
    diff,
  };
});
