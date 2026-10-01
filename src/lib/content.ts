import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocalizedPath, type Alternate } from '@/i18n/utils';
import { languages, type Lang } from '@/i18n/ui';
import type { RouteKey } from '@/i18n/routes';

/** Content collections whose entries exist per language and are linked via `translationKey`. */
type TranslatedCollection = 'competencies' | 'legal';
type TranslatedEntry = CollectionEntry<TranslatedCollection>;

// URL segment per collection; legal pages live directly under /[lang]/.
const collectionRoutes: Record<TranslatedCollection, RouteKey | undefined> = {
  competencies: 'competencies',
  legal: undefined,
};

/**
 * Reads an entry's language from its id. Entry ids look like `de/vermessung`:
 * the folder is the language, the file name is the slug.
 *
 * @param entry A content entry (or anything with a content id).
 * @returns The language folder of the entry.
 */
export function getEntryLang(entry: { id: string }): Lang {
  return entry.id.split('/')[0] as Lang;
}

/**
 * Reads an entry's URL slug from its id, i.e. the file name without language folder.
 *
 * @param entry A content entry (or anything with a content id).
 * @returns The slug, e.g. `vermessung` for `de/vermessung`.
 */
export function getEntrySlug(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

/**
 * Builds the localized URL of a content entry.
 *
 * @param entry A competency or legal page entry.
 * @returns Root-relative URL, e.g. `/schwarz-amp-industrial/de/kompetenzen/vermessung/`
 *   or `/schwarz-amp-industrial/en/legal-notice/`.
 */
export function getEntryPath(entry: TranslatedEntry): string {
  return getLocalizedPath(getEntryLang(entry), collectionRoutes[entry.collection], getEntrySlug(entry));
}

/**
 * Finds all translations of an entry, linked through the shared `translationKey` frontmatter.
 *
 * @param entry The entry whose translations to find.
 * @param all All entries of the same collection, in every language.
 * @returns One alternate per existing translation, including `entry` itself.
 */
export function getEntryAlternates(entry: TranslatedEntry, all: TranslatedEntry[]): Alternate[] {
  return all
    .filter((other) => other.data.translationKey === entry.data.translationKey)
    .map((other) => ({ lang: getEntryLang(other), path: getEntryPath(other) }));
}

/**
 * Logs a build warning for every `translationKey` that doesn't exist in all languages.
 * Called from `getStaticPaths` of the content routes.
 *
 * @param entries All entries of one collection, in every language.
 * @example
 * // [i18n] legal "privacy-policy" has no translation for: en
 */
export function warnMissingTranslations(entries: TranslatedEntry[]): void {
  const langsByKey = new Map<string, Set<Lang>>();
  for (const entry of entries) {
    const langs = langsByKey.get(entry.data.translationKey) ?? new Set();
    langsByKey.set(entry.data.translationKey, langs.add(getEntryLang(entry)));
  }

  for (const [key, langs] of langsByKey) {
    const missing = languages.filter((lang) => !langs.has(lang));
    if (missing.length > 0) {
      const collection = entries[0].collection;
      console.warn(`[i18n] ${collection} "${key}" has no translation for: ${missing.join(', ')}`);
    }
  }
}

/**
 * Loads the competencies of one language.
 *
 * @param lang Language to load.
 * @returns Competency entries sorted by their `order` frontmatter.
 */
export async function getCompetencies(lang: Lang) {
  const entries = await getCollection('competencies', (entry) => getEntryLang(entry) === lang);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Finds a legal page by its `translationKey`, e.g. to link the privacy policy.
 *
 * @param lang Language of the page.
 * @param translationKey Key of the legal page, e.g. `privacy-policy`.
 * @returns Title and localized URL, or `undefined` if the page doesn't exist in `lang`.
 */
export async function getLegalPageLink(lang: Lang, translationKey: string) {
  const entry = (await getLegalPages(lang)).find((page) => page.data.translationKey === translationKey);
  return entry && { title: entry.data.title, href: getEntryPath(entry) };
}

/**
 * Loads the legal pages (Impressum, privacy policy, …) of one language, e.g. for the footer.
 *
 * @param lang Language to load.
 * @returns Legal page entries sorted by their `order` frontmatter.
 */
export async function getLegalPages(lang: Lang) {
  const entries = await getCollection('legal', (entry) => getEntryLang(entry) === lang);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
