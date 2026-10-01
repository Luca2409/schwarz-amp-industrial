import { expect, test } from '@playwright/test';

/**
 * Home page hero: the overlay header is transparent at the top and turns solid when
 * scrolling; subpages keep the solid header. See docs/quality-checks.md.
 */

const headerBackground = (page: import('@playwright/test').Page) =>
  page.locator('.site-header').evaluate((el) => getComputedStyle(el).backgroundColor);

test('home header is transparent over the hero and turns solid on scroll', async ({ page }) => {
  await page.goto('de/');
  await expect.poll(() => headerBackground(page)).toBe('rgba(0, 0, 0, 0)');

  await page.mouse.wheel(0, 400);
  await expect.poll(() => headerBackground(page)).not.toBe('rgba(0, 0, 0, 0)');

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => headerBackground(page)).toBe('rgba(0, 0, 0, 0)');
});

test('subpages keep the solid header', async ({ page }) => {
  await page.goto('de/kontakt/');
  await expect.poll(() => headerBackground(page)).not.toBe('rgba(0, 0, 0, 0)');
});

test.describe('on a laptop screen', () => {
  test.use({ viewport: { width: 1440, height: 790 } });

  test('shows the whole key facts island on the first screen', async ({ page }) => {
    await page.goto('de/');
    const box = await page.locator('.facts-bar__list').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(790);
  });
});
