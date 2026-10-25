export type Os = "win" | "nix";

export const COMMANDS: Record<Os, { tab: string; shell: string; prompt: string; cmd: string }> = {
  win: { tab: "Windows", shell: "PowerShell", prompt: "PS>", cmd: "irm https://raw.githubusercontent.com/CydoEntis/maitty/main/install.ps1 | iex" },
  nix: { tab: "macOS · Linux", shell: "sh · bash · zsh", prompt: "$", cmd: "curl -fsSL https://raw.githubusercontent.com/CydoEntis/maitty/main/install.sh | sh" },
};

export const OSES = Object.keys(COMMANDS) as Os[];
