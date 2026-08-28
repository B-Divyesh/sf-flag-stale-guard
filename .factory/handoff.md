# Flag Stale Guard polish round 1 handoff

Date: 2026-08-28  
Work order: `flag-stale-guard-polish-1`  
Repair commit: `8eff3a57dd36b054628686db0ba54e4413bc2705`  
Evidence commit: `37d344e`

## Delivered

- Resolved all 13 findings in `.factory/review-1.md`; the complete finding-to-evidence record is in `.factory/polish-1.md`.
- Added direct one-click demo entry at `/?demo=1`, the required persistent banner, an isolated in-memory sample interaction, announced reset, and an install-focused exit action.
- Added the `demo-reset` claim and tagged observable regression test. The claims manifest now has 14 claims, each with exactly one matching tagged test.
- Rewrote the landing and README wording for plain language, stable **source reference** terminology, accurate installation guidance, and a concrete deployment section.
- Preserved the botanical field-guide visual system and added no remote services, cookies, analytics, or browser storage.

## Exact verification

From a clean clone at `/tmp/flag-stale-guard-clean-8eff3a5`:

```sh
npm ci
# each of the 14 exact commands in .factory/claims.json, separately
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
npm run build
cargo package --allow-dirty
npm audit --omit=dev
```

All commands passed. `npm test` passed 6 Rust unit tests, 5 Rust integration tests, 7 build-contract tests, and 26 Chromium tests. The static bundle is 10.08 kB JavaScript raw (3.76 kB gzip) and 6.49 kB CSS raw (2.30 kB gzip).

The Chromium suite covers axe serious/critical checks, keyboard/focus, 390 px mobile, 200% text reflow, reduced motion, private same-origin requests/no cookies/no browser storage, and the loaded demo’s offline behavior.

## Deploy and live recheck

The static deployment artifact is `dist/site/`; `8eff3a5` and the evidence commit were pushed to `origin/main`. Factory static deployment `723220f4-4758-4ff4-b51e-f7ab8d74f250` completed successfully to `https://flag-stale-guard.sociobot.in/`.

Cold live verification passed:

- `verify-url.sh` passed root and `/?demo=1` with no console/page errors, correct title/lang/H1/main, complete alt text, and labelled controls. Evidence: `.factory/evidence/verify-live-home/` and `.factory/evidence/verify-live-demo/`.
- A live Playwright + axe sweep passed root, direct demo, privacy, terms, and `/missing-page` (HTTP 404) at 390 px. It found no serious/critical axe violations or horizontal overflow.
- The live demo interaction marked a sample source reference, Reset demo removed that state and announced the reset, and View install steps focused the install heading.
- Live screenshots: `.factory/evidence/live/home-390.png`, `.factory/evidence/live/demo-390.png`, and `.factory/evidence/live/404-1440.png`.

## Known gaps

None.
