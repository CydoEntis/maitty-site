// Fades [data-reveal] content in as it scrolls into view, and marks each
// section off screen so its decoration pauses (global.css, [data-paused]).
if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.setAttribute("data-in", ""); reveal.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

  const pause = new IntersectionObserver((entries) => entries.forEach((en) => en.target.toggleAttribute("data-paused", !en.isIntersecting)));
  document.querySelectorAll("main > section").forEach((s) => pause.observe(s));
}
