import { i18n } from 'astro:config/client';

/**
 * UI strings (navigation, labels, aria labels, …). Page content lives in `src/content/`.
 * German is the reference: every other language must define the same keys, which
 * TypeScript enforces via `satisfies UiStrings`.
 */
const de = {
  'brand.subtitle': 'Zerstörungsfreie Werkstoffprüfung',
  'brand.homeLabel': 'AMP Startseite',

  'nav.about': 'Know-how',
  'nav.competencies': 'Kompetenzen',
  'nav.quality': 'Qualität',
  'nav.contact': 'Kontakt',
  'nav.cta': 'Projekt anfragen',
  'nav.menu': 'Menü',
  'nav.mainLabel': 'Hauptnavigation',
  'nav.mobileLabel': 'Mobile Hauptnavigation',

  'language.label': 'Sprache',
  'language.select': 'Sprache auswählen',

  'footer.navLabel': 'Footer-Navigation',
  'footer.legalLabel': 'Rechtliche Hinweise',
  'footer.tagline': 'Präzision. Erfahrung. Verantwortung.',

  'breadcrumb.home': 'Startseite',

  'notFound.title': 'Seite nicht gefunden',
  'notFound.text': 'Die angeforderte Seite existiert nicht oder wurde verschoben.',
  'notFound.home': 'Zur Startseite →',

  'competency.back': '← Alle Kompetenzen',
  'competency.eyebrow': 'AMP · Kompetenz',
  'competency.contactEyebrow': 'Kontakt',
  'competency.contactTitle': 'Projekt besprechen',
  'competency.contactText': 'Sie haben eine konkrete Prüfaufgabe? Sprechen Sie uns an.',
  'competency.contactCta': 'Kontakt aufnehmen →',
  'competency.relatedEyebrow': 'Weitere Kompetenzen',
  'competency.relatedTitle': 'Mehr aus unserem Leistungsspektrum.',

  'seo.defaultDescription': 'AMP – Zerstörungsfreie Werkstoffprüfung',
  'seo.imageAlt': 'AMP Prüftechnik im industriellen Einsatz',
} as const;

type UiStrings = Record<keyof typeof de, string>;

const en = {
  'brand.subtitle': 'Non-Destructive Testing',
  'brand.homeLabel': 'AMP home page',

  'nav.about': 'Expertise',
  'nav.competencies': 'Capabilities',
  'nav.quality': 'Quality',
  'nav.contact': 'Contact',
  'nav.cta': 'Request a project',
  'nav.menu': 'Menu',
  'nav.mainLabel': 'Main navigation',
  'nav.mobileLabel': 'Mobile main navigation',

  'language.label': 'Language',
  'language.select': 'Select language',

  'footer.navLabel': 'Footer navigation',
  'footer.legalLabel': 'Legal information',
  'footer.tagline': 'Precision. Experience. Responsibility.',

  'breadcrumb.home': 'Home',

  'notFound.title': 'Page not found',
  'notFound.text': 'The page you requested does not exist or has been moved.',
  'notFound.home': 'Go to home page →',

  'competency.back': '← All capabilities',
  'competency.eyebrow': 'AMP · Capability',
  'competency.contactEyebrow': 'Contact',
  'competency.contactTitle': 'Discuss your project',
  'competency.contactText': 'Do you have a specific inspection task? Get in touch with us.',
  'competency.contactCta': 'Get in touch →',
  'competency.relatedEyebrow': 'More capabilities',
  'competency.relatedTitle': 'Explore our full range of services.',

  'seo.defaultDescription': 'AMP – Non-Destructive Testing',
  'seo.imageAlt': 'AMP testing technology in industrial use',
} as const satisfies UiStrings;

/** UI strings per language; read them with `useTranslations` from `src/i18n/utils.ts`. */
export const ui = { de, en } as const satisfies Record<string, UiStrings>;

/** A supported language code, e.g. `de`. */
export type Lang = keyof typeof ui;
/** A translation key, e.g. `nav.contact`. */
export type UiKey = keyof typeof de;

/** Configured locales from `i18n.locales` in astro.config.mjs; `ui` must hold strings for each. */
export const languages = i18n!.locales.map((locale) =>
  typeof locale === 'string' ? locale : locale.path,
) as Lang[];
/** Default locale from `i18n.defaultLocale` in astro.config.mjs. */
export const defaultLang = i18n!.defaultLocale as Lang;

/**
 * Display and SEO metadata per language.
 * `name`: native name (aria label), `short`: language picker label, `ogLocale`: `og:locale` value.
 */

export const localeMeta: Record<Lang, { name: string; short: string; ogLocale: string }> = {
  de: { name: 'Deutsch', short: 'De', ogLocale: 'de_DE' },
  en: { name: 'English', short: 'En', ogLocale: 'en_US' },
};
