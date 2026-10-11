# shautech — website (offline build)

© 2026 shautech. All rights reserved. · www.shautech.com · contact@shautech.com

Static site, zero external dependencies: fonts, styles, scripts and images are all local.
Open `index.html` directly or serve the folder (`python3 -m http.server`). Deploys as-is to GitHub Pages
(`CNAME`, `.nojekyll`, `404.html`, `robots.txt`, `sitemap.xml` included).

## Structure
- `index.html` — homepage: boot sequence, chaos→order hero, before/after, services + live console,
  **shautech pulse** (audit engine + sample report), **shautech labs** (featured migration + 7 more),
  team, process, why us, results, contact.
- `pulse/index.html` — interactive demo report (open findings, apply fixes, score climbs 82→100).
- `labs/index.html` — all simulators. Each lab is one self-contained page in `labs/`:
  `migration` · `copilot` · `security` · `conditional-access` · `identity-lifecycle` ·
  `ransomware-recovery` · `endpoint-rollout` · `licence-audit`.
- `legal.html` — legal notice, copyright, trademarks, privacy (no cookies, no tracking).
- `404.html` — not-found page.
- `assets/css/style.css` — site design system (brand: #0A0B0D background, #4D9FFF accent, Space Grotesk + JetBrains Mono).
- `assets/css/labs.css` + `assets/js/lab-engine.js` — shared lab design system and engine (level map, score, SVG icon set, canvas scenes, finale).
- `assets/js/main.js` — homepage interactions. `assets/js/page.js` — secondary pages.
- `assets/fonts/` — self-hosted woff2. `assets/img/` — team photos.
- `dev/` — developer notes and the lab template (not linked, excluded from robots).

## The logo
The original shautech mark is kept everywhere: `.logo > .mark` (the › in an accent square) + `shau` + `<span class="tech">tech</span>`
in JetBrains Mono 700. Do not restyle.

## Conventions
- Contact e-mail everywhere: `contact@shautech.com`.
- No emoji in the labs: use `Lab.icon(name)`. No third-party requests anywhere.
- Every page has a `no-js` fallback and respects `prefers-reduced-motion`.

## What changed vs. the live site (2026-10-11)
- Removed: the 3D `studio/` (6.5 MB, WebGL-only), `backup-pre-comet/`, duplicate `team/` photos, Google Fonts.
- Added: pulse + labs sections on the homepage, three new labs (ransomware recovery, endpoint rollout, licence audit),
  legal page, 404, SEO/OG metadata, copyright notices.
- Rebuilt: all five existing labs on the shared engine with SVG graphics and themed canvas scenes; the pulse demo page.
