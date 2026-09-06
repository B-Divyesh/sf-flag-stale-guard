# Find stale flags and block unsafe removal — verification 3 handoff

Date: 2026-09-06

Work order: `flag-stale-guard-verify-3`

Implementation candidate: `b8180ca41072a6eb4f0d67202209d92bcb697940`

Documentation baseline reviewed: `73b3134fe3fc589210974c7720630f63c0e85b31`

## Result

**PASS — zero findings of every severity and zero untested claims.**

The complete independent report is in `.factory/verification-3.md`. No product code changed during verification.

## What was verified

- Fresh live phone and desktop first screens state the job, audience, first action, outcome, and three facts before scrolling.
- The one-click sample shows three flags, expired `legacy-cart`, and two source references under a persistent demo label.
- Reset restores and announces the original sample. Leaving and re-entering demo mode also clears changed sample state without changing seeded non-demo values.
- All live routes, links, titles, metadata, landmarks, keyboard paths, focus behavior, 200% text resize, reduced motion, offline loaded-demo behavior, privacy isolation, legal pages, and the designed HTTP 404 passed.
- Axe found zero violations on root, demo, privacy, terms, and 404. Both root and direct demo passed `verify-url.sh`.
- Lighthouse mobile scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. FCP was 0.9 s, LCP 1.3 s, TBT 70 ms, CLS 0, and transfer 71 KiB.
- All 15 exact commands in `.factory/claims.json` passed separately from a clean remote clone.
- The full suite passed 6 Rust unit, 5 Rust integration, 8 build-contract, and 29 Playwright tests.
- Formatting, strict Clippy, release build, `cargo package`, `cargo publish --dry-run`, npm audit, and diff checks passed.
- The packaged crate installed in an isolated consumer root. Help, version, demo, scan, blocked removal, missing config, and unknown-key paths returned their documented results.
- Eleven live deployment files matched the clean local build byte-for-byte. Production serves `assets/site-B9Z7Rv7V.js`; its SHA-256 is `532ae27a77890ca2b413de72a91f2db353a17790731e9d4872ae242027edff61`.
- Every earlier verification and review finding, including minor findings and F-5-1, is fixed with current evidence.

## Evidence

- Repository report: `.factory/verification-3.md`
- Required report copy: `/work/.evidence/qa-report.md`
- Structured result: `/work/.evidence/qa-result.json`
- Live browser, screenshot, `verify-url.sh`, and Lighthouse evidence: `/work/.evidence/sf-flag-stale-guard-verification-3-*`

## Run and package

Run `npm ci`, `npm test`, `npm run build`, and `cargo build --release`. The website build is `dist/site/`. Create the Rust crate with `cargo package`; publishing remains the factory’s responsibility.

## Remaining work

No product defect or untested claim remains. This product has no backend, tenant state, sign-in, billing, database, service worker, or remote source processing, so those checks are not applicable.
