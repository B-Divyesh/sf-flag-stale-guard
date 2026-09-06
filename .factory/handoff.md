# Flag Stale Guard repair 3 handoff

Date: 2026-09-06

Implementation commit: `b8180ca41072a6eb4f0d67202209d92bcb697940`
Documentation record: committed separately after the implementation; see the final handoff SHA in repository history.

## What changed

- Fixed review finding F-5-1. The in-memory sample review marker now resets whenever site navigation leaves demo mode, including browser history navigation.
- Extended the `demo-sandbox` claim with an outcome-based browser regression: mark a sample source reference, leave for install steps, return through navigation, and confirm the original sample has no marker.
- Updated demo and README documentation to say that Reset demo or leaving demo discards the sample review state. The copy audit records the added README sentences.
- Preserved the isolated demo contract: the state is still memory-only and does not read or write browser storage or repository data.

## Verification

From a new clone at the implementation commit (`/tmp/fsg-repair3-clean.4sskCJ/repo`), `npm ci` succeeded. All 15 exact commands declared in `.factory/claims.json` passed individually, followed by a passing full `npm test` run. The full suite passed 6 Rust unit tests, 5 Rust CLI integration tests, 8 build-contract tests, and 29 Playwright tests.

The implementation checkout also passed `npm test`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, `npm audit --omit=dev`, and `git diff --check`.

`npm run build` produced `dist/site/`. The clean checkout claim suite exercises the installed CLI from an isolated checkout, including its demo, normal scan, expired metadata gate, literal references, blocked removal, clear-removal recovery, JSON output, invalid metadata, missing paths, the GitHub Action command, and no-network guard.

## Deployment and live checks

- Deployed `dist/site/` to the existing production Static Web App `sf-flag-stale-guard` using its product-scoped production configuration. The temporary untracked credential file created by the deployment CLI was deleted without being opened or committed.
- Production now serves `assets/site-B9Z7Rv7V.js`. Its SHA-256 matches the local build: `532ae27a77890ca2b413de72a91f2db353a17790731e9d4872ae242027edff61`.
- Fresh 390×844 phone and 1440×900 desktop contexts both showed the job (**Find flags ready for removal**), audience, and **Try it with sample data** action without scrolling or horizontal overflow.
- The live one-click sample showed three flags, expired `legacy-cart`, and two source references. Reset restored the original sample. Changing it, leaving for install steps, and returning showed no retained review marker. Seeded non-demo local and session values stayed unchanged.
- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/?demo=1`: HTTPS 200, title, language, one H1, main landmark, image alt treatment, labelled controls, and no console errors.
- Live Playwright axe checks found no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, or the designed missing route. All live routes loaded correctly; `/missing-page` correctly returned HTTP 404.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.8 s, LCP 1.2 s, TBT 80 ms, CLS 0, transfer 71 KiB.

## Earlier findings and remaining work

Every earlier verification and review finding was inspected before the repair. The prior fixes remain in place: fail-closed configured paths, ISO metadata validation, complete claim coverage, checkout install, real 404s and route metadata, 200% reflow, plain copy, demo reset feedback, history restoration, and the self-hosted CLI recording.

No product defects remain from this repair. This is a free local CLI with a static documentation/demo site, no backend, accounts, billing, service worker, analytics, or stored user data. Backend-only checks and billing registration are not applicable.

## Run and deploy

Run `npm ci`, `npm test`, `npm run build`, and `cargo build --release`. The static deployment root is `dist/site/`. The ready-to-publish Rust package can be created with `cargo package`; registry publishing remains the factory’s responsibility.
