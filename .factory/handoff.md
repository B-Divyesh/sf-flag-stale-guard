# Flag Stale Guard handoff

## What shipped

- A Rust 0.1.0 CLI with `scan`, `remove-check`, and `demo` commands.
- TOML flag inventory with required owner and ISO expiry metadata.
- Explicit `literal` adapter that scans only configured local paths and reports exact file:line references.
- Expired-flag checklist, JSON output, exit `2` for `--check` findings, and exit `3` when removal remains blocked.
- `action.yml` composite GitHub Action that runs the same CI gate.
- A Vite static site in `dist/`, including `/demo`, `/privacy`, `/terms`, and styled 404 route.
- The one-click demo and CLI demo use bundled sample data only. No source or demo data leaves the device.
- Botanical field-guide visual system and an original generated WebP hero at 60 KB. Prompt provenance is in `public/field-guide-hero.png.json`.

## Verify from a clean checkout

```sh
npm install
npm test
npm run build:site
cargo build --release
cargo run -- demo
```

`npm test` passed: 2 Rust unit tests and 4 Playwright tests, including both claim tests and an axe serious/critical check. `npm run build:site` writes `index.html` at `dist/`.

Claim checks:

- `@claim:sample-removal-block` proves the demo shows two live references and a blocked removal.
- `@claim:local-source` proves the browser demo makes no cross-origin requests.

## Measured checks

- Lighthouse local desktop run: Performance **100**, Accessibility **100**.
- LCP: **1,567 ms**; CLS: **0**.
- Built initial JS: **3.14 KB gzip**; CSS: **2.11 KB gzip**; LCP hero: **61.4 KB WebP**.
- Browser axe test: zero serious or critical violations.

## Known limits and next steps

- `literal` is intentionally the only adapter in v1. It finds configured text references; it cannot prove runtime evaluation safety. Add provider-specific static adapters only with explicit conventions and tests.
- The GitHub composite action requires a Rust toolchain in the workflow.
- The command is ready for `cargo package`; registry publication is left to the factory.
