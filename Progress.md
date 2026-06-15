# shautech.com — Progress Log

A running log of changes to the site, grouped by date and author.
Repo: <https://github.com/luciancpopa/shautech> · Live: <https://www.shautech.com/>

> Format: each entry maps to one or more git commits. Newest first.

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

_Last updated: 2026-06-15_
