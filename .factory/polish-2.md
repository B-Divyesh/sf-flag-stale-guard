# Polish round 2 — Flag Stale Guard

Candidate repaired: `cd5ea260f0614d6907c2bf3bcdff674cfa250f51`
Base review: `dea718fe0eef45cfec1c15946beb4a5d40f1155a`

## Review finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the Node 20 promise removed; the README names only the exercised tools. | Final clean-clone claim sweep; README audit. |
| F-1-2 | Kept factual `cargo package` archive wording without a publication-readiness promise. | Final clean-clone claim sweep; README audit. |
| F-1-3 | Kept **View install steps** routing to `/#install` and focusing the install heading. | `tests/quality.spec.js` offline/demo route test; live demo check. |
| F-1-4 | Kept in-memory review state; Reset restores three flags and announces the result. | `@claim:demo-reset`; live demo check and [demo screenshot](evidence/polish-2-live/demo-390.png). |
| F-1-5 | Kept the README introduction split into short sentences. | `.factory/copy-audit.md`; README review. |
| F-1-6 | Replaced every remaining human CLI “live reference” string with **source reference**. Added the README definition of a source reference. | `@claim:sample-removal-block`, `@claim:clear-removal-check`, and `@claim:demo-sandbox`; source/README term scan. |
| F-1-7 | Kept the first-screen “command-line tool” wording. | Cold live home check; [home screenshot](evidence/polish-2-live/home-390.png). |
| F-1-8 | Kept the setup instruction showing `YYYY-MM-DD` and “config file.” | `@claim:metadata-gate`; copy audit. |
| F-1-9 | Kept the concrete limitation about users and code at runtime. | Cold live home check; copy audit. |
| F-1-10 | Kept the explanatory “Find expired flags and remaining references” heading. | Full axe/browser suite; cold live home check. |
| F-1-11 | Kept “literal mode” and its exact-key explanation. | `@claim:literal-references`; README review. |
| F-1-12 | Kept the separated exit-0 result and deletion warning. | `@claim:clear-removal-check`; README review. |
| F-1-13 | Kept README deployment ownership and `dist/site/` instructions. | `npm run build`; README Deploy section. |
| F-2-1 | Save scroll and focus in each history entry on scroll/focus/navigation; restore both on `popstate`. | `Back and Forward restore each route’s scroll position and focus`; live check restored home scroll to `1665`. |
| F-2-2 | Rewrote the 404 H1, explanation, and return link in plain route language. | `plain error and sharing copy name the page and removal action`; live HTTP 404 check; [404 screenshot](evidence/polish-2-live/404-1440.png). |
| F-2-3 | Removed the decorative specimen caption while retaining the useful image alt text. | `plain error and sharing copy name the page and removal action`; live check asserts zero `figcaption` elements. |
| F-2-4 | Rewrote root description, Open Graph, and Twitter text to name removal directly. | `plain error and sharing copy name the page and removal action`; live metadata check. |

## Verification evidence

- Final clean clone: `/tmp/fsg-polish2-final-final.ERZC4E` at `cd5ea26`; `npm ci` succeeded and all 14 exact commands in `.factory/claims.json` passed. The log ends with `ALL_CLAIMS_PASS` and the checkout remained clean.
- Full suite: `npm test` passed: 6 Rust unit tests, 5 Rust integration tests, 7 build-contract tests, and 28 Playwright browser/accessibility/privacy/offline tests.
- Release checks passed: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, `npm audit --omit=dev`, and `git diff --check`.
- Local cold checks: `verify-url.sh` passed `/` and `/?demo=1`; screenshots and JSON are in `evidence/polish-2-local-home/` and `evidence/polish-2-local-demo/`.
- Deployment: Static deployment `c2eef0a0-6b67-4c7d-b5fc-6c39d7cf3d66` reached `https://flag-stale-guard.sociobot.in/`.
- Live cold checks: `verify-url.sh` passed root and direct demo. The live browser report at `evidence/polish-2-live/live-check.json` records same-origin requests only, zero browser storage in demo, no unexpected console errors, zero serious/critical axe findings, no 390px overflow, history restoration, and real HTTP 404 behavior.
