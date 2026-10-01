import { getRelativeLocaleUrl } from 'astro:i18n';
import { ui, defaultLang, languages, type Lang, type UiKey } from './ui';
import { routes, type RouteKey } from './routes';

/** A translation of the current page, used for hreflang and the language picker. */
export interface Alternate {
  /** Language of the translation. */
  lang: Lang;
  /** Root-relative URL including `base`, e.g. `/schwarz-amp-industrial/en/`. */
  path: string;
}

/**
 * Creates a translation function for UI strings defined in `src/i18n/ui.ts`.
 *
 * @param lang Language to translate into.
 * @returns A function `t(key)` that returns the string for `key`, falling back to the
 *   default language if the key is missing in `lang`.
 * @example
 * const t = useTranslations('en');
 * t('nav.contact'); // "Contact"
 */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Builds a localized URL, translating the route segment via `src/i18n/routes.ts`.
 * The result includes `base` and the locale prefix and follows the `trailingSlash` setting.
 *
 * @param lang Target language.
 * @param route Optional route key whose segment is translated (e.g. `competencies`).
 * @param segments Further path segments appended as-is (e.g. a content slug).
 * @returns Root-relative URL.
 * @example
 * getLocalizedPath('de');                                // "/schwarz-amp-industrial/de/"
 * getLocalizedPath('de', 'competencies', 'vermessung');  // "/schwarz-amp-industrial/de/kompetenzen/vermessung/"
 */
export function getLocalizedPath(lang: Lang, route?: RouteKey, ...segments: string[]): string {
  const path = [route && routes[route][lang], ...segments].filter(Boolean).join('/');
  return getRelativeLocaleUrl(lang, path);
}

/**
 * Links to a section of the home page in the given language.
 *
 * @param lang Target language.
 * @param anchor Section id without `#`, e.g. `about`, `services`, `quality`, `contact`.
 * @returns Root-relative URL with fragment, e.g. `/schwarz-amp-industrial/de/#about`.
 */
export function getHomeAnchor(lang: Lang, anchor: string): string {
  return `${getLocalizedPath(lang)}#${anchor}`;
}

/**
 * Lists the translations of a page that exists under the same (translated) route in
 * every language, such as the home page. For content entries with individual slugs,
 * use `getEntryAlternates` from `src/lib/content.ts` instead.
 *
 * @param route Optional route key, see {@link getLocalizedPath}.
 * @param segments Further path segments, see {@link getLocalizedPath}.
 * @returns One alternate per configured language.
 */
export function getAlternates(route?: RouteKey, ...segments: string[]): Alternate[] {
  return languages.map((lang) => ({ lang, path: getLocalizedPath(lang, route, ...segments) }));
}
