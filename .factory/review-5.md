# Review 5 — Find stale flags and block unsafe removal

Date: 2026-09-06

Work order: `flag-stale-guard-review-5`

Live URL: <https://flag-stale-guard.sociobot.in>

Implementation candidate: `e369bfeb6caa43bfae3ace1404f8b6f71986bd52`

Documentation baseline: `72dc90120d667dd4c3797793ff9c471d9f9b7ece`

## Verdict

**FAIL — 1 minor finding; 0 untested claims.**

All 15 declared public claims pass. The installed CLI also passes normal, invalid, boundary, and recovery checks. The product fails this review because changed demo state survives leaving demo mode and returning through the site. The demo sandbox contract requires leaving demo mode to discard demo data.

No product code, assets, tests, or deployment settings were changed during this review.

## Finding

### Minor — F-5-1: Leaving demo mode does not discard changed sample state

- Start at `/demo` and choose **Mark first source reference reviewed**. The page shows **Reviewed in this demo**.
- Choose **View install steps**. The demo banner disappears and the URL becomes `/#install`.
- Choose **Demo** in the main navigation. The demo banner returns, but **Reviewed in this demo** is still present.
- A full reload clears the state, and **Reset demo** clears and announces it. No cookie, local storage, session storage, or real repository data changes.
- Expected: leaving demo mode discards demo state, so re-entering starts with the original three flags.
- Impact: a visitor who leaves and re-enters the demo does not get the clean sample promised by the demo sandbox contract. The impact is limited to one in-memory sample marker.
- Fix: reset `reviewedReference` when navigation leaves the demo, and add a browser test for change → leave → re-enter.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 with reduced motion enabled.

| Check | Phone | Desktop |
|---|---|---|
| Job | **Find flags ready for removal** | Same |
| Audience | Maintainers removing old flags without leaving source references | Same |
| First action | **Try it with sample data** | Same |
| Next result | See an expired flag and its source references | Same |
| Three facts | Checkout install, no source upload, MIT license | Same |
| Visible without scrolling | Job, audience, action, next result, and all three facts | Same |
| Horizontal overflow | None | None |

The title names the job, and the first action opens sample output in one click. Copy uses plain words, has no mood headings or banned marketing words, and no sentence exceeds 22 words. The landing page and README consistently use **source reference** for an exact-key file-and-line match.

## Demo and data isolation

- `/?demo=1` and `/demo` show a persistent **Demo — sample data, nothing is saved** banner.
- The first demo view contains `checkout-v2`, expired `legacy-cart`, and `billing-surge-cap`. It shows both `legacy-cart` source references.
- The review marker changes visibly. **Reset demo** removes it, restores three flags, keeps keyboard focus on Reset, and announces **Demo reset to the original three flags.**
- Seeded `real:sentinel` local storage and `real:session` session storage values remained unchanged through entry, interaction, and reset.
- The demo created no cookies or browser-storage keys. All requests stayed on the product origin.
- The installed `flag-stale-guard demo` command used a temporary directory, printed its path and the same three flags, and did not alter the consumer directory.
- F-5-1 is the only failed demo requirement.

## Public claims

The clean checkout was `/tmp/fsg-review5-clean.NrGRwC` at `72dc901`. After `npm ci`, every exact command in `.factory/claims.json` ran separately.

| Claim ID | Result |
|---|---|
| `metadata-gate` | Pass |
| `literal-references` | Pass |
| `fail-closed-paths` | Pass |
| `expired-checklist` | Pass |
| `sample-removal-block` | Pass |
| `clear-removal-check` | Pass |
| `json-output` | Pass |
| `demo-sandbox` | Pass |
| `demo-reset` | Pass |
| `cli-demo-recording` | Pass |
| `local-source` | Pass |
| `website-private` | Pass |
| `github-action-gate` | Pass |
| `mit-license` | Pass |
| `checkout-install` | Pass |

Landing, demo, privacy, terms, README, action, and install copy were cross-checked against the claim manifest. No false, missing, incomplete, duplicate, or untested public claim was found. F-5-1 concerns a required sandbox transition that the product does not publicly claim to support, so the untested-claim count remains zero.

## Clean build and installed CLI

The following documented commands passed in the clean checkout:

```text
npm ci
npm test
npm run build
cargo build --release
cargo package
```

`npm test` passed 6 Rust unit tests, 5 Rust integration tests, 8 build-contract tests, and 29 Playwright tests. `npm run build` produced `dist/site/`. The production bundles are 12.28 kB JavaScript and 7.49 kB CSS before gzip, or 4.50 kB and 2.49 kB after gzip.

A separate consumer directory installed the CLI with `cargo install --path <clean-checkout> --root <isolated-root>`. Results:

| Path | Expected exit | Result |
|---|---:|---|
| `--help` and `--version` | 0 | Pass; helpful subcommands and version `0.1.0` |
| Human and JSON demo | 0 | Pass; three flags and temporary workspace |
| Future flag scan and JSON scan | 0 | Pass; tracked with one source reference |
| Removal with one source reference | 3 | Pass; blocked with file and line |
| Removal after deleting that reference | 0 | Pass; recovery reports no configured references |
| Expiry equal to 2026-09-06 | 0 | Pass; boundary remains tracked |
| Expiry one day earlier | 2 | Pass; expired with checklist |
| Unsupported adapter | 1 | Pass; actionable error |
| Empty flag list | 1 | Pass; actionable error |
| Malformed TOML | 1 | Pass; parse error |
| Missing config | 1 | Pass; actionable error |
| Unknown removal key | 1 | Pass; not-configured error |

No backend exists, so tenant isolation, backend restart persistence, health, and HTTP 429 behavior do not apply.

## Live site checks

- `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` return 200. A made-up route returns an expected HTTP 404 and renders **Page not found** with a home link.
- Every route has its own title, description, canonical URL, one H1, English language, header, navigation, main, footer, and image alt text.
- All discovered internal links, the terminal recording, and the external repository link returned 200.
- The root and demo passed `/opt/fleet/lib/verify-url.sh` with no console errors.
- Axe found zero violations of any severity on root, demo, privacy, terms, and the designed 404.
- Keyboard checks passed for the skip link, demo action, review action, Reset, route focus, Space activation, and focus retention.
- All phone links and buttons measured at least 44×44 CSS pixels. Every route reflowed at 200% text size without horizontal page overflow.
- With reduced motion, the hero animation is `none`; with motion allowed, the single 0.8-second entrance runs.
- Back restored the root to `scrollY=1665` with the H1 focused. Forward restored Privacy at the top with its H1 focused.
- The loaded demo still supports Reset and navigation to install steps while offline. The site makes no offline-install or update promise and registers no service worker.
- Live response headers include CSP, HSTS, `nosniff`, and strict-origin referrer policy. No third-party script, font, analytics, account, payment, cookie, or external request was present.
- Lighthouse 13.4.1 mobile scores: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.9 s, LCP 1.3 s, TBT 40 ms, CLS 0, total transfer 71 KiB.
- Privacy and Terms routes load directly, have distinct titles, and state the local search and runtime-safety limits in plain words. There is no stored personal data requiring a request workflow.

## Candidate and live identity

`e369bfe` is the last commit that changes product behavior. Later commits `b4721c0` and `72dc901` contain only evidence and review documentation. There is no product-file difference from `e369bfe` through `72dc901`.

The live JavaScript, CSS, hero image, social image, and terminal recording hashes exactly match the clean local build. The live product therefore matches implementation candidate `e369bfe`. A later report-only deployment timestamp does not change that candidate.

## Earlier finding dispositions

Every earlier review, polish report, verification report, and handoff was inspected. Each earlier finding was tested against the current live product and clean candidate.

| Earlier finding | Current evidence and disposition |
|---|---|
| F-1-1: untested Node 20 support | Fixed. No Node-version support claim remains. |
| F-1-2: untested ready-to-publish claim | Fixed. Copy says `cargo package` creates an archive; the command also succeeds. |
| F-1-3: **Start for real** returned to the hero | Fixed. **View install steps** opens `/#install` and focuses **Run it in a repository**. |
| F-1-4: Reset had no observable result | Fixed. Review state changes, Reset restores it, announces the reset, and retains focus. |
| F-1-5: long README sentence | Fixed. The introduction is split into short sentences. |
| F-1-6: four names for source references | Fixed. Site, README, recording, and CLI consistently use **source reference**. |
| F-1-7: unexplained first-screen CLI abbreviation | Fixed. The first screen says **command-line tool**. |
| F-1-8: unexplained ISO/TOML instruction | Fixed. It shows `YYYY-MM-DD` and says config file. |
| F-1-9: abstract runtime limit | Fixed. The page says it cannot identify exposed users or prove running behavior. |
| F-1-10: vague section heading | Fixed. The heading names expired flags and remaining references. |
| F-1-11: unexplained literal adapter | Fixed. README says **literal mode** and defines the exact-key search. |
| F-1-12: combined exit-zero result and warning | Fixed. The result and deletion instruction are separate. |
| F-1-13: missing deploy guidance | Fixed. README names `dist/site/` and Param Factory ownership. |
| F-2-1: Back lost scroll position | Fixed. Live Back restored `scrollY=1665` and H1 focus; Forward also restored state. |
| F-2-2: metaphorical 404 copy | Fixed. The live H1 is **Page not found**. |
| F-2-3: decorative image caption | Fixed. No `figcaption` is present; useful alt text remains. |
| F-2-4: unclear search description | Fixed. Description says it blocks removal while references remain. |
| F-3-1: no real CLI recording | Fixed. The self-hosted recording and transcript match packaged demo output. |
| F-3-2: checkout test did not install | Fixed. The claim test clones, installs, and runs the binary in isolated paths. The manual consumer install also passed. |
| Verification: missing paths failed open | Fixed. Human and JSON removal checks exit 1 without safe-removal output. |
| Verification: claim contract incomplete | Fixed. Fifteen unique claims have exactly one tagged observable test each. |
| Verification: live install command failed | Fixed. The documented checkout install succeeds in a clean consumer directory. |
| Verification: malformed metadata passed | Fixed. Malformed dates and blank owners make `--check` exit 2. |
| Verification: soft 404 and shared metadata | Fixed. Unknown routes return 404; route titles, descriptions, and canonicals differ. |
| Verification: 200% text overflow | Fixed. All live routes remain within the 390 px viewport at 200% text size. |

No earlier finding has regressed. F-5-1 is new and concerns leaving and re-entering the demo, which the existing reset and clean-context tests do not cover.

## Missed leverage

No AI feature is warranted. Expiry validation, exact-key search, and removal gating are deterministic safety checks. The product already provides JSON for automation and a GitHub Action for CI. No additional import, export, or sync step is clearly required by the brief.

## Required next step

Fix F-5-1 and add a claim or quality test that changes demo state, leaves demo mode, re-enters through client navigation, and confirms the original state. Re-run all 15 declared claim commands and the full suite before requesting another PASS review.
