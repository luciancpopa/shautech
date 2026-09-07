# shautech.com — Progress Log

A running log of changes to the site, grouped by date and author.
Repo: <https://github.com/luciancpopa/shautech> · Live: <https://www.shautech.com/>

> Format: each entry maps to one or more git commits. Newest first.

---

## 2026-09-07 — Lucian Popa

Focus: **the 3D studio** — an immersive walk-through version of shautech, reachable from the homepage via a Matrix-style red pill.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Added **`studio/`** — a Three.js 3D walk-through of the shautech studio at `/studio/`: arrival hall with reception, a corridor of doors for each chapter (services, Pulse, labs, team, process, contact), Lucian and Andrei as figures at the end of the hall, orbit/disassemble object controls, ambient sound toggle. Plain ES modules + a local `three.module.js`, no build step | Studio | `c158e57` |
| 2 | Homepage **"Take the red pill"** capsule (glowing red pill, slow pulse, faster on hover) in the nav above 1200px, under the hero CTA ("Or see how deep the studio goes —"), and in the mobile menu; all link to `/studio/` | Home | `c158e57` |
| 3 | Studio welcome poster ("shautech / THE STUDIO / COME ON IN") moved along the left wall so it sits between two pillars instead of behind one; sitemap entry for `/studio/` | Studio + sitemap | `c158e57` |

---

## 2026-08-01 — Lucian Popa

Focus: **labs landing page**, **shautech pulse interactive demo**, and **lab 05 — identity lifecycle**.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Added **`labs/index.html`** — standalone landing page for shautech labs at `/labs/` (was a 404): hero, "no signup / no slides / no jargon" strip, cards for all 5 sims, book-a-workshop CTA. Gives Labs a shareable URL for LinkedIn posts and prospects | Labs | `cd97c2e` |
| 2 | Added **`pulse/index.html`** — interactive demo of the shautech pulse report at `/pulse/`: score animates to 82, 10 real-audit-style findings (legacy auth, admin MFA exclusions, missing DMARC, "Anyone" links…) expand to *what we saw / why it matters / the fix / CIS mapping*; "apply fix" buttons raise the score live, balanced so the last fix lands exactly on 100 → 🎉 banner + "get your tenant scored" CTA | Platform | `cd97c2e` |
| 3 | Added **`labs/entra-lifecycle-simulator.html`** ("The Revolving Door"): 7-level Entra ID identity-lifecycle game — ghost-account hunt, joiner-day decisions, Sales→Finance mover board, KEEP/REVOKE/FLAG access reviews, redundancy-day leaver-rush arcade (missed leavers turn into red ghosts), MANUAL→AUTOMATED lifecycle-workflow switch, governance tickets. Canvas background is an identity conveyor: joiners door → department racks granting access rings → leavers door, with red ghost accounts piling up until progress sweeps them clean | Labs | `cd97c2e` |
| 4 | Homepage wiring: **LAB 05 row** in the labs section, "all the labs live at shautech.com/labs" share link in the labs note, **"Try the demo report →"** ghost button in the platform section; sitemap entries for `/labs/`, `/pulse/` and the new sim | Home + sitemap | `cd97c2e` |

---

## 2026-07-26 — Lucian Popa

Focus: **shautech labs** — interactive workshop simulators, playable on the site.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Added **`labs/migration-simulator.html`** ("Operation Moving Clouds"): the 7-level tenant-to-tenant migration game restyled to the site's dark Operator design system (Space Grotesk / JetBrains Mono, panel + accent tokens, shautech/labs header) | Labs | `bc1c878` |
| 2 | Gave the migration sim an **animated canvas background**: SOURCE/DESTINATION tenant racks with LED slots, curved data lanes, glowing wireframe packets that change shape with what you click (envelopes, bits, chat bubbles, users, globes, license tickets), arrival pulses; DPR-aware, pauses when hidden, reduced-motion fallback | Labs | `bc1c878` |
| 3 | Added **`labs/security-simulator.html`** ("Breach Day"): 7-level incident-response game — spot-the-phish email, triage decisions, log timeline hunt, containment board, phish-storm arcade, GDPR 72-hour recovery night, hardening tickets; background shows an ATTACKER rack firing red packets that bounce off a shield once contained | Labs | `bc1c878` |
| 4 | Added the **Labs section** to the homepage (console-window cards for both sims + "book a workshop" note), `Labs` nav links (desktop + mobile), sitemap entries for both labs, and end-of-game "Run this live with your team →" CTAs linking back to #contact | Home + sitemap + Labs | `bc1c878` |
| 5 | Added **`labs/copilot-simulator.html`** ("Operation Open Secrets"): 7-level Copilot readiness game — demo shock, oversharing hunt, readiness decisions, sensitivity-label mini-game, fix-the-shares board, risky-prompt arcade, pilot rollout night, governance tickets; background shows Copilot queries returning red (leaked) or green answers that clean up as you fix the tenant | Labs | `40c0cd1` |
| 6 | Added **`labs/conditional-access-simulator.html`** ("The Bouncer Protocol"): 7-level conditional access game — six signals, rollout decisions (report-only, break-glass), baseline policy board, allow/MFA/block verdict scenarios, rush-hour arcade, enforcement night, tuning tickets; background gate goes none → report-only → enforced, with red sign-ins bouncing and amber ones pausing for MFA | Labs | `40c0cd1` |
| 7 | Restyled the **Labs section as service-style rows** (same `.svc-row` pattern as "What we run") for visual consistency, and fixed the **nav wrapping** ("Why us" on two lines): nowrap links, responsive gap, burger menu now takes over below 1020px | Home | `40c0cd1` |

---

## 2026-07-05 — Lucian Popa

Focus: platform section, product rename to **shautech pulse**, CIS compliance mapping, header badge fix.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Added the **platform section**: our in-house audit engine with mock report console (score 82/100, findings, monthly re-scan), "Compliance isn't a one-off" grid, and matching service card `05 · IT audit & compliance report`; refreshed Results and founder bio | Platform + Services + Results + Team | `3953310` |
| 2 | Renamed the audit engine from `shaudit` to **shautech pulse** everywhere (service card, platform section, report console, "Why shautech", terminal command now `shautech-pulse --full`) | Site-wide | `39fc743` |
| 3 | Added **CIS Microsoft 365 Benchmark / Microsoft baseline mapping**: platform lead paragraph, new "Framework-mapped" bullet (insurers & auditors angle), `CIS M365 benchmark` in the report footer, `CIS benchmark` service-card tag | Platform + Services | `39fc743` |
| 4 | Fixed the stale **"Booking June '26"** header badge — now computed in JS as always next month (e.g. "Booking August '26"), with a "Booking now" no-JS fallback | Header | `39fc743` |

---

## 2026-06-15 — Andrei Luca (`luk`)

Focus: hero/CTA copy, demo cleanup, navigation fix, team intro.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Replaced demo client `northgate-ltd` with `shautech.onmicrosoft.com` in the animated terminal (header + `connect-shautech` command) | Hero terminal | `370e8e2` |
| 2 | Changed CTA heading from "Ready to clean up your IT?" to **"Let's get your IT _right_."** (accent moved to "right") | Contact CTA | `18f8c95` |
| 3 | Made the **shautech logo scroll to the very top** on click (header was `position:sticky`, so `#top` alone did nothing — added a small JS smooth-scroll handler for header + footer logos) | Header / footer | `e1c5471` |
| 4 | Updated team intro from "two companies" to **"three companies"** (worked together at 3 companies before shautech) | Team intro | `bd8b133` |

---

## 2026-06-13 — Andrei Luca (`luk`)

Focus: corrected Andrei Luca's bio (LinkedIn auto-import was inaccurate), team tags, Results proof points, and footer cleanup.

| # | Change | Where | Commit |
|---|--------|-------|--------|
| 1 | Rewrote Andrei Luca's bio with accurate experience and refreshed skill tags | Team card | `65d3fa5` |
| 2 | Refined team intro wording and Andrei's bio phrasing | Team section | `e7a201b` |
| 3 | Shortened `40,000+` to `40k+` in Andrei's bio | Team card | `c5627f4` |
| 4 | Removed placeholder phone number `+44 (0) 000 000 000` from footer | Footer | `9eeb638` |
| 5 | Added two real Results cards: **Windows 11 25H2 in-place upgrade** and **BitLocker + LAPS hardening (500+ devices)** | Results | `65a8621` |
| 6 | Added **custom AD password-expiry automation** Results card (PowerShell reads `pwdLastSet`) + matching `notify-AD_expiry.ps1` line in the animated terminal; bumped W11 upgrade to **1,000+ endpoints** | Results + terminal | `6f19c75` |
| 7 | Set Andrei to **17 years**, Luci to **15 years** (dropped "Nearly"), reworked team intro to highlight prior shared history | Team section | `63c59fa` |
| 8 | Broke team intro onto two lines ("Two Global Admins, one team." on its own line) | Team intro | `b9a5616` |

### Net result of the team-card rewrite (Andrei Luca)

- **Role:** Co-founder · Endpoints & security ops
- **Bio:** "17 years steering Microsoft infrastructure at enterprise scale — SCCM/MECM, Intune and co-management running 40k+ endpoints across 24 countries. Troubleshoot across servers, identity, cloud and compliance, plus the patch orchestration nobody else wants to own."
- **Tags:** `Intune & SCCM co-management` · `M365 & Azure administration` · `Hybrid AD & on-prem infra` · `Defender & Purview`

---

## 2026-06-09 → 2026-06-11 — Lucian Popa (initial build, before Andrei joined)

Baseline site created and rebranded by Lucian. Listed here for context.

| Date | Change | Commit |
|------|--------|--------|
| 2026-06-11 | Thicken comet tail, add light-leak overlay, refine team & section seams | `8439024` |
| 2026-06-11 | Add scroll-drawn comet thread, team section, and Romania positioning | `fb3bdaf` |
| 2026-06-11 | Archive pre-comet snapshot under `backup-pre-comet/` | `2f53239` |
| 2026-06-09 | Lowercase brand to "shautech" + fix mobile horizontal drag | `a2a00f5` |
| 2026-06-09 | Shautech 2.0: rebrand to dark "Operator" control-panel aesthetic | `5dd4ff0` |
| 2026-06-09 | Add favicon, meta description, OG/Twitter cards, robots, sitemap | `492fe89` |
| 2026-06-09 | Mobile UX: tighter type, hide desktop dataviz, scroll trust strip | `9e93e7f` |
| 2026-06-09 | Add mobile responsive layout | `848a1ba` |

---

_Last updated: 2026-09-07_
