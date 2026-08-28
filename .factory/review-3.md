# Adversarial first-read review 3 — Flag Stale Guard

Date: 2026-08-28
Work order: `flag-stale-guard-review-3`
Candidate: `44b2e0b79efb01450d5baf932518c36145ae87b1`
Live URL: <https://flag-stale-guard.sociobot.in>

## Verdict

**FAIL — 2 findings (1 blocking, 1 medium).**

The first screen is clear, the website sample is isolated, the CLI works from a checkout, and all declared claim commands pass. This cannot pass while the CLI lacks the required self-hosted recording of the real command, and while the checkout-install claim's tagged regression test does not run the public checkout-install workflow.

No product code was modified in this review.

## Findings

### Blocking

#### F-3-1 — The CLI demo has no recording of the real command

- Exact location: landing page, **Sample scan**. The only command demonstration is a hand-authored `<pre>` beginning `flag-stale-guard scan --config flag-stale-guard.toml --check`; `public/` contains no terminal recording asset.
- Verification: the real installed command was run from `/tmp/fsg-review3-demo.*`. It creates a temporary workspace and prints all three flags, the full four-item removal checklist, and the two `legacy-cart` source references. The landing block is static text rather than a self-hosted asciinema/SVG/video recording of that command. The one-click web sample is useful, but it is not the CLI executing.
- Why this blocks: for a CLI, the required try-out is a landing-page recording of the real binary doing the sample job, plus the shipped `demo` command. A first-time visitor can inspect an illustrative card UI but cannot see what they will actually run or receive in their terminal.
- Concrete fix: add a self-hosted terminal recording generated from the released `flag-stale-guard demo` (or the documented sample scan) to the landing page, with a plain HTML transcript and controls. Keep `cargo run -- demo` and the existing isolated web sample. Add a Playwright test that confirms the recording asset and transcript contain the command, `legacy-cart`, its two source references, and the temporary-workspace result.

### Medium

#### F-3-2 — The checkout-install claim test does not test installation from a checkout

- Exact claim/location: `.factory/claims.json`, `checkout-install` — “The CLI installs and runs from a repository checkout without a registry release.” The associated test is `tests/claims.spec.js` `@claim:checkout-install`.
- Verification: the test setup first runs `cargo package`, then installs `target/package/flag-stale-guard-0.1.0` (`tests/claims.spec.js:21-29`). The tagged test itself only runs `--version` on that packaged install and checks that the landing contains `cargo install --path sf-flag-stale-guard` (`tests/claims.spec.js:228-233`). It never runs `cargo install --path <checkout>`. During this review, the actual checkout command did succeed in an isolated root, but that manual result is not a regression test.
- Why this matters: a packaging-tree install can pass while the public checkout instruction regresses. The claim contract requires the tagged test to assert the observable workflow visitors are told to use.
- Concrete fix: in `@claim:checkout-install`, clone or copy a clean checkout into the sandbox, run `cargo install --path . --root <isolated-root>` from that checkout (equivalent to the README's cloned-directory command), then run `<isolated-root>/bin/flag-stale-guard --version`. Keep the production-copy assertion as a separate UI assertion.

## 1. Cold first screen

Fresh Chromium contexts loaded the live root before scrolling.

| Viewport | What it does | For whom | First action | Result |
|---|---|---|---|---|
| 390×844 | Finds flags ready for removal | Maintainers removing old flags without leaving source references | Try it with sample data | Pass |
| 1440×900 | Same | Same | Try it with sample data | Pass |

The mobile fold contains the eyebrow, H1, audience sentence, primary action, what clicking shows, and all three facts. The desktop fold adds the original field-guide illustration. There was no pre-scroll ambiguity.

## 2. Copy audit

Words are lexical words; code-only commands and file paths are excluded. Labels and headings are included so that heading and action quality is auditable. No item exceeds 22 words, uses a banned marketing adjective, relies on a mood/metaphor heading, or has a non-result-naming button. The two findings above concern demo proof and claim coverage, not prose.

### Landing page

| Copy | Words | Review |
|---|---:|---|
| A command-line tool for release flag cleanup | 7 | — |
| Find flags ready for removal | 5 | — |
| For maintainers who need to remove old flags without leaving source references behind. | 13 | — |
| Try it with sample data | 5 | — |
| See an expired flag and its source references. | 8 | — |
| Runs from a repository checkout. | 5 | — |
| Sends no source code away. | 5 | — |
| MIT licensed. | 2 | — |
| Pressed green and dried red leaves on a field-guide page, representing active and expired flags. | 15 | — (image alt) |
| Sample scan | 2 | — |
| See the removal gate before install | 6 | — |
| legacy-cart — expired | 3 | — (sample output) |
| owner: Drew \| expiry: 2026-02-15 | 4 | — (sample output) |
| source references: 2 | 3 | — (sample output) |
| removal checklist: | 2 | — (sample output) |
| Remove every source reference listed below. | 6 | — (sample output) |
| Exit 2: expired flags need attention. | 6 | — (sample output) |
| How it works | 3 | — |
| Find expired flags and remaining references | 6 | — |
| List each flag. | 3 | — |
| Add an owner and a YYYY-MM-DD expiry date to one config file. | 11 | — |
| Scan configured paths. | 3 | — |
| See source references for every known flag. | 7 | — |
| Check before removal. | 3 | — |
| Get a checklist after expiry. | 5 | — |
| Block removal while source references remain. | 6 | — |
| Clear limits | 2 | — |
| What Flag Stale Guard does not decide | 7 | — |
| It finds configured source references. | 5 | — |
| It cannot tell which users see a flag or prove what your code does when it runs. | 17 | — |
| Review the checklist and your tests before deleting a flag. | 10 | — |
| Install from the repository | 4 | — |
| Run it in a repository | 5 | — |
| Read the repository on GitHub (opens another site) | 8 | — |
| Local checks for configured release flags. | 6 | — |
| Built by Param Factory · v0.1.0 | 5 | — |

Root search/share description: “Find expired release flags and block removal while source references remain.” (11 words) — clear and covered by the feature claims.

### README

| Copy | Words | Review |
|---|---:|---|
| Flag Stale Guard | 3 | — |
| Find release flags ready for removal. | 6 | — |
| It is for maintainers who need to clear old flags without missing source references. | 14 | — |
| Flag Stale Guard is a free, local Rust command-line tool. | 10 | — |
| It reads one config file and checks each flag’s owner and expiry date. | 13 | — |
| It finds source references and blocks removal while any remain. | 10 | — |
| It prints a removal checklist after expiry. | 7 | — |
| It cannot tell which users see a flag or prove what your code does when it runs. | 17 | — |
| Install and use | 3 | — |
| Install the binary from a checkout: | 6 | — |
| Copy `examples/flag-stale-guard.toml` into your repository. | 5 | — |
| List each flag with a `key`, `owner`, and `YYYY-MM-DD` `expires` date. | 11 | — |
| Set `paths` to the source folders you want scanned. | 9 | — |
| The default `literal` mode searches text files for the exact flag key. | 12 | — |
| A source reference is a file and line containing that key. | 11 | — |
| Run a scan in human or JSON form: | 8 | — |
| `--check` exits `2` when a flag is expired or has missing or invalid metadata. | 14 | — |
| Owners cannot be blank. | 4 | — |
| Expiry dates must use `YYYY-MM-DD`. | 5 | — |
| A missing or unreadable configured scan path is an error. | 10 | — |
| The CLI exits `1` instead of treating that path as clear. | 11 | — |
| Check a proposed deletion with: | 5 | — |
| It exits `3` while source references remain. | 7 | — |
| Exit `0` means the tool found no source references in the folders you listed. | 14 | — |
| Run your tests and review the live behavior before deletion. | 10 | — |
| Use in GitHub Actions | 4 | — |
| The included composite action runs the same `--check` gate. | 9 | — |
| It uses the Rust toolchain supplied by your workflow. | 9 | — |
| Try the bundled demo | 4 | — |
| The command creates a temporary sample workspace and prints where it is. | 12 | — |
| Nothing in your repository changes. | 5 | — |
| The website demo is at `/?demo=1` and uses the same sample data. | 12 | — |
| It keeps its review state in memory and Reset demo restores the original three flags. | 15 | — |
| Develop, test, and build | 4 | — |
| Run `cargo package` to create the crate archive. | 8 | — |
| Publishing is intentionally left to the factory, so the docs use the working checkout install until a registry release exists. | 20 | — |
| Deploy | 1 | — |
| `npm run build:site` creates the static site in `dist/site/`. | 9 | — |
| Param Factory deploys that directory and publishes the crate. | 9 | — |
| Do not change DNS, billing, or hosting from this repository. | 10 | — |
| Privacy and license | 3 | — |
| The CLI does not send source code away. | 8 | — |
| The website has no analytics, account, or payment flow. | 9 | — |
| See the deployed `/privacy` and `/terms` pages. | 7 | — |
| Licensed under MIT. | 3 | — |

All claim-like README and landing statements map to the manifest except that F-3-2's test does not exercise its own checkout-install promise. The MIT test also establishes the README's “free” licensing context.

## 3. Demo and sandbox

The one-click browser flow itself passes: **Try it with sample data** opens `/?demo=1` and immediately shows three realistic flags, owners, expiry dates, the expired `legacy-cart`, and its two file-and-line source references. The persistent banner says “Demo — sample data, nothing is saved.” Reset restores the changed review marker and announces “Demo reset to the original three flags.” A fresh context had no cookies, localStorage, or sessionStorage before or after interaction; request logging recorded only the page, same-origin JS/CSS, and same-origin hero image. Direct `/demo` has the same three flags.

The installed CLI was separately run from a temporary working directory. It exited 0, printed a separate `/tmp/flag-stale-guard-demo-*` workspace, produced the three sample findings, and did not change the clean checkout. F-3-1 remains because this real execution is not recorded on the landing page.

## 4. Claims

A fresh clone at the candidate commit was created in `/tmp/fsg-review3-clean.a5PDcP`. After `npm ci`, every exact command declared in `.factory/claims.json` completed successfully; the clone stayed clean. A complete `npm test` then passed: 6 Rust unit tests, 5 Rust integration tests, 7 build-contract tests, and 28 Playwright tests.

| Claim | Result |
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
| `local-source` | Pass |
| `website-private` | Pass |
| `github-action-gate` | Pass |
| `mit-license` | Pass |
| `checkout-install` | Pass, with the test-coverage gap in F-3-2 |

The manual isolated checkout install also passed: `cargo install --path <fresh-checkout> --root <temp-root>` installed `flag-stale-guard 0.1.0`, and its `demo` command ran successfully. That confirms current behavior but does not replace the missing tagged regression coverage.

## 5. History verification

Every earlier review, polish report, verification report, and handoff was read. The former defects were rechecked live and in code rather than accepted from their status labels.

| Earlier finding | Current result |
|---|---|
| F-1-1 through F-1-2 | Fixed: Node support and publication-readiness promises are absent. |
| F-1-3 | Fixed: **View install steps** goes to `/#install` and focuses its H2. |
| F-1-4 | Fixed: sample review state changes, Reset restores it, and a live region announces the result. |
| F-1-5 | Fixed: README prose is split into short sentences. |
| F-1-6 | Fixed: landing, README, and every human CLI string use **source reference**. |
| F-1-7 through F-1-13 | Fixed: plain command-line wording, explicit date/config wording, concrete limits, explanatory headings, literal-mode explanation, separated exit guidance, and deployment guidance are present. |
| F-2-1 | Fixed: Back/Forward restores the landing scroll position and H1 focus. |
| F-2-2 through F-2-4 | Fixed: the 404 is plain, the decorative caption is gone, and metadata names removal directly. |

Earlier verifier findings also remain fixed: bad/missing paths fail closed, malformed dates and blank owners fail the gate, checkout installation works, missing routes return HTTP 404, metadata changes by route, social art is 1200×630, and 200% text has no horizontal overflow.

## 6. Structure, privacy, accessibility, and identity

- Live `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns 404 and renders the designed not-found page.
- Each route has a route-specific title, description, canonical, Open Graph/Twitter metadata, one H1, `lang="en"`, and header/nav/main/footer landmarks. The root title follows the required product—job pattern.
- The header/footer, skip link, Privacy and Terms links, sitemap, robots file, favicon, Apple icon, and 1200×630 social art are present. The link crawl found no dead internal or external link.
- Live axe checks found no serious or critical violations at 390×844 or 1440×900. There is no 390px overflow, focus is visible, client route changes focus the H1, and reduced motion has no running animation.
- Live request logs across landing, demo, and privacy contained only same-origin requests. There were no cookies or browser-storage entries. The CSP is self-scoped and no remote font/script is loaded.
- The pressed-leaf artwork, herbarium paper palette, serif/display pairing, specimen borders, and square-edged labels implement the documented botanical field-guide identity rather than a generic SaaS template.

## 7. Missed leverage

No AI feature is needed: expiry validation and literal source matching are safety checks where generated advice would weaken the result. JSON output and the composite GitHub Action provide the expected automation/export paths. `.factory/brief.json` is not present, so no additional brief-specific capability can be verified.

## What would make this perfect

1. Ship an accessible, self-hosted recording of the real CLI sample run on the landing page and test it.
2. Make the tagged checkout-install claim test install from an actual fresh checkout.
3. Re-run the full clean-clone claim sweep and live checklist. PASS requires zero findings.
