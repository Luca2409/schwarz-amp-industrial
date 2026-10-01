# Contact page

`/de/kontakt/` and `/en/contact/` show the contact person, the address, a contact form and a Google Maps map. Header ("Kontakt", "Projekt anfragen"), footer, the home page contact banner and the competency sidebars link to it.

> **Not a legal opinion.** The notes below summarize common German/EU practice. Have the final setup and privacy policy reviewed by a lawyer or a data protection officer.

## Files

| File | Purpose |
| --- | --- |
| `src/pages/de/kontakt.astro`, `src/pages/en/contact.astro` | Routes (static, so they don't clash with the legal pages route `[lang]/[slug].astro`) |
| `src/components/ContactPage.astro` | Page template: hero, form, contact person, address, map, SEO |
| `src/components/ContactForm.astro` | Form with fetch submission, honeypot and status messages |
| `src/components/GoogleMap.astro` | Map with two-click consent |
| `src/site.ts` | Address, contact person, form service, map URL |
| `src/i18n/ui.ts` | All texts (`contact.*` keys) |
| `src/i18n/routes.ts` | URL segments `kontakt` / `contact` |
| `src/content/legal/*/datenschutz.md`, `privacy-policy.md` | Privacy sections 4 (contact form) and 5 (Google Maps) |
| `src/styles/global.css` | Section "CONTACT PAGE" |
| `tests/e2e/contact.spec.ts` | E2E tests for form and map |

The route file names must match `routes.contact` in `src/i18n/routes.ts`. When renaming one, rename the other.

## Setup checklist

The build prints a warning until everything is configured:

```
[contact] de: not configured yet: address (src/site.ts), contactPerson.name (src/site.ts), contactForm.endpoint (src/site.ts), contact.personRole (src/i18n/ui.ts)
```

Remaining `[placeholders]` in `src/site.ts`, `src/i18n/ui.ts` and the legal pages **fail the build in CI**, so they're never deployed by accident. To deploy a draft anyway, use a [prototype build](./quality-checks.md#prototype-mode). See [Placeholder check](#placeholder-check).

1. **Address:** fill in `site.address` in `src/site.ts`. It's used on the page, for the map and, once complete, as `PostalAddress` in the structured data.
2. **Contact person:** fill in `site.contactPerson` (name, email, phone) and the role in `contact.personRole` for every language in `src/i18n/ui.ts`.
3. **Form service:** choose a provider and configure it, see [Form service](#form-service).
4. **Map (optional):** for an exact pin, open the location in Google Maps → *Share* → *Embed a map* and paste the iframe's `src` URL into `site.mapEmbedUrl`. Otherwise the map searches for the company name and address.
5. **Privacy policy:** fill in the `[placeholders]` in sections 4 and 5 of both privacy policy files, in particular the form service's name, address, third-country transfer and retention period.

## Form service

GitHub Pages only serves static files, so the form posts to an external service that forwards submissions by email. The form is provider-neutral: it sends a regular `multipart/form-data` POST.

| Field | Content |
| --- | --- |
| `name`, `email`, `message` | Required |
| `company`, `phone` | Optional |
| `subject` (name from `subjectField`) | Fixed email subject (`contact.form.subject`) |
| `language` | Page language (`de` / `en`) |
| honeypot | Spam trap, see `site.contactForm.honeypot` |
| `hiddenFields` | Provider-specific extras from `src/site.ts` |

Configuration examples for `site.contactForm` in `src/site.ts`:

```ts
// Web3Forms (https://web3forms.com): access key arrives by email; the key is public by design.
contactForm: {
  endpoint: import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT || 'https://api.web3forms.com/submit',
  hiddenFields: { access_key: 'YOUR-ACCESS-KEY', from_name: 'AMP Website' },
  honeypot: 'botcheck',
  subjectField: 'subject',
},

// Formspree (https://formspree.io): form id from the dashboard.
contactForm: {
  endpoint: import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT || 'https://formspree.io/f/YOUR-FORM-ID',
  hiddenFields: {},
  honeypot: '_gotcha',
  subjectField: '_subject',
},
```

The environment variable `PUBLIC_CONTACT_FORM_ENDPOINT` overrides the endpoint. The e2e tests use it to point the form at a fake endpoint; you can also use it for a separate test endpoint.

Check the provider's current documentation for its field names; they can change.

### Behavior

| Situation | Behavior |
| --- | --- |
| `endpoint` empty | Form is shown disabled with a note and the email address |
| JavaScript on | Submits via `fetch`; shows "sending", then success (form is cleared) or an error with the email address. Counts as error: non-2xx status, or a 2xx response with `{"success": false}` (Web3Forms) or `{"ok": false}` (Formspree) |
| JavaScript off | Browser posts directly to the service, which shows its own confirmation page |
| Validation | Native HTML validation (`required`, `type="email"`, `maxlength`) with messages in the page language (`contact.form.invalidRequired`, `contact.form.invalidEmail`) instead of the browser language |
| Double submit | Fields are disabled while sending (after the data has been collected) |

Messages are announced to screen readers via a `role="status"` live region. It's always in the page (empty until the first submit), because screen readers often ignore live regions that only appear when the message does.

## Google Maps (two-click solution)

`GoogleMap.astro` initially renders only a notice, a **Load map** button and an **Open in Google Maps** link. Nothing is loaded from Google until the button is clicked. Then the iframe is inserted. The choice isn't stored, so the map has to be loaded again on every visit. That's deliberate: storing consent would require a way to withdraw it (e.g. a consent manager).

The embed URL is `site.mapEmbedUrl` or, if empty, `https://www.google.com/maps?q=<company, address>&output=embed`. This keyless URL is widely used but not an official Google API. If it ever stops working, use the *Embed a map* URL (step 4 above) or the [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) with an API key.

## Legal implications

### Contact form

- **Information duty (Art. 13 GDPR):** visitors must be informed about the processing *when* they submit. The form shows a short notice with a link to the privacy policy, which explains purpose, legal basis, recipient (form service), storage and third-country transfer (section 4).
- **Legal basis:** Art. 6 (1) (b) GDPR for inquiries related to a contract, otherwise Art. 6 (1) (f) GDPR (legitimate interest in answering). A **consent checkbox is not needed** and isn't used: consent would be revocable at any time and is the weaker basis here.
- **Data minimization (Art. 5 (1) (c)):** only name, email and message are required; company and phone are optional.
- **Processor (Art. 28 GDPR):** the form service processes the data on your behalf. You need a **data processing agreement (DPA/AVV)** with it; most providers offer one in their terms or on request.
- **Third-country transfer (Art. 44 ff.):** many form services are US-based. Check whether the provider is certified under the EU-US Data Privacy Framework or offers standard contractual clauses, and name the mechanism in the privacy policy. An EU-based provider avoids the topic.
- **Transport encryption:** the site and the form endpoints use HTTPS, which Art. 32 GDPR effectively requires for forms.
- **Retention:** delete inquiries once handled, unless retention duties apply (e.g. business letters, 6 years under § 257 HGB). Also check and configure how long the form service keeps submissions.

### Google Maps

- **Consent required:** embedding Google Maps transfers the visitor's IP address to Google (also to the USA) and can store cookies. Under § 25 (1) TDDDG and Art. 6 (1) (a) GDPR this needs prior consent; loading the map without consent is a common reason for warning letters (*Abmahnungen*).
- **Two-click solution:** the click on **Load map** after reading the notice is the consent. Nothing is transferred before. The notice names the recipient (Google), the transfer to the USA and links the privacy policy.
- **Privacy policy:** section 5 names the provider (Google Ireland Limited), the data, the legal basis, the US transfer (Google LLC is certified under the EU-US Data Privacy Framework) and how to withdraw consent.
- **No consent banner needed** as long as Google Maps (after the click) is the only service that needs consent. If analytics, YouTube embeds or similar are added later, use a consent manager instead.
- **Alternative without consent:** the **Open in Google Maps** link only opens Google in a new tab and transfers nothing beforehand. A static image of the map (screenshot or OpenStreetMap tile, respecting the license) would avoid the topic entirely.

### Language choice in localStorage

The language picker stores the chosen language in `localStorage`. This is "strictly necessary" for a function the visitor requested (§ 25 (2) No. 2 TDDDG), so no consent is needed. It's mentioned in privacy section 6.

## Placeholder check

Remaining `[placeholders]` in `src/site.ts`, `src/i18n/ui.ts` and the legal pages only warn locally but **fail the build in CI**, so an incomplete contact page or Impressum is never deployed by accident. A [prototype build](./quality-checks.md#prototype-mode) only warns and hides the site from search engines. Details: [quality-checks.md → Placeholders](./quality-checks.md#placeholders).

## Tests

`tests/e2e/contact.spec.ts` tests the form (success, both error cases, validation messages, status region) against a mocked form service, and the Google Maps consent (no Google request before the click, map size afterwards). Test list and how to run them: [quality-checks.md → End-to-end tests](./quality-checks.md#end-to-end-tests).

## Recommendations: what a contact page usually also has

Not built yet:

- **Photo of the contact person:** builds trust; needs the person's consent to publish (Art. 6 (1) (a) GDPR / § 22 KUG). Could be an optional `image` in `site.contactPerson`.
- **Opening hours / availability:** e.g. "Mon–Fri 7:30–16:30"; also as `openingHours` in the structured data.
- **Further contacts per competency:** e.g. a dedicated contact for metrology and for NDT.
- **Directions:** parking, delivery address for test parts, entrance to the testing center, nearest highway exit.
- **Subject or service selection** in the form (e.g. dropdown with the competencies) to route inquiries.
- **File upload** for drawings or specifications: check whether the form service supports it and mention it in the privacy policy.
- **Spam protection beyond the honeypot**, if spam becomes a problem: a privacy-friendly CAPTCHA (e.g. Friendly Captcha, EU-based), which then also needs a privacy policy section.
- **Confirmation email** to the sender: possible with most form services; note that it can be misused to send spam to third parties.
- **vCard download** for the contact person.
