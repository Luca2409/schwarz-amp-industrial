import { expect, test } from '@playwright/test';

/**
 * Language switching: the language picker on pages whose URLs differ per language,
 * the saved language choice, and the redirect on "/" by browser language.
 * See docs/quality-checks.md.
 */

test.describe('language picker', () => {
  test('switches between the localized contact pages and remembers the choice', async ({ page, isMobile }) => {
    await page.goto('de/kontakt/');
    if (isMobile) await page.getByText('Menü').click();

    await page.getByRole('link', { name: 'English' }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/en\/contact\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.evaluate(() => localStorage.getItem('amp-lang'))).toBe('en');
  });

  test('switches a competency page to its translation with a different slug', async ({ page, isMobile }) => {
    await page.goto('de/kompetenzen/vermessung/');
    if (isMobile) await page.getByText('Menü').click();

    await page.getByRole('link', { name: 'English' }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/en\/competencies\/dimensional-metrology\/$/);
  });
});

test.describe('root redirect', () => {
  test.describe('with an English browser', () => {
    test.use({ locale: 'en-US' });

    test('redirects to /en/', async ({ page }) => {
      await page.goto('./');
      await expect(page).toHaveURL(/\/en\/$/);
    });
  });

  test.describe('with a French browser', () => {
    test.use({ locale: 'fr-FR' });

    test('falls back to /de/', async ({ page }) => {
      await page.goto('./');
      await expect(page).toHaveURL(/\/de\/$/);
    });
  });

  test.describe('with a saved choice', () => {
    test.use({ locale: 'en-US' });

    test('prefers the language chosen in the picker over the browser language', async ({ page }) => {
      await page.goto('de/');
      await page.evaluate(() => localStorage.setItem('amp-lang', 'de'));
      await page.goto('./');
      await expect(page).toHaveURL(/\/de\/$/);
    });
  });
});
