# Demo sandbox

- **Website:** open `/?demo=1`, `/demo`, or click **Try it with sample data**. It displays three fixed flags from `examples/`, including an expired `legacy-cart` flag with two source references. The persistent banner says that nothing is saved. You can mark one sample source reference as reviewed; **Reset demo** restores the original three flags and announces the reset. Demo review state exists only in page memory, so it never reads, writes, or shares real data or browser storage.
- **CLI:** run `cargo run -- demo`. It copies the same files to a temporary directory, scans them, and prints the temporary workspace path. It does not change the current repository. The landing page includes a self-hosted SVG recording of this command, a download link, and a plain HTML transcript. The displayed workspace path is redacted because every run gets a different temporary directory.
- **Direct removal gate:** run `cargo run -- remove-check legacy-cart --config examples/flag-stale-guard.toml`. It exits 3 while the sample references remain.

The demo has no account, network calls, browser storage, or connection to a real repository.
