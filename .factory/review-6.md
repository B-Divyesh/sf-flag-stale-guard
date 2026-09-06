# Find stale flags and block unsafe removal — review 6

Date: 2026-09-06

Work order: `flag-stale-guard-review-6`

Implementation candidate: `b8180ca41072a6eb4f0d67202209d92bcb697940`

Documentation SHA: `49df798d7de41abef9f012146c58d158756def99`

Live URL: <https://flag-stale-guard.sociobot.in>

## Verdict

**PASS — zero findings of every severity and zero untested claims.**

Finding count: **0**

Untested claim count: **0**

The live site matches the implementation candidate. All 15 declared claim commands passed separately from a clean remote clone. The full suite, release checks, installed CLI, demo isolation, routes, accessibility, privacy, links, and performance checks also passed.

No product code changed during this review.

## Job, audience, and first action before scrolling

Fresh 390×844 phone and 1440×900 desktop contexts opened the live root at scroll position zero. Both showed the same clear first screen without horizontal overflow or console errors.

- Job: **Find flags ready for removal**.
- Audience: maintainers removing old flags without missing source references.
- First action: **Try it with sample data**. The next line says it shows an expired flag and its source references.
- Plain facts: runs from a repository checkout, sends no source code away, and uses the MIT license.

The primary action, audience sentence, and job heading were visible before scrolling at both sizes. The text uses plain product terms and no metaphor or mood heading. The current copy audit has no sentence above 22 words and no banned marketing word.

## Live sample and data isolation

The root action opened `/?demo=1` in one click. The first sample screen was already populated with three realistic flags. It showed expired `legacy-cart`, its owner and expiry date, and these two source references:

```text
src/checkout.ts:6
src/legacy.ts:1
```

The persistent label said **Demo — sample data, nothing is saved** and included **Reset demo** and **View install steps**.

The full sample path passed:

1. Marking the first source reference changed the sample and announced the change.
2. Reset restored the original three flags, removed the marker, retained focus, and announced the reset.
3. Marking the reference again, leaving for the install section, and re-entering through Demo restored the original sample.
4. Seeded `real:sentinel` values in local and session storage stayed unchanged.
5. The demo created no cookie, cache, service worker, or other browser storage entry.
6. All observed requests stayed on the product origin.

The loaded demo still reset and navigated to the install section with the browser offline. The product does not promise offline installation or updates and registers no service worker.

## Declared claims

A clean remote clone at `/tmp/flag-stale-guard-review6-clean.i2AKSq/repo` resolved to documentation SHA `49df798`. `npm ci` installed the locked prerequisites with zero audit vulnerabilities. Every exact claim command then ran separately and passed.

| Claim | Exact command | Result |
|---|---|---|
| `metadata-gate` | `npm test -- --grep @claim:metadata-gate` | PASS — expired, malformed-date, and blank-owner inputs returned the documented status; `--check` exited 2. |
| `literal-references` | `npm test -- --grep @claim:literal-references` | PASS — only the literal key inside the configured path was reported. |
| `fail-closed-paths` | `npm test -- --grep @claim:fail-closed-paths` | PASS — missing and non-text configured paths exited 1 without a safe-removal result. |
| `expired-checklist` | `npm test -- --grep @claim:expired-checklist` | PASS — the expired flag printed the complete removal checklist. |
| `sample-removal-block` | `npm test -- --grep @claim:sample-removal-block` | PASS — the bundled sample exited 3 and the CLI and site listed the same two references. |
| `clear-removal-check` | `npm test -- --grep @claim:clear-removal-check` | PASS — a configured path without the key returned the safe result and exit 0. |
| `json-output` | `npm test -- --grep @claim:json-output` | PASS — scan and removal output parsed with the documented fields. |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — the CLI checkout stayed clean; website changes disappeared after exit; storage stayed empty. |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS — the direct demo showed three flags and Reset restored and announced the original state. |
| `cli-demo-recording` | `npm test -- --grep @claim:cli-demo-recording` | PASS — the local recording and transcript matched the packaged demo after normalizing only its temporary path. |
| `local-source` | `npm test -- --grep @claim:local-source` | PASS — scan and demo succeeded under a guard that terminates network system calls. |
| `website-private` | `npm test -- --grep @claim:website-private` | PASS — requests were same-origin; cookies and storage stayed empty; no account or payment control exists. |
| `github-action-gate` | `npm test -- --grep @claim:github-action-gate` | PASS — the action uses the same check gate; expired and missing-path cases returned 2 and 1. |
| `mit-license` | `npm test -- --grep @claim:mit-license` | PASS — the repository license and visible site fact both identify MIT. |
| `checkout-install` | `npm test -- --grep @claim:checkout-install` | PASS — a separate checkout installed and ran the CLI and demo while remaining clean. |

The landing, sample, privacy, terms, README, action, installation, and demo documents were cross-checked against `.factory/claims.json`. No false, incomplete, missing, duplicate, or untested public claim was found.

## Clean build and installed CLI

The clean checkout passed:

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

The full suite passed 6 Rust unit tests, 5 Rust CLI integration tests, 8 build-contract tests, and 29 Playwright tests. `npm run build` produced `dist/site/`. Initial JavaScript is 12.32 kB raw and 4.52 kB gzip. CSS is 7.49 kB raw and 2.49 kB gzip.

The packaged crate installed into a separate consumer root. The installed binary returned version `0.1.0`, useful help, and the expected results:

| Path | Expected exit | Result |
|---|---:|---|
| `demo --json` | 0 | PASS — three sample flags and the complete expired checklist. |
| Sample `scan --check --json` | 2 | PASS — expired `legacy-cart` failed the gate. |
| Sample `remove-check legacy-cart --json` | 3 | PASS — both source references blocked removal. |
| Unknown removal key | 1 | PASS — clear not-configured error and next action. |
| Missing config | 1 | PASS — clear file error and next action. |

The suite also covered a future date, expiry equal to today, an expired date, malformed date, blank owner, malformed input, missing and non-text paths, scoped matching, blocked removal, clear-removal recovery, human output, JSON output, and the GitHub Action path.

## Live routes, accessibility, privacy, and performance

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-review-6` deliberately returned HTTP 404 and rendered **Page not found** with a working home link. That 404 is expected evidence, not a defect.
- Every route had a distinct correct title, description, canonical URL, Open Graph URL, one H1, `lang="en"`, header, navigation, main, footer, and complete image alt treatment.
- Axe 4.10.2 found zero violations on all five routes. The root and direct sample also passed `/opt/fleet/lib/verify-url.sh` with no console or page errors.
- Keyboard checks passed for the skip link, Enter, Space, route focus, reset focus, and install focus. Focus used a visible 3 px outline.
- Every tested phone link and button was at least 44×44 CSS pixels. All routes stayed within 390 px at normal size and with the root font size set to 34 px for the 200% text check.
- A reduced-motion context had zero running animations. Back restored the root to `scrollY=1665` with its H1 focused; Forward restored Privacy at the top with its H1 focused.
- Every discovered route, asset, fragment destination, and external repository link worked.
- Response headers included a same-origin CSP, HSTS, `nosniff`, and strict-origin referrer policy.
- The site made no third-party request and loaded no third-party script or font. It has no analytics, account, payment, cookie, or tracking flow.
- Privacy and Terms loaded directly with clear titles and limits. The product stores no remote personal data, so a privacy-request workflow is not applicable.
- Lighthouse 13.4.1 mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.87 s, LCP 1.31 s, TBT 8 ms, CLS 0, and transfer 72.8 kB.

The botanical field-guide palette, pressed-leaf artwork, serif headings, specimen rules, and square controls match `.factory/design.md` and remain distinct from a generic framework page. The original art, social crop, and terminal recording have recorded provenance.

## Candidate and live identity

`b8180ca` is the last product implementation commit. Later commits `73b3134` and `49df798` change only `.factory/handoff.md` and `.factory/verification-3.md`.

Eleven deployable files matched the clean build byte-for-byte: both HTML pages, JavaScript, CSS, hero art, social art, terminal recording, favicon, Apple touch icon, `robots.txt`, and `sitemap.xml`. Production serves `assets/site-B9Z7Rv7V.js`; its local and live SHA-256 is `532ae27a77890ca2b413de72a91f2db353a17790731e9d4872ae242027edff61`.

## Earlier finding dispositions

Every earlier review, polish report, verification report, and handoff was inspected. Each finding was checked against the clean package or live product instead of relying on its earlier status.

| Earlier finding | Current evidence and disposition |
|---|---|
| F-1-1 — untested Node 20 support | Fixed. No Node-version support promise remains. |
| F-1-2 — untested ready-to-publish wording | Fixed. Copy says `cargo package` creates the archive; package and publish dry-run pass. |
| F-1-3 — sample exit returned to the hero | Fixed. **View install steps** opens `/#install` and focuses **Run it in a repository**. |
| F-1-4 — Reset had no observable result | Fixed. State changes; Reset restores it, announces the result, and retains focus. |
| F-1-5 — long README sentence | Fixed. Current prose is split into short sentences. |
| F-1-6 — four names for a source reference | Fixed. Site, README, recording, and human CLI output use **source reference**. |
| F-1-7 — unexplained first-screen CLI abbreviation | Fixed. The first screen says **command-line tool**. |
| F-1-8 — unexplained ISO/TOML instruction | Fixed. It shows `YYYY-MM-DD` and says config file. |
| F-1-9 — abstract runtime limit | Fixed. The site says it cannot identify exposed users or prove running behavior. |
| F-1-10 — vague section heading | Fixed. The heading names expired flags and remaining references. |
| F-1-11 — unexplained literal adapter | Fixed. README says **literal mode** and defines the exact-key search. |
| F-1-12 — combined exit-zero result and warning | Fixed. Result and deletion guidance are separate. |
| F-1-13 — missing deployment guidance | Fixed. README names `dist/site/` and Param Factory ownership. |
| F-2-1 — Back lost scroll and focus | Fixed. Back restored `scrollY=1665` and the root H1; Forward restored Privacy at the top. |
| F-2-2 — metaphorical 404 copy | Fixed. The real HTTP 404 says **Page not found** and gives a home link. |
| F-2-3 — decorative image caption | Fixed. No `figcaption` remains; useful image alt text remains. |
| F-2-4 — unclear search description | Fixed. Search and sharing text says removal is blocked while references remain. |
| F-3-1 — no recording of the real CLI demo | Fixed. The self-hosted recording and transcript match the packaged CLI output. |
| F-3-2 — checkout claim did not install from a checkout | Fixed. The exact claim clones, installs, runs, and confirms a clean checkout. |
| F-5-1 — leaving the sample retained changed state | Fixed. Live and claim paths both clear the marker after exit and re-entry while preserving non-demo values. |
| Original verifier — missing paths failed open | Fixed. Human and JSON checks exit 1 and never print a safe result. |
| Original verifier — claims contract incomplete | Fixed. Fifteen unique claims have one tagged observable test each, and all passed separately. |
| Original verifier — live install command failed | Fixed. Checkout installation works in a clean consumer environment. |
| Original verifier — malformed metadata passed | Fixed. Malformed expiry and blank owner make `--check` exit 2. |
| Original verifier — soft 404 and shared metadata | Fixed. Unknown routes return HTTP 404 and every route has its own metadata. |
| Original verifier — 200% text overflow | Fixed. All live routes reflow within the phone viewport. |

Reviews 4 and verification 2 reported no additional findings. No earlier finding has regressed.

## Applicability and missed leverage

This is a local Rust CLI with a static documentation and sample site. It has no backend, tenant data, sign-in, billing, database, health endpoint, or live API allowance. Tenant isolation, restart persistence, SQLite, rate limits, and `Retry-After` checks do not apply.

No AI, import, export, or sync feature is missing from the stated job. Expiry validation and literal source inspection are deterministic safety checks. JSON output and the GitHub Action already provide the expected scripting and automation paths without sending source code away.

## Findings by severity

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Minor | 0 |
| Untested claims | 0 |

**Final verdict: PASS.**
