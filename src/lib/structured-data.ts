import { getAbsoluteLocaleUrl } from 'astro:i18n';
import { defaultLang, type Lang } from '@/i18n/ui';
import { site } from '@/site';

// schema.org JSON-LD objects, rendered into <head> by the JsonLd component.

/** Stable id of the organization node, so other nodes can reference it across pages. */
const organizationId = () => `${getAbsoluteLocaleUrl(defaultLang)}#organization`;

/**
 * Describes the company as a schema.org `Organization`. Rendered on the home pages.
 *
 * @param lang Language of the current page; sets the organization's `url`.
 * @param siteUrl Absolute site URL (`Astro.site`), used to make the logo URL absolute.
 * @returns JSON-LD object built from `src/site.ts`.
 */
export function organization(lang: Lang, siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(),
    name: site.company,
    alternateName: site.name,
    url: getAbsoluteLocaleUrl(lang),
    logo: new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}${site.logo}`, siteUrl).href,
    email: site.email,
    telephone: site.phone.display,
  };
}

/**
 * Describes the website of one language as a schema.org `WebSite`. Rendered on the home pages.
 *
 * @param lang Language of the website version.
 * @param name Site name, typically the home page title.
 * @param description Site description, typically the home page description.
 * @returns JSON-LD object referencing the organization as publisher.
 */
export function website(lang: Lang, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: getAbsoluteLocaleUrl(lang),
    inLanguage: lang,
    publisher: { '@id': organizationId() },
  };
}

/**
 * Describes a competency as a schema.org `Service`. Rendered on competency pages.
 *
 * @param lang Language of the page.
 * @param name Service name, e.g. the competency title.
 * @param description Service description, e.g. the competency's `seoDescription`.
 * @param url Absolute URL of the competency page.
 * @returns JSON-LD object referencing the organization as provider.
 */
export function service(lang: Lang, name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    inLanguage: lang,
    provider: { '@id': organizationId() },
  };
}

/**
 * Describes the page's position in the site as a schema.org `BreadcrumbList`.
 *
 * @param items Breadcrumb trail from the home page to the current page, with absolute URLs.
 * @returns JSON-LD object with numbered list items.
 */
export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
