# TODO – SEO & i18n

Open points after the i18n/SEO/sitemap setup (Oct 2026). Check items off as they're done.

## Must-have

- [x] **Impressum & Datenschutzerklärung** – legally required in Germany. Add DE/EN pages with localized slugs (e.g. `/de/impressum/` ↔ `/en/legal-notice/`) and pass them to the unused `legalLinks` prop in `Footer.astro`.
- [ ] **Own domain** – the site runs under `luca2409.github.io/schwarz-amp-industrial`, so canonicals, hreflang and the sitemap point there, and `robots.txt` is ignored (crawlers only read it at the domain root). When the domain is ready: set `site` in `astro.config.mjs`, remove `base`.
- [x] **Favicon** – no icon link in `BaseLayout.astro`, no favicon in `public/`.
- [x] **Image optimization** – images are served unprocessed from `public/`. `hero-image.jpg` (2560×1440, LCP) and `showcase-image.png` (2.1 MB, seemingly unused). Move to `src/assets/`, use `astro:assets` `<Image>` and `image()` in the content schema.
- [x] **Better meta texts** – `seoDescription` of competencies is ~30 chars (aim for ~150). Titles like "Vermessung | AMP" could include keywords.

## Worth adding

- [x] **Structured data (JSON-LD)** – `Organization`/`LocalBusiness` (address, phone, email) on home, `Service` on competency pages, `BreadcrumbList` on detail pages.
- [x] **Central site config** – email/phone are hard-coded in `Footer.astro`, both `home.md` files and `[slug].astro`. Move to e.g. `src/site.ts`.
- [x] **Localized 404 page** – `src/pages/404.astro`.
- [x] **Translation check** – warn at build time when a `translationKey` is missing in a language.
- [x] **OG image** – dedicated 1200×630 image (optionally per page) plus `og:image:width`/`og:image:height`.

## Nice to have

- [x] **Language detection on `/`** – redirect to `/en/` for English browsers, keep `/de/` as fallback.
- [x] **`lastmod` in sitemap** – from git history or a frontmatter date.
- [x] **Internal linking** – link related competencies on detail pages.
- [x] **`.gitignore`** – add `.DS_Store`.

## Follow-ups

- [ ] **Fill in legal pages** – `src/content/legal/**` are templates; complete every `[placeholder]` and have them legally reviewed. Phone/email there are duplicated from `src/site.ts` (Markdown can't import it).
- [ ] **Unused images** – `public/images/showcase-image.png` (2.1 MB) and `hero-placeholder.svg` aren't referenced but still get deployed.
- [ ] **Company address in JSON-LD** – add `address` to `src/site.ts` and the `Organization` in `src/lib/structured-data.ts` once known.

## Notes

Full feature documentation: [i18n-seo.md](./i18n-seo.md).


- `/` is handled by `src/pages/index.astro` (Astro's `redirectToDefaultLocale` is off): it redirects to the language saved by the language picker, else the browser language, else `/de/`.
- `lastmod` comes from the git history of each page's source files (`src/lib/last-modified.ts`), so the deploy workflow checks out the full history (`fetch-depth: 0`).
- How it's wired: UI strings in `src/i18n/ui.ts`, localized URL segments in `src/i18n/routes.ts`, translations of content linked via `translationKey` frontmatter, hreflang rendered in `BaseLayout.astro` and copied into the sitemap by `src/i18n/sitemap.ts`. Company data in `src/site.ts`, JSON-LD builders in `src/lib/structured-data.ts`, content helpers in `src/lib/content.ts`.
