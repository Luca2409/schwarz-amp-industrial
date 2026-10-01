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
  'footer.relatedLabel': 'Weitere Unternehmen',
  'footer.tagline': 'Präzision. Erfahrung. Verantwortung.',

  'breadcrumb.home': 'Startseite',

  'nav.certificates': 'Zertifikate',

  'certificates.metaTitle': 'Zertifikate – ISO 9001 und DGZfP | AMP',
  'certificates.metaDescription': 'Zertifikate und Mitgliedschaften von AMP Prüftechnik: Qualitätsmanagement nach ISO 9001 und Mitgliedschaft in der Deutschen Gesellschaft für Zerstörungsfreie Prüfung (DGZfP).',
  'certificates.eyebrow': 'Zertifikate',
  'certificates.title': 'Alles nach internationalen Standards.',
  'certificates.intro': 'AMP erfüllt weltweite Anforderungen an Schweißbefähigungen und Qualitätszertifizierungen nach internationalen Standards.',
  'certificates.issuer': 'Ausgestellt von',
  'certificates.download': 'PDF herunterladen',
  'certificates.germanOnly': 'nur auf Deutsch',
  'certificates.quality': 'Zertifikate ansehen →',

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

  'contact.metaTitle': 'Kontakt – Prüfaufgabe anfragen | AMP',
  'contact.metaDescription': 'Kontakt zu AMP Prüftechnik: Anfrage zu zerstörungsfreier Werkstoffprüfung, Vermessung oder Inspektionen per Formular, E-Mail oder Telefon.',
  'contact.eyebrow': 'Kontakt',
  'contact.title': 'Sprechen Sie uns an.',
  'contact.intro': 'Beschreiben Sie uns Ihre Prüfaufgabe – wir melden uns schnellstmöglich bei Ihnen.',
  'contact.personEyebrow': 'Ihr Ansprechpartner',
  'contact.personRole': '[Funktion, z. B. Leitung Prüfzentrum]',
  'contact.addressEyebrow': 'Anschrift',
  'contact.phone': 'Telefon',
  'contact.email': 'E-Mail',

  'contact.form.title': 'Anfrage senden',
  'contact.form.name': 'Name',
  'contact.form.company': 'Firma',
  'contact.form.email': 'E-Mail',
  'contact.form.phone': 'Telefon',
  'contact.form.message': 'Ihre Nachricht',
  'contact.form.requiredHint': 'Pflichtfelder sind mit * markiert.',
  'contact.form.privacy': 'Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage. Weitere Informationen finden Sie in unserer',
  'contact.form.submit': 'Anfrage senden →',
  'contact.form.sending': 'Wird gesendet …',
  'contact.form.success': 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns in Kürze bei Ihnen.',
  'contact.form.error': 'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns an',
  'contact.form.unavailable': 'Das Kontaktformular ist derzeit nicht verfügbar. Bitte schreiben Sie uns eine E-Mail an',
  'contact.form.subject': 'Neue Anfrage über die Website',
  'contact.form.invalidRequired': 'Bitte füllen Sie dieses Feld aus.',
  'contact.form.invalidEmail': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',

  'contact.map.title': 'Anfahrt',
  'contact.map.notice': 'Beim Laden der Karte werden Daten, u. a. Ihre IP-Adresse, an Google übertragen, auch in die USA, und Cookies gesetzt. Mehr dazu in unserer',
  'contact.map.load': 'Karte laden',
  'contact.map.open': 'In Google Maps öffnen ↗',
  'contact.map.iframeTitle': 'Standort von AMP auf Google Maps',

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
  'footer.relatedLabel': 'Related companies',
  'footer.tagline': 'Precision. Experience. Responsibility.',

  'breadcrumb.home': 'Home',

  'nav.certificates': 'Certificates',

  'certificates.metaTitle': 'Certificates – ISO 9001 and DGZfP | AMP',
  'certificates.metaDescription': 'Certificates and memberships of AMP Prüftechnik: quality management to ISO 9001 and membership of the German Society for Non-Destructive Testing (DGZfP).',
  'certificates.eyebrow': 'Certificates',
  'certificates.title': 'Everything to international standards.',
  'certificates.intro': 'AMP meets worldwide requirements for welding qualifications and quality certifications to international standards.',
  'certificates.issuer': 'Issued by',
  'certificates.download': 'Download PDF',
  'certificates.germanOnly': 'German only',
  'certificates.quality': 'View certificates →',

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

  'contact.metaTitle': 'Contact – Request an Inspection | AMP',
  'contact.metaDescription': 'Contact AMP Prüftechnik about non-destructive testing, dimensional metrology or inspections via form, email or phone.',
  'contact.eyebrow': 'Contact',
  'contact.title': "Let's talk about your project.",
  'contact.intro': "Tell us about your inspection task – we'll get back to you as soon as possible.",
  'contact.personEyebrow': 'Your contact person',
  'contact.personRole': '[Role, e.g. Head of Testing Center]',
  'contact.addressEyebrow': 'Address',
  'contact.phone': 'Phone',
  'contact.email': 'Email',

  'contact.form.title': 'Send an inquiry',
  'contact.form.name': 'Name',
  'contact.form.company': 'Company',
  'contact.form.email': 'Email',
  'contact.form.phone': 'Phone',
  'contact.form.message': 'Your message',
  'contact.form.requiredHint': 'Required fields are marked with *.',
  'contact.form.privacy': 'We only use your details to handle your inquiry. For more information, see our',
  'contact.form.submit': 'Send inquiry →',
  'contact.form.sending': 'Sending …',
  'contact.form.success': "Thank you! Your message has been sent. We'll get back to you shortly.",
  'contact.form.error': 'Your message could not be sent. Please try again or email us at',
  'contact.form.unavailable': 'The contact form is currently unavailable. Please email us at',
  'contact.form.subject': 'New inquiry via the website',
  'contact.form.invalidRequired': 'Please fill in this field.',
  'contact.form.invalidEmail': 'Please enter a valid email address.',

  'contact.map.title': 'Directions',
  'contact.map.notice': 'Loading the map transfers data, including your IP address, to Google, also to the USA, and sets cookies. Learn more in our',
  'contact.map.load': 'Load map',
  'contact.map.open': 'Open in Google Maps ↗',
  'contact.map.iframeTitle': 'AMP location on Google Maps',

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
