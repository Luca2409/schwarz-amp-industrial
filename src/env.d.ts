interface ImportMetaEnv {
  /** Overrides `site.contactForm.endpoint`, e.g. for the e2e tests. */
  readonly PUBLIC_CONTACT_FORM_ENDPOINT?: string;
  /**
   * `"true"` builds a prototype: placeholders in legal texts only warn instead of failing the
   * build, and every page is hidden from search engines (noindex, robots.txt disallow).
   */
  readonly PUBLIC_PROTOTYPE?: string;
}
