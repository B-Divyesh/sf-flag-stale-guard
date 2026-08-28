import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { resolve } from 'node:path';

const siteRoot = resolve('dist/site');

test('build:site writes a complete deployable site to dist/site', async () => {
  const expectedFiles = [
    'index.html',
    '404.html',
    'staticwebapp.config.json',
    'robots.txt',
    'sitemap.xml'
  ];

  await Promise.all(expectedFiles.map(async file => {
    const contents = await readFile(resolve(siteRoot, file), 'utf8');
    assert.ok(contents.length > 0, `${file} must not be empty`);
  }));

  const assets = await readdir(resolve(siteRoot, 'assets'));
  assert.ok(assets.some(file => file.endsWith('.js')), 'a JavaScript bundle must be emitted');
  assert.ok(assets.some(file => file.endsWith('.css')), 'a CSS bundle must be emitted');
});

test('built HTML references files inside the deployment root', async () => {
  const html = await readFile(resolve(siteRoot, 'index.html'), 'utf8');
  const localReferences = [...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)[^"]*"/g)]
    .map(([, pathname]) => pathname)
    .filter(pathname => pathname !== '');

  assert.ok(localReferences.length > 0, 'the built page must reference local assets');
  await Promise.all(localReferences.map(pathname =>
    assert.doesNotReject(
      readFile(resolve(siteRoot, pathname)),
      `/${pathname} must resolve inside dist/site`
    )
  ));
});

test('static host routes known pages and preserves a real HTTP 404 policy', async () => {
  const config = JSON.parse(await readFile(resolve(siteRoot, 'staticwebapp.config.json'), 'utf8'));
  assert.equal(config.navigationFallback, undefined, 'a catch-all SPA fallback would turn unknown paths into HTTP 200');
  assert.deepEqual(config.responseOverrides['404'], { rewrite: '/404.html' });
  const rewrites = Object.fromEntries(
    config.routes.filter(route => route.rewrite).map(route => [route.route, route.rewrite])
  );
  assert.deepEqual(rewrites, {
    '/demo': '/index.html',
    '/privacy': '/index.html',
    '/terms': '/index.html'
  });
});

test('social metadata uses the required 1200 by 630 product artwork', async () => {
  const html = await readFile(resolve(siteRoot, 'index.html'), 'utf8');
  assert.match(html, /property="og:image" content="https:\/\/flag-stale-guard\.sociobot\.in\/field-guide-social\.webp"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  const image = await readFile(resolve(siteRoot, 'field-guide-social.webp'));
  assert.ok(image.length > 0, 'the social image must be deployed');
});

test('install copy uses the working checkout path instead of an unavailable registry command', async () => {
  const javascript = (await Promise.all(
    (await readdir(resolve(siteRoot, 'assets')))
      .filter(file => file.endsWith('.js'))
      .map(file => readFile(resolve(siteRoot, 'assets', file), 'utf8'))
  )).join('\n');
  assert.match(javascript, /cargo install --path sf-flag-stale-guard/);
  assert.doesNotMatch(javascript, /cargo install flag-stale-guard(?:\\n|<)/);
});

test('every declared claim has exactly one tagged regression test', async () => {
  const claims = JSON.parse(await readFile(resolve('.factory/claims.json'), 'utf8'));
  const tests = await readFile(resolve('tests/claims.spec.js'), 'utf8');
  const ids = claims.map(claim => claim.id);
  assert.equal(new Set(ids).size, ids.length, 'claim ids must be unique');
  for (const claim of claims) {
    assert.equal(
      claim.test,
      `npm test -- --grep @claim:${claim.id}`,
      `${claim.id} must declare its exact tagged command`
    );
    const matches = tests.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g')) ?? [];
    assert.equal(matches.length, 1, `${claim.id} must have exactly one tagged test`);
  }
  const taggedIds = [...tests.matchAll(/@claim:([a-z0-9-]+)/g)].map(([, id]) => id);
  assert.deepEqual(taggedIds.sort(), [...ids].sort(), 'tagged tests and claims manifest must match');
});
