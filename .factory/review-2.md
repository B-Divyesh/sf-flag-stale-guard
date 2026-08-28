# Adversarial first-read review 2 — Flag Stale Guard

Date: 2026-08-28

Work order: `flag-stale-guard-review-2`

Candidate: `b207aa95c8473d8533e65ca5c615a17d1ac41aac`

Live URL: <https://flag-stale-guard.sociobot.in>

Verdict: **FAIL — 5 findings (2 blocking, 1 medium, 2 minor)**

The first screen, demo, declared claims, accessibility baseline, link crawl, and core CLI behavior pass. The candidate cannot pass because a prior terminology finding remains in the CLI and browser history does not restore scroll position. Three copy defects also remain. PASS requires zero findings.

No product code was modified during this review.

## Findings

### Blocking

#### F-1-6 — The prior source-reference terminology finding is only half-fixed

- Exact quote/location: CLI `demo` output and `src/main.rs:325` — “live references: 2”; successful `remove-check` output at `src/main.rs:116` — “no live references were found in configured paths.”
- Prior requirement: review 1 required **source reference** everywhere because the same file-and-line match had four names. The live landing page, website demo, and README now use “source reference,” but the shipped command-line interface still uses “live references.”
- Verification: `cargo run --quiet --manifest-path /work/repo/Cargo.toml -- demo` from `/tmp/fsg-review2-cli.M2ujTs` printed “live references” for all three sample flags. Source inspection found the same wording in scan and removal output. The repository remained unchanged.
- Why this fails: a visitor moving from the website demo to the CLI must infer that “live reference” and “source reference” are the same result. Step 6 requires any half-fixed earlier finding to return as BLOCKING with the same ID.
- Concrete fix: change every human-readable CLI result to **source reference**, including “source references: 2,” “2 source reference(s) remain,” and “no source references were found in configured paths.” Update the tagged assertions and search the website, README, help, and CLI output for term drift.

#### F-2-1 — Browser Back loses the landing-page position

- Exact behavior/location: live SPA history handling in `src/site.js:76`. From `/`, the page was scrolled to `1665px`; opening Privacy and pressing Back returned to `/` at `0px` instead of `1665px`.
- What works: Back restores the correct URL and focuses “Find flags ready for removal.” Client route changes also focus the new H1.
- Why this fails: a visitor who follows a route after reading part of the landing page is returned to the top and must find their place again. The routing contract requires back/forward navigation to restore scroll and focus; broken history behavior is BLOCKING.
- Concrete fix: save scroll position and focused element in each history entry before `pushState`. On `popstate`, render the route, then restore its saved focus and scroll. Add a Playwright test that scrolls `/`, opens Privacy, presses Back and Forward, and asserts both entries.

### Medium

#### F-2-2 — The 404 uses field-guide metaphor instead of naming the error

- Exact quote/location: live 404 H1 — “This field guide page is missing”; return link — “Return to the flag inventory guide.”
- Why this fails: “field guide” and “flag inventory guide” are theme language, not route names. The home page is not named the flag inventory guide. A person scanning the H1 must translate the metaphor before learning that the page was not found.
- Concrete rewrite: H1 **“Page not found”**; body **“The page may have moved, or the address may be wrong.”**; link **“Return to Flag Stale Guard home.”** Keep the botanical identity in the visual treatment rather than the navigation copy.

### Minor

#### F-2-3 — The hero caption is decorative specimen lore

- Exact quote/location: landing illustration caption — “Specimen sheet 01 · inspect before removal”.
- Why this fails: “Specimen sheet 01” is an invented label and gives the visitor no usable information. The adjacent first screen states the inspection job, and the alt text explains the image.
- Concrete fix: remove the caption. If a visible caption is required, use **“Active and expired flags marked for inspection.”**

#### F-2-4 — The search description has an unclear pronoun

- Exact quote/location: root meta, Open Graph, and Twitter description — “Find release flags ready for removal and block it while source references remain.”
- Why this fails: “it” can refer to the flag rather than removal. This is the sentence a first-time visitor may see in a search or shared link.
- Concrete rewrite: **“Find expired release flags and block removal while source references remain.”** Apply it to the root meta, Open Graph, and Twitter descriptions.

## 1. Cold first screen

Fresh Chromium contexts loaded production at 390×844 and 1440×900 with no prior site storage. These observations were recorded before scrolling.

| Question | Mobile and desktop answer | Result |
|---|---|---|
| What does this do? | “Find flags ready for removal.” | PASS |
| For whom? | Maintainers removing old flags without leaving source references. | PASS |
| What should I click first? | “Try it with sample data.” | PASS |

The action is visible before scrolling at both sizes. The adjacent sentence says it will show an expired flag and its source references. Mobile also shows all three short facts before the fold. There were no console errors or horizontal overflow.

## 2. Copy audit

Method: punctuation-only marks are ignored. Hyphenated terms, paths, switches, and versions count as one word. Code commands are excluded unless they contain a user-facing sentence. Headings, labels, captions, and actions are included.

### Landing page

| # | Text | Words | Flag |
|---:|---|---:|---|
| 1 | A command-line tool for release flag cleanup | 7 | — |
| 2 | Find flags ready for removal | 5 | — |
| 3 | For maintainers who need to remove old flags without leaving source references behind. | 13 | — |
| 4 | Try it with sample data | 5 | —; required sample action |
| 5 | See an expired flag and its source references. | 8 | — |
| 6 | Runs from a repository checkout. | 5 | — |
| 7 | Sends no source code away. | 5 | — |
| 8 | MIT licensed. | 2 | — |
| 9 | Pressed green and dried red leaves on a field-guide page, representing active and expired flags. | 15 | —; image alt text |
| 10 | Specimen sheet 01 · inspect before removal | 6 | F-2-3 |
| 11 | Sample scan | 2 | — |
| 12 | See the removal gate before install | 6 | — |
| 13 | Remove every source reference listed below. | 6 | — |
| 14 | Exit 2: expired flags need attention. | 6 | — |
| 15 | How it works | 3 | — |
| 16 | Find expired flags and remaining references | 6 | — |
| 17 | List each flag. | 3 | — |
| 18 | Add an owner and a `YYYY-MM-DD` expiry date to one config file. | 11 | — |
| 19 | Scan configured paths. | 3 | — |
| 20 | See source references for every known flag. | 7 | — |
| 21 | Check before removal. | 3 | — |
| 22 | Get a checklist after expiry. | 5 | — |
| 23 | Block removal while source references remain. | 6 | — |
| 24 | Clear limits | 2 | — |
| 25 | What Flag Stale Guard does not decide | 7 | — |
| 26 | It finds configured source references. | 5 | — |
| 27 | It cannot tell which users see a flag or prove what your code does when it runs. | 17 | — |
| 28 | Review the checklist and your tests before deleting a flag. | 10 | — |
| 29 | Install from the repository | 4 | — |
| 30 | Run it in a repository | 5 | — |
| 31 | Read the repository on GitHub (opens another site) | 8 | — |
| 32 | Local checks for configured release flags. | 6 | — |
| 33 | Built by Param Factory · v0.1.0 | 5 | — |
| 34 | Find release flags ready for removal and block it while source references remain. | 13 | F-2-4; root sharing/search description |

No visible landing sentence exceeds 22 words or contains a banned marketing adjective. The primary action is the prescribed demo action. Navigation links name destinations, and the repository link names its result and external destination.

### README

| # | Sentence or heading | Words | Flag |
|---:|---|---:|---|
| 1 | Flag Stale Guard | 3 | — |
| 2 | Find release flags ready for removal. | 6 | — |
| 3 | It is for maintainers who need to clear old flags without missing source references. | 14 | — |
| 4 | Flag Stale Guard is a free, local Rust command-line tool. | 10 | — |
| 5 | It reads one config file and checks each flag’s owner and expiry date. | 13 | — |
| 6 | It finds source references and blocks removal while any remain. | 10 | — |
| 7 | It prints a removal checklist after expiry. | 7 | — |
| 8 | It cannot tell which users see a flag or prove what your code does when it runs. | 17 | — |
| 9 | Install and use | 3 | — |
| 10 | Install the binary from a checkout: | 6 | — |
| 11 | Copy `examples/flag-stale-guard.toml` into your repository. | 5 | — |
| 12 | List each flag with a `key`, `owner`, and `YYYY-MM-DD` `expires` date. | 11 | — |
| 13 | Set `paths` to the source folders you want scanned. | 9 | — |
| 14 | The default `literal` mode searches text files for the exact flag key. | 12 | — |
| 15 | Run a scan in human or JSON form: | 8 | —; technical output names |
| 16 | `--check` exits `2` when a flag is expired or has missing or invalid metadata. | 14 | — |
| 17 | Owners cannot be blank. | 4 | — |
| 18 | Expiry dates must use `YYYY-MM-DD`. | 5 | — |
| 19 | A missing or unreadable configured scan path is an error. | 10 | — |
| 20 | The CLI exits `1` instead of treating that path as clear. | 11 | —; standard command-line term |
| 21 | Check a proposed deletion with: | 5 | — |
| 22 | It exits `3` while source references remain. | 7 | — |
| 23 | Exit `0` means the tool found no source references in the folders you listed. | 14 | — |
| 24 | Run your tests and review the live behavior before deletion. | 10 | — |
| 25 | Use in GitHub Actions | 4 | — |
| 26 | The included composite action runs the same `--check` gate. | 9 | —; standard term in this section |
| 27 | It uses the Rust toolchain supplied by your workflow. | 9 | — |
| 28 | Try the bundled demo | 4 | — |
| 29 | The command creates a temporary sample workspace and prints where it is. | 12 | — |
| 30 | Nothing in your repository changes. | 5 | — |
| 31 | The website demo is at `/?demo=1` and uses the same sample data. | 12 | — |
| 32 | It keeps its review state in memory and Reset demo restores the original three flags. | 15 | — |
| 33 | Develop, test, and build | 4 | — |
| 34 | Run `cargo package` to create the crate archive. | 8 | — |
| 35 | Publishing is intentionally left to the factory, so the docs use the working checkout install until a registry release exists. | 20 | — |
| 36 | Deploy | 1 | — |
| 37 | `npm run build:site` creates the static site in `dist/site/`. | 9 | — |
| 38 | Param Factory deploys that directory and publishes the crate. | 9 | — |
| 39 | Do not change DNS, billing, or hosting from this repository. | 10 | — |
| 40 | Privacy and license | 3 | — |
| 41 | The CLI does not send source code away. | 8 | — |
| 42 | The website has no analytics, account, or payment flow. | 9 | — |
| 43 | See the deployed `/privacy` and `/terms` pages. | 7 | — |
| 44 | Licensed under MIT. | 3 | — |

No README sentence exceeds 22 words, contains a banned marketing adjective, or uses a mood heading. The README consistently uses **source reference**; F-1-6 appears in the CLI reached from these instructions.

## 3. Demo and sandbox

Result: **PASS.**

- One click on **Try it with sample data** opens `/?demo=1`.
- The first 390×844 screen shows the persistent banner, product H1, expired-removal explanation, “Flag inventory,” and the first realistic flag card. The page contains all three named flags and blocked `legacy-cart` with two file-and-line references.
- The banner reads “Demo — sample data, nothing is saved.” and includes **Reset demo** and **View install steps**.
- Marking the first source reference changes the button and shows “Reviewed in this demo.” Reset removes that state and announces “Demo reset to the original three flags.”
- Seeded `real:sentinel` localStorage and `real:session` sessionStorage values were unchanged. The demo created no cookies or storage entries.
- The observed request set contained only the root document, same-origin hashed JavaScript/CSS, and same-origin hero image. There were no cross-origin or failed requests.
- The CLI demo ran from `/tmp/fsg-review2-cli.M2ujTs`, created `/tmp/flag-stale-guard-demo-946`, printed its location, exited 0, and left the repository clean. Its terminology defect is F-1-6; isolation passes.

## 4. Claims

The repository was cloned without local modifications to `/tmp/fsg-review2-clean.B78d8Z` at `b207aa9`. After `npm ci`, every exact `.factory/claims.json` command ran separately. All passed and the clone remained clean.

| Claim ID | Exact command | Result |
|---|---|---|
| `metadata-gate` | `npm test -- --grep @claim:metadata-gate` | PASS |
| `literal-references` | `npm test -- --grep @claim:literal-references` | PASS |
| `fail-closed-paths` | `npm test -- --grep @claim:fail-closed-paths` | PASS |
| `expired-checklist` | `npm test -- --grep @claim:expired-checklist` | PASS |
| `sample-removal-block` | `npm test -- --grep @claim:sample-removal-block` | PASS |
| `clear-removal-check` | `npm test -- --grep @claim:clear-removal-check` | PASS |
| `json-output` | `npm test -- --grep @claim:json-output` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `local-source` | `npm test -- --grep @claim:local-source` | PASS |
| `website-private` | `npm test -- --grep @claim:website-private` | PASS |
| `github-action-gate` | `npm test -- --grep @claim:github-action-gate` | PASS |
| `mit-license` | `npm test -- --grep @claim:mit-license` | PASS |
| `checkout-install` | `npm test -- --grep @claim:checkout-install` | PASS |

No unlisted end-user claim was found on the live landing page or in README. Installation, metadata, matching, exit codes, checklist, JSON, action, demo, privacy, licensing, and checkout behavior map to declared entries. Build/deploy commands are maintainer instructions exercised by the build-contract suite, not end-user capability promises.

## 5. History verification

Every earlier review, polish report, verification report, and handoff was read. Status labels were not accepted as evidence.

| Earlier finding | Live and code result |
|---|---|
| F-1-1 — untested Node 20 support | Fixed. README has no Node-version promise. |
| F-1-2 — “ready-to-publish” claim | Fixed. README says only that `cargo package` creates the archive. |
| F-1-3 — “Start for real” returns to hero | Fixed. **View install steps** opens `/#install` and focuses the install H2. |
| F-1-4 — Reset has no observable result | Fixed. State changes, Reset restores it, and a live region announces it. |
| F-1-5 — 28-word README sentence | Fixed. The explanation is split into sentences of 13 words or fewer. |
| F-1-6 — four terms for source references | **Half-fixed and BLOCKING again.** Website and README use “source reference”; CLI uses “live references.” |
| F-1-7 — unexplained first-screen “CLI” | Fixed. The eyebrow says “command-line tool.” |
| F-1-8 — unexplained ISO/TOML sentence | Fixed. The step shows `YYYY-MM-DD` and says “config file.” |
| F-1-9 — abstract runtime-limit sentence | Fixed. The limit names users and code behavior directly. |
| F-1-10 — vague cleanup heading | Fixed. H2 is “Find expired flags and remaining references.” |
| F-1-11 — unexplained “literal adapter” | Fixed. README uses “literal mode” and explains exact-key search. |
| F-1-12 — combined exit-0 sentence | Fixed. Result and safety instruction are separate and use “source references.” |
| F-1-13 — deployment guidance absent | Fixed. README names `dist/site/` and Param Factory ownership. |

Earlier verifier defects are fixed: missing and non-UTF-8 paths fail closed; malformed dates and blank owners fail the gate; checkout installation works; unknown live routes return 404; per-route metadata updates; social art is 1200×630; and 200% mobile text has no horizontal overflow.

## 6. Structure, links, identity, and accessibility

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/definitely-missing-review-2` returns 404 and renders the product-styled page.
- Each route has one H1, ordered headings, `lang="en"`, header/nav/main/footer landmarks, route-specific title, description, canonical, Open Graph, and Twitter data.
- The root title is “Flag Stale Guard — find flags ready for removal” and follows the pattern. F-2-4 covers its description.
- SVG favicon, 180×180 Apple icon, 1200×630 social art, `robots.txt`, `sitemap.xml`, and the static 404 policy are live.
- Every discovered route, asset, fragment destination, and external GitHub repository returned 200; the deliberate missing route returned 404.
- Route changes focus their H1, and demo exit focuses the install H2. F-2-1 covers Back/Forward scroll restoration.
- Live axe checks on five routes at 390×844 and 1440×900 found zero WCAG A/AA violations. No target was below 44×44 px. Reduced-motion contexts had no running animation. Every route stayed within 390px at 200% text.
- `/opt/fleet/lib/verify-url.sh` passed root and `/?demo=1` with correct title/lang/H1/main/alt/button labels and no console errors.
- The botanical palette, pressed-leaf art, serif display type, specimen rules, and square-edged controls are distinct from a generic SaaS template. F-2-2 and F-2-3 concern metaphor copy, not visual identity.
- `npm run build` produced `dist/site/`. Checked files matched live SHA-256 hashes. Initial JavaScript is 10,076 bytes raw / 3,782 bytes gzip; CSS is 6,489 bytes raw / 2,317 bytes gzip.

## 7. Missed leverage

No missing AI, import/export, or sync feature is a finding. Repository scanning and expiry validation are deterministic; generated advice would weaken a safety gate. JSON output and the GitHub Action provide the expected export and automation paths. `.factory/brief.json` is absent, so no brief-only feature can be evaluated.

## What would make this perfect

1. Resolve F-1-6 throughout human-readable CLI output and tests.
2. Preserve scroll and focus state across Back and Forward, with a browser regression test.
3. Replace the 404 metaphor, remove or rewrite the specimen caption, and clarify the root sharing description.
4. Rerun every claim from a clean clone and the full live checklist. PASS requires all changes and zero findings.
