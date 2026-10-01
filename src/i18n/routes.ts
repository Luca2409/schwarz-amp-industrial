import type { Lang } from './ui';

/**
 * Localized URL segments, keyed by route. Every language needs an entry.
 *
 * @example
 * // /de/kompetenzen/vermessung/  ↔  /en/competencies/dimensional-metrology/
 * routes.competencies.de; // "kompetenzen"
 */
export const routes = {
  competencies: { de: 'kompetenzen', en: 'competencies' },
  // Static routes: src/pages/de/kontakt.astro and src/pages/en/contact.astro must match.
  contact: { de: 'kontakt', en: 'contact' },
  // Static routes: src/pages/de/zertifikate.astro and src/pages/en/certificates.astro must match.
  certificates: { de: 'zertifikate', en: 'certificates' },
} as const satisfies Record<string, Record<Lang, string>>;

/** Name of a localized route, e.g. `competencies`. */
export type RouteKey = keyof typeof routes;

/**
 * Routes served by static page files (`src/pages/<lang>/<segment>.astro`) instead of a
 * dynamic `[lang]/[…]` route. The build checks that these files exist for every language.
 */
export const staticRoutes = ['contact', 'certificates'] as const satisfies readonly RouteKey[];
