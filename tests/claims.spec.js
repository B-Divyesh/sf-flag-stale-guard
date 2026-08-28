import { test, expect } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const repository = resolve('.');
let sandbox;
let binary;
let networkGuard;

function run(args, options = {}) {
  return spawnSync(binary, args, {
    cwd: options.cwd ?? repository,
    env: options.env ?? process.env,
    encoding: 'utf8'
  });
}

function fixture(name, config, sources = {}) {
  const directory = join(sandbox, name);
  mkdirSync(directory, { recursive: true });
  for (const [relative, contents] of Object.entries(sources)) {
    const destination = join(directory, relative);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, contents);
  }
  writeFileSync(join(directory, 'flag-stale-guard.toml'), config);
  return directory;
}

function normalizeDemoOutput(output) {
  return output
    .replace(/^Demo workspace: .+$/m, 'Demo workspace: [temporary workspace]')
    .trim();
}

test.beforeAll(() => {
  sandbox = mkdtempSync(join(tmpdir(), 'flag-stale-guard-claims-'));
  execFileSync('cargo', ['package', '--allow-dirty'], { cwd: repository, stdio: 'pipe' });
  const packageDirectory = join(repository, 'target', 'package', 'flag-stale-guard-0.1.0');
  execFileSync('cargo', ['install', '--path', packageDirectory, '--root', join(sandbox, 'install'), '--force'], {
    cwd: repository,
    stdio: 'pipe'
  });
  binary = join(sandbox, 'install', 'bin', 'flag-stale-guard');
  networkGuard = join(sandbox, 'no-network.so');
  execFileSync('cc', ['-shared', '-fPIC', resolve('tests/no-network.c'), '-o', networkGuard], {
    cwd: repository,
    stdio: 'pipe'
  });
});

test.afterAll(() => {
  if (sandbox) rmSync(sandbox, { recursive: true, force: true });
});

test('@claim:metadata-gate owner and ISO expiry metadata control the check exit', async () => {
  const directory = fixture(
    'metadata',
    'paths = ["src"]\n[[flags]]\nkey = "expired"\nowner = "Mina"\nexpires = "2020-01-01"\n[[flags]]\nkey = "bad-date"\nowner = "Drew"\nexpires = "tomorrow"\n[[flags]]\nkey = "blank-owner"\nowner = "   "\nexpires = "2099-12-01"\n',
    { 'src/app.ts': "export const flag = 'expired';\n" }
  );
  const result = run(['scan', '--config', 'flag-stale-guard.toml', '--check', '--json'], { cwd: directory });
  expect(result.status).toBe(2);
  expect(JSON.parse(result.stdout).map(item => item.status)).toEqual([
    'expired',
    'metadata invalid',
    'metadata missing'
  ]);
});

test('@claim:literal-references only configured paths are searched for literal keys', async () => {
  const directory = fixture(
    'literal-references',
    'paths = ["src"]\n[[flags]]\nkey = "checkout-v2"\nowner = "Mina"\nexpires = "2099-12-01"\n',
    {
      'src/app.ts': "export const flag = 'checkout-v2';\n",
      'outside/ignored.ts': "export const flag = 'checkout-v2';\n"
    }
  );
  const result = run(['scan', '--config', 'flag-stale-guard.toml', '--json'], { cwd: directory });
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)[0].references).toEqual(['src/app.ts:1']);
});

test('@claim:fail-closed-paths missing and unscannable configured paths stop human and JSON checks', async () => {
  const missing = fixture(
    'missing-path',
    'paths = ["source-typo"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2099-12-01"\n',
    { 'src/app.ts': "export const flag = 'old-flag';\n" }
  );
  for (const extra of [[], ['--json']]) {
    const result = run(['remove-check', 'old-flag', '--config', 'flag-stale-guard.toml', ...extra], { cwd: missing });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('configured scan path `source-typo` cannot be read');
    expect(result.stdout).not.toContain('Safe to remove');
  }

  const unscannable = fixture(
    'unscannable-path',
    'paths = ["source.bin"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2099-12-01"\n'
  );
  writeFileSync(join(unscannable, 'source.bin'), Buffer.from([0xff, 0xfe, 0xfd]));
  const binaryFile = run(['scan', '--config', 'flag-stale-guard.toml', '--check'], { cwd: unscannable });
  expect(binaryFile.status).toBe(1);
  expect(binaryFile.stderr).toContain('configured scan path `source.bin` is not UTF-8 text');
});

test('@claim:expired-checklist an expired flag prints the documented removal checklist', async () => {
  const directory = fixture(
    'checklist',
    'paths = ["src"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2020-01-01"\n',
    { 'src/app.ts': "export const flag = 'old-flag';\n" }
  );
  const result = run(['scan', '--config', 'flag-stale-guard.toml'], { cwd: directory });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('removal checklist:');
  expect(result.stdout).toContain("Confirm the flag's rollout is complete.");
  expect(result.stdout).toContain('Run the test suite before release.');
});

test('@claim:sample-removal-block the same sample blocks CLI and website removal with two references', async ({ page }) => {
  const result = run([
    'remove-check',
    'legacy-cart',
    '--config',
    resolve('examples/flag-stale-guard.toml')
  ]);
  expect(result.status).toBe(3);
  expect(result.stdout).toContain('2 source reference(s) remain');
  expect(result.stdout).toContain('src/checkout.ts:6');
  expect(result.stdout).toContain('src/legacy.ts:1');

  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'legacy-cart is blocked' })).toBeVisible();
  await expect(page.locator('.check-panel li')).toHaveCount(2);
});

test('@claim:clear-removal-check remove-check exits zero only after configured references are gone', async () => {
  const directory = fixture(
    'clear-removal',
    'paths = ["src"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2020-01-01"\n',
    { 'src/app.ts': 'export const stable = true;\n' }
  );
  const result = run(['remove-check', 'old-flag', '--config', 'flag-stale-guard.toml'], { cwd: directory });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('no source references were found in configured paths');
});

test('@claim:json-output scan and remove-check return parseable structured output', async () => {
  const directory = fixture(
    'json-output',
    'paths = ["src"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2020-01-01"\n',
    { 'src/app.ts': "export const flag = 'old-flag';\n" }
  );
  const scan = run(['scan', '--config', 'flag-stale-guard.toml', '--json'], { cwd: directory });
  const removal = run(['remove-check', 'old-flag', '--config', 'flag-stale-guard.toml', '--json'], { cwd: directory });
  expect(scan.status).toBe(0);
  expect(removal.status).toBe(3);
  expect(JSON.parse(scan.stdout)).toEqual([expect.objectContaining({
    key: 'old-flag', status: 'expired', owner: 'Mina', adapter: 'literal', references: ['src/app.ts:1']
  })]);
  expect(JSON.parse(removal.stdout)).toEqual(expect.objectContaining({
    key: 'old-flag', status: 'expired', references: ['src/app.ts:1']
  }));
});

test('@claim:demo-sandbox CLI and website demos leave the current repository and browser storage unchanged', async ({ page }) => {
  const before = execFileSync('git', ['status', '--porcelain=v1'], { cwd: repository, encoding: 'utf8' });
  const result = run(['demo']);
  const after = execFileSync('git', ['status', '--porcelain=v1'], { cwd: repository, encoding: 'utf8' });
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('Sample data only; nothing in your repository changed.');
  expect(result.stdout).toContain('source references: 2');
  const workspace = result.stdout.match(/^Demo workspace: (.+)$/m)?.[1];
  expect(workspace).toBeTruthy();
  expect(existsSync(join(workspace, 'flag-stale-guard.toml'))).toBe(true);
  expect((result.stdout.match(/ — (?:tracked|expired|metadata missing|metadata invalid)$/gm) ?? [])).toHaveLength(3);
  expect(after).toBe(before);

  await page.goto('/?demo=1');
  await page.locator('#reset').evaluate(button => button.click());
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
    .toEqual({ local: 0, session: 0 });
});

test('@claim:demo-reset the direct demo restores the original sample after a review interaction', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Inspect three configured flags' })).toBeVisible();
  await expect(page.locator('#flag-list article')).toHaveCount(3);
  const review = page.getByRole('button', { name: 'Mark first source reference reviewed' });
  await review.click();
  await expect(page.getByText('Reviewed in this demo', { exact: true })).toBeVisible();
  await expect(page.getByText('First source reference marked reviewed in this demo.')).toBeVisible();
  await page.locator('#reset').evaluate(button => button.click());
  await expect(page.getByText('Demo reset to the original three flags.')).toBeVisible();
  await expect(page.getByText('Reviewed in this demo', { exact: true })).toHaveCount(0);
  await expect(page.locator('#flag-list article')).toHaveCount(3);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
    .toEqual({ local: 0, session: 0 });
});

test('@claim:local-source the packaged CLI performs a source scan without a network syscall', async () => {
  const directory = fixture(
    'no-network',
    'paths = ["src"]\n[[flags]]\nkey = "private-flag"\nowner = "Mina"\nexpires = "2099-12-01"\n',
    { 'src/private.ts': "export const flag = 'private-flag';\n" }
  );
  const result = run(['scan', '--config', 'flag-stale-guard.toml', '--json'], {
    cwd: directory,
    env: { ...process.env, LD_PRELOAD: networkGuard }
  });
  expect(result.status).toBe(0);
  expect(result.stderr).not.toContain('network syscall attempted');
  expect(JSON.parse(result.stdout)[0].references).toEqual(['src/private.ts:1']);

  const demo = run(['demo', '--json'], { env: { ...process.env, LD_PRELOAD: networkGuard } });
  expect(demo.status).toBe(0);
  expect(demo.stderr).not.toContain('network syscall attempted');
  expect(JSON.parse(demo.stdout)).toHaveLength(3);
});

test('@claim:website-private the website uses no analytics, cookies, accounts, payments, or saved demo data', async ({ page, context }) => {
  const foreign = [];
  const requests = [];
  page.on('request', request => {
    requests.push(new URL(request.url()).pathname);
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') foreign.push(request.url());
  });
  for (const route of ['/', '/demo', '/privacy']) {
    const response = await page.goto(route);
    expect(response.headers()['set-cookie']).toBeUndefined();
  }
  expect(foreign).toEqual([]);
  expect(requests.filter(path =>
    !['/', '/demo', '/privacy', '/field-guide-hero.webp', '/cli-demo-recording.svg', '/favicon.svg'].includes(path)
    && !path.startsWith('/assets/')
  )).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
    .toEqual({ local: 0, session: 0 });
  await expect(page.locator('form,input,[href*="login"],[href*="checkout"],[href*="subscribe"]')).toHaveCount(0);
});

test('@claim:github-action-gate the composite action runs the same expired-flag check gate', async () => {
  const action = readFileSync(resolve('action.yml'), 'utf8');
  expect(action).toContain('scan --config "${{ inputs.config }}" --check');
  const directory = fixture(
    'action-consumer',
    'paths = ["src"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2020-01-01"\n',
    { 'src/app.ts': "export const flag = 'old-flag';\n" }
  );
  const result = spawnSync('cargo', [
    'run',
    '--quiet',
    '--manifest-path',
    resolve('Cargo.toml'),
    '--',
    'scan',
    '--config',
    join(directory, 'flag-stale-guard.toml'),
    '--check'
  ], { cwd: directory, encoding: 'utf8' });
  expect(result.status).toBe(2);
  expect(result.stdout).toContain('old-flag — expired');

  const missingPathDirectory = fixture(
    'action-missing-path',
    'paths = ["source-typo"]\n[[flags]]\nkey = "old-flag"\nowner = "Mina"\nexpires = "2099-12-01"\n',
    { 'src/app.ts': "export const flag = 'old-flag';\n" }
  );
  const missingPath = spawnSync('cargo', [
    'run',
    '--quiet',
    '--manifest-path',
    resolve('Cargo.toml'),
    '--',
    'scan',
    '--config',
    join(missingPathDirectory, 'flag-stale-guard.toml'),
    '--check'
  ], { cwd: missingPathDirectory, encoding: 'utf8' });
  expect(missingPath.status).toBe(1);
  expect(missingPath.stderr).toContain('configured scan path `source-typo` cannot be read');
  expect(missingPath.stdout).not.toContain('Safe to remove');
});

test('@claim:mit-license the shipped CLI and website are MIT licensed', async ({ page }) => {
  expect(readFileSync(resolve('Cargo.toml'), 'utf8')).toContain('license = "MIT"');
  expect(readFileSync(resolve('LICENSE'), 'utf8')).toContain('Permission is hereby granted, free of charge');
  await page.goto('/');
  await expect(page.getByText('MIT licensed.')).toBeVisible();
});

test('@claim:cli-demo-recording the landing recording and transcript match the packaged CLI demo', async ({ page }) => {
  const result = run(['demo']);
  expect(result.status).toBe(0);
  const expectedTranscript = `$ flag-stale-guard demo\n${normalizeDemoOutput(result.stdout)}`;

  await page.goto('/');
  const recording = page.locator('#cli-demo-recording');
  await expect(recording).toBeVisible();
  await expect(recording).toHaveAttribute('src', '/cli-demo-recording.svg');
  await expect(recording).toHaveAttribute('alt', /temporary workspace/);
  await expect(page.getByRole('link', { name: 'Download terminal recording' })).toHaveAttribute('download', '');
  await page.locator('#cli-demo-transcript-control').click();
  expect(await page.locator('#cli-demo-transcript').textContent()).toBe(expectedTranscript);

  const svg = readFileSync(resolve('public/cli-demo-recording.svg'), 'utf8');
  for (const text of [
    'flag-stale-guard demo',
    'checkout-v2 — tracked',
    'legacy-cart — expired',
    'src/checkout.ts:6',
    'src/legacy.ts:1',
    'removal checklist:',
    'billing-surge-cap — tracked'
  ]) expect(svg).toContain(text);
});

test('@claim:checkout-install a clean repository checkout installs and runs the CLI without a registry release', async ({ page }) => {
  const checkout = join(sandbox, 'checkout');
  const installRoot = join(sandbox, 'checkout-install');
  const targetDirectory = join(sandbox, 'checkout-target');
  execFileSync('git', ['clone', '--local', '--no-hardlinks', repository, checkout], { stdio: 'pipe' });
  execFileSync('cargo', ['install', '--path', '.', '--root', installRoot, '--force'], {
    cwd: checkout,
    env: { ...process.env, CARGO_TARGET_DIR: targetDirectory },
    stdio: 'pipe'
  });
  const checkoutBinary = join(installRoot, 'bin', 'flag-stale-guard');
  const result = spawnSync(checkoutBinary, ['--version'], { cwd: checkout, encoding: 'utf8' });
  expect(result.status).toBe(0);
  expect(result.stdout.trim()).toBe('flag-stale-guard 0.1.0');

  const demo = spawnSync(checkoutBinary, ['demo'], { cwd: checkout, encoding: 'utf8' });
  expect(demo.status).toBe(0);
  expect(demo.stdout).toContain('Demo workspace:');
  expect(demo.stdout).toContain('legacy-cart — expired');
  expect(execFileSync('git', ['status', '--porcelain=v1'], { cwd: checkout, encoding: 'utf8' })).toBe('');

  await page.goto('/');
  const install = page.locator('.install');
  await expect(install).toContainText('cargo install --path sf-flag-stale-guard');
  await expect(install).not.toContainText('cargo install flag-stale-guard');
});

test('routes update titles and the demo fits a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Flag Stale Guard');
  await expect(page.locator('main h1')).toHaveCount(1);
  await page.goto('/demo');
  await expect(page.locator('.demo-banner')).toBeVisible();
});
