import { getCollection, type CollectionEntry } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';

export const supportedLocales = ['de', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];

const competencyRouteSegments: Record<Locale, string> = {
  de: 'kompetenzen',
  en: 'competencies',
};

function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

function parseCompetencyId(id: string) {
  const [locale, ...slugParts] = id.split('/');
  const slug = slugParts.join('/');

  if (!isLocale(locale) || !slug) {
    throw new Error(
      `Invalid competency content path "${id}". Expected "de/<slug>" or "en/<slug>".`
    );
  }

  return { locale, slug };
}

export function getCompetencyUrl(locale: Locale, slug: string) {
  return getRelativeLocaleUrl(
    locale,
    `${competencyRouteSegments[locale]}/${slug}`
  );
}

export async function getCompetencyStaticPaths(locale: Locale) {
  const allEntries = await getCollection('competencies');
  const entriesByTranslation = new Map<string, CollectionEntry<'competencies'>>();

  for (const entry of allEntries) {
    const parsed = parseCompetencyId(entry.id);
    const mapKey = `${parsed.locale}:${entry.data.translationKey}`;

    if (entriesByTranslation.has(mapKey)) {
      throw new Error(
        `Duplicate competency translationKey "${entry.data.translationKey}" for locale "${parsed.locale}".`
      );
    }

    entriesByTranslation.set(mapKey, entry);
  }

  const alternateLocale: Locale = locale === 'de' ? 'en' : 'de';
  const localizedEntries = allEntries.filter(
    (entry) => parseCompetencyId(entry.id).locale === locale
  );

  return localizedEntries.map((entry) => {
    const { slug } = parseCompetencyId(entry.id);
    const alternateEntry = entriesByTranslation.get(
      `${alternateLocale}:${entry.data.translationKey}`
    );

    if (!alternateEntry) {
      console.warn(
        `[i18n] Missing ${alternateLocale} translation for competency "${entry.data.translationKey}".`
      );
    }

    const alternateLocaleUrl = alternateEntry
      ? getCompetencyUrl(
          alternateLocale,
          parseCompetencyId(alternateEntry.id).slug
        )
      : undefined;

    return {
      params: { id: slug },
      props: { entry, alternateLocaleUrl },
    };
  });
}
