# shautech labs — developer spec (for building/porting simulators)

Every lab is ONE self-contained HTML file in `/labs/` that loads two shared assets:

- `../assets/css/labs.css` — the design system (tokens, topbar, level map, all game components)
- `../assets/js/lab-engine.js` — the engine (`window.Lab`): level map, score, screens, finale, SVG icons, canvas scene runner

Start from `dev/lab-template.html`. Keep the `<head>`, `<header>`, `<main>`, `<div class="nojs">` exactly; only change title/description/canonical/og, the `<style>` block (lab-specific CSS only, keep small) and the game `<script>`.

## Hard rules (the site must be "bulletproof")
1. **Offline-first, zero external requests.** No Google Fonts, no CDNs, no images from the web. Fonts are self-hosted via `../assets/fonts/fonts.css`.
2. **No emoji anywhere** (not in markup, not in JS strings, not in canvas). Use `Lab.icon('name')` SVG icons, `Lab.avatar('AB', hue)` for people, and `Lab.sev('crit'|'warn'|'ok'|'info','TEXT')` for status chips. Grep your file for emoji before finishing: `grep -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' file.html` must return nothing. Typographic characters (→ · « » — ✓) are fine in copy, but prefer icons for ✓/✗ in UI.
3. **Plain English, professional tone.** Light humour is welcome (the labs are for non-technical people too) but no "lol", no cutesy filler. Keep all the *teaching content* (the facts, decisions, explanations) of the original lab when porting; tighten wording where it rambles.
4. **Keyboard + screen reader friendly.** Every clickable thing is a `<button>` (or `<a>` for navigation). Decorative SVG/canvas has `aria-hidden="true"`.
5. **Resilient.** Guard DOM lookups, never leave `setInterval`/`setTimeout` running after a level ends (store ids, clear them in the next level). Wrap arcade loops so they stop when the arena is removed from the DOM. `prefers-reduced-motion` is handled by the engine for the background; for arcade levels, read `Lab.reduced` and slow down / shorten where motion matters.
6. **Works from `file://`.** No `fetch`, no modules, no `import`. One IIFE. Inline `onclick="L.fn(...)"` handlers are allowed — expose them on `window.L`.
7. **Mobile.** Everything must work at 375px width (stack grids, arena stays usable with touch). Items in arenas ≥ 42px tap targets.
8. **Copyright.** Keep the `<!-- © 2026 shautech -->` head comment and the `/* © 2026 shautech */` script comment. Contact email everywhere is `contact@shautech.com`. Site is `https://www.shautech.com`.

## Engine API (`window.Lab`)
```js
Lab.init({ title, codename, levels:[{icon,name}], render:[fn…], maxScore, ranks:[{min,title,icon,msg}], summary, scene })
Lab.show(html)            // renders a level screen (resets scroll, hydrates <i data-ic="name"></i> placeholders)
Lab.goto(n)               // sets Lab.level = n and calls render[n]()
Lab.addScore(n, x, y)     // +/- points; floating "+10" at viewport x,y if given
Lab.scoreAt(n, event)     // same, from a click event
Lab.finale({ heading, summary, into:'#finale', mood })  // rank card + particle burst + CTA buttons. `into` renders inside the current screen (e.g. after the last tickets); omit to replace the screen
Lab.mood('night'|'alert'|'calm'|'')  // body glow + scene.state.mood
Lab.toast(msg, iconName)
Lab.patch(selector, html) // set innerHTML + hydrate icons
Lab.icon(name, extraClass) -> '<svg class="ic …">…</svg>'   (extraClass e.g. 'ic--lg', 'ic--xl')
Lab.avatar(initials, hue, extraClass) -> '<span class="avatar">AB</span>'  (hue 0-360; 'ghost' class for stale/red accounts)
Lab.sev(kind, text), Lab.badge(text, icon), Lab.say(who, html, 'tip'|'warn'|'alert'), Lab.btn(label, onclickString, 'blue'|'green'|'red'|'small', icon)
Lab.typeLines(logEl, [[cls, text], …], speedMs)  // async terminal typing into a .log element (cls: ok|warn|crit|dim|p|'')
Lab.util = { clamp, lerp, pick, shuffle, esc, $ } ;  Lab.reduced (bool) ; Lab.score ; Lab.level
Lab.draw = { rr, rack, curve, posOn, path, glowDot, glyph(kind), grid, text }  // canvas helpers for scenes
Lab.colors = { accent, accent2, mint, amber, red, violet, ink, ink2, ink3 } ; Lab.rgba('#hex', alpha)
```

### Icon names available
mail folder chat user users user-x user-check user-plus globe printer license plug shield shield-check shield-alert shield-off lock unlock key laptop phone server database cloud cloud-up cloud-check cloud-off search map ticket flask truck switch check check-circle x x-circle flag bug alert info clock calendar star trophy medal refresh play bolt eye eye-off file file-text file-lock sheet link share tag filter settings arrow-right arrow-left arrow-up arrow-down chevron-right download upload wifi home building briefcase euro chart bars pin bell bell-off hourglass fire skull sparkles robot cpu terminal code git box boxes layers hard-drive save history rotate-ccw power moon sun coffee heart gift door door-open badge scan radar target network route inbox send thumbs-up thumbs-down pause list-check percent wrench spinner zap camera mic monitor usb battery-low vpn credit-card at hash graduation help

Unknown names fall back to a `?` icon — don't invent names.

## Components (class names in labs.css)
- Layout: `.screen` (max 900px; add `.screen--wide` on the element via `Lab.show` wrapper if needed), `.row`, `.row--center`, `.spacer`, `.center`, `.grid .grid--2/--3/--auto/--auto-lg`, `.panel`, `.panel--soft`
- Text: `.badge`, `h1/h2/h3` (`<em>` = accent colour), `.muted`, `.small`, `.mono`, `.kbd`
- Guide cards: `.say[data-who]` + `.tip` / `.warn` / `.alert`
- Buttons: `.btn`, `.btn.blue` (primary), `.btn.green`, `.btn.red`, `.btn.small`
- Status: `.sev.sev--crit/--warn/--ok/--info/--muted`, `.tag`, `.tags`, `.avatar(.avatar--sm/--lg/.ghost)`
- Discovery tiles: `.tile` (`.found`/`.done`/`.bad`/`.ghost`) with `.ic` + `.nm`; `.inv` inventory box; `.log` terminal box (`.ok .warn .crit .dim .p .cur`)
- Tables/lists: `.sheet > table` (`tr.hot`, `tr.bad`), `.clist > .citem(.checked)` with `<span class="box">✓</span>` first child, `.warnnote`, `.oknote`
- Decisions: `.choices > button.choice` (`.good/.meh/.bad`, `:disabled`), `.verdict(.show)`
- People rows: `.userrow(.done/.bad)` with `.avatar` + `.who`, `.pstatus(.ok/.err/.warn)`, `.mini-bar > i(.ok/.err)`
- Assignment: `.slot(.filled/.wrong)`, `.stack`, `.stack-lbl`, `.chip-btn(.sel/.used)`, `.prep-grid`
- Arcade: `.arena(.arena--tall)`, `.house.house--l/--r(.ok/.bad)`, `button.item(.bad/.good/.warn; .fly/.pop/.sink animations)`, `.bigbar(.danger) > i + span`, `.event-banner(.show/.ok/.info)`, `.hud-strip`
- Switches: `.switch-zone`, `.big-switch(.on) > .knob`, `.dns-line`, `button.toggle(.on) > .track`
- Tickets: `.ticket(.done) > .tx + .choices + .verdict`
- Mock UI: `.mail > .mail__head + .mail__body` with `span.clue(.hit)` and `.fake-btn`; `.timeline > .tl(.hit/.ok)` with `span.t`; `.policy(.on/.report) > .ic + .who + .state`; `.board > .col > .card-sm(.done/.bad)`; `.meter(.danger) > i`; `.score-big`; `.countdown(.danger/.ok)`; `.signal(.on)`; `.verdict-btns`
- Finale: handled by `Lab.finale()`

If you truly need a new component, add it to the page's `<style>` using the tokens (`var(--panel)`, `var(--line2)`, `var(--accent)`, `var(--mint)`, `var(--amber)`, `var(--red)`, `var(--ink2)`, `var(--mono)`). Never hard-code new colours.

## Ambient canvas scene ("professional graphics")
Each lab has a themed, slow, low-alpha schematic drawn on `#labbg` behind the UI. Think *blueprint / network diagram*, not cartoon: thin lines, rounded racks, glowing packets, grids, dashed lanes. Use `Lab.draw.*` helpers. Keep total alpha low so text stays readable; big shapes ≤ .12 alpha, lines ≤ .35, packets up to .9 but small. React to `s.level` and `s.mood` (set automatically by the engine on each `show()` / `mood()`): e.g. more red packets in an incident level, everything calm and mint at the end. Cap work: ≤ ~60 moving objects. The engine handles DPR, resize, visibility and reduced motion (draws one static frame).

## Level structure (keep the 7-level rhythm)
0 Briefing → 1 Discovery/hunt → 2 Decisions (multiple choice with verdicts) → 3 Build/board (assign, toggle, configure) → 4 Scenario verdicts → 5 Arcade (timed, clickable items; ~45–60 s) → 6 Night/cutover (mood 'night' or 'alert', a step-by-step with a big switch or countdown) → 7 Tickets (first-try +10, retry +5) → `Lab.finale({into:'#finale'})`.
Scoring: each level ≈ 40–80 points; total `maxScore` ≈ 400–450; 3–4 ranks.

## Porting an existing lab (from `live version 2026-10-11/labs/*.html`)
- Read the whole original. Keep every level's teaching content, decisions, verdict texts, tickets and the end-of-game "remember" summary (reword lightly to professional tone, remove emoji and jokes that don't land).
- Rebuild the markup with the components above. Replace `.obj`→`.tile`, `.office`→`.grid.grid--auto`, `.face` emoji→`Lab.avatar`, `.lic`→`.chip-btn`, `.lic-slot`→`.slot`, `.cloud-house`→`.house`, emoji `.item`→`button.item` with an icon, `.confetti`→(engine), `.rank-big` → ranks config, `LEVELS` icons → icon names, `document.body.classList.toggle('night')`→`Lab.mood('night')`.
- Rebuild the canvas background using `Lab.draw` in the scene spec with the same *idea* (migration lanes, attacker vs shield, gate, conveyor…) but cleaner.
- Keep points balance roughly the same as the original.

## Definition of done (check each)
- [ ] `node -e "…"` is not applicable (inline script) → open the page in the Playwright browser from `file://`, click through ALL levels to the finale, and confirm **zero console errors**.
- [ ] No emoji (grep), no `http(s)://` except the canonical/og URLs and `https://www.shautech.com`.
- [ ] Works at 375px width (screenshot the arcade level and the tickets level).
- [ ] Topbar shows the logo exactly as `.logo .mark + shau<span class="tech">tech</span>` — do not restyle it.
- [ ] Level map icons all resolve (no `?` fallback icons visible).
- [ ] The finale renders with rank + "Run this live with your team" → `../index.html#contact`.
