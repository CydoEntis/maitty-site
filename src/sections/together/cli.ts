export const CLI: [cmd: string, note: string][] = [
  ["maitty worktree feat/login -- codex", "a new branch in its own worktree, with codex"],
  ['maitty send -p 3 "run the tests"', "message session 3"],
  ["maitty handoff 3 --to claude", "hand its task to another agent"],
  ["maitty ls --json", "every session and its status"],
];
