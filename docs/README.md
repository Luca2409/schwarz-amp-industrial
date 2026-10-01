# Documentation

| Document | Content |
| --- | --- |
| [../README.md](../README.md) | Setup, scripts, project structure, content editing, deployment, styling |
| [i18n-seo.md](./i18n-seo.md) | Languages, localized URLs, translations, SEO tags, structured data, sitemap |
| [contact-page.md](./contact-page.md) | Contact page, form service, Google Maps, legal implications |
| [quality-checks.md](./quality-checks.md) | Type check, content validation, build checks, e2e tests, CI pipeline |

Code is documented with JSDoc comments on functions, exported values and component props.

## Feature overview

### Languages and URLs

| Feature | Summary | Docs | Key files |
| --- | --- | --- | --- |
| i18n routing | German and English under `/de/` and `/en/`, configured once in `astro.config.mjs` | [i18n-seo.md → Configuration](./i18n-seo.md#configuration) | `astro.config.mjs` |
| UI translations | Translation keys for all fixed texts, completeness type-checked | [i18n-seo.md → UI translations](./i18n-seo.md#ui-translations) | `src/i18n/ui.ts`, `src/i18n/utils.ts` |
| Content translations | One Markdown file per language, linked via `translationKey` | [i18n-seo.md → Content translations](./i18n-seo.md#content-translations) | `src/content/`, `src/lib/content.ts` |
| Localized URLs | Translated route segments and slugs, e.g. `/de/kompetenzen/vermessung/` ↔ `/en/competencies/dimensional-metrology/` | [i18n-seo.md → Localized route segments](./i18n-seo.md#localized-route-segments) | `src/i18n/routes.ts` |
| Language picker | Links to the current page's translation; remembers the choice | [i18n-seo.md → Language selection](./i18n-seo.md#language-selection) | `src/components/LanguagePicker.astro` |
| Root redirect | `/` redirects by saved choice, browser language, or to `/de/` | [i18n-seo.md → Root redirect](./i18n-seo.md#root-redirect-) | `src/pages/index.astro` |

### SEO

| Feature | Summary | Docs | Key files |
| --- | --- | --- | --- |
| Head tags | Title, description, canonical, Open Graph, Twitter, favicon, `noindex` | [i18n-seo.md → SEO tags](./i18n-seo.md#seo-tags) | `src/layouts/BaseLayout.astro` |
| hreflang | Alternates incl. `x-default` on every translated page | [i18n-seo.md → SEO tags](./i18n-seo.md#seo-tags) | `src/layouts/BaseLayout.astro` |
| Structured data | `Organization`, `WebSite`, `Service`, `ContactPage`, `BreadcrumbList` | [i18n-seo.md → Structured data](./i18n-seo.md#structured-data) | `src/lib/structured-data.ts`, `src/components/JsonLd.astro` |
| Sitemap | With hreflang alternates and `lastmod` from git | [i18n-seo.md → Sitemap](./i18n-seo.md#sitemap-and-robotstxt) | `src/i18n/sitemap.ts`, `src/lib/last-modified.ts` |
| robots.txt | Allows all, points to the sitemap | [i18n-seo.md → robots.txt](./i18n-seo.md#robotstxt) | `src/pages/robots.txt.ts` |
| Social preview image | 1200×630, generated; optional per competency | [i18n-seo.md → SEO tags](./i18n-seo.md#seo-tags) | `src/layouts/BaseLayout.astro` |
| Meta texts | SEO title and description per competency | [i18n-seo.md → Competency frontmatter](./i18n-seo.md#competency-frontmatter) | `src/content/competencies/` |
| Internal linking | Related competencies on every competency page | [i18n-seo.md → Internal linking](./i18n-seo.md#internal-linking) | `src/pages/[lang]/[competencies]/[slug].astro` |

### Pages and content

| Feature | Summary | Docs | Key files |
| --- | --- | --- | --- |
| Contact page | Contact person, address, form, Google Maps with consent | [contact-page.md](./contact-page.md) | `src/components/ContactPage.astro` |
| Legal pages | Impressum and privacy policy per language, linked in the footer (templates) | [i18n-seo.md → Legal pages](./i18n-seo.md#legal-pages) | `src/content/legal/` |
| 404 page | Bilingual, `noindex` | [i18n-seo.md → 404 page](./i18n-seo.md#404-page) | `src/pages/404.astro` |
| Site config | Company data, address, contact person, form service in one place | [i18n-seo.md → Site config](./i18n-seo.md#site-config), [contact-page.md → Setup](./contact-page.md#setup-checklist) | `src/site.ts` |
| Image optimization | WebP in several sizes via `astro:assets` | [i18n-seo.md → Images](./i18n-seo.md#images) | `src/assets/images/` |
| Favicon | SVG plus Apple touch icon | [i18n-seo.md → SEO tags](./i18n-seo.md#seo-tags) | `public/favicon.svg` |

### Quality

| Feature | Summary | Docs | Key files |
| --- | --- | --- | --- |
| Build checks | Missing translations, contact config, placeholders (block CI), static route files | [quality-checks.md → Build checks](./quality-checks.md#build-checks) | `src/integrations/site-checks.ts` |
| E2E tests | 12 Playwright tests on desktop and mobile, against a local build or a deployed site (`E2E_BASE_URL`) | [quality-checks.md → End-to-end tests](./quality-checks.md#end-to-end-tests) | `tests/e2e/`, `playwright.config.ts` |
| Deploy config | Domain and base path in one place, shared by Astro and the tests | [i18n-seo.md → Move to your own domain](./i18n-seo.md#move-to-your-own-domain) | `deploy.config.mjs` |
| CI pipeline | Build, test, deploy to GitHub Pages | [quality-checks.md → CI pipeline](./quality-checks.md#ci-pipeline) | `.github/workflows/deploy.yml` |
