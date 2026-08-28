# Polish round 1 — Flag Stale Guard

Candidate repaired: `8eff3a57dd36b054628686db0ba54e4413bc2705`  
Base review: `7c79c7377a2834cf12845a2836b375667a6d10f9`

## Review finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Removed the untested Node 20 compatibility promise. | Clean-clone `npm test`; no version-support claim remains in README. |
| F-1-2 | Replaced “ready-to-publish” with the factual `cargo package` archive instruction. | Clean-clone `cargo package --allow-dirty`; README copy check. |
| F-1-3 | Replaced “Start for real” with **View install steps**. It routes to `/#install`, scrolls there, and focuses the install heading. | `the loaded demo remains usable offline and does not pin stale app caches`; `.factory/evidence/local-demo-390.png`; live `/?demo=1` check pending deployment. |
| F-1-4 | Added an in-memory sample review action. Reset restores all three original flags and announces the result. No browser or real-data storage is touched. | `@claim:demo-reset`; `@claim:demo-sandbox`; `.factory/evidence/local-demo-390.png`; live check pending deployment. |
| F-1-5 | Split the 28-word README explanation into short sentences. | `.factory/copy-audit.md`; README review. |
| F-1-6 | Standardized the UI, README, demo, and audit on **source reference**. | `@claim:literal-references`; copy audit terminology table. |
| F-1-7 | Expanded the first-screen “CLI” to “command-line tool.” | `the first-screen demo action uses the isolated direct demo URL`; `.factory/evidence/local-home-390.png`; live check pending deployment. |
| F-1-8 | Rewrote the first setup step to show a `YYYY-MM-DD` expiry date and a config file. | `@claim:metadata-gate`; copy audit. |
| F-1-9 | Replaced abstract limitation wording with concrete user/runtime limits. | Landing copy audit; `.factory/evidence/local-home-390.png`; cold live check pending deployment. |
| F-1-10 | Renamed the how-it-works heading to **Find expired flags and remaining references**. | Landing copy audit; heading/axe browser suite; `.factory/evidence/local-home-390.png`. |
| F-1-11 | Replaced “literal adapter” with **literal mode** and explained the exact-key search. | `@claim:literal-references`; README review. |
| F-1-12 | Split the zero-exit result from the deletion safety instruction. | `@claim:clear-removal-check`; README review. |
| F-1-13 | Added README deployment ownership and `dist/site/` guidance. | `build:site writes a complete deployable site to dist/site`; README Deploy section. |

## Verification evidence

- Fresh clone: `/tmp/flag-stale-guard-clean-8eff3a5` after `npm ci`.
- All 14 exact commands from `.factory/claims.json`: passed individually.
- Full suite: `npm test` passed (6 Rust unit + 5 Rust integration + 7 build-contract + 26 Chromium tests).
- Release checks: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, `npm run build`, `npm audit --omit=dev`, and `git diff --check` passed.
- Local visual evidence: `.factory/evidence/local-home-390.png`, `.factory/evidence/local-demo-390.png`, and `.factory/evidence/local-404-1440.png`. Live evidence is pending deployment propagation.
