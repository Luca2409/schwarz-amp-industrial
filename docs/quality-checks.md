# Checks and tests

Everything that verifies the site automatically: type checks, content validation, build checks and end-to-end tests, and when each of them runs.

## Overview

| Check | Command / trigger | Catches | Local | CI |
| --- | --- | --- | --- | --- |
| [Type check](#type-check) | `npm run check` | Missing translation keys, incomplete route translations, wrong props | error | **not run** (see [Gaps](#gaps)) |
| [Content schemas](#content-schemas) | every build and dev server | Missing/invalid frontmatter, missing image files | error | error |
| [Missing translations](#missing-translations) | every build | Content not available in every language | warning | warning |
| [Contact configuration](#contact-configuration) | every build | Address, contact person, role, form endpoint not set | warning | warning |
| [Placeholders](#placeholders) | build, dev server start | `[placeholders]` in company data, UI strings, legal pages | warning | **error** (warning in a [prototype build](#prototype-mode)) |
| [Static route files](#static-route-files) | build, dev server start | Contact route files not matching `routes.ts` | error (dev: warning) | error |
| [End-to-end tests](#end-to-end-tests) | `npm run test:e2e` | Broken form, map consent, language switching, root redirect | error | error |

Before pushing, run:

```bash
npm run check && npm run build && npm run test:e2e
```

## Type check

`npm run check` runs `astro check`, which type-checks `.astro` and `.ts` files, including the tests. Beyond normal type errors, the types enforce:

| Rule | Where | How |
| --- | --- | --- |
| Every language has every UI string | `src/i18n/ui.ts` | `en` must `satisfies UiStrings` (the German keys) |
| Every route has a segment per language | `src/i18n/routes.ts` | `satisfies Record<string, Record<Lang, string>>` |
| Static routes are valid route keys | `src/i18n/routes.ts` | `staticRoutes` `satisfies readonly RouteKey[]` |
| Every language has display/SEO metadata | `src/i18n/ui.ts` | `localeMeta: Record<Lang, …>` |
| Only existing translation keys are used | components | `t(key)` accepts only `UiKey` |

## Content schemas

`src/content.config.ts` defines a Zod schema per collection (`pages`, `competencies`, `legal`). The build and the dev server reject entries with missing or wrongly typed fields. Fields declared with `image()` (`heroImage`, `showcaseImage`, `ogImage`) also fail if the referenced file doesn't exist.

> After changing a schema, restart the dev server: its content cache can keep entries that were invalid in between.

## Build checks

### Missing translations

`warnMissingTranslations()` (`src/lib/content.ts`) runs in `getStaticPaths` of the competency and legal page routes. It warns about every `translationKey` that doesn't exist in all languages:

```
[i18n] legal "privacy-policy" has no translation for: en
```

The page is still built; it just has no counterpart in the missing language.

### Expired certificates

`warnExpiredCertificates()` (`src/lib/certificates.ts`) warns during the build about certificates whose `validUntil` has passed:

```
[certificates] "iso-9001" expired on 2024-11-21; replace it in src/lib/certificates.ts
```

### Contact configuration

`ContactPage.astro` warns per language while contact settings are missing (`getMissingContactSettings()` in `src/site.ts`, plus the role in `ui.ts`):

```
[contact] de: not configured yet: address (src/site.ts), contactPerson.name (src/site.ts), contactForm.endpoint (src/site.ts), contact.personRole (src/i18n/ui.ts)
```

An empty form endpoint doesn't fail the build: the form is then shown disabled with an email fallback.

### Placeholders

The `siteChecks()` integration (`src/integrations/site-checks.ts`) finds unfilled placeholders:

| Where | What counts as placeholder |
| --- | --- |
| `src/site.ts`, `src/i18n/ui.ts` | String literals in square brackets, e.g. `'[PLZ]'` |
| `src/content/legal/**/*.md` | Bracketed text that isn't a Markdown link, e.g. `[Registernummer]`; HTML comments are ignored |

| Environment | Result |
| --- | --- |
| Dev server start, local build | Warning listing every placeholder per file |
| CI (`CI=true`, set by GitHub Actions) | **Build fails**, so an incomplete Impressum or contact page is never deployed |
| `PUBLIC_PROTOTYPE=true` | Warning only; prototype build that can be deployed. Every page gets `noindex` and `robots.txt` disallows all crawlers, so placeholder legal texts don't end up in search engines |
| `ALLOW_PLACEHOLDERS=true` | Warning only; used by the e2e test build, which is never deployed |

Competency content isn't scanned, because method abbreviations like `[RT]` or `[PMI]` look like placeholders.

### Prototype mode

A prototype build lets you deploy a draft while legal texts or contact data still contain `[placeholders]`, without the draft showing up in search engines.

**Switch it on**

| Where | How |
| --- | --- |
| GitHub Actions (deploy) | Repository variable `PROTOTYPE` = `true` (Settings → Secrets and variables → Actions → Variables). The workflow passes it to the build as `PUBLIC_PROTOTYPE`. |
| Locally | `PUBLIC_PROTOTYPE=true npm run build` (or `npm run dev`) |

Switch it off for the real launch by deleting the variable or setting it to anything other than `true`.

**What changes**

| Area | Normal build | Prototype build | Implemented in |
| --- | --- | --- | --- |
| Placeholder check in CI | Build fails | Warning only | `src/integrations/site-checks.ts` |
| Robots meta tag | Only on pages with `noindex` (404, root redirect) | `noindex` on every page | `src/layouts/BaseLayout.astro` |
| `robots.txt` | `Allow: /` plus sitemap | `Disallow: /` | `src/pages/robots.txt.ts` |

Everything else (content, sitemap, structured data, tests) stays the same.

**Keep in mind**

- The site is still reachable for anyone with the link; `noindex` only keeps it out of search results. Don't share a prototype with placeholder legal texts publicly.
- Pages that search engines indexed before the prototype was deployed disappear only after the next crawl.
- `robots.txt` only works at the domain root, so on the GitHub Pages project URL only the `noindex` tag takes effect (see [i18n-seo.md → robots.txt](./i18n-seo.md#robotstxt)).
- `ALLOW_PLACEHOLDERS=true` only skips the placeholder check without hiding the site. It exists for the e2e test build, which is never deployed; use `PUBLIC_PROTOTYPE` for deployments.

### Static route files

Routes listed in `staticRoutes` (`src/i18n/routes.ts`) use static page files instead of a dynamic route, currently `contact` and `certificates`. `siteChecks()` verifies that `src/pages/<lang>/<segment>.astro` exists for every language, so renaming a segment in `routes.ts` without renaming the file can't break links unnoticed:

```
Static route files don't match src/i18n/routes.ts. Missing: src/pages/en/contact.astro
```

## End-to-end tests

[Playwright](https://playwright.dev/) tests in `tests/e2e/`, configured in `playwright.config.ts`.

### Setup

The tests run either against a local test build (default) or against any deployed site:

| Mode | Command | Site under test |
| --- | --- | --- |
| Local (default, CI) | `npm run test:e2e` | `astro build --outDir dist-e2e` (separate from `dist/`, which gets deployed), served by `astro preview` on port 4399 under the base path from `deploy.config.mjs` |
| Deployed site | `E2E_BASE_URL=https://luca2409.github.io/schwarz-amp-industrial/ npm run test:e2e` | The given URL; no local server is started |

Tests use URLs relative to the site (e.g. `de/kontakt/`), so they work with any domain and base path.

- **Form service is always mocked:** the tests read the endpoint from the form's `action` and intercept it, so no real submission is sent, not even against production. The local test build uses the fake endpoint `PUBLIC_CONTACT_FORM_ENDPOINT=https://forms.example.test/submit`.
- **Form tests skip on unconfigured deployments:** if the page's form has no endpoint (form shown disabled), the 4 submission tests are skipped.
- **Provider-neutral:** the honeypot name and subject field (`subject` / `_subject`) are read from the page, not assumed.
- **Google is intercepted** in the map test, so no request leaves the machine.
- **Browser:** the installed Google Chrome (`channel: 'chrome'`), no separate browser download. GitHub's Ubuntu runners have Chrome preinstalled.
- **Projects:** every test runs twice, on `desktop` (Desktop Chrome) and `mobile` (Pixel 7 viewport).
- **Workers:** 2; more parallel Chrome instances caused startup timeouts.
- **On failure:** a trace is kept in `test-results/`; in CI it's uploaded as artifact `playwright-traces`.

### Test cases

`tests/e2e/certificates.spec.ts`:

| Test | Verifies |
| --- | --- |
| lists certificates with downloadable PDFs | Both download links return a PDF (HTTP 200, `application/pdf`) |
| switches between the localized certificates pages | `/de/zertifikate/` → `/en/certificates/`, English PDF linked |

`tests/e2e/llms.spec.ts`:

| Test | Verifies |
| --- | --- |
| llms.txt follows the llmstxt.org format and links existing pages | H1 + blockquote, `## Optional` section, every linked page returns 200 |
| llms-full.txt contains the content of every language | German and English sections, competency content, no soft hyphens |
| robots.txt welcomes AI crawlers and points to llms.txt | AI crawler entries and llms.txt reference (skipped on prototype deployments) |
| home page describes the company and its services as structured data | `Organization` with description and three offered services |

`tests/e2e/contact.spec.ts`:

| Test | Verifies |
| --- | --- |
| sends the form and shows a success message | Request contains the fields, `language` and the subject (`subject` or `_subject`); honeypot not sent; success message; form cleared |
| shows an error when the service rejects the submission with HTTP 200 | `{"success": false}` is treated as error; input is kept |
| shows an error when the service fails | HTTP 500 shows the error with the email address |
| shows validation messages in the page language | German messages for empty and invalid fields; no request sent |
| contact form has an always-present, empty status region before submitting | Live region exists before the first submit (screen reader announcements); also runs when the form isn't configured |
| loads nothing from Google until the visitor clicks "Load map" | Zero Google requests before the click; iframe with Google URL and title afterwards; at least 300px high |
| links to Google Maps in a new tab without embedding | External link uses the official Maps URL and `target="_blank"` |

`tests/e2e/i18n.spec.ts`:

| Test | Verifies |
| --- | --- |
| switches between the localized contact pages and remembers the choice | `/de/kontakt/` → `/en/contact/`, `<html lang="en">`, choice saved in localStorage |
| switches a competency page to its translation with a different slug | `/de/kompetenzen/vermessung/` → `/en/competencies/dimensional-metrology/` |
| root redirect: English browser | `/` → `/en/` |
| root redirect: French browser | `/` → `/de/` (fallback) |
| root redirect: saved choice | Saved `de` wins over an English browser |

### Running and debugging

```bash
npm run test:e2e                                      # all tests, both projects
E2E_BASE_URL=https://… npm run test:e2e               # against a deployed site
npx playwright test -g "contact form"                 # filter by test name
npx playwright test --project=mobile                  # one project
npx playwright test --headed                          # watch the browser
npx playwright show-trace test-results/…/trace.zip    # inspect a failure step by step
```

### Writing a test

- Put it in `tests/e2e/<area>.spec.ts`. Use URLs relative to `baseURL` without a leading slash, e.g. `page.goto('de/kontakt/')`, never absolute paths or the base path, so the test works locally and against any deployment.
- Read environment-specific values (endpoints, field names) from the page instead of hard-coding them.
- Prefer accessible locators (`getByRole`, `getByLabel`) over CSS selectors; they also check accessibility.
- Mock every external service with `page.route()`.
- On mobile, navigation links are in the collapsed menu; open it first (see `i18n.spec.ts`).

## CI pipeline

`.github/workflows/deploy.yml`, on every push to `main`:

| Step | Fails on |
| --- | --- |
| Checkout (full history) | |
| `npm ci` | Lockfile mismatch |
| `npm run build` | Schema errors, placeholders (not in a prototype build), static route mismatch |
| `npm run test:e2e` | Any failing test (one retry in CI) |
| Upload traces | Only runs if a previous step failed |
| Upload `dist/` and deploy | |

Nothing is deployed if any step fails.

## Gaps

- **`npm run check` isn't part of CI.** Type errors, such as a missing English translation key, only show up when someone runs it locally. Adding `- run: npm run check` before the build step in `deploy.yml` would close this.
- **The real form service isn't tested.** The tests use a mock; after configuring the service, send one real inquiry on the live site.
- **No visual regression tests.** Layout changes aren't caught automatically.
- **No smoke test after deploying.** The tests run before the deploy against a local build. A job after `deploy` running `npm run test:e2e` with `E2E_BASE_URL` set to the deployed URL would verify the live site.
