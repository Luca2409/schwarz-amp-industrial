import { expect, test } from '@playwright/test';

/**
 * Certificates page: localized URLs, language switch, and working PDF downloads.
 * See docs/quality-checks.md.
 */

test('lists certificates with downloadable PDFs', async ({ page, request }) => {
  await page.goto('de/zertifikate/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/internationalen Standards/);

  const links = page.locator('.certificate-card__download');
  await expect(links).toHaveCount(2);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) {
    const response = await request.get(new URL(href, page.url()).href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
});

test('switches between the localized certificates pages', async ({ page, isMobile }) => {
  await page.goto('de/zertifikate/');
  if (isMobile) await page.getByText('Menü').click();
  await page.getByRole('link', { name: 'English' }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/certificates\/$/);
  await expect(page.locator('.certificate-card__download').first()).toHaveAttribute('href', /-en\.pdf$/);
});
