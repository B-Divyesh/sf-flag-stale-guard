# Independent product verification — PASS

Date: 2026-08-28  
Work order: `flag-stale-guard-verify-2`  
Candidate: `976ed0794a66232077f14f813853e43a3c32e4f5`  
Live URL: `https://flag-stale-guard.sociobot.in`  
Artifact: local Rust CLI, GitHub composite action, and static documentation/demo site

## Verdict

**PASS — release candidate accepted.** No critical, high, medium, or low defects were found in this independent verification. The deployed root HTML, JavaScript, and CSS are byte-identical to a fresh production build at the tested commit.

## Mandatory first read

Cold-loaded the live root at desktop and 390 px mobile before reading source or builder notes.

- **What it does:** “Find flags ready for removal.”
- **For whom:** “For maintainers who need to remove old flags without leaving live references behind.”
- **What to click first:** the visible one-click **Try it with sample data** action, with the adjacent explanation “See an expired flag and its call sites.”

This passes the plain-words and demo gates. The click opens `/demo`, which immediately shows three realistic configured flags, the expired `legacy-cart`, its two source references, a removal block, and the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**.

## Claims-first verification

`.factory/claims.json` exists and declares 13 claims. After `npm ci`, an uncontaminated `npm test` run completed successfully: 6 Rust unit tests, 5 Rust CLI integration tests, 6 Node build-contract tests, and 24 Chromium tests passed. The build-contract test confirms exactly one `@claim:<id>` regression tag for every declared claim; the Chromium run exercised every tagged claim through the shipped demo / packaged CLI flow.

| Claim ID | Result |
| --- | --- |
| `metadata-gate` | PASS |
| `literal-references` | PASS |
| `fail-closed-paths` | PASS |
| `expired-checklist` | PASS |
| `sample-removal-block` | PASS |
| `clear-removal-check` | PASS |
| `json-output` | PASS |
| `demo-sandbox` | PASS |
| `local-source` | PASS |
| `website-private` | PASS |
| `github-action-gate` | PASS |
| `mit-license` | PASS |
| `checkout-install` | PASS |

The exact individual commands declared by the manifest were also initiated from this clean checkout. An earlier interrupted verifier invocation left its own Vite preview on port 4173, producing port-conflict failures before the selected browser tests ran; that was test-harness contamination, not a product failure. With the preview lifecycle clean, the single-server `npm test` run above is the authoritative all-claim result.

## Product and package exercise

- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo build --release`, `cargo package --allow-dirty`, `npm run build`, and `npm audit --omit=dev` all passed. `npm audit` reported 0 vulnerabilities.
- `cargo install --path target/package/flag-stale-guard-0.1.0 --root /tmp/fsg-consumer.lVRAVx/install --force` installed the packaged crate into an isolated consumer root.
- The installed binary returned `flag-stale-guard 0.1.0`. On the bundled sample, `scan --check --json` returned the three findings and exited 2 for expired `legacy-cart`; `remove-check legacy-cart --json` returned the same two references and exited 3; `demo --json` exited 0.
- Boundary and recovery checks passed: an unknown flag, empty config, and missing config each exit 1 with a next-step error. The automated claim coverage additionally passes malformed expiry, blank owner, missing scan path, non-UTF-8 configured file, clear removal, JSON output, no-network source scanning, and action-gate paths.

## Live site, privacy, accessibility, and performance

- Live `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns a real 404. The external repository link returns 200.
- `verify-url.sh` passed for live `/` and `/demo`: correct title and language, one H1, main landmark, complete image alt treatment, no unlabeled buttons, and no console/page errors. Evidence is under `/tmp/fsg-verify-live-home/` and `/tmp/fsg-verify-live-demo/`.
- Independent Playwright checks at 1440×900 and 390×844 found no horizontal overflow. At 390 px with the root font size set to 34 px (200%), `/`, `/demo`, `/privacy`, and `/terms` each remained 390 px wide with no overflow.
- Axe 4.10.2 found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the 404 route at both viewports. Keyboard-only verification confirmed the skip link is first and visibly focused (3 px solid outline), moves focus to `<main>`, and client navigation moves focus to the new H1. Reduced-motion CSS resolves transition and animation duration to `0s`.
- A fresh live browser context made only same-origin requests across landing, demo, and privacy; it received no cookies and retained no localStorage or sessionStorage keys. The live page has no account, payment, or tracking controls. This confirms the documented privacy posture; the packaged CLI’s no-network claim is also exercised by the tagged `LD_PRELOAD` syscall guard.
- Live headers provide HSTS, `nosniff`, strict-origin referrer policy, and a same-origin CSP (`default-src`, `img-src`, `style-src`, `script-src`, and `connect-src` all self-scoped). HTML is cached for 30 seconds; hashed JS and CSS are immutable for one year. Initial JS is 8,988 bytes / 3,484 gzip, CSS is 6,135 bytes / 2,244 gzip, and the 61,400-byte hero is within the stated asset budget.

## Deployment identity

Fresh `npm run build` generated `dist/site/`. SHA-256 values matched the live deployment exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `5f4247695d7a97531d3312cabd168fc77e0eb538beb4fcd41a78833f27ba4b57` |
| `assets/site-DzjY2A5z.js` | `5049f23907e04facb406171661884645436369db831c23a791258aef1fb9201c` |
| `assets/style-CIdA81iI.css` | `c461dd1ebd71afec692addf0fecd19ed89d4946d05e811570ec14630aaeb95fa` |

## Applicability

This is a local CLI and static site. It has no server-side API, sign-in, billing/product-unlock calls, persistence service, PWA service worker, or backend health endpoint; rate-limit, Entra tenant, concurrency, persistence-boundary, service-worker-update, and offline-reload checks are therefore not applicable. The loaded static demo remains usable offline, as covered by the browser suite, but it makes no offline-first claim.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

