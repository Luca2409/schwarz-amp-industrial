/** Company data used across components, SEO tags and structured data. */
export const site = {
  /** Short brand name, e.g. for `og:site_name`. */
  name: 'AMP',
  /** Company name shown in the footer and structured data. */
  company: 'AMP Prüftechnik',
  email: 'info@amp-zfp.de',
  phone: {
    /** Human-readable format. */
    display: '+49 7443 9665-19',
    /** `tel:` link without spaces. */
    href: 'tel:+497443966519',
  },
  /** Logo path inside `public/`, without `base`. */
  logo: '/images/logo-amp.png',

  /** Related companies linked in the footer; names aren't translated. */
  relatedCompanies: [
    { name: 'Schwarz Holding', url: 'https://www.schwarz-online.de/' },
    { name: 'Schwarz Forst & Agrar', url: 'https://www.schwarz-forst-agrar.de/' },
    { name: 'Blackworker', url: 'https://www.blackworker.de/' },
  ],

  // TODO: Replace the [placeholders] below; the build warns while any are left.

  /** Postal address, shown on the contact page, used for the map and structured data. */
  address: {
    street: '[Straße Hausnummer]',
    postalCode: '[PLZ]',
    city: '[Ort]',
    /** ISO 3166-1 country code. */
    country: 'DE',
  },

  /** Contact person shown on the contact page. Their role is translated via `contact.personRole` in `src/i18n/ui.ts`. */
  contactPerson: {
    name: '[Vorname Nachname]',
    email: 'info@amp-zfp.de',
    phone: {
      display: '+49 7443 9665-19',
      href: 'tel:+497443966519',
    },
  },

  /**
   * Contact form service. GitHub Pages can't process forms, so an external service
   * receives the submission and forwards it by email.
   */
  contactForm: {
    /**
     * POST endpoint of the form service, e.g. `https://api.web3forms.com/submit` or
     * `https://formspree.io/f/<id>`. While empty, the form is shown disabled with an email fallback.
     * The environment variable `PUBLIC_CONTACT_FORM_ENDPOINT` overrides it (used by the e2e tests).
     */
    endpoint: import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT || '',
    /** Extra hidden fields the service needs, e.g. `{ access_key: '…' }` for Web3Forms. */
    hiddenFields: {} as Record<string, string>,
    /** Name of the honeypot spam trap: `botcheck` (Web3Forms) or `_gotcha` (Formspree). */
    honeypot: 'botcheck',
    /** Field the service uses as email subject: `subject` (Web3Forms) or `_subject` (Formspree). */
    subjectField: 'subject',
  },

  /**
   * Google Maps embed URL. Leave empty to derive it from `address`, or paste the URL from
   * Google Maps → Share → Embed a map (the `src` of the iframe) for an exact pin.
   */
  mapEmbedUrl: '',
} as const;

/**
 * Checks whether a config value is still a placeholder in square brackets.
 *
 * @param value A string from {@link site}.
 * @returns `true` for values like `[PLZ]`.
 */
export function isPlaceholder(value: string): boolean {
  return /^\[.*\]$/.test(value.trim());
}

/** `true` once street, postal code and city are filled in. */
export const hasAddress = [site.address.street, site.address.postalCode, site.address.city].every(
  (value) => !isPlaceholder(value),
);

/**
 * Lists the contact settings that still need to be filled in, for a build warning.
 *
 * @returns Human-readable names of missing settings, empty when everything is configured.
 */
export function getMissingContactSettings(): string[] {
  const missing: string[] = [];
  if (!hasAddress) missing.push('address');
  if (isPlaceholder(site.contactPerson.name)) missing.push('contactPerson.name');
  if (!site.contactForm.endpoint) missing.push('contactForm.endpoint');
  return missing.map((setting) => `${setting} (src/site.ts)`);
}

/** Address as one line, e.g. for the map query: `Musterstraße 1, 12345 Musterstadt`. */
export const addressLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
