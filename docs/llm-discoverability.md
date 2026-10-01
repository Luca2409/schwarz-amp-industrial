# Discoverability for language models

What the site provides so that AI assistants and AI search engines (ChatGPT, Claude, Perplexity, Google AI Overviews, Copilot, …) can find AMP, understand what it does and cite the right pages.

## Overview

| Building block | URL | Purpose | Source |
| --- | --- | --- | --- |
| `llms.txt` | `/llms.txt` | Short summary of AMP plus links to the key pages in both languages | `src/pages/llms.txt.ts`, `src/lib/llms.ts` |
| `llms-full.txt` | `/llms-full.txt` | Full text of home, competency, certificates and contact pages as one Markdown document | `src/pages/llms-full.txt.ts`, `src/lib/llms.ts` |
| `robots.txt` | `/robots.txt` | Allows all crawlers, names AI crawlers explicitly, points to `llms.txt` and the sitemap | `src/pages/robots.txt.ts` |
| Structured data | in every page's `<head>` | Organization with description, subject areas and offered services; services, breadcrumbs | `src/lib/structured-data.ts` |
| Sitemap with hreflang | `/sitemap-index.xml` | All pages and their translations | see [i18n-seo.md](./i18n-seo.md#sitemap-and-robotstxt) |
| Server-rendered HTML | every page | Content is in the HTML, no JavaScript needed to read it | Astro static build |

## llms.txt

Follows the proposal at [llmstxt.org](https://llmstxt.org): a Markdown file at the site root that tells language models what the site is about and where to look.

Structure:

```markdown
# AMP Prüftechnik

> One-paragraph summary: who AMP is, where, what it offers.

- Company, location, email, phone, languages

## Kompetenzen (Deutsch)
- [Title](absolute URL): SEO description
## Deutsch
- [Startseite](…), [Zertifikate](…), [Kontakt](…)
## Capabilities (English)
## English
## Optional
- Legal pages (can be skipped when context is short)
```

- **Generated, not hand-written:** links, titles and descriptions come from the content collections (`src/content/`), the UI strings (`src/i18n/ui.ts`) and `src/site.ts`. New competencies or legal pages appear automatically.
- **The summary paragraph** (the `>` line) is written in `buildLlmsTxt()` in `src/lib/llms.ts`. Update it when AMP's services change.
- **Company facts** only include values that aren't `[placeholders]`; the address appears once `site.address` in `src/site.ts` is filled in.
- **Absolute URLs** use `site` and `base` from `deploy.config.mjs`.

## llms-full.txt

The full text content in one file, so a language model can read everything without crawling every page. Per language:

- Home page: title, description, the "know-how" text and the quality statement
- Every competency page: description and full Markdown body
- Certificates: title, description and issuer of each certificate
- Contact page: intro text

Each page section starts with `URL: …`, so answers can cite the right page. Soft hyphens are removed and headings are nested consistently (`#` language, `##` page, `###` and below page content).

## robots.txt

```
User-agent: *
Allow: /

# AI search and answer engines are welcome.
User-agent: GPTBot
User-agent: ClaudeBot
…
Allow: /

# Summary for language models: …/llms.txt
Sitemap: …/sitemap-index.xml
```

- `User-agent: *` already allows every crawler; the AI crawlers are listed explicitly to make the intent unambiguous. Edit the list in `aiCrawlers` in `src/pages/robots.txt.ts`.
- To **block** a crawler instead, add a separate group, e.g. `User-agent: CCBot` / `Disallow: /`, before the `Sitemap` line.
- Listed: OpenAI (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`), Anthropic (`ClaudeBot`, `Claude-SearchBot`, `Claude-User`), Perplexity (`PerplexityBot`, `Perplexity-User`), Google (`Google-Extended`), Apple (`Applebot-Extended`), Microsoft (`Bingbot`).

## Structured data

The `Organization` on the home page contains, besides name, logo and contact:

| Property | Content |
| --- | --- |
| `description` | The home page's meta description |
| `knowsAbout` | The competency titles |
| `makesOffer` | One `Offer` → `Service` per competency, with name, description, URL and AMP as provider |
| `address` | Once `site.address` in `src/site.ts` is filled in |

Competency pages additionally carry a `Service`, all detail pages a `BreadcrumbList`. Full table: [i18n-seo.md → Structured data](./i18n-seo.md#structured-data).

## Prototype builds

In a [prototype build](./quality-checks.md#prototype-mode) `robots.txt` disallows all crawlers and every page is `noindex`. `llms.txt` and `llms-full.txt` are still generated, but crawlers that respect `robots.txt` won't fetch them.

## Limitations

- **Root location:** `llms.txt` and `robots.txt` are expected at the domain root. While the site runs under `luca2409.github.io/schwarz-amp-industrial/`, they're at `…/schwarz-amp-industrial/llms.txt`, where most tools won't look. On an own domain without `base` (see [i18n-seo.md → Move to your own domain](./i18n-seo.md#move-to-your-own-domain)) they're at the root automatically.
- **llms.txt is a proposal, not a standard.** Several AI tools read it, but none guarantees to. Structured data, clear page titles and descriptions, and server-rendered text matter at least as much.
- **Content quality decides.** Language models cite concrete, verifiable statements. Specific facts (founding year, certifications of the inspectors, industries served, reference projects) on the pages help more than any technical measure. Keep the certificates up to date: the ISO 9001 certificate currently listed expired on 2024-11-21.

## Checking

```bash
npm run build
cat dist/llms.txt dist/robots.txt
head -60 dist/llms-full.txt
```

`tests/e2e/llms.spec.ts` checks the format and links of `llms.txt`, the content of `llms-full.txt`, the AI crawler entries in `robots.txt` and the Organization structured data. Validate structured data with the [Schema Markup Validator](https://validator.schema.org/).
