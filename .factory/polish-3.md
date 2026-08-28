# Polish round 3 — Flag Stale Guard

Candidate repaired: `e369bfeb6caa43bfae3ace1404f8b6f71986bd52`
Base review: `b15c0ca81a9cf85cd04b8c3b7ceb8abc849e271a`

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the untested Node-version promise out of the README. | Clean-clone 15-claim sweep; README audit; [live home](https://flag-stale-guard.sociobot.in/). |
| F-1-2 | Kept factual crate-archive wording without a publication-readiness promise. | Clean-clone release `cargo package --allow-dirty`; README audit. |
| F-1-3 | Kept **View install steps** pointing to `/#install`, with focus moved to the install heading. | `the loaded demo remains usable offline and does not pin stale app caches`; live direct demo check. |
| F-1-4 | Kept the in-memory review interaction; Reset restores all three flags and announces the result. | `@claim:demo-reset`; live `demo-reset` report; [live demo](https://flag-stale-guard.sociobot.in/?demo=1). |
| F-1-5 | Kept the README introduction split into short sentences. | `.factory/copy-audit.md`; README review. |
| F-1-6 | Kept **source reference** as the sole human-facing term and sorted source references for stable CLI/demo output. | `@claim:literal-references`; `@claim:sample-removal-block`; `@claim:cli-demo-recording`. |
| F-1-7 | Kept **command-line tool** on the first screen. | Cold live home screenshot: `evidence/polish-3-live-home/screenshot-mobile.png`. |
| F-1-8 | Kept the explicit `YYYY-MM-DD` date and config-file instruction. | `@claim:metadata-gate`; `.factory/copy-audit.md`. |
| F-1-9 | Kept concrete wording about users and code behavior at runtime. | Cold live home check; `.factory/copy-audit.md`. |
| F-1-10 | Kept the explanatory **Find expired flags and remaining references** heading. | Live axe route sweep; mobile screenshot. |
| F-1-11 | Kept **literal mode** and the exact-key explanation. | `@claim:literal-references`; README review. |
| F-1-12 | Kept separate exit-0 meaning and deletion-safety guidance. | `@claim:clear-removal-check`; README review. |
| F-1-13 | Kept `dist/site/` deployment ownership in the README. | `build:site writes a complete deployable site to dist/site`; README Deploy section. |
| F-2-1 | Kept history entries’ scroll/focus restoration. | `Back and Forward restore each route’s scroll position and focus`; live report records `scroll: 1665`, focused H1. |
| F-2-2 | Kept the plain **Page not found** error copy and return link. | `plain error and sharing copy name the page and removal action`; live HTTP 404 and `evidence/polish-3-live/404-1440.png`. |
| F-2-3 | Kept decorative specimen caption removed. | `plain error and sharing copy name the page and removal action` asserts no `figcaption`; live home check. |
| F-2-4 | Kept the direct removal wording in root, Open Graph, and Twitter descriptions. | `plain error and sharing copy name the page and removal action`; live root metadata check. |
| F-3-1 | Added `public/cli-demo-recording.svg`: a self-hosted SVG terminal recording of the packaged `flag-stale-guard demo`, plus a download control and plain HTML transcript. The transcript is compared with the real packaged CLI output after redacting only its per-run temporary path. | `@claim:cli-demo-recording`; `built landing ships the self-hosted CLI demo recording and transcript controls`; live `recording` report; `evidence/polish-3-live-home/screenshot-mobile.png`. |
| F-3-2 | Reworked `@claim:checkout-install` to clone a clean local checkout, run `cargo install --path . --root <isolated root>`, execute the installed binary and demo, and confirm the clone remains clean. | `@claim:checkout-install` from clean clone `/tmp/fsg-polish3-clean.DY7ZqS`; full clean-clone suite. |

## Verification evidence

- Fresh clone: `/tmp/fsg-polish3-clean.DY7ZqS` at `e369bfe`. `npm ci` succeeded. Every exact command declared in `.factory/claims.json` passed independently: `metadata-gate`, `literal-references`, `fail-closed-paths`, `expired-checklist`, `sample-removal-block`, `clear-removal-check`, `json-output`, `demo-sandbox`, `demo-reset`, `cli-demo-recording`, `local-source`, `website-private`, `github-action-gate`, `mit-license`, and `checkout-install`.
- Full clean-clone suite: `npm test` passed (6 Rust unit tests, 5 Rust integration tests, 8 build-contract tests, and 29 Playwright browser/accessibility/privacy/offline tests).
- Clean-clone release checks passed: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, and `npm audit --omit=dev` (0 vulnerabilities). The clone finished with an empty `git status --short`.
- Local cold checks: `/opt/fleet/lib/verify-url.sh` passed root and `?demo=1`; evidence is in `evidence/polish-3-local-home/` and `evidence/polish-3-local-demo/`.
- Deployment: Static Web Apps deployment `8055804e-1251-41c0-bfbd-55d66163dcc5` succeeded to [flag-stale-guard.sociobot.in](https://flag-stale-guard.sociobot.in/).
- Live cold checks: `/opt/fleet/lib/verify-url.sh` passed root and direct demo. `evidence/polish-3-live/live-check.json` records route titles/canonicals, real HTTP 404, zero serious/critical axe issues, zero unexpected console errors, same-origin requests only, no demo storage/cookies, 200% text reflow, history restoration, and the recording asset/transcript check.
- The standalone `@axe-core/cli` could not start Selenium because this container lacks a Chrome binary. The shipped Playwright axe integration ran with the installed Chromium and passed locally and live; no product accessibility issue remained.
