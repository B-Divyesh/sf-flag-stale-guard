use serde_json::Value;
use std::{
    fs,
    path::{Path, PathBuf},
    process::{Command, Output},
    time::{SystemTime, UNIX_EPOCH},
};

struct Fixture(PathBuf);

impl Fixture {
    fn new(name: &str) -> Self {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "flag-stale-guard-cli-{name}-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(path.join("src")).unwrap();
        Self(path)
    }

    fn write(&self, relative: &str, contents: &str) {
        fs::write(self.0.join(relative), contents).unwrap();
    }

    fn write_bytes(&self, relative: &str, contents: &[u8]) {
        fs::write(self.0.join(relative), contents).unwrap();
    }

    fn run(&self, arguments: &[&str]) -> Output {
        Command::new(env!("CARGO_BIN_EXE_flag-stale-guard"))
            .args(arguments)
            .current_dir(&self.0)
            .output()
            .unwrap()
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

fn text(bytes: &[u8]) -> String {
    String::from_utf8(bytes.to_vec()).unwrap()
}

#[test]
fn remove_check_fails_closed_for_a_missing_path_in_human_and_json_modes() {
    let fixture = Fixture::new("missing-path");
    fixture.write("src/app.ts", "export const flag = 'old-flag';\n");
    fixture.write(
        "missing-path.toml",
        "paths = [\"source-typo\"]\n[[flags]]\nkey = \"old-flag\"\nowner = \"Maintainer\"\nexpires = \"2026-12-01\"\n",
    );

    for extra in [None, Some("--json")] {
        let mut arguments = vec!["remove-check", "old-flag", "--config", "missing-path.toml"];
        if let Some(argument) = extra {
            arguments.push(argument);
        }
        let output = fixture.run(&arguments);
        assert_eq!(output.status.code(), Some(1));
        assert!(text(&output.stdout).is_empty());
        assert!(text(&output.stderr).contains("configured scan path `source-typo` cannot be read"));
        assert!(!text(&output.stdout).contains("Safe to remove"));
    }
}

#[test]
fn scan_fails_closed_for_a_directly_configured_non_utf8_file() {
    let fixture = Fixture::new("non-utf8-path");
    fixture.write_bytes("source.bin", &[0xff, 0xfe, 0xfd]);
    fixture.write(
        "flag-stale-guard.toml",
        "paths = [\"source.bin\"]\n[[flags]]\nkey = \"old-flag\"\nowner = \"Maintainer\"\nexpires = \"2026-12-01\"\n",
    );

    let output = fixture.run(&["scan", "--config", "flag-stale-guard.toml", "--check"]);
    assert_eq!(output.status.code(), Some(1));
    assert!(text(&output.stderr).contains("configured scan path `source.bin` is not UTF-8 text"));
}

#[test]
fn malformed_expiry_and_blank_owner_fail_the_check_gate() {
    let fixture = Fixture::new("invalid-metadata");
    fixture.write("src/app.ts", "export const first = 'bad-date';\n");
    fixture.write(
        "flag-stale-guard.toml",
        "paths = [\"src\"]\n[[flags]]\nkey = \"bad-date\"\nowner = \"Maintainer\"\nexpires = \"tomorrow\"\n[[flags]]\nkey = \"blank-owner\"\nowner = \"  \"\nexpires = \"2026-12-01\"\n",
    );

    let output = fixture.run(&[
        "scan",
        "--config",
        "flag-stale-guard.toml",
        "--check",
        "--json",
    ]);
    assert_eq!(output.status.code(), Some(2));
    let findings: Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(findings[0]["status"], "metadata invalid");
    assert_eq!(findings[1]["status"], "metadata missing");
}

#[test]
fn configured_literal_scan_reports_only_in_scope_references() {
    let fixture = Fixture::new("scan-scope");
    fixture.write("src/app.ts", "export const first = 'checkout-v2';\n");
    fs::create_dir_all(fixture.0.join("outside")).unwrap();
    fixture.write(
        "outside/ignored.ts",
        "export const second = 'checkout-v2';\n",
    );
    fixture.write(
        "flag-stale-guard.toml",
        "paths = [\"src\"]\n[[flags]]\nkey = \"checkout-v2\"\nowner = \"Mina\"\nexpires = \"2099-12-01\"\n",
    );

    let output = fixture.run(&["scan", "--config", "flag-stale-guard.toml", "--json"]);
    assert!(output.status.success());
    let findings: Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(findings[0]["references"][0], "src/app.ts:1");
    assert_eq!(findings[0]["references"].as_array().unwrap().len(), 1);
}

#[test]
fn packaged_examples_are_present_for_the_documented_demo() {
    let manifest = Path::new(env!("CARGO_MANIFEST_DIR"));
    assert!(manifest.join("examples/flag-stale-guard.toml").is_file());
    assert!(manifest.join("examples/src/checkout.ts").is_file());
    assert!(manifest.join("examples/src/legacy.ts").is_file());
}
