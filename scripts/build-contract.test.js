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
