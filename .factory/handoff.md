# Flag Stale Guard polish 2 handoff

Date: 2026-08-28
Work order: `flag-stale-guard-polish-2`
Repair commit: `cd5ea260f0614d6907c2bf3bcdff674cfa250f51`

## Delivered

- Resolved every finding in review rounds 1 and 2. The remaining CLI terminology is now **source reference** everywhere people read it, and the README defines it plainly.
- History now saves and restores both scroll and focus. The skip link explicitly focuses main content.
- Rewrote the 404 and sharing metadata in plain words and removed the decorative hero caption.
- Preserved the botanical field-guide system, direct `?demo=1` sandbox, reset behavior, privacy posture, real 404 routing, legal links, mobile layout, and CLI/static-site artifact class.
- Updated the catalog description and copy audit. Full finding-to-evidence mapping is in `.factory/polish-2.md`.

## Verification

- Final clean clone: `/tmp/fsg-polish2-final-final.ERZC4E`, commit `cd5ea26`; `npm ci` succeeded and every one of the 14 exact `.factory/claims.json` commands passed. The clone remained clean.
- Full `npm test` passed: 6 Rust unit tests, 5 Rust CLI integration tests, 7 build-contract tests, and 28 Chromium tests.
- Passed `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, `npm audit --omit=dev`, and `git diff --check`.
- Local `verify-url.sh` passed root and direct demo. Evidence: `.factory/evidence/polish-2-local-home/` and `.factory/evidence/polish-2-local-demo/`.
- Pushed `cd5ea26` to `origin/main` and deployed static build `dist/site/` as deployment `c2eef0a0-6b67-4c7d-b5fc-6c39d7cf3d66`.
- Cold live checks passed at `https://flag-stale-guard.sociobot.in/` and `https://flag-stale-guard.sociobot.in/?demo=1`. The live report confirms mobile reflow, zero serious/critical axe findings across five routes, no unexpected console errors, same-origin-only requests, zero demo storage, history scroll restoration to 1665px, and real HTTP 404 behavior.

## Run and publish

- Develop and verify: `npm ci && npm test`
- Build deployment artifact: `npm run build:site` → `dist/site/`
- Package for factory publishing: `cargo package`

## Remaining work

None. The crate is prepared for factory publishing; do not publish or change DNS, billing, or hosting from this repository.
