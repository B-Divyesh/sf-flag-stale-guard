# Demo sandbox

- **Website:** open `/demo` or click **Try it with sample data**. It displays three fixed flags from `examples/`, including an expired `legacy-cart` flag with two references. The persistent banner says that nothing is saved. **Reset demo** clears only `demo:flag-stale-guard` in localStorage.
- **CLI:** run `cargo run -- demo`. It copies the same files to a temporary directory, scans them, and prints the temporary workspace path. It does not change the current repository.
- **Direct removal gate:** run `cargo run -- remove-check legacy-cart --config examples/flag-stale-guard.toml`. It exits 3 while the sample references remain.

The demo has no account, network calls, or connection to a real repository.
