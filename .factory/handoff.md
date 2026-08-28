# Flag Stale Guard review 3 handoff

Date: 2026-08-28
Work order: `flag-stale-guard-review-3`

## Done

- Performed an independent first-read review of the deployed site at mobile and desktop sizes.
- Wrote the complete result in `.factory/review-3.md`.
- Did not modify product code or assets.

## Verified

- Fresh contexts identify the job, audience, and **Try it with sample data** action without scrolling.
- The browser demo shows the three sample flags immediately, resets a visible interaction, stores no browser data, and makes only same-origin requests.
- All 14 declared claim commands passed in a fresh clone, as did the full `npm test` suite.
- An isolated checkout install and temporary-directory CLI `demo` run passed.
- Live routes, metadata, HTTP 404, links, responsive layout, focus, reduced motion, accessibility smoke checks, and privacy posture were checked.

## Remaining work

The review verdict is **FAIL** with two findings:

1. **F-3-1 (blocking):** add an accessible, self-hosted recording of the real CLI sample run to the landing page.
2. **F-3-2 (medium):** make the `checkout-install` tagged claim test execute `cargo install --path` from an actual fresh checkout.

See `.factory/review-3.md` for exact evidence and concrete fixes.
