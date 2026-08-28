import { test, expect } from '@playwright/test';
import axeSource from 'axe-core';

const routes = [
  ['/', 'Flag Stale Guard — inspect stale release flags'],
  ['/demo', 'Demo — Flag Stale Guard'],
  ['/privacy', 'Privacy — Flag Stale Guard'],
  ['/terms', 'Terms — Flag Stale Guard'],
  ['/missing-page', 'Not found — Flag Stale Guard']
];

for (const [route, title] of routes) {
  test(`${route} has its identity, landmarks, and no serious accessibility findings`, async ({ page }) => {
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));

    await page.goto(route);
    await expect(page).toHaveTitle(title);
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

test('keyboard navigation exposes the skip link and moves focus after route changes', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const demoLink = page.getByRole('link', { name: 'Try it with sample data' });
  await demoLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.getByRole('button', { name: 'Reset demo' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
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
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveTitle('Flag Stale Guard — inspect stale release flags');
});
