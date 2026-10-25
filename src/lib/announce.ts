// Speaks a demo's change through the page's one polite live region (Page.astro).
export function announce(text: string) {
  const region = document.getElementById("live");
  if (region) region.textContent = text;
}
