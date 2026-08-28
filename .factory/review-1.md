# Adversarial first-read review 1 — Flag Stale Guard

Date: 2026-08-28

Work order: `flag-stale-guard-review-1`

Candidate: `44740de6e81b8bc28a0e100a0b1765bc033a102d`

Live URL: <https://flag-stale-guard.sociobot.in>

Verdict: **FAIL — 13 findings (4 medium, 9 minor); 0 blocking findings**

The product is clear, tryable, visually distinct, and operationally sound. It still cannot pass this review because PASS requires zero findings. The remaining defects are two unlisted public claims, an adoption CTA that returns visitors to the page they just left, missing deployment guidance, an unobservable reset action, and eight plain-language defects.

No product code was modified during this review.

## Findings

### Medium

#### F-1-1 — The documented Node 20 support claim is not listed or tested

- Exact quote/location: README, **Develop, test, and build** — “Requirements: Rust stable and Node 20+.”
- Verification: `.factory/claims.json` has no compatibility claim. The local run used Node `22.23.2`; none of the declared claim tests runs under Node 20.
- Impact: a contributor can rely on Node 20 compatibility without any sandbox result establishing it.
- Concrete fix: add a `supported-toolchains` entry to `.factory/claims.json` and a tagged clean-install/build/test job that runs on Node 20 and Rust stable. Alternatively, replace the sentence with the exact versions exercised by the release gate.

#### F-1-2 — “Ready-to-publish” is an unlisted packaging claim

- Exact quote/location: README, **Develop, test, and build** — “`cargo package` produces the ready-to-publish crate.”
- Verification: `cargo package` happens during the claim test setup, but no `.factory/claims.json` entry states or scopes the public “ready-to-publish” promise.
- Impact: the phrase promises publication readiness without declaring what readiness means or making that outcome independently selectable as a claim test.
- Concrete fix: either remove the adjective (“Run `cargo package` to create the crate archive.”) or add a `publishable-crate` claim whose tagged test checks `cargo package`, packaged contents, manifest metadata, license, README, and installation from the produced archive.

#### F-1-3 — “Start for real” returns to the landing hero instead of starting setup

- Exact quote/location: persistent `/demo` banner — “Start for real”.
- Verification: the link targets `/`; activating it renders “Find flags ready for removal” at the top of the landing page. The install commands remain several sections below.
- Impact: after the demo proves the value, the adoption action makes the visitor search for the next step. The label also does not name the result.
- Concrete fix: change the action to “View install steps”, give the install section a stable `id="install"`, and link to `/#install`. On navigation, focus the install heading.

#### F-1-13 — The README does not explain how deployment is handled

- Exact location: README, **Develop, test, and build**. It explains how to create `dist/site/` and says crate publishing is left to the factory, but it does not say how the website build is deployed.
- Impact: a maintainer can build both artifacts but cannot tell whether to publish the site, which directory is the deployable root, or whether deployment is intentionally external to this repository.
- Concrete fix: add a **Deploy** section: “`npm run build:site` creates the static site in `dist/site/`. Param Factory deploys that directory and publishes the crate; do not change DNS, billing, or hosting from this repository.”

### Minor

#### F-1-4 — “Reset demo” has no observable result

- Exact quote/location: persistent `/demo` banner — “Reset demo”.
- Verification: the implementation removes `demo:flag-stale-guard` and rerenders the same immutable sample. In a normal fresh session the key does not exist, the visitor cannot change any sample state, and activation produces no visible or announced confirmation. A seeded unrelated `real:sentinel` key remained untouched, so isolation itself is correct.
- Impact: a first-time visitor cannot confirm whether reset worked.
- Concrete fix: provide at least one local demo interaction whose state can be restored, then announce “Demo reset to the original three flags” in the live region. If the demo remains read-only, remove the misleading reset control and document why the CLI-specific demo does not need mutable browser state.

#### F-1-5 — One README sentence exceeds the 22-word cap and carries four jobs

- Exact quote/location: README introduction — “It reads static configuration, checks owner and expiry metadata, finds literal call sites in configured paths, prints a removal checklist after expiry, and blocks removal while references remain.” (28 words)
- Impact: the core explanation is the hardest sentence on the page to scan.
- Concrete rewrite: “It reads one config file and checks each flag’s owner and expiry date. It finds source references and blocks removal while any remain.”

#### F-1-6 — The same concept has four names

- Exact quotes/locations: landing — “call sites”, “live references”, “literal source references”, and “configured source references”; README repeats “literal call sites”, “source references”, and “configured literal references”.
- Impact: the visitor has to infer that every phrase means a file-and-line match for a flag key.
- Concrete fix: use **source reference** everywhere. Rewrite the hero outcome as “See an expired flag and its source references.” Define it once in the README as “a file and line containing the exact flag key.”

#### F-1-7 — The first-screen eyebrow uses an unexplained abbreviation

- Exact quote/location: landing first screen — “A local CLI for release flag cleanup”.
- Impact: “CLI” assumes command-line vocabulary before the visitor has seen a command.
- Concrete rewrite: “A command-line tool for release flag cleanup”.

#### F-1-8 — The first how-it-works step combines two unexplained formats

- Exact quote/location: landing, **How it works** — “Add an owner and ISO expiry in one TOML file.”
- Impact: “ISO expiry” and “TOML” require prior knowledge and do not show the accepted date shape.
- Concrete rewrite: “Add an owner and a `YYYY-MM-DD` expiry date to one config file.”

#### F-1-9 — The limits section ends in abstract jargon

- Exact quote/location: landing, **What Flag Stale Guard does not decide** — “It does not evaluate flags, target users, or prove runtime safety.”
- Impact: “evaluate flags” and “runtime safety” do not state the concrete limitation on first read.
- Concrete rewrite: “It cannot tell which users see a flag or prove what your code does when it runs.”

#### F-1-10 — A section heading does not explain its content out of context

- Exact quote/location: landing H2 — “Keep flag cleanup honest”.
- Impact: a screen-reader heading list does not reveal that the section covers config, source search, and removal checks.
- Concrete rewrite: “Find expired flags and remaining references”.

#### F-1-11 — The README introduces “literal adapter” before explaining it

- Exact quote/location: README, **Install and use** — “The default `literal` adapter looks for the exact flag key in text files.”
- Impact: “adapter” sounds like an integration the visitor must configure, although this release has only one matching mode.
- Concrete rewrite: “The default `literal` mode searches text files for the exact flag key.”

#### F-1-12 — The zero-exit explanation puts the result and warning in one sentence

- Exact quote/location: README, **Install and use** — “A zero exit means no configured literal references were found; still run your tests and review runtime behavior.”
- Impact: the semicolon joins the command result to a separate safety instruction and repeats the terminology defect in F-1-6.
- Concrete rewrite: “Exit 0 means the tool found no source references in the folders you listed. Run your tests and review the live behavior before deletion.”

## 1. Cold first screen

Fresh Chromium contexts loaded the production root before scrolling.

| Viewport | What it does | For whom | First action | Result |
|---|---|---|---|---|
| 390×844 | Finds release flags that are ready for removal without leaving source references | Maintainers removing old flags | “Try it with sample data” | PASS |
| 1440×900 | Same answer | Same audience | Same action | PASS |

The mobile fold contains the eyebrow, H1, audience sentence, primary action, adjacent outcome, and all three facts. The desktop fold contains the same material and the product-specific specimen art. No blocking first-read defect was found.

## 2. Copy audit

Method: lexical words were counted; punctuation-only marks were ignored, and hyphenated terms, paths, switches, and versions count as one word. Code blocks were excluded except complete user-facing sentences. Headings, labels, and actions are included even when they are fragments so the jargon and out-of-context checks are auditable.

### Landing page

| # | Copy | Words | Flag |
|---:|---|---:|---|
| 1 | A local CLI for release flag cleanup | 7 | F-1-7 |
| 2 | Find flags ready for removal | 5 | — |
| 3 | For maintainers who need to remove old flags without leaving live references behind. | 13 | F-1-6 |
| 4 | Try it with sample data | 5 | —; prescribed demo action |
| 5 | See an expired flag and its call sites. | 8 | F-1-6 |
| 6 | Runs in your repository. | 4 | — |
| 7 | Sends no source code away. | 5 | — |
| 8 | MIT licensed. | 2 | — |
| 9 | Specimen sheet 01 · inspect before removal | 6 | — |
| 10 | Sample scan | 2 | — |
| 11 | See the removal gate before install | 6 | — |
| 12 | Remove every live reference listed below. | 6 | F-1-6 |
| 13 | Exit 2: expired flags need attention. | 6 | — |
| 14 | How it works | 3 | — |
| 15 | Keep flag cleanup honest | 4 | F-1-10 |
| 16 | List each flag. | 3 | — |
| 17 | Add an owner and ISO expiry in one TOML file. | 10 | F-1-8 |
| 18 | Scan configured paths. | 3 | — |
| 19 | See literal source references for every known flag. | 8 | F-1-6 |
| 20 | Check before removal. | 3 | — |
| 21 | Get a checklist after expiry. | 5 | — |
| 22 | Block removal while references remain. | 5 | F-1-6 |
| 23 | Clear limits | 2 | — |
| 24 | What Flag Stale Guard does not decide | 7 | — |
| 25 | It finds configured source references. | 5 | F-1-6 |
| 26 | It does not evaluate flags, target users, or prove runtime safety. | 11 | F-1-9 |
| 27 | Review the checklist and your tests before deleting a flag. | 10 | — |
| 28 | Install from the repository | 4 | — |
| 29 | Run it in a repository | 5 | — |
| 30 | Read the repository on GitHub (opens another site) | 8 | — |
| 31 | Local checks for release flags that outlive their plan. | 9 | — |
| 32 | Built by Param Factory · v0.1.0 | 5 | — |

No landing item exceeds 22 words and no banned marketing word appears. Navigation labels are “Demo”, “How it works”, and “Privacy”; they are conventional link destinations rather than result actions. The demo controls are reviewed in F-1-3 and F-1-4.

### README

| # | Sentence | Words | Flag |
|---:|---|---:|---|
| 1 | Find release flags ready for removal. | 6 | — |
| 2 | It is for maintainers who need to clear old flags without missing live source references. | 15 | F-1-6 |
| 3 | Flag Stale Guard is a free, local Rust CLI. | 9 | —; covered by MIT, local-source, and no-payment claims |
| 4 | It reads static configuration, checks owner and expiry metadata, finds literal call sites in configured paths, prints a removal checklist after expiry, and blocks removal while references remain. | 28 | F-1-5, F-1-6 |
| 5 | It does not evaluate flags or prove runtime safety. | 9 | F-1-9 |
| 6 | Install the binary from a checkout: | 6 | — |
| 7 | Copy `examples/flag-stale-guard.toml` into your repository. | 5 | — |
| 8 | List each flag with a `key`, `owner`, and ISO `expires` date. | 11 | F-1-8 |
| 9 | Set `paths` to the source folders you want scanned. | 9 | — |
| 10 | The default `literal` adapter looks for the exact flag key in text files. | 13 | F-1-11 |
| 11 | Run a scan in human or JSON form: | 8 | —; appropriate technical output name |
| 12 | `--check` exits `2` when a flag is expired or has missing or invalid metadata. | 14 | — |
| 13 | Owners cannot be blank. | 4 | — |
| 14 | Expiry dates must use `YYYY-MM-DD`. | 5 | — |
| 15 | A missing or unreadable configured scan path is an error. | 10 | — |
| 16 | The CLI exits `1` instead of treating that path as clear. | 11 | F-1-7 terminology only; retained in technical instructions |
| 17 | Check a proposed deletion with: | 5 | — |
| 18 | It exits `3` while source references remain. | 7 | — |
| 19 | A zero exit means no configured literal references were found; still run your tests and review runtime behavior. | 18 | F-1-6, F-1-12 |
| 20 | The included composite action runs the same `--check` gate. | 9 | —; standard GitHub Actions term under its named section |
| 21 | It uses the Rust toolchain supplied by your workflow. | 9 | —; covered by `github-action-gate` |
| 22 | The command creates a temporary sample workspace and prints where it is. | 12 | —; covered by `demo-sandbox` |
| 23 | Nothing in your repository changes. | 5 | — |
| 24 | The website demo is at `/demo` and uses the same sample data. | 12 | —; covered by `sample-removal-block` and `demo-sandbox` |
| 25 | Requirements: Rust stable and Node 20+. | 6 | F-1-1 |
| 26 | `cargo package` produces the ready-to-publish crate. | 6 | F-1-2 |
| 27 | Publishing is intentionally left to the factory, so the docs use the working checkout install until a registry release exists. | 20 | — |
| 28 | The CLI does not send source code away. | 8 | — |
| 29 | The website has no analytics, account, or payment flow. | 9 | — |
| 30 | See the deployed `/privacy` and `/terms` pages. | 7 | — |
| 31 | Licensed under MIT. | 3 | — |

README headings were also checked: “Flag Stale Guard” (3), “Install and use” (3), “Use in GitHub Actions” (4), “Try the bundled demo” (4), “Develop, test, and build” (4), and “Privacy and license” (3). Each makes sense in a heading list.

## 3. Demo and sandbox

Result: **PASS with the two minor/medium control findings above; the demo itself is not blocking.**

- One click from the cold landing action opens `/demo`.
- The first demo viewport already shows three named flags, owners, expiry dates, the expired `legacy-cart` flag, and its two file-and-line references.
- The persistent banner reads “Demo — sample data, nothing is saved.” and contains Reset and exit actions.
- A fresh context had no cookies, localStorage, or sessionStorage after the normal demo flow.
- A seeded `demo:flag-stale-guard` key was removed by Reset. A seeded `real:sentinel` key was preserved. The demo did not read or change it.
- The loaded demo remained usable after the browser context was put offline. This is supporting sandbox evidence; the product does not make an offline-first claim.
- The CLI demo ran from a new `/tmp/fsg-review-cli.*` working directory with `cargo run --quiet --manifest-path /work/repo/Cargo.toml -- demo`. It exited 0, printed its separate temporary workspace, found three flags and the expected two `legacy-cart` references, and did not change the repository.

## 4. Claims

The repository was clean at the supplied base commit before dependency installation. Every exact command in `.factory/claims.json` was run independently and sequentially. All passed.

| Claim | Result | Observable evidence |
|---|---|---|
| `metadata-gate` | PASS | Expired, invalid-date, and blank-owner cases returned the promised statuses and exit 2. |
| `literal-references` | PASS | Only the in-scope exact key match was reported. |
| `fail-closed-paths` | PASS | Missing and non-UTF-8 configured paths exited 1 without safe-removal output. |
| `expired-checklist` | PASS | The expired flag printed the complete checklist. |
| `sample-removal-block` | PASS | CLI exited 3 and CLI/site showed the same two references. |
| `clear-removal-check` | PASS | A configured path without a key match exited 0. |
| `json-output` | PASS | Scan and removal output parsed with the documented fields. |
| `demo-sandbox` | PASS | CLI repository status and browser storage remained unchanged. |
| `local-source` | PASS | The packaged CLI completed under a socket/connect/sendto preload guard. |
| `website-private` | PASS | Same-origin-only requests, no cookies/storage, and no account/payment controls. |
| `github-action-gate` | PASS | The action command and expired/missing-path outcomes matched the CLI gate. |
| `mit-license` | PASS | Cargo metadata, LICENSE, and live fact all identify MIT. |
| `checkout-install` | PASS | The packaged checkout installed into an isolated root and returned version 0.1.0. |

The full `npm test` gate also passed: 6 Rust unit tests, 5 Rust CLI integration tests, 6 build-contract tests, and 24 Chromium tests. F-1-1 and F-1-2 are the only public sentences found without a corresponding claim entry.

## 5. Privacy and offline request evidence

- The landing-to-demo flow requested only the production document, hashed same-origin JS/CSS, and the same-origin hero image.
- There were no cross-origin requests, failed requests, page errors, cookies, or product-created browser-storage keys.
- The CSP restricts default, image, style, script, and connection sources to self.
- The packaged CLI no-network claim passed its syscall guard.
- No service worker or Cache Storage entry exists. No offline-reload claim is made.

## 6. History verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The current `.factory/handoff.md` and both independent verification reports were read. Earlier release defects were rechecked rather than accepted from their status labels.

| Earlier defect or limit | Live/code confirmation |
|---|---|
| Missing or unreadable scan paths failed open | Fixed: source validates paths; tagged claim passed for human/JSON missing paths and non-UTF-8 input. |
| Malformed dates and blank owners were accepted | Fixed: exact date parsing and trimmed owners are present; tagged claim passed. |
| Claims manifest had only two entries and the CLI privacy test observed only the browser | Core defect fixed: 13 tagged tests exist and the CLI privacy test runs the packaged binary under a network syscall guard. Claim inventory is still not complete for the two README claims in F-1-1 and F-1-2. |
| Registry install command did not work | Fixed: live and README copy use checkout installation; the tagged installation test passed. |
| Unknown routes were soft 404s; route metadata was stale | Fixed: unknown live URL returned 404 and rendered the designed page; titles, descriptions, canonicals, OG URLs, and Twitter metadata changed by route. |
| Social art was not 1200×630 | Fixed: live image measured 1200×630. |
| 200% text produced mobile overflow | Fixed: all public routes stayed within 390 px at a 34 px root font size. |
| Literal matching cannot prove runtime behavior | Still an accurately disclosed product limit, not a regression. |
| Crate is not on crates.io | Still accurately disclosed; checkout install is the working path. |

## 7. Structure, links, identity, and accessibility

Result: **PASS.**

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. A new unknown path returned a real 404 and the styled field-guide missing page.
- Every route had one H1, ordered headings, header/nav/main/footer landmarks, route-specific title/description/canonical/OG/Twitter data, and the skip link.
- The root title follows “Product — what it does” and is under 60 characters.
- The live social image is 1200×630, Apple icon is 180×180, SVG favicon loads, and `robots.txt`/`sitemap.xml` list the public routes.
- Back navigation restored `/demo` and focused its H1. Client route changes also focused the new H1.
- Every discovered internal link, fragment, and the external GitHub link resolved. No dead link was found.
- Independent axe 4.10.2 runs on five routes at 1440×900 and 390×844 found zero serious/critical violations. No target was below 44×44 px. Normal and 200% text layouts had no horizontal overflow. Reduced-motion contexts had no running animation.
- `/opt/fleet/lib/verify-url.sh` passed for the production root and demo with no unexpected console/page errors. The browser reports the expected failed-document diagnostic when deliberately opening the HTTP 404.
- The botanical specimen-sheet art, paper palette, serif display type, status labels, square-edged controls, and field-guide 404 form a distinct product identity rather than a generic SaaS template. Asset provenance is recorded in `.factory/design.md`.
- Fresh `npm run build:site` output matched production SHA-256 for root HTML, hashed JavaScript, and hashed CSS. Initial JavaScript is 8,988 bytes raw; CSS is 6,135 bytes raw; hero art is 61,400 bytes.

## 8. Missed leverage

No missing AI, import/export, or sync feature is a finding in this round. The job is deterministic repository inspection; runtime AI would add privacy and correctness risk without improving the stated gate. The included GitHub Action is the expected automation path. `.factory/brief.json` is absent, so no additional brief-specific integration could be verified.

## What would make this perfect

Resolve F-1-1 through F-1-13, rerun every claim command from a clean checkout, and repeat the cold mobile/desktop, demo-isolation, copy, route, link, and accessibility checks. A subsequent round can return PASS only if the claim inventory contains every remaining public promise, deployment ownership is documented, and the copy audit has no jargon, term drift, overlong sentence, vague heading, or ambiguous action left.
