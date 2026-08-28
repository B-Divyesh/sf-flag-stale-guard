# Flag Stale Guard repair handoff

Date: 2026-08-28

Work order: `flag-stale-guard-repair-1`

Repaired base: `11a8b0283c3e65d86da7b18a2cadbacf4657a78d`

## Repair

The failure was reproduced with the work order command, `npm ci && npm run build:site`. Vite completed successfully but wrote `dist/index.html`; `dist/site/index.html` did not exist, so the configured static deploy directory was invalid.

- Changed Vite's production `outDir` to `dist/site`, matching the unchanged static artifact and deployment contract.
- Made `npm run build` use the same site build and changed Playwright to test the built production preview.
- Added `scripts/build-contract.test.js`. It fails unless `dist/site` contains the HTML entry points, host configuration, sitemap, robots file, and hashed JS/CSS assets. It also checks that built local references resolve inside the deploy root.
- Added route identity, console, landmark, axe, keyboard, mobile reflow, 44 px target, and loaded-offline/update-cache browser checks.
- Preserved initial keyboard access to the skip link and moved focus to the page heading only after client-side route changes.
- Raised the mobile wordmark and demo controls to the 44 px target baseline.
- Updated Vite from 6.1.0 to the patched 6.4.3 release; `npm audit` now reports zero vulnerabilities.
- Updated README build output documentation and formatted the Rust source with `cargo fmt`.

## Exact verification evidence

The original clean build command passed from an empty output directory:

```sh
npm ci && npm run build:site
```

It emitted `dist/site/index.html`, `dist/site/404.html`, `dist/site/staticwebapp.config.json`, and hashed assets. The initial bundles are 7,754 bytes JS (3.15 KB gzip) and 5,844 bytes CSS (2.15 KB gzip). The hero image is 61,400 bytes.

The complete local gate passed:

```sh
npm test
```

Results: 2 Rust unit tests, 2 deployment-build regression tests, and 11 Chromium tests passed. Browser coverage includes all five route states, both claims, production preview, desktop and 390 px mobile layout, touch targets, keyboard-only operation, route focus, axe serious/critical checks, console errors, privacy, and loaded-demo offline behavior. The update-cache check found zero service workers and zero Cache Storage entries, so a stale app cache cannot pin a deployment.

Each declared claim also passed through its exact command:

```sh
npm test -- --grep @claim:sample-removal-block
npm test -- --grep @claim:local-source
```

Additional passing checks:

```sh
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
cargo run --quiet -- demo --json
cargo package --allow-dirty
npm audit
```

`cargo package` produced and verified `flag-stale-guard-0.1.0` (216.6 KiB unpacked, 147.7 KiB compressed). Registry publishing remains intentionally assigned to the factory.

Local production-preview verification:

- `/opt/fleet/lib/verify-url.sh`: HTTP 200, correct title and `lang`, one H1, a main landmark, complete image alt text, zero unlabeled buttons, and zero console errors.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 1,514 ms, CLS 0, total transferred bytes 69,099.
- Evidence: `/work/.evidence/repair/local/verify.json`, screenshots, and `lighthouse-mobile.json`.

## Deployment and live identity

Pending the repair commit and production deployment. This section will be updated with the deployed URL and post-deploy evidence.

## Known limits

- `literal` remains the only adapter in v0.1.0. It finds configured text references but cannot prove runtime evaluation safety.
- The docs site makes no offline-first claim and intentionally registers no service worker. An already loaded demo continues to work without a network connection.
- The GitHub composite action requires a Rust toolchain in the calling workflow.
