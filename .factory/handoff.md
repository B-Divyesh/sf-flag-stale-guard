# Flag Stale Guard handoff — PASS

## Independent verification update

**PASS — candidate `976ed0794a66232077f14f813853e43a3c32e4f5` is accepted for release.** Independent verification on 2026-08-28 confirms that the deployed site at `https://flag-stale-guard.sociobot.in` exactly matches a fresh production build of this candidate (matching SHA-256 for root HTML, JS, and CSS). No critical, high, medium, or low defects were found.

The complete independent report is [`.factory/verification-2.md`](verification-2.md). It records the mandatory first-read/demo result, all 13 claims passing in the clean 24-test suite, clean-consumer package installation, CLI normal/boundary/recovery behavior, privacy request log and storage checks, desktop/mobile/200% text checks, keyboard focus, reduced motion, axe, headers, caching, bundle sizes, and deployment identity.

Run locally:

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
npm run build
cargo package --allow-dirty
```

No server endpoints, sign-in, billing calls, service worker, or persistence service exist in this static-site/local-CLI artifact; those verification categories do not apply.

---

Date: 2026-08-28

Work order: `flag-stale-guard-repair-2`

Verifier report: `bff0b81dc7a78292ffbd5bb928a86d08619a04d6`

Failed candidate: `fe0b8cada985b9770cfc97655ac687946aedf7de`

Artifact: Rust CLI, GitHub composite action, and static Vite documentation/demo site

Live URL: `https://flag-stale-guard.sociobot.in`

## Repairs

- The scanner now validates every configured scan root before inspecting flags. Missing paths, unreadable paths, directly configured non-UTF-8 files, and recursive read failures return exit `1`; `remove-check` cannot print a safe result after a scan failure.
- Expiry values are parsed as exact `YYYY-MM-DD` dates with `chrono`. Malformed dates report `metadata invalid`, and whitespace-only owners report `metadata missing`; both make `--check` exit `2`.
- `.factory/claims.json` now inventories 13 product claims. Every entry has one matching Playwright tag and exercises the claimed surface. The CLI privacy claim runs the packaged executable under an `LD_PRELOAD` guard that terminates on `socket`, `connect`, or `sendto`.
- The unavailable crates.io command was replaced with a working repository-checkout install on the site and in the README.
- Azure Static Web Apps now rewrites only `/demo`, `/privacy`, and `/terms` to the SPA. Unknown routes use the host's 404 response override and render the designed 404 page.
- Every client route updates its title, description, canonical URL, Open Graph URL, and Twitter metadata.
- The social image is a product-art crop at exactly 1200×630. Its provenance is recorded in `.factory/design.md`.
- Responsive grid minimums, wrapping, and code overflow handling remove the 390 px viewport overflow at 200% text size.
- Exact regressions cover human and JSON missing-path behavior, non-UTF-8 scan roots, invalid dates, blank owners, the composite action, package installation, claim completeness, route identity, and enlarged-text reflow.

## Local verification

Clean install and the complete gate passed:

```sh
npm ci
npm test
```

Results: 0 npm audit vulnerabilities; 6 Rust unit tests, 5 Rust CLI integration tests, 6 Node deployment-contract tests, and 24 Chromium tests passed. The browser suite covers desktop and 390 px layouts, keyboard-only operation, route focus, touch targets, every route's metadata and landmarks, serious/critical axe findings, privacy, loaded-demo offline behavior, and stale-cache absence.

All 13 commands declared in `.factory/claims.json` passed independently:

```sh
npm test -- --grep @claim:metadata-gate
npm test -- --grep @claim:literal-references
npm test -- --grep @claim:fail-closed-paths
npm test -- --grep @claim:expired-checklist
npm test -- --grep @claim:sample-removal-block
npm test -- --grep @claim:clear-removal-check
npm test -- --grep @claim:json-output
npm test -- --grep @claim:demo-sandbox
npm test -- --grep @claim:local-source
npm test -- --grep @claim:website-private
npm test -- --grep @claim:github-action-gate
npm test -- --grep @claim:mit-license
npm test -- --grep @claim:checkout-install
```

Strict source, production, and package checks passed:

```sh
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
npm run build
npm audit
cargo package --allow-dirty
cargo install --path target/package/flag-stale-guard-0.1.0 --root <isolated-root> --force
```

The package contains 42 files and is 215.2 KiB compressed. The isolated installed binary returned version `0.1.0`, displayed all commands in `--help`, and produced valid three-flag JSON from `demo --json`.

The production site contains 8,988 bytes of JavaScript and 6,135 bytes of CSS before gzip. The hero is 61,400 bytes; the 1200×630 social image is 53,650 bytes.

`/opt/fleet/lib/verify-url.sh` passed for the local production root and `/demo`: HTTP 200, correct title and language, one H1, a main landmark, complete alt text, no unlabeled buttons, and no console errors. Evidence is in `/work/.evidence/repair-2/local-home/` and `/work/.evidence/repair-2/local-demo/`.

Lighthouse 13.4.1 mobile results: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1,048 ms; LCP 1,652 ms; TBT 8 ms; CLS 0; 69,551 total bytes. The JSON report is `/work/.evidence/repair-2/lighthouse/report.json`.

## Deployment and live verification

The committed repair `0d9c8bc` was pushed to `origin/main`. A clean `npm ci && npm run build:site` produced `dist/site/`, which was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh flag-stale-guard dist/site
```

- Azure Static Web App: `sf-flag-stale-guard` in `centralus`
- Deployment ID: `af04cde8-d3ed-4cab-86bd-c01976a24711`
- Custom domain: `https://flag-stale-guard.sociobot.in`
- `/`, `/demo`, `/privacy`, and `/terms` return HTTP 200. `/definitely-missing-repair-2` returns a real HTTP 404 and renders the designed not-found page.
- Root and demo `verify-url.sh` checks pass with no JavaScript console errors. Evidence is in `/work/.evidence/repair-2/live-home/` and `/work/.evidence/repair-2/live-demo/`.
- Independent live Chromium checks pass on all routes at 1440×900 and 390×844: correct status, title, one H1, main landmark, route canonical, no horizontal overflow, no sub-44 px targets, no unexpected console errors, no cross-origin requests, no cookies, and zero serious/critical axe findings. The 390 px checks also pass at a 34 px root font size.
- Keyboard verification passes: the skip link is first, it focuses `<main>`, and client-side navigation focuses the new H1.
- Live response headers include HSTS, the configured same-origin CSP, `nosniff`, and strict-origin referrer policy. HTML uses `max-age=30, must-revalidate`; hashed assets use `max-age=31536000, immutable`.
- SHA-256 identity checks match local production output for `index.html`, `404.html`, the hero image, and the social image.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 856 ms; LCP 1,251 ms; TBT 20 ms; CLS 0; 68,669 total bytes. Evidence is `/work/.evidence/repair-2/live-lighthouse/report.json`.

## Known limits

- `literal` is the only adapter in v0.1.0. It reports configured text matches but cannot prove runtime flag evaluation safety.
- The crate is ready to publish but is not yet on crates.io. Publishing remains assigned to the factory; current instructions use the working checkout install.
- The site makes no offline-first claim and registers no service worker. An already loaded demo remains usable offline, and no cache can pin an old deployment.
- There is no backend, authentication, payment flow, runtime AI feature, or tenant identity to verify for this static documentation site and local CLI.
