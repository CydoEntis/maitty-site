# maitty.app

The landing page for [Maitty](https://github.com/CydoEntis/maitty), built
with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
into one static HTML page.

```sh
pnpm install
pnpm dev       # http://localhost:4321, ?theme=day or ?theme=night forces a theme
pnpm check     # astro check (types and templates)
pnpm build     # writes dist/
pnpm preview   # serves dist/
```

## Layout

- `src/pages/index.astro` lists the sections in order.
- `src/sections/<name>/` holds one section each: its `.astro` component, its
  data, and the small script that makes its demo interactive. The page is
  whole without scripts: every section renders to plain HTML at build time,
  and each script only toggles attributes and text on markup that is already
  there. No UI framework.
- `src/lib/` holds what more than one section uses: the shared clock that
  drives spinners and typing (`ticker.ts`, off when the visitor prefers
  reduced motion, paused for sections off screen), reveal-on-scroll and
  off-screen pausing (`motion.ts`), the live region (`announce.ts`), and the
  session states (`states.ts`).
- `src/styles/global.css` holds the design tokens (Night and Day, switched by
  `data-theme` on `<html>`), the fonts, and the keyframes. Tailwind's theme
  maps the tokens to utilities: `bg-card`, `text-teal`, and `tm-*` for the
  terminal mocks' colours (`text-tm-amber`).
- `public/boot.js` runs before first paint: it sets the theme (a `?theme=`
  link, then `localStorage['maitty-theme']`, then the system preference) and
  the visitor's OS for the install tabs. It is a file rather than an inline
  script so the CSP needs no script hashes.
- On a phone the hero and branch demos switch to phone layouts (one view at
  a time, chosen by a tap), and no demo text is under 12px.

The design is the designer's handoff ("Maitty Landing v2"). The terminal mocks
are live HTML built from the app's real UI with fictional sessions.

## Fonts

Self-hosted in `public/fonts/` with their OFL licences. The terminal mocks need
JetBrains Mono's box-drawing and braille characters, so the full files load;
`jetbrains-mono-*-latin.woff2` are latin subsets that paint the hero first.
Regenerate them with [fonttools](https://github.com/fonttools/fonttools)
(`pip install fonttools brotli`), from `public/fonts/`:

```sh
for w in 400 600 700; do
  pyftsubset jetbrains-mono-$w.woff2 --flavor=woff2 --layout-features='*' \
    --unicodes="U+0000-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2212" \
    --output-file=jetbrains-mono-$w-latin.woff2
done
```

## Outside requests

The only request the page makes to anyone else is the latest version from
GitHub's releases API, for the footer. If it fails, the version stays hidden.

## Deploy

A push to `main` builds the Docker image (Astro build, then Caddy serving
`dist/`) and publishes it; the server pulls it. `deploy/README.md` has the
details.
