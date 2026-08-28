# Flag Stale Guard adversarial review 2 handoff

Date: 2026-08-28

Work order: `flag-stale-guard-review-2`

Candidate reviewed: `b207aa95c8473d8533e65ca5c615a17d1ac41aac`

## Delivered

- Wrote `.factory/review-2.md` with a **FAIL** verdict: 5 findings, including 2 blocking findings.
- Modified no product code.
- Rechecked every finding from review 1 against the live site and source. F-1-6 is half-fixed and returns as BLOCKING because the CLI still says “live references.”
- Verified the cold first screen, one-click demo, reset, real-storage isolation, live request privacy, CLI temp-directory behavior, copy, route metadata, links, 404, browser history, accessibility, reflow, reduced motion, visual identity, and missed leverage.

## Verification

- Fresh clone: `/tmp/fsg-review2-clean.B78d8Z` at `b207aa9`; `npm ci` passed and the clone remained clean.
- All 14 exact `.factory/claims.json` commands passed independently.
- Full `npm test` passed: 6 Rust unit tests, 5 Rust CLI integration tests, 7 build-contract tests, and 26 Chromium tests.
- `npm run build` passed and produced `dist/site/`; checked deployment files matched live SHA-256 hashes.
- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/?demo=1`.
- Live Playwright + axe checks passed five routes at mobile and desktop with zero WCAG A/AA violations, no undersized targets, no overflow, and no unexpected console errors.
- Live link and asset crawl returned the expected 200 responses; a deliberate unknown route returned 404.
- Demo traffic was same-origin only; cookies and demo-created browser storage remained empty; seeded real-storage sentinels were unchanged.
- CLI demo exited 0 from a temporary working directory and left the repository clean.

## Remaining work

See `.factory/review-2.md`. Required repairs are F-1-6 and F-2-1 through F-2-4. The owner’s zero-finding standard is not met.
