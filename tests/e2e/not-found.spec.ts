import { expect, test } from '@playwright/test';

/**
 * 404 page: one page for every unknown URL; shows only the language matching the URL,
 * else the saved choice or browser language. See docs/i18n-seo.md → 404 page.
 */

const visibleHeading = (page: import('@playwright/test').Page) =>
  page.getByRole('heading', { level: 1 }).filter({ visible: true });

test('shows the German 404 for German URLs', async ({ page }) => {
  const response = await page.goto('de/gibt-es-nicht/');
  expect(response?.status()).toBe(404);
  await expect(visibleHeading(page)).toHaveText('Seite nicht gefunden');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('shows the English 404 for English URLs', async ({ page }) => {
  await page.goto('en/does-not-exist/');
  await expect(visibleHeading(page)).toHaveText('Page not found');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Page not found/);
});

test.describe('without a language in the URL', () => {
  test.use({ locale: 'en-US' });

  test('uses the browser language', async ({ page }) => {
    await page.goto('does-not-exist/');
    await expect(visibleHeading(page)).toHaveText('Page not found');
  });
});
