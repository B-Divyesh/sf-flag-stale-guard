use clap::{Parser, Subcommand};
use serde::{Deserialize, Serialize};
use std::{
    fs, io,
    path::{Path, PathBuf},
    process::ExitCode,
};

#[derive(Parser)]
#[command(
    name = "flag-stale-guard",
    version,
    about = "Inspect configured release flags before they become unsafe to remove."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Inventory flags and their source references.
    Scan {
        #[arg(short, long, default_value = "flag-stale-guard.toml")]
        config: PathBuf,
        #[arg(long)]
        json: bool,
        #[arg(
            long,
            help = "Exit 2 when expired flags or missing metadata are found."
        )]
        check: bool,
    },
    /// Refuse removal while a flag still has live source references.
    RemoveCheck {
        flag: String,
        #[arg(short, long, default_value = "flag-stale-guard.toml")]
        config: PathBuf,
        #[arg(long)]
        json: bool,
    },
    /// Run the shipped sample in a temporary directory; no repository files change.
    Demo {
        #[arg(long)]
        json: bool,
    },
}

#[derive(Debug, Deserialize)]
struct Config {
    #[serde(default)]
    paths: Vec<String>,
    #[serde(default)]
    exclude: Vec<String>,
    #[serde(default)]
    flags: Vec<Flag>,
}
#[derive(Debug, Deserialize, Clone)]
struct Flag {
    key: String,
    owner: Option<String>,
    expires: Option<String>,
    #[serde(default)]
    adapter: Option<String>,
}
#[derive(Debug, Serialize)]
struct Finding {
    key: String,
    status: String,
    owner: Option<String>,
    expires: Option<String>,
    adapter: String,
    references: Vec<String>,
    checklist: Vec<String>,
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    match run(cli) {
        Ok(code) => ExitCode::from(code),
        Err(e) => {
            eprintln!("Error: {e}\nNext: check the config path and run `flag-stale-guard --help`.");
            ExitCode::from(1)
        }
    }
}

fn run(cli: Cli) -> Result<u8, String> {
    match cli.command {
        Command::Scan {
            config,
            json,
            check,
        } => {
            let findings = inspect(&config)?;
            print_findings(&findings, json);
            Ok(if check && findings.iter().any(|f| f.status != "tracked") {
                2
            } else {
                0
            })
        }
        Command::RemoveCheck { flag, config, json } => {
            let findings = inspect(&config)?;
            let found = findings
                .iter()
                .find(|f| f.key == flag)
                .ok_or_else(|| format!("`{flag}` is not configured"))?;
            if json {
                println!("{}", serde_json::to_string_pretty(found).unwrap());
            }
            if found.references.is_empty() {
                if !json {
                    println!(
                        "Safe to remove `{}`: no live references were found in configured paths.",
                        found.key
                    );
                }
                Ok(0)
            } else {
                if !json {
                    println!(
                        "Removal blocked for `{}`: {} live reference(s) remain.",
                        found.key,
                        found.references.len()
                    );
                    for r in &found.references {
                        println!("  {r}");
                    }
                    println!("Next: remove these references, then run this command again.");
                }
                Ok(3)
            }
        }
        Command::Demo { json } => {
            let temp =
                std::env::temp_dir().join(format!("flag-stale-guard-demo-{}", std::process::id()));
            let _ = fs::remove_dir_all(&temp);
            fs::create_dir_all(temp.join("src")).map_err(io_err)?;
            fs::write(
                temp.join("flag-stale-guard.toml"),
                include_str!("../examples/flag-stale-guard.toml"),
            )
            .map_err(io_err)?;
            fs::write(
                temp.join("src/checkout.ts"),
                include_str!("../examples/src/checkout.ts"),
            )
            .map_err(io_err)?;
            fs::write(
                temp.join("src/legacy.ts"),
                include_str!("../examples/src/legacy.ts"),
            )
            .map_err(io_err)?;
            let old = std::env::current_dir().map_err(io_err)?;
            std::env::set_current_dir(&temp).map_err(io_err)?;
            let findings = inspect(Path::new("flag-stale-guard.toml"))?;
            std::env::set_current_dir(old).map_err(io_err)?;
            if json {
                println!("{}", serde_json::to_string_pretty(&findings).unwrap());
            } else {
                println!(
                    "Demo workspace: {}\nSample data only; nothing in your repository changed.",
                    temp.display()
                );
                print_findings(&findings, false);
            }
            Ok(0)
        }
    }
}

fn io_err(e: io::Error) -> String {
    e.to_string()
}
fn inspect(config_path: &Path) -> Result<Vec<Finding>, String> {
    let raw = fs::read_to_string(config_path).map_err(io_err)?;
    let config: Config = toml::from_str(&raw).map_err(|e| format!("could not read TOML: {e}"))?;
    if config.flags.is_empty() {
        return Err("no [[flags]] entries were configured".into());
    }
    let root = config_path.parent().unwrap_or(Path::new("."));
    let paths = if config.paths.is_empty() {
        vec![".".to_string()]
    } else {
        config.paths
    };
    let today = chrono::Utc::now().date_naive().to_string();
    config
        .flags
        .into_iter()
        .map(|flag| {
            let adapter = flag.adapter.clone().unwrap_or_else(|| "literal".into());
            if adapter != "literal" {
                return Err(format!(
                    "flag `{}` uses unsupported adapter `{adapter}`; use `literal`",
                    flag.key
                ));
            }
            let mut refs = Vec::new();
            for p in &paths {
                collect_refs(&root.join(p), &flag.key, &config.exclude, root, &mut refs)?;
            }
            let status = if flag.owner.as_deref().unwrap_or("").is_empty()
                || flag.expires.as_deref().unwrap_or("").is_empty()
            {
                "metadata missing"
            }
            // ISO dates sort lexically, which keeps comparison transparent in JSON output.
            else if flag.expires.as_deref().unwrap() < today.as_str() {
                "expired"
            } else {
                "tracked"
            };
            let mut checklist = Vec::new();
            if status == "expired" {
                checklist.extend(
                    [
                        "Confirm the flag's rollout is complete.",
                        "Remove every live reference listed below.",
                        "Delete the flag from its provider after code cleanup.",
                        "Run the test suite before release.",
                    ]
                    .map(String::from),
                );
            }
            Ok(Finding {
                key: flag.key,
                status: status.into(),
                owner: flag.owner,
                expires: flag.expires,
                adapter,
                references: refs,
                checklist,
            })
        })
        .collect()
}
fn collect_refs(
    path: &Path,
    key: &str,
    excludes: &[String],
    root: &Path,
    out: &mut Vec<String>,
) -> Result<(), String> {
    if !path.exists() {
        return Ok(());
    }
    if path.is_dir() {
        for item in fs::read_dir(path).map_err(io_err)? {
            let child = item.map_err(io_err)?.path();
            collect_refs(&child, key, excludes, root, out)?;
        }
        return Ok(());
    }
    let relative = path
        .strip_prefix(root)
        .unwrap_or(path)
        .display()
        .to_string();
    if excludes.iter().any(|x| relative.contains(x))
        || relative.contains(".git/")
        || relative.contains("target/")
    {
        return Ok(());
    }
    if let Ok(text) = fs::read_to_string(path) {
        for (line, content) in text.lines().enumerate() {
            if content.contains(key) {
                out.push(format!("{}:{}", relative, line + 1));
            }
        }
    }
    Ok(())
}
fn print_findings(findings: &[Finding], json: bool) {
    if json {
        println!("{}", serde_json::to_string_pretty(findings).unwrap());
        return;
    }
    println!("Flag inventory");
    for f in findings {
        println!("\n{} — {}", f.key, f.status);
        println!(
            "  owner: {} | expiry: {} | adapter: {}",
            f.owner.as_deref().unwrap_or("missing"),
            f.expires.as_deref().unwrap_or("missing"),
            f.adapter
        );
        println!("  live references: {}", f.references.len());
        for r in &f.references {
            println!("    {r}");
        }
        if !f.checklist.is_empty() {
            println!("  removal checklist:");
            for item in &f.checklist {
                println!("    - {item}");
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn scan_sample_finds_expired_flag_and_references() {
        let v = inspect(Path::new("examples/flag-stale-guard.toml")).unwrap();
        let old = v.iter().find(|x| x.key == "legacy-cart").unwrap();
        assert_eq!(old.status, "expired");
        assert_eq!(old.references.len(), 2);
    }
    #[test]
    fn fresh_flag_is_tracked() {
        let v = inspect(Path::new("examples/flag-stale-guard.toml")).unwrap();
        assert_eq!(
            v.iter().find(|x| x.key == "checkout-v2").unwrap().status,
            "tracked"
        );
    }
}
