# Find stale flags and block unsafe removal — verification 3

Date: 2026-09-06

Work order: `flag-stale-guard-verify-3`

Implementation candidate: `b8180ca41072a6eb4f0d67202209d92bcb697940`

Documentation baseline: `73b3134fe3fc589210974c7720630f63c0e85b31`
Live URL: <https://flag-stale-guard.sociobot.in>

## Verdict

**PASS — zero findings of every severity and zero untested claims.**

Finding count: **0**

Untested claim count: **0**

The live product matches the implementation candidate. All 15 declared claim commands passed independently from a clean remote clone. The complete suite, release checks, installed CLI, live demo, routes, accessibility, privacy, links, and performance checks also passed.

## Job, audience, and first action before scrolling

Fresh 390×844 phone and 1440×900 desktop contexts opened the live root at scroll position zero. Both showed the same complete first screen without horizontal overflow:

- Job: **Find flags ready for removal**.
- Audience: maintainers removing old flags without missing source references.
- First action: **Try it with sample data**. The next line says it will show an expired flag and its source references.
- Plain facts: runs from a repository checkout, sends no source code away, and uses the MIT license.

No metaphor or mood heading was present. The copy audit has no sentence above 22 words and no banned marketing word. The site and README use **source reference** consistently for an exact flag-key match in a file and line.

## Declared claims

A clean clone from the remote repository was created at `/tmp/fsg-verify3-clean.uANnDY/repo`. It resolved to documentation SHA `73b3134fe3fc589210974c7720630f63c0e85b31` and began clean. `npm ci` installed the documented prerequisites with zero audit vulnerabilities.

Every command below was run separately and passed. Each selected browser test used the packaged CLI created by its clean test setup.

| Claim | Exact command | Result and observed outcome |
|---|---|---|
| `metadata-gate` | `npm test -- --grep @claim:metadata-gate` | PASS — expired, malformed-date, and blank-owner inputs returned their documented statuses; `--check` exited 2. |
| `literal-references` | `npm test -- --grep @claim:literal-references` | PASS — only the exact key inside the configured path was reported. |
| `fail-closed-paths` | `npm test -- --grep @claim:fail-closed-paths` | PASS — missing and non-UTF-8 paths exited 1 in covered modes and never printed a safe result. |
| `expired-checklist` | `npm test -- --grep @claim:expired-checklist` | PASS — the expired flag printed the complete removal checklist. |
| `sample-removal-block` | `npm test -- --grep @claim:sample-removal-block` | PASS — the bundled CLI sample exited 3 and both CLI and site listed the same two references. |
| `clear-removal-check` | `npm test -- --grep @claim:clear-removal-check` | PASS — a configured path without the key returned the documented safe result and exit 0. |
| `json-output` | `npm test -- --grep @claim:json-output` | PASS — scan and removal output parsed with the documented fields and results. |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — the CLI left its checkout clean; changed website sample state disappeared after exit and re-entry; browser storage stayed empty. |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS — the direct demo showed three flags; Reset restored them and announced the result. |
| `cli-demo-recording` | `npm test -- --grep @claim:cli-demo-recording` | PASS — the local recording and transcript matched the packaged demo after normalizing only its temporary path. |
| `local-source` | `npm test -- --grep @claim:local-source` | PASS — scan and demo succeeded under a syscall guard that terminates network calls. |
| `website-private` | `npm test -- --grep @claim:website-private` | PASS — requests stayed same-origin; cookies and storage remained empty; no account or payment control exists. |
| `github-action-gate` | `npm test -- --grep @claim:github-action-gate` | PASS — the composite action used the same check gate; expired and missing-path cases returned 2 and 1. |
| `mit-license` | `npm test -- --grep @claim:mit-license` | PASS — repository license text and live landing fact both identify MIT. |
| `checkout-install` | `npm test -- --grep @claim:checkout-install` | PASS — a separate clean checkout installed with `cargo install --path .`; the installed binary and demo ran; the checkout stayed clean. |

Landing, demo, privacy, terms, README, action, install, and demo documentation were cross-checked against `.factory/claims.json`. No false, incomplete, missing, duplicate, or untested public claim was found.

## Full build and installed CLI

The same clean checkout passed:

```text
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
cargo package --allow-dirty
cargo publish --dry-run --allow-dirty
npm audit --omit=dev
git diff --check
```

The full suite passed 6 Rust unit tests, 5 Rust CLI integration tests, 8 build-contract tests, and 29 Playwright tests. `npm run build` produced `dist/site/`. JavaScript is 12.32 kB raw and 4.52 kB gzip; CSS is 7.49 kB raw and 2.49 kB gzip.

A separate consumer root installed `target/package/flag-stale-guard-0.1.0`. The installed binary returned version `0.1.0`, helpful subcommands, and these outcomes:

| Path | Expected | Result |
|---|---:|---|
| `demo --json` | 0 | PASS — three flags: tracked, expired, tracked. |
| Sample `scan --check --json` | 2 | PASS — expired `legacy-cart` failed the gate. |
| Sample `remove-check legacy-cart --json` | 3 | PASS — both source references blocked removal. |
| Unknown removal key | 1 | PASS — actionable not-configured error. |
| Missing config | 1 | PASS — actionable config-path error. |

The automated suite additionally passed the normal future-date case, expiry-equals-today boundary, one-day-expired case, malformed date, blank owner, malformed input, missing and unreadable paths, clear-removal recovery, human output, JSON output, and GitHub Action paths.

## Live demo and real-data isolation

The root action entered `/?demo=1` in one click. The first demo screen was already populated with three realistic flags. It showed expired `legacy-cart`, owner and expiry metadata, and these two configured references:

```text
src/checkout.ts:6
src/legacy.ts:1
```

The persistent label read **Demo — sample data, nothing is saved** and included **Reset demo** and **View install steps**. Marking the first reference changed the sample. Reset restored the original three flags, removed the marker, retained focus, and announced **Demo reset to the original three flags.**

The prior F-5-1 path now passes live and in the claim test: mark the sample, leave for the install steps, re-enter Demo through navigation, and find no retained marker. Seeded `real:sentinel` local and session values remained unchanged throughout, proving that the demo did not clear or replace non-demo browser data.

The loaded demo still reset and navigated while the browser was offline. No cache or service-worker registration exists. The product makes no offline-install or update promise.

## Live routes, accessibility, privacy, and performance

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-verification-3` deliberately returned HTTP 404 and rendered the designed **Page not found** view with a home link. The browser's failed-resource message for that requested 404 is expected, not a product error.
- Every route had its own correct title, description, canonical URL, one H1, `lang="en"`, header, navigation, main, footer, and complete image alt treatment.
- Axe 4.10.2 reported zero violations of any severity across all five routes. The root and direct demo also passed `/opt/fleet/lib/verify-url.sh` with no console or page errors.
- Keyboard checks passed for the skip link, Enter, Space, route focus, reset focus, and install focus. Focus uses a visible 3 px outline. All tested links and buttons measured at least 44×44 CSS pixels.
- At 390 px, every route had zero horizontal overflow at normal size and with the root font size set to 34 px for the 200% text check.
- Reduced-motion contexts had zero running animations. Back restored the root to `scrollY=1665` with its H1 focused; Forward restored Privacy at the top with its H1 focused.
- Every discovered internal asset, route link, and external repository link returned 200.
- All browser requests during the landing and demo flow stayed on `flag-stale-guard.sociobot.in`. No cookie was set. The demo did not create browser storage. The site has no third-party scripts, fonts, analytics, account, payment, or tracking flow.
- Privacy and Terms load directly with distinct titles and plain limits. Because neither the site nor CLI stores personal data remotely, a data-request workflow is not applicable.
- Response headers include same-origin CSP, HSTS, `nosniff`, and strict-origin referrer policy. Hashed assets use one-year immutable caching; HTML uses short revalidation.
- Lighthouse 13.4.1 mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.3 s, TBT 70 ms, CLS 0, and total transfer 71 KiB.

Live evidence is stored outside the package under `/work/.evidence/sf-flag-stale-guard-verification-3-*`.

## Candidate and deployment identity

`b8180ca` is the last product implementation commit. The later `73b3134` commit changes only `.factory/handoff.md`. The clean build emitted `assets/site-B9Z7Rv7V.js`, matching production.

Eleven deployable files were compared byte-for-byte with live responses: both HTML pages, JavaScript, CSS, hero art, social art, terminal recording, favicon, Apple touch icon, `robots.txt`, and `sitemap.xml`. All matched. The JavaScript SHA-256 is `532ae27a77890ca2b413de72a91f2db353a17790731e9d4872ae242027edff61` locally and live.

## Earlier findings

Every earlier review, polish report, verification report, and handoff was inspected. Each finding was checked against current code, the clean package, or the live product.

| Earlier finding | Current evidence and disposition |
|---|---|
| F-1-1 — untested Node 20 support | Fixed. No Node-version support promise remains. |
| F-1-2 — untested ready-to-publish wording | Fixed. Copy says only that `cargo package` creates the archive; package and publish dry-run pass. |
| F-1-3 — demo exit returned to the hero | Fixed. **View install steps** opens `/#install` and focuses **Run it in a repository**. |
| F-1-4 — Reset had no observable result | Fixed. Sample state changes; Reset restores it, announces the result, and retains focus. |
| F-1-5 — long README sentence | Fixed. Current prose is split into short sentences. |
| F-1-6 — four names for a source reference | Fixed. Site, README, recording, and human CLI output use **source reference**. |
| F-1-7 — unexplained first-screen CLI abbreviation | Fixed. The first screen says **command-line tool**. |
| F-1-8 — unexplained ISO/TOML instruction | Fixed. It shows `YYYY-MM-DD` and says config file. |
| F-1-9 — abstract runtime limit | Fixed. The site says it cannot identify exposed users or prove running behavior. |
| F-1-10 — vague section heading | Fixed. The heading names expired flags and remaining references. |
| F-1-11 — unexplained literal adapter | Fixed. README says **literal mode** and defines its exact-key search. |
| F-1-12 — combined exit-zero result and warning | Fixed. Result and deletion guidance are separate. |
| F-1-13 — missing deploy guidance | Fixed. README names `dist/site/` and Param Factory ownership. |
| F-2-1 — Back lost scroll and focus | Fixed. Live Back restored `scrollY=1665` and root H1 focus; Forward restored Privacy. |
| F-2-2 — metaphorical 404 copy | Fixed. The HTTP 404 says **Page not found** and explains the next action. |
| F-2-3 — decorative image caption | Fixed. No `figcaption` remains; useful image alt text remains. |
| F-2-4 — unclear search description | Fixed. Search and sharing descriptions say that removal is blocked while references remain. |
| F-3-1 — no recording of the real CLI demo | Fixed. The local SVG and transcript match the packaged CLI output. |
| F-3-2 — checkout claim did not install from a checkout | Fixed. The exact claim clones, installs, runs, and checks a clean checkout. |
| F-5-1 — leaving demo retained changed sample state | Fixed. Live and claim paths both clear the marker on exit and re-entry. |

The original verifier defects also remain fixed: configured paths fail closed; malformed expiry and blank owner metadata fail the gate; all public claims are declared; the checkout install works; unknown routes return a real 404; route metadata is canonical; social art is 1200×630; and 200% text reflows without page overflow.

## Applicability and missed leverage

This product is a local Rust CLI and static documentation/demo site. It has no backend, tenant data, sign-in, billing, database, health endpoint, or live API allowance. Backend tenant isolation, restart persistence, 429/Retry-After, concurrency, and billing checks do not apply.

No missing AI, import/export, or sync feature is a finding. The job is deterministic source inspection and metadata validation. JSON output and the GitHub Action provide the expected scripting and automation paths without sending source code away.

## Findings by severity

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Minor | 0 |
| Untested claims | 0 |

**Final verdict: PASS.**
