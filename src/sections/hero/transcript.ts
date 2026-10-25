// Turns a pane's transcript into markup. The build uses it for the first
// render and the demo script for every change after, so both agree.
import type { Line } from "./demo-data";

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c]);

export function transcriptHtml(lines: Line[]): string {
  return lines.map((l) => {
    const style = `padding-left:${l.pl ?? "0"};background:${l.bg ?? "transparent"};margin-top:${l.mt ?? "0"}`;
    const segs = l.segs.map((s) => `<span style="color:${s.c};font-weight:${s.fw ?? 400}">${esc(s.t)}</span>`).join("");
    return `<div class="tline" style="${style}">${segs}</div>`;
  }).join("");
}
