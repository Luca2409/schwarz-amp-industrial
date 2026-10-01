import { expect, test, type Page } from '@playwright/test';

/**
 * Contact page: form submission and error handling against a mocked form service,
 * validation messages, the status live region, and the Google Maps two-click solution.
 * Works against the local test build and any deployment (E2E_BASE_URL): the form service
 * is always mocked, whatever endpoint the page is configured with. See docs/quality-checks.md.
 */

const contactForm = (page: Page) => page.locator('form[data-contact-form]');

/**
 * Intercepts the form service the page posts to (the form's `action`) and answers with
 * the given status and JSON body, so no real submission is ever sent.
 *
 * @param page The page under test, already on the contact page.
 * @param status HTTP status of the mocked response.
 * @param body JSON body of the mocked response.
 * @returns Array that collects the raw request bodies of all submissions.
 */
async function mockFormService(page: Page, status: number, body: object) {
  const endpoint = await contactForm(page).getAttribute('action');
  if (!endpoint) throw new Error('Contact form has no action; is the form service configured?');

  const requests: string[] = [];
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postData() ?? '');
    await route.fulfill({
      status,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(body),
    });
  });
  return requests;
}

/** Fills in the required fields of the German contact form with valid values. */
async function fillForm(page: Page) {
  await page.getByLabel('Name *').fill('Erika Mustermann');
  await page.getByLabel('E-Mail *').fill('erika@example.com');
  await page.getByLabel('Ihre Nachricht *').fill('Wir benötigen eine Ultraschallprüfung.');
}

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('de/kontakt/');
    // A deployment without configured form service shows the form disabled; nothing to submit.
    const configured = (await contactForm(page).getAttribute('action')) !== null;
    test.skip(!configured, 'Form service not configured (site.contactForm.endpoint is empty)');
  });

  test('sends the form and shows a success message', async ({ page }) => {
    const requests = await mockFormService(page, 200, { success: true });
    await fillForm(page);
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page.getByRole('status')).toHaveText(/Vielen Dank/);
    await expect(page.getByLabel('Name *')).toHaveValue('');

    expect(requests).toHaveLength(1);
    expect(requests[0]).toContain('Erika Mustermann');
    expect(requests[0]).toContain('name="language"\r\n\r\nde');
    // `subject` (Web3Forms) or `_subject` (Formspree), depending on site.contactForm.subjectField.
    expect(requests[0]).toMatch(/name="_?subject"/);
    // The unchecked honeypot checkbox isn't submitted.
    const honeypot = await contactForm(page).locator('.contact-form__honeypot input').getAttribute('name');
    expect(requests[0]).not.toContain(`name="${honeypot}"`);
  });

  test('shows an error when the service rejects the submission with HTTP 200', async ({ page }) => {
    await mockFormService(page, 200, { success: false, message: 'Invalid access key' });
    await fillForm(page);
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page.getByRole('status')).toHaveText(/konnte nicht gesendet werden.*info@amp-zfp\.de/);
    await expect(page.getByLabel('Name *')).toHaveValue('Erika Mustermann');
  });

  test('shows an error when the service fails', async ({ page }) => {
    await mockFormService(page, 500, {});
    await fillForm(page);
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    await expect(page.getByRole('status')).toHaveText(/konnte nicht gesendet werden/);
  });

  test('shows validation messages in the page language', async ({ page }) => {
    const requests = await mockFormService(page, 200, { success: true });
    await page.getByLabel('E-Mail *').fill('not-an-email');
    await page.getByRole('button', { name: 'Anfrage senden' }).click();

    const nameMessage = await page.getByLabel('Name *').evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(nameMessage).toBe('Bitte füllen Sie dieses Feld aus.');

    await page.getByLabel('Name *').fill('Erika Mustermann');
    await page.getByRole('button', { name: 'Anfrage senden' }).click();
    const emailMessage = await page.getByLabel('E-Mail *').evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(emailMessage).toBe('Bitte geben Sie eine gültige E-Mail-Adresse ein.');

    expect(requests).toHaveLength(0);
  });
});

test('contact form has an always-present, empty status region before submitting', async ({ page }) => {
  await page.goto('de/kontakt/');
  await expect(page.getByRole('status')).toBeAttached();
  await expect(page.getByRole('status')).toBeEmpty();
});

test.describe('Google Maps', () => {
  test('loads nothing from Google until the visitor clicks "Load map"', async ({ page }) => {
    const googleRequests: string[] = [];
    await page.route(/google\./, async (route) => {
      googleRequests.push(route.request().url());
      await route.fulfill({ contentType: 'text/html', body: '<html><body>map</body></html>' });
    });

    await page.goto('en/contact/');
    await page.waitForLoadState('networkidle');
    expect(googleRequests).toHaveLength(0);
    await expect(page.locator('iframe')).toHaveCount(0);

    await page.getByRole('button', { name: 'Load map' }).click();

    const iframe = page.locator('iframe.google-map__frame');
    await expect(iframe).toHaveAttribute('src', /google\.com\/maps/);
    await expect(iframe).toHaveAttribute('title', 'AMP location on Google Maps');
    await expect.poll(() => googleRequests.length).toBeGreaterThan(0);

    // The iframe fills the map box instead of collapsing to the default 150px height.
    const box = await iframe.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(300);
  });

  test('links to Google Maps in a new tab without embedding', async ({ page }) => {
    await page.goto('en/contact/');
    const link = page.getByRole('link', { name: /Open in Google Maps/ });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  });
});
