import { test, expect } from '@playwright/test';
import axeSource from 'axe-core';

test('@claim:sample-removal-block the sample blocks removal with two references', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'legacy-cart is blocked' })).toBeVisible();
  await expect(page.getByText('Two live references remain in the configured sample paths.')).toBeVisible();
  await expect(page.locator('.check-panel li')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('sample data, nothing is saved')).toBeVisible();
});

test('@claim:local-source the demo makes no cross-origin requests', async ({ page }) => {
  const foreign = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') foreign.push(request.url()); });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Inspect three configured flags' })).toBeVisible();
  expect(foreign).toEqual([]);
});

test('routes update titles and the demo fits a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Flag Stale Guard');
  await expect(page.locator('main h1')).toHaveCount(1);
  await page.goto('/demo');
  await expect(page.locator('.demo-banner')).toBeVisible();
});

test('the demo has no serious or critical axe findings', async ({ page }) => {
  await page.goto('/demo');
  await page.addScriptTag({ content: axeSource.source });
  const results = await page.evaluate(async () => window.axe.run(document));
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact))).toEqual([]);
});
