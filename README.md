# maitty.app

The landing page for [Maitty](https://github.com/CydoEntis/maitty). Plain
HTML, CSS and a little JavaScript in `site/`; no build step.

- `site/` is what gets served. Open it through any static server
  (`python -m http.server -d site`) to work on it.
- The look follows the designer's handoff (sea-at-night tokens, Night and Day,
  Martian Mono / JetBrains Mono / Instrument Sans). The fonts are self-hosted
  in `site/fonts/` with their OFL licences.
- The terminal screens are real Maitty frames, exported from the app into
  `site/frames/` as `NAME-night.html` and `NAME-day.html` (`<pre class="frame">`
  with coloured spans). Regenerate them from a Maitty checkout next to this
  repo (`C:\dev\maitty`):

  ```sh
  MAITTY_SITE_FRAMES=../maitty-site/site/frames cargo test export_site_frames -- --ignored
  ```

  They are copied into `index.html` so the page ships them inline: about
  800 KB raw but under 40 KB gzipped, with no layout shift and no requests
  after load. After changing a frame, run:

  ```sh
  node tools/splice-frames.mjs
  ```

  It replaces everything between `<!-- frame:NAME -->` and
  `<!-- /frame:NAME -->` in `index.html`. CI fails if `index.html` is out of
  date with `site/frames/`.
- The only request the page makes to anyone else is the latest version from
  GitHub's releases API, for the footer. If it fails, the version is hidden.
- `deploy/README.md` covers how a push to `main` reaches the server.
