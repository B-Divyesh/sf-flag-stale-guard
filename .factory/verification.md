# Independent product verification — FAIL

Date: 2026-08-28

- Work order: `flag-stale-guard-verify-1`
- Candidate: `fe0b8cada985b9770cfc97655ac687946aedf7de`
- Live URL: `https://flag-stale-guard.sociobot.in`
- Artifact: Rust CLI, GitHub composite action, and static documentation/demo site
- Result: **FAIL — do not release this candidate**

The earlier deployment-output problem is resolved. The live deployment is healthy and byte-for-byte matches this candidate's production site. The candidate still fails the product contract because the CLI's core removal check fails open when a configured scan path does not exist, and the required claims manifest does not cover the promises made by the product.

No product code was modified during this verification.

## First-read gate

**PASS.** Opened the live root cold at 1440×900 and 390×844 before reading the builder's framing.

- What it does: “Find flags ready for removal.”
- For whom: maintainers removing old flags without leaving live references.
- What to click first: “Try it with sample data.”
- The adjacent text explains that the click shows an expired flag and its call sites.
- The action is visible without scrolling on desktop and mobile and opens `/demo` in one click.
- `/demo` immediately shows three realistic flags, an expired `legacy-cart`, two references, a removal block, the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real**.

## Release-blocking findings

### Critical — `remove-check` reports “Safe to remove” when a configured scan path is missing

The scanner silently accepts every nonexistent path (`src/main.rs:246-248`). `remove-check` then treats the resulting empty reference set as safe and exits 0 (`src/main.rs:112-119`).

Fresh packaged-binary reproduction from `/tmp/fsg-qa`, where `src/app.ts` contains `old-flag` but the config mistakenly says `paths = ["source-typo"]`:

```text
$ flag-stale-guard remove-check old-flag --config missing-path.toml
Safe to remove `old-flag`: no live references were found in configured paths.
$ echo $?
0
```

This is a fail-open result in the product's central safety gate. A path typo can allow a maintainer or CI job to delete a flag while live references remain. Missing, unreadable, or otherwise unscannable configured paths must be an error and a nonzero exit.

### High — the required claims contract is incomplete and one declared test checks the wrong product surface

Both commands declared in `.factory/claims.json` pass, but the manifest contains only two entries while the landing page, privacy page, demo, and README make many additional testable promises. Examples not represented by a claim entry include:

- checks owner and ISO expiry metadata;
- finds literal source references in configured paths;
- prints a removal checklist after expiry;
- exits 2 for expired or incomplete flags;
- the demo changes nothing in the current repository;
- the website has no analytics, accounts, payments, or cookies;
- the GitHub Action runs the same gate.

The `local-source` claim says “The CLI sends no source code away,” but its tagged test only opens the browser demo and checks browser requests (`tests/claims.spec.js:12-17`). It never executes or observes the CLI. This does not prove the declared CLI claim. Under the supplied claims contract, unlisted claim-like copy and a claim test that does not exercise the claimed surface are release blocking.

### High — the live install command does not currently work

The live install section tells users to run `cargo install flag-stale-guard`. From a clean directory, the registry reports:

```text
error: could not find `flag-stale-guard` in registry `https://github.com/rust-lang/crates.io-index`
```

The candidate is packageable and the generated crate installs successfully by local path, so the artifact is ready for the factory's publishing step. Until that step happens, the live page must not present the registry command as usable without qualification or a working Git-based alternative.

## Other findings

### Medium — malformed expiry metadata is accepted as tracked

The implementation compares raw expiry strings lexically rather than parsing an ISO date (`src/main.rs:188-213`). A flag with `expires = "tomorrow"` exits 0 and is printed as `tracked`, despite the README and live page requiring an ISO expiry. This weakens the required metadata gate.

### Medium — unknown routes are soft 404s and route metadata is not canonical

- `GET /definitely-missing-qa` returns HTTP 200, then JavaScript paints the not-found page. The navigation fallback prevents the configured 404 response override from producing a real HTTP 404.
- `/demo`, `/privacy`, `/terms`, and the not-found view all retain the root canonical URL.
- The Open Graph image is 1200×800, not the required 1200×630 social image.

### Low — 200% text sizing produces horizontal page overflow

At a 390px viewport with the root font size doubled to 34px, document width grows to 413px. Normal-size mobile layout has no overflow, and the enlarged terminal remains keyboard-scrollable, but the result misses the no-loss 200% resize baseline.

## Mandatory claims-first evidence

| Claim | Exact command | Result |
|---|---|---|
| `sample-removal-block` | `npm test -- --grep @claim:sample-removal-block` | PASS: 2 Rust tests, 2 build-contract tests, and 1 selected Playwright test passed |
| `local-source` | `npm test -- --grep @claim:local-source` | PASS command; 2 Rust tests, 2 build-contract tests, and 1 selected Playwright test passed. Coverage is invalid for the CLI claim as described above. |

## Clean checkout and build evidence

The checkout began clean at the exact candidate commit. Results:

- `npm ci`: PASS, 19 packages installed, 0 audit vulnerabilities.
- `npm test`: PASS — 2 Rust unit tests, 2 Node build-contract tests, 11 Chromium tests.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `cargo build --release`: PASS.
- `npm run build`: PASS; production output created at `dist/site/`.
- `npm audit`: PASS, 0 vulnerabilities.
- `cargo package --allow-dirty`: PASS; 38 files, 219.6 KiB unpacked and 149.3 KiB compressed.
- `cargo install --path target/package/flag-stale-guard-0.1.0 --root /tmp/fsg-install --force`: PASS.
- Packaged action command from a separate consumer directory: PASS; expired sample returned exit 2.

Production bundle sizes are comfortably within budget:

- JavaScript: 7,814 bytes raw, 3.16 KiB gzip.
- CSS: 5,844 bytes raw, 2.15 KiB gzip.
- Hero WebP: 61,400 bytes.

## CLI end-to-end matrix

All cases used the clean installed package binary, not `cargo run` from the source checkout.

| Case | Observed result |
|---|---|
| `--help` / `--version` | Helpful subcommands shown; version `0.1.0` |
| `demo` | Exit 0; temporary workspace path printed; three sample flags and two `legacy-cart` references shown |
| `demo --json` | Exit 0; valid structured array for all three flags |
| expiry equal to 2026-08-28 | Exit 0; tracked boundary behavior |
| expiry 2026-08-27 with `--check` | Exit 2; expired plus checklist |
| `remove-check` with one reference | Exit 3; reference listed |
| missing owner with `--check` | Exit 2; `metadata missing` |
| malformed TOML | Exit 1; parse cause and next action shown |
| unsupported adapter | Exit 1; names adapter and required `literal` value |
| unknown flag | Exit 1; says the flag is not configured |
| missing configured path | **Exit 0 and “Safe to remove” — critical failure** |
| malformed expiry `tomorrow` | **Exit 0 and `tracked` — metadata failure** |

## Live site, accessibility, privacy, and performance

- `/opt/fleet/lib/verify-url.sh`: PASS — HTTP 200, correct title/lang, one H1, main landmark, complete image alt text, no unlabeled buttons, no console errors.
- Independent axe checks across `/`, `/demo`, `/privacy`, `/terms`, and the not-found view at desktop and 390px mobile: zero serious or critical findings.
- Keyboard-only smoke test: skip link is first; Enter activates it; nav, demo action, terminal regions, reset, and start-for-real are reachable and operable; route changes focus the H1.
- Visible focus: 3px solid ochre outline observed on keyboard targets.
- Touch targets: no link or button below 44×44 CSS px on either tested viewport.
- Reduced motion: zero active animations with `prefers-reduced-motion: reduce`.
- Normal mobile reflow: zero horizontal overflow at 390px.
- Console errors, page errors, and failed requests: zero across all routes and sizes.
- Outbound browser requests: zero cross-origin requests across landing and demo interactions.
- Browser storage remained empty; response headers set no cookies.
- CLI source and dependency inspection found no network client dependency or networking API. Runtime syscall tracing was unavailable in the container; the declared browser test does not substitute for a CLI network test.
- CSP, HSTS, `nosniff`, and strict-origin referrer policy are active. Hashed assets use `public, max-age=31536000, immutable`; HTML uses `max-age=30, must-revalidate`.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 917 ms, LCP 1,303 ms, TBT 67 ms, CLS 0, total bytes 68,243.
- Every discovered internal and external link returned 200, and both in-page fragments existed.
- No service worker, backend API, authentication, payments, or product-unlock endpoint exists. PWA update/offline-reload, server persistence/concurrency/rate limiting, and Entra tenant checks are therefore not applicable.

## Deployment identity

The live deployment matches the candidate's production output. SHA-256 hashes matched for all nine checked deploy artifacts:

- `index.html`
- `404.html`
- hashed JavaScript and CSS bundles
- hero WebP
- favicon and Apple touch icon
- `robots.txt`
- `sitemap.xml`

The earlier `dist/site` deployment-only failure is not present in this candidate.

## Required next steps

1. Fail closed when any configured scan path is missing or unreadable; add unit, CLI, JSON, and action tests for it.
2. Parse expiry with an ISO date parser and reject malformed values; validate blank/whitespace owners too.
3. Inventory every product claim, add one scoped test per claim, and make the CLI privacy claim test execute/observe the packaged CLI.
4. Publish the prepared crate through the factory or replace the live install command with one that works now.
5. Return a real HTTP 404, set per-route canonicals, provide the required social image dimensions, and remove 200% text overflow.
