import { expect, test } from '@playwright/test';

/**
 * Discoverability for language models: llms.txt, llms-full.txt, robots.txt and the
 * Organization structured data. See docs/llm-discoverability.md.
 */

test('llms.txt follows the llmstxt.org format and links existing pages', async ({ request, baseURL }) => {
  const response = await request.get('llms.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();

  expect(text).toMatch(/^# .+\n\n> .+/); // H1 title, then a blockquote summary
  expect(text).toContain('## Optional');

  const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  expect(links.length).toBeGreaterThan(10);
  for (const link of links) {
    // Links point to the deployed site; check the same path on the site under test.
    const path = new URL(link).pathname.replace(/^\/[^/]+\//, '');
    expect((await request.get(new URL(path, baseURL).href)).status(), link).toBe(200);
  }
});

test('llms-full.txt contains the content of every language', async ({ request }) => {
  const text = await (await request.get('llms-full.txt')).text();
  expect(text).toContain('# Deutsch');
  expect(text).toContain('# English');
  expect(text).toContain('FARO Laser Tracker');
  expect(text).not.toContain('­');
});

test('robots.txt welcomes AI crawlers and points to llms.txt', async ({ request }) => {
  const text = await (await request.get('robots.txt')).text();
  // A prototype deployment disallows everything; the full check only applies otherwise.
  test.skip(text.includes('Disallow: /'), 'Prototype build');
  expect(text).toContain('User-agent: GPTBot');
  expect(text).toContain('User-agent: ClaudeBot');
  expect(text).toMatch(/llms\.txt/);
});

test('home page describes the company and its services as structured data', async ({ page }) => {
  await page.goto('en/');
  const data = await page.locator('script[type="application/ld+json"]').first().textContent();
  const organization = JSON.parse(data!)[0];
  expect(organization['@type']).toBe('Organization');
  expect(organization.description).toBeTruthy();
  expect(organization.makesOffer.length).toBe(3);
});
