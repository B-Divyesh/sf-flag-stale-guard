# Flag Stale Guard polish round 1 handoff

Date: 2026-08-28  
Work order: `flag-stale-guard-polish-1`  
Repair commit: `8eff3a57dd36b054628686db0ba54e4413bc2705`

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

The static deployment artifact is `dist/site/`; `8eff3a5` was pushed to `origin/main`. The deployment watcher had not yet served that revision at the time this handoff was drafted. Local `verify-url.sh` evidence is in `.factory/evidence/verify-local-home/` and `.factory/evidence/verify-local-demo/`; visual evidence is in `.factory/evidence/local-*.png`. Before completion, verify a cold live root, `/?demo=1`, privacy, terms, and a missing route; run `verify-url.sh` plus the browser axe suite; and update this section with the deployed commit, screenshots, and outcomes.

## Known gaps

None in the repository repair. Live deployment propagation remains to be recorded in this handoff before final acceptance.
