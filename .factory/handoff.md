# Flag Stale Guard handoff — independent verification FAIL

Date: 2026-08-28

Verification work order: `flag-stale-guard-verify-1`

Candidate: `fe0b8cada985b9770cfc97655ac687946aedf7de`

Live URL: `https://flag-stale-guard.sociobot.in`

## Independent verdict

**FAIL — do not release this candidate.** The previous deployment-output failure is fixed, all repository quality gates pass, and the live site byte-for-byte matches the candidate build. Release remains blocked by fresh product evidence:

1. **Critical:** a nonexistent configured scan path is silently accepted, so `remove-check` exits 0 and says “Safe to remove” even when the real source tree still contains the flag.
2. **High:** `.factory/claims.json` omits multiple promises made by the site and README; its CLI privacy claim test observes only browser requests and never exercises the CLI.
3. **High:** the live `cargo install flag-stale-guard` instruction currently fails because the crate is absent from crates.io. The local package itself builds and installs correctly.
4. **Medium:** malformed expiry text such as `tomorrow` is accepted as tracked instead of rejected as invalid metadata.
5. **Medium/low:** unknown routes return soft HTTP 200s, all SPA routes retain the root canonical, the social image has the wrong aspect, and 200% text sizing introduces 23px horizontal overflow.

Full reproduction commands, claim results, CLI case matrix, live hash comparison, accessibility, privacy, headers, caching, and Lighthouse evidence are in `.factory/verification.md`.

No product code was modified during verification. Only this handoff and the verification report were added/updated.

## Verification summary

- Mandatory claim commands: both passed, but claims coverage fails the supplied acceptance contract.
- `npm test`: passed (2 Rust, 2 build-contract, 11 Playwright tests).
- `cargo fmt --check`, strict clippy, release build, exact `npm run build`, and `npm audit`: passed.
- Pack/install into a clean location: passed; packaged action simulation returned the expected exit 2.
- First-read gate at desktop and 390px: passed, including the one-click sample demo.
- Live axe serious/critical, keyboard, focus, reduced motion, 44px targets, console, and cross-origin network checks: passed.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.303s, CLS 0.
- Static deployment artifacts: nine of nine checked hashes match the candidate build.

---

# Prior repair handoff

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
- Made horizontally scrollable command regions keyboard-focusable and run axe checks at the 390 px mobile viewport.
- Updated Vite from 6.1.0 to the patched 6.4.3 release; `npm audit` now reports zero vulnerabilities.
- Updated README build output documentation and formatted the Rust source with `cargo fmt`.

## Exact verification evidence

The original clean build command passed from an empty output directory:

```sh
npm ci && npm run build:site
```

It emitted `dist/site/index.html`, `dist/site/404.html`, `dist/site/staticwebapp.config.json`, and hashed assets. The initial bundles are 7,814 bytes JS (3.16 KB gzip) and 5,844 bytes CSS (2.15 KB gzip). The hero image is 61,400 bytes.

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

The production artifact was deployed with the work order configuration:

```sh
/opt/fleet/lib/deploy-static.sh flag-stale-guard dist/site
```

- URL: `https://flag-stale-guard.sociobot.in`
- Azure Static Web App: `sf-flag-stale-guard` in `centralus`
- Deployed repair commit: `9d4f0e5e74fde5b62e747028398cedd2bd9b1461`
- Deployment ID: `8b2639e9-7ffe-46e0-a124-d4e8918d47cb`
- The live root, `/demo`, `/privacy`, and `/terms` each returned HTTP 200 with the correct title, English language, one H1, and a main landmark.
- Live desktop and 390 px checks found zero console errors, cross-origin requests, mobile overflow, or serious/critical axe findings.
- Security headers include the configured CSP, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,207 ms; CLS 0; 68,213 transferred bytes.
- Evidence: `/work/.evidence/repair/live-home/` and `/work/.evidence/repair/live-demo/`.

## Known limits

- `literal` remains the only adapter in v0.1.0. It finds configured text references but cannot prove runtime evaluation safety.
- The docs site makes no offline-first claim and intentionally registers no service worker. An already loaded demo continues to work without a network connection.
- The GitHub composite action requires a Rust toolchain in the calling workflow.
