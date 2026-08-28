# Flag Stale Guard

Find release flags ready for removal. It is for maintainers who need to clear old flags without missing source references.

Flag Stale Guard is a free, local Rust command-line tool. It reads one config file and checks each flag’s owner and expiry date. It finds source references and blocks removal while any remain. It prints a removal checklist after expiry. It cannot tell which users see a flag or prove what your code does when it runs.

## Install and use

Install the binary from a checkout:

```sh
git clone https://github.com/B-Divyesh/sf-flag-stale-guard.git
cargo install --path sf-flag-stale-guard
flag-stale-guard scan --config sf-flag-stale-guard/examples/flag-stale-guard.toml --check
```

Copy `examples/flag-stale-guard.toml` into your repository. List each flag with a `key`, `owner`, and `YYYY-MM-DD` `expires` date. Set `paths` to the source folders you want scanned. The default `literal` mode searches text files for the exact flag key.

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

`--check` exits `2` when a flag is expired or has missing or invalid metadata. Owners cannot be blank. Expiry dates must use `YYYY-MM-DD`.

A missing or unreadable configured scan path is an error. The CLI exits `1` instead of treating that path as clear.

Check a proposed deletion with:

```sh
flag-stale-guard remove-check legacy-cart --config flag-stale-guard.toml
```

It exits `3` while source references remain. Exit `0` means the tool found no source references in the folders you listed. Run your tests and review the live behavior before deletion.

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

The command creates a temporary sample workspace and prints where it is. Nothing in your repository changes. The website demo is at `/?demo=1` and uses the same sample data. It keeps its review state in memory and Reset demo restores the original three flags.

## Develop, test, and build

```sh
npm install
npm test              # cargo tests plus browser claim checks
npm run build:site    # static site -> dist/site/
cargo build --release # CLI -> target/release/flag-stale-guard
```

Run `cargo package` to create the crate archive. Publishing is intentionally left to the factory, so the docs use the working checkout install until a registry release exists.

## Deploy

`npm run build:site` creates the static site in `dist/site/`. Param Factory deploys that directory and publishes the crate. Do not change DNS, billing, or hosting from this repository.

## Privacy and license

The CLI does not send source code away. The website has no analytics, account, or payment flow. See the deployed `/privacy` and `/terms` pages. Licensed under [MIT](LICENSE).
