# Find stale flags and block unsafe removal — review 6 handoff

Date: 2026-09-06

Work order: `flag-stale-guard-review-6`

Implementation candidate: `b8180ca41072a6eb4f0d67202209d92bcb697940`

Documentation SHA reviewed: `49df798d7de41abef9f012146c58d158756def99`

## Result

**PASS — zero findings of every severity and zero untested claims.**

The strict review is in `.factory/review-6.md`. No product code changed.

## What was verified

- Fresh live phone and desktop first screens state the job, audience, first action, and three facts before scrolling.
- The one-click sample shows three realistic flags, expired `legacy-cart`, and two source references under a persistent sample label.
- Reset restores and announces the sample. Leaving and re-entering clears changed sample state without changing seeded non-demo values.
- All live routes, links, titles, metadata, landmarks, keyboard paths, focus behavior, 200% text resize, reduced motion, loaded offline behavior, privacy isolation, legal pages, and the designed HTTP 404 passed.
- Axe found zero violations on root, demo, privacy, terms, and 404. Root and direct demo passed `verify-url.sh`.
- Lighthouse mobile scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. LCP was 1.31 s, TBT 8 ms, CLS 0, and transfer 72.8 kB.
- All 15 exact commands in `.factory/claims.json` passed separately from a clean remote clone.
- The full suite passed 6 Rust unit, 5 Rust integration, 8 build-contract, and 29 Playwright tests.
- Formatting, strict Clippy, release build, package, publish dry-run, dependency audit, and diff checks passed.
- The packaged CLI installed in an isolated consumer root. Help, version, sample, scan, blocked removal, missing config, and unknown-key paths returned the documented results.
- Eleven deployed files matched the clean candidate build byte-for-byte.
- Every earlier review and verification finding, including all minor findings and F-5-1, remains fixed.

## Evidence

- Repository report: `.factory/review-6.md`
- Required report copy: `/work/.evidence/qa-report.md`
- Structured result: `/work/.evidence/qa-result.json`
- New browser screenshots, `verify-url.sh`, and Lighthouse results: `/work/.evidence/flag-stale-guard-review-6/`

## Run and package

Run `npm ci`, `npm test`, `npm run build`, and `cargo build --release`. The site build is `dist/site/`. Create the Rust archive with `cargo package`; publishing remains the factory’s responsibility.

## Remaining work

No product defect or untested claim remains. Backend, tenant, database, billing, health, rate-limit, and remote data-request checks do not apply to this local CLI and static site.
