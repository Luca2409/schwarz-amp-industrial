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
} as const;
