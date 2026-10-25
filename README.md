# maitty.app

The landing page for [Maitty](https://github.com/CydoEntis/maitty). Plain
HTML, CSS and JavaScript in `site/`; no build step for deploy.

- `site/` is what gets served. Open it through any static server
  (`python -m http.server -d site`) to work on it. `?theme=day` or
  `?theme=night` forces a theme.
- The page is a 1:1 port of the designer's prototype ("Maitty Landing v2"):
  the same markup, tokens, copy, interactive demos and motion.
  - `site/view.js`: the markup, as a plain-JS template.
  - `site/logic.js`: the prototype's logic class (state, scripted demo).
  - `site/main.js`: mounts the two, re-renders by morphing the DOM, and does
    the browser work (reveal on scroll, pausing off-screen sections, the
    ticker, theme storage, the version fetch).
  - `site/styles.css`: the prototype's tokens and keyframes, the fonts, and
    its hover and active styles as classes.
- `index.html` carries the first render, so the page is whole before any
  script runs. After changing `view.js` or `logic.js`, run:

  ```sh
  node tools/prerender.mjs
  ```

  CI fails if `index.html` is out of date.
- Fonts are self-hosted in `site/fonts/` with their OFL licences.
- `site/frames/` holds real Maitty screens exported from the app. The page
  doesn't show them at the moment: every app picture in the design is an
  interactive demo. `tools/splice-frames.mjs` copies a frame into
  `index.html` wherever a `<!-- frame:NAME -->` / `<!-- /frame:NAME -->` slot
  exists. Regenerate them from a Maitty checkout next to this repo
  (`C:\dev\maitty`), on `dev` and pulled (the exporter is on `origin/dev`):

  ```sh
  cd ../maitty && git switch dev && git pull
  MAITTY_SITE_FRAMES=../maitty-site/site/frames cargo test export_site_frames -- --ignored
  ```

  ```powershell
  cd ..\maitty; git switch dev; git pull
  $env:MAITTY_SITE_FRAMES = "..\maitty-site\site\frames"; cargo test export_site_frames -- --ignored
  ```
- The only request the page makes to anyone else is the latest version from
  GitHub's releases API, for the footer. If it fails, the version is hidden.
- `deploy/README.md` covers how a push to `main` reaches the server.
