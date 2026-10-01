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
} as const satisfies Record<string, Record<Lang, string>>;

/** Name of a localized route, e.g. `competencies`. */
export type RouteKey = keyof typeof routes;
