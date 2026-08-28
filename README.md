# Flag Stale Guard

Find release flags ready for removal. It is for maintainers who need to clear old flags without missing live source references.

Flag Stale Guard is a free, local Rust CLI. It reads static configuration, checks owner and expiry metadata, finds literal call sites in configured paths, prints a removal checklist after expiry, and blocks removal while references remain. It does not evaluate flags or prove runtime safety.

## Install and use

Build the binary from a checkout:

```sh
cargo build --release
./target/release/flag-stale-guard scan --config examples/flag-stale-guard.toml --check
```

Copy `examples/flag-stale-guard.toml` into your repository. List each flag with a `key`, `owner`, and ISO `expires` date. Set `paths` to the source folders you want scanned. The default `literal` adapter looks for the exact flag key in text files.

```toml
paths = ["src"]

[[flags]]
key = "checkout-v2"
owner = "Mina"
expires = "2026-12-01"
adapter = "literal"
```

Run a scan in human or JSON form:

```sh
flag-stale-guard scan --config flag-stale-guard.toml --check
flag-stale-guard scan --config flag-stale-guard.toml --json
```

`--check` exits `2` when any flag is expired or missing metadata. Check a proposed deletion with:

```sh
flag-stale-guard remove-check legacy-cart --config flag-stale-guard.toml
```

It exits `3` while source references remain. A zero exit means no configured literal references were found; still run your tests and review runtime behavior.

## Use in GitHub Actions

The included composite action runs the same `--check` gate. It uses the Rust toolchain supplied by your workflow.

```yaml
- uses: actions/checkout@v4
- uses: dtolnay/rust-toolchain@stable
- uses: B-Divyesh/sf-flag-stale-guard@main
  with:
    config: flag-stale-guard.toml
```

## Try the bundled demo

```sh
cargo run -- demo
```

The command creates a temporary sample workspace and prints where it is. Nothing in your repository changes. The website demo is at `/demo` and uses the same sample data.

## Develop, test, and build

Requirements: Rust stable and Node 20+.

```sh
npm install
npm test              # cargo tests plus browser claim checks
npm run build:site    # static site -> dist/
cargo build --release # CLI -> target/release/flag-stale-guard
```

`cargo package` produces the ready-to-publish crate. Publishing is intentionally left to the factory.

## Privacy and license

The CLI does not send source code away. The website has no analytics, account, or payment flow. See the deployed `/privacy` and `/terms` pages. Licensed under [MIT](LICENSE).
