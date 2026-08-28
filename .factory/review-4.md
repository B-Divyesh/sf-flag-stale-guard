# Adversarial first-read review 4 — Flag Stale Guard

Date: 2026-08-28
Work order: `flag-stale-guard-review-4`
Candidate: `b4721c0767281ff426b8092b7a7e4b3e78e2ba3e`
Live URL: <https://flag-stale-guard.sociobot.in>

## Verdict

**PASS — zero findings.**

This review repeated the cold-read, demo, claims, privacy, history, route, copy, link, accessibility, and CLI checks. The product is clear on a 390 px phone and desktop, the real CLI has a safe bundled demo, and the website demo is isolated. No prior finding remains unfixed. No unlisted end-user claim was found.

No product code was modified during this review.

## 1. Cold first screen

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 before scrolling or inspecting source.

| Viewport | What it does | For whom | What to click first | Result |
|---|---|---|---|---|
| 390×844 | Finds release flags ready for removal. | Maintainers removing old flags without source references. | **Try it with sample data**. | Pass |
| 1440×900 | Same. | Same. | **Try it with sample data**. | Pass |

The phone fold contains the exact headline, audience sentence, primary action, immediate result (“See an expired flag and its source references.”), and three concise facts. It has no horizontal overflow (390 px document width at a 390 px viewport). The desktop view has the same content plus the distinct field-guide artwork. There were no console errors.

## 2. Copy audit

Method: lexical words were counted; punctuation-only marks were ignored. Headings, actions, labels, and accessible image text are included so the audit also checks out-of-context headings and buttons. Commands and structured CLI output are excluded unless they contain a reader-facing sentence.

### Landing page

| Copy | Words | Review |
|---|---:|---|
| Flag Stale Guard | 3 | Clear wordmark. |
| Demo | 1 | Destination-naming link. |
| How it works | 3 | Destination-naming link. |
| Privacy | 1 | Destination-naming link. |
| A command-line tool for release flag cleanup | 7 | Clear audience context. |
| Find flags ready for removal | 5 | Clear H1. |
| For maintainers who need to remove old flags without leaving source references behind. | 13 | Clear audience and outcome. |
| Try it with sample data | 5 | Required result-naming demo action. |
| See an expired flag and its source references. | 8 | States the click result. |
| Runs from a repository checkout. | 5 | Covered by `checkout-install`. |
| Sends no source code away. | 5 | Covered by `local-source`. |
| MIT licensed. | 2 | Covered by `mit-license`. |
| Pressed green and dried red leaves on a field-guide page, representing active and expired flags. | 15 | Useful image alt text. |
| Terminal recording | 2 | Names the section. |
| See the actual CLI demo | 5 | Names the section result. |
| Download terminal recording | 3 | Result-naming download action. |
| Recorded from the shipped `flag-stale-guard demo` command. | 6 | Covered by `cli-demo-recording`. |
| Each run uses its own temporary workspace. | 7 | Covered by `cli-demo-recording` and `demo-sandbox`. |
| Read the full terminal transcript | 5 | Result-naming disclosure control. |
| Sample data only; nothing in your repository changed. | 8 | Covered by `demo-sandbox`. |
| Confirm the flag’s rollout is complete. | 6 | Useful checklist instruction. |
| Remove every source reference listed below. | 6 | Useful checklist instruction. |
| Delete the flag from its provider after code cleanup. | 9 | Useful checklist instruction. |
| Run the test suite before release. | 6 | Useful checklist instruction. |
| How it works | 3 | Names the process section. |
| Find expired flags and remaining references | 6 | Clear H2. |
| List each flag. | 3 | Imperative step. |
| Add an owner and a `YYYY-MM-DD` expiry date to one config file. | 11 | Concrete instruction. |
| Scan configured paths. | 3 | Imperative step. |
| See source references for every known flag. | 7 | Concrete result. |
| Check before removal. | 3 | Imperative step. |
| Get a checklist after expiry. | 5 | Concrete result. |
| Block removal while source references remain. | 6 | Covered by `sample-removal-block`. |
| Clear limits | 2 | Names the limitation section. |
| What Flag Stale Guard does not decide | 7 | Clear H2. |
| It finds configured source references. | 5 | Covered by `literal-references`. |
| It cannot tell which users see a flag or prove what your code does when it runs. | 17 | Concrete limitation. |
| Review the checklist and your tests before deleting a flag. | 10 | Concrete safety instruction. |
| Install from the repository | 4 | Names the install section. |
| Run it in a repository | 5 | Clear H2. |
| Read the repository on GitHub (opens another site) | 8 | Result and external destination are named. |
| Local checks for configured release flags. | 6 | Accurate footer one-liner. |
| Built by Param Factory · v0.1.0 | 5 | Attribution and build identifier. |

The structured terminal transcript also presents the command, a temporary workspace, three named flags, owners, ISO expiry dates, literal mode, each source-reference count, the two `legacy-cart` file-and-line references, and the four-item removal checklist. It is a faithful machine-output transcript, not marketing copy. Its text is covered by `cli-demo-recording`.

### README

| Copy | Words | Review |
|---|---:|---|
| Flag Stale Guard | 3 | Clear name. |
| Find release flags ready for removal. | 6 | Clear job statement. |
| It is for maintainers who need to clear old flags without missing source references. | 14 | Clear audience. |
| Flag Stale Guard is a free, local Rust command-line tool. | 10 | Accurate product description. |
| It reads one config file and checks each flag’s owner and expiry date. | 13 | `metadata-gate`. |
| It finds source references and blocks removal while any remain. | 10 | `literal-references` / `sample-removal-block`. |
| It prints a removal checklist after expiry. | 7 | `expired-checklist`. |
| It cannot tell which users see a flag or prove what your code does when it runs. | 17 | Clear limitation. |
| Install and use | 3 | Clear heading. |
| Install the binary from a checkout: | 6 | Clear instruction heading. |
| Copy `examples/flag-stale-guard.toml` into your repository. | 5 | Concrete instruction. |
| List each flag with a `key`, `owner`, and `YYYY-MM-DD` `expires` date. | 11 | Concrete instruction. |
| Set `paths` to the source folders you want scanned. | 9 | Concrete instruction. |
| The default `literal` mode searches text files for the exact flag key. | 12 | `literal-references`. |
| A source reference is a file and line containing that key. | 11 | Consistent definition. |
| Run a scan in human or JSON form: | 8 | Clear instruction heading. |
| `--check` exits `2` when a flag is expired or has missing or invalid metadata. | 14 | `metadata-gate`. |
| Owners cannot be blank. | 4 | `metadata-gate`. |
| Expiry dates must use `YYYY-MM-DD`. | 5 | `metadata-gate`. |
| A missing or unreadable configured scan path is an error. | 10 | `fail-closed-paths`. |
| The CLI exits `1` instead of treating that path as clear. | 11 | `fail-closed-paths`. |
| Check a proposed deletion with: | 5 | Clear instruction heading. |
| It exits `3` while source references remain. | 7 | `sample-removal-block`. |
| Exit `0` means the tool found no source references in the folders you listed. | 14 | `clear-removal-check`. |
| Run your tests and review the live behavior before deletion. | 10 | Concrete safety instruction. |
| Use in GitHub Actions | 4 | Clear heading. |
| The included composite action runs the same `--check` gate. | 9 | `github-action-gate`. |
| It uses the Rust toolchain supplied by your workflow. | 9 | Concrete usage detail. |
| Try the bundled demo | 4 | Clear heading. |
| The command creates a temporary sample workspace and prints where it is. | 12 | `demo-sandbox`. |
| Nothing in your repository changes. | 5 | `demo-sandbox`. |
| The landing page has a self-hosted terminal recording and transcript of this command. | 13 | `cli-demo-recording`. |
| The website demo is at `/?demo=1` and uses the same sample data. | 12 | `sample-removal-block`. |
| It keeps its review state in memory and Reset demo restores the original three flags. | 15 | `demo-sandbox` / `demo-reset`. |
| Develop, test, and build | 4 | Clear heading. |
| Run `cargo package` to create the crate archive. | 8 | Factual maintainer instruction. |
| Publishing is intentionally left to the factory, so the docs use the working checkout install until a registry release exists. | 20 | Scoped deployment instruction. |
| Deploy | 1 | Clear heading. |
| `npm run build:site` creates the static site in `dist/site/`. | 9 | Build instruction. |
| Param Factory deploys that directory and publishes the crate. | 9 | Scope clarification. |
| Do not change DNS, billing, or hosting from this repository. | 10 | Scope clarification. |
| Privacy and license | 3 | Clear heading. |
| The CLI does not send source code away. | 8 | `local-source`. |
| The website has no analytics, account, or payment flow. | 9 | `website-private`. |
| See the deployed `/privacy` and `/terms` pages. | 7 | Clear destination instruction. |
| Licensed under MIT. | 3 | `mit-license`. |

No landing or README item exceeds 22 words, uses a banned marketing adjective, uses a metaphor/mood heading, or changes the term **source reference**. All buttons and links name their result. No claim-like user-facing statement lacks a corresponding claim entry and observable test.

## 3. Demo and sandbox

Result: **pass.**

- The first-screen action opens `/?demo=1` in one click. The direct `/demo` route also works.
- The first demo screen immediately shows the banner **“Demo — sample data, nothing is saved.”**, all three realistic flags, expired `legacy-cart`, and its two file-and-line source references.
- **Reset demo** restores the changed review marker and announces “Demo reset to the original three flags.”
- A live test seeded `real:sentinel` in localStorage and `real:session` in sessionStorage. Both remained untouched; the demo added no storage or cookie. Its review state is in memory only.
- Live request logs contained only the product origin. The demo requested its document plus same-origin JavaScript and CSS; the landing additionally requested same-origin artwork and recording assets.
- From a separate temporary directory, `cargo run --manifest-path <clean-clone>/Cargo.toml -- demo` printed a separate `/tmp/flag-stale-guard-demo-*` workspace, three flags, the expired checklist, and the two `legacy-cart` references. The clean clone remained unmodified.

## 4. Claims

`.factory/claims.json` has 15 entries. A fresh local clone at the candidate commit was created in `/tmp/fsg-review4-clean.NyjBsr`, followed by `npm ci`. Every exact command declared by the manifest was run separately, then the complete suite was run. All passed.

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

`npm test` also passed: 6 Rust unit tests, 5 Rust integration tests, 8 build-contract tests, and 29 Playwright tests. The clean clone finished without tracked-file changes.

## 5. Earlier findings and verification history

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, verification report, and handoff was read. Findings were checked against the live product and current code rather than accepted from their marked status.

| Earlier finding | Live and code result |
|---|---|
| F-1-1 to F-1-2 | Fixed: no untested Node-support or publication-readiness promise remains. |
| F-1-3 | Fixed: **View install steps** routes to `/#install` and focuses the install heading. |
| F-1-4 | Fixed: an in-memory review interaction is visible; reset restores it and announces the result. |
| F-1-5 | Fixed: the former long README sentence is split. |
| F-1-6 | Fixed: website, README, recording, and human CLI output consistently say **source reference**. |
| F-1-7 to F-1-13 | Fixed: command-line wording, explicit date/config instruction, concrete limitations, explanatory headings, literal-mode explanation, clear exit guidance, and deployment ownership are present. |
| F-2-1 | Fixed: live Back restored the root route to `scrollY` 1665 and focused its H1; Forward restores the destination route. |
| F-2-2 to F-2-4 | Fixed: the HTTP 404 says “Page not found,” the decorative caption is absent, and sharing/search copy says “block removal.” |
| F-3-1 | Fixed: the landing page includes a self-hosted SVG recording, download, and tested transcript of the real `flag-stale-guard demo`. |
| F-3-2 | Fixed: the tagged checkout claim clones a checkout, runs `cargo install --path .` into an isolated root, runs the installed binary and demo, and confirms the clone stays clean. |
| Earlier verifier defects | Fixed: paths fail closed, malformed dates and blank owners fail the gate, the working checkout install is documented, unknown routes return actual 404, metadata is per route, social art is 1200×630, and 200% mobile text reflows without overflow. |

## 6. Structure, links, privacy, accessibility, and identity

- Live `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` returned HTTP 200. A deliberately missing route returned HTTP 404 and rendered the designed error page. All discovered internal links, the recording asset, artwork, and the external repository link returned 200.
- Route titles, descriptions, canonicals, Open Graph/Twitter descriptions, favicons, Apple icon, robots file, sitemap, skip link, header/footer, and one H1 per route were confirmed. The root title is **“Flag Stale Guard — find flags ready for removal.”**
- Live route changes focus the H1 and announce it. Back restored the saved scroll/focus entry. The direct demo URL canonicalizes to `/demo`.
- Live axe 4.10.2 checks on root, demo, privacy, and terms found zero serious or critical issues. The live CSP correctly blocks arbitrary inline script; axe was injected in a `bypassCSP` review context only.
- There are no live console errors, third-party requests, cookies, demo storage, accounts, payment controls, analytics controls, or remote font/script loads. The CSP, `nosniff`, HSTS, and referrer policy were present in live headers.
- The warm paper palette, ink rules, serif field-guide display type, pressed-leaf artwork, and square specimen-label controls match `.factory/design.md` and are recognizably product-specific rather than a generic SaaS template.

## 7. Missed leverage

No additional AI feature is expected. The core jobs—expiry validation, exact-key source scanning, and removal gating—are deterministic safety checks; generated advice would not strengthen them. The CLI supplies structured JSON for automation and a composite GitHub Action for CI. There is no `.factory/brief.json` in this repository to imply an additional product requirement.

## What would make this perfect

Nothing is currently required. Preserve the current direct demo, claim-to-test mapping, live route/focus checks, and checkout-install test as the product evolves; any new promise should receive an observable claim test before it is published.
