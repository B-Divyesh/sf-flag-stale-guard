# Flag Stale Guard polish 3 handoff

Date: 2026-08-28
Work order: `flag-stale-guard-polish-3`
Repair commit: `e369bfeb6caa43bfae3ace1404f8b6f71986bd52` (`fix: record the real CLI demo`)
Deployment: `8055804e-1251-41c0-bfbd-55d66163dcc5`

## Done

- Added an original self-hosted SVG terminal recording of the real packaged `flag-stale-guard demo` output, a download control, and an accessible HTML transcript. Its transcript is regression-tested against the packaged command after redacting only the temporary workspace path.
- Made source-reference ordering deterministic so CLI and recorded output are reproducible.
- Strengthened `@claim:checkout-install` to install from a clean cloned checkout into an isolated root, execute the installed binary and demo, and check that checkout remains clean.
- Preserved all earlier review repairs: plain first-screen copy, isolated `?demo=1` sandbox with reset, source-reference language, route metadata/history/focus, 404/legal links, mobile reflow, privacy posture, and botanical field-guide identity.
- Updated `.factory/catalog-description.txt`, demo documentation, asset provenance, claims, copy audit, and `.factory/polish-3.md`.

## Verify

```sh
npm ci
npm test
npm run build:site
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo build --release
cargo package --allow-dirty
```

- Fresh clone `/tmp/fsg-polish3-clean.DY7ZqS` at `e369bfe`: all 15 exact claim commands passed independently, then `npm test` passed (6 Rust unit + 5 Rust integration + 8 build-contract + 29 Playwright tests). The clone’s final Git status was clean.
- Release checks passed in that clone: formatter, clippy, release build, crate package, and `npm audit --omit=dev` (0 vulnerabilities).
- Build output: `dist/site/`; JavaScript is 4,513 bytes gzip and CSS is 2,492 bytes gzip. The deployed artifact was 198,825 bytes.
- Local cold checks: `verify-url.sh` passed `/` and `/?demo=1`; screenshots and reports are in `.factory/evidence/polish-3-local-home/` and `.factory/evidence/polish-3-local-demo/`.
- Live cold checks passed at <https://flag-stale-guard.sociobot.in/> and <https://flag-stale-guard.sociobot.in/?demo=1>. `.factory/evidence/polish-3-live/live-check.json` records route/title/canonical checks, actual HTTP 404, live axe checks, no unexpected console errors, no third-party requests, no demo storage/cookies, 200% text reflow, demo reset, history restoration, and the terminal recording/transcript asset.

## Notes

- The standalone `npx @axe-core/cli` could not run because this container lacks a Selenium Chrome binary. The repository’s Playwright axe integration ran against installed Chromium and passed locally and against the live site.
- No known product gaps remain. Do not publish the crate from this worker; Param Factory owns registry publishing and static deployment.
