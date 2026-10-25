// Types the commands one after another, shows each note once its command is
// whole, then starts over. The caret sits wherever typing is happening.
import { onTick } from "../../lib/ticker";
import { CLI } from "./cli";

const CHARS_PER_TICK = 1.6;
const PAUSE_CHARS = 18;
const END_PAUSE_CHARS = 40;
const LOOP = CLI.reduce((sum, [cmd]) => sum + cmd.length + PAUSE_CHARS, 0) + END_PAUSE_CHARS;

const section = document.querySelector<HTMLElement>("[data-together]")!;
const cmds = [...section.querySelectorAll<HTMLElement>("[data-cmd]")];
const carets = [...section.querySelectorAll<HTMLElement>("[data-caret]")];
const notes = [...section.querySelectorAll<HTMLElement>("[data-note]")];

onTick(section, (frame) => {
  let pos = (frame * CHARS_PER_TICK) % LOOP;
  let caretAt = -1;
  CLI.forEach(([cmd], i) => {
    const whole = pos >= cmd.length;
    cmds[i].textContent = cmd.slice(0, Math.max(0, Math.min(cmd.length, Math.floor(pos))));
    notes[i].style.opacity = whole ? "1" : "0";
    if (caretAt < 0 && !whole) caretAt = i;
    pos -= cmd.length + PAUSE_CHARS;
  });
  carets.forEach((c, i) => { c.hidden = i !== caretAt; });
});
