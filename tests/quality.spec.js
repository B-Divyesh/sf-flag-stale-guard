import { test, expect } from '@playwright/test';
import axeSource from 'axe-core';

const routes = [
  ['/', 'Flag Stale Guard — find flags ready for removal', 'https://flag-stale-guard.sociobot.in/'],
  ['/demo', 'Demo — Flag Stale Guard', 'https://flag-stale-guard.sociobot.in/demo'],
  ['/privacy', 'Privacy — Flag Stale Guard', 'https://flag-stale-guard.sociobot.in/privacy'],
  ['/terms', 'Terms — Flag Stale Guard', 'https://flag-stale-guard.sociobot.in/terms'],
  ['/missing-page', 'Not found — Flag Stale Guard', 'https://flag-stale-guard.sociobot.in/missing-page']
];

for (const [route, title, canonical] of routes) {
  test(`${route} has its identity, landmarks, and no serious accessibility findings`, async ({ page }) => {
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /\S+/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('nav')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);

    await page.addScriptTag({ content: axeSource.source });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document);
      return result.violations.filter(item => ['serious', 'critical'].includes(item.impact));
    });
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('desktop landing and demo render without console, layout, or axe failures', async ({ page }) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ['/', '/demo']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
    await page.addScriptTag({ content: axeSource.source });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document);
      return result.violations.filter(item => ['serious', 'critical'].includes(item.impact));
    });
    expect(violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('keyboard navigation exposes the skip link and moves focus after route changes', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  await demoLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.getByRole('button', { name: 'Reset demo' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeFocused();
});

test('Back and Forward restore each route’s scroll position and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1665));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1600);

  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).evaluate(link => link.click());
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy for local flag checks' })).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1600);
  await expect(page.getByRole('heading', { name: 'Find flags ready for removal' })).toBeFocused();

  await page.goForward();
  await expect(page).toHaveURL('/privacy');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole('heading', { name: 'Privacy for local flag checks' })).toBeFocused();
});

test('plain error and sharing copy name the page and removal action', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to Flag Stale Guard home.' })).toBeVisible();
  await page.goto('/');
  const expected = 'Find expired release flags and block removal while source references remain.';
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', expected);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', expected);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', expected);
  await expect(page.locator('figcaption')).toHaveCount(0);
});

test('the demo reflows on a phone and keeps touch targets large enough', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    smallTargets: [...document.querySelectorAll('a,button')]
      .map(element => ({ label: element.textContent.trim(), rect: element.getBoundingClientRect().toJSON() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
  }));
  expect(layout.content).toBeLessThanOrEqual(layout.viewport);
  expect(layout.smallTargets).toEqual([]);
});

test('content reflows without horizontal page overflow at 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = '34px'; });
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth
    }));
    expect(layout.content, `${route} overflowed at 200% text size`).toBeLessThanOrEqual(layout.viewport);
  }
});

test('the loaded demo remains usable offline and does not pin stale app caches', async ({ page, context }) => {
  await page.goto('/demo');
  const browserCaches = await page.evaluate(async () => ({
    cacheKeys: 'caches' in window ? await caches.keys() : [],
    workers: 'serviceWorker' in navigator ? (await navigator.serviceWorker.getRegistrations()).length : 0
  }));
  expect(browserCaches).toEqual({ cacheKeys: [], workers: 0 });

  await context.setOffline(true);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('sample data, nothing is saved')).toBeVisible();
  await page.getByRole('link', { name: 'View install steps' }).click();
  await expect(page).toHaveTitle('Flag Stale Guard — find flags ready for removal');
  await expect(page.getByRole('heading', { name: 'Run it in a repository' })).toBeFocused();
});

test('the first-screen demo action uses the isolated direct demo URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('A command-line tool for release flag cleanup')).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Flag Stale Guard');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://flag-stale-guard.sociobot.in/demo');
});
