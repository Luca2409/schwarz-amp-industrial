import fs from 'node:fs';
import path from 'node:path';
import type { Lang } from '@/i18n/ui';

/** A certificate or membership shown on the certificates page. */
export interface Certificate {
  /** Stable id, also used as anchor. */
  id: string;
  /** Title per language. */
  title: Record<Lang, string>;
  /** Short description per language, e.g. the certified scope. */
  description: Record<Lang, string>;
  /** Issuing body, e.g. "DEKRA Certification GmbH". */
  issuer: string;
  /** End of validity (ISO date), only used for the build warning; omit for memberships. */
  validUntil?: string;
  /** PDF per language, path inside `public/` without `base`. Falls back to German. */
  files: Partial<Record<Lang, string>> & { de: string };
}

/**
 * Certificates and memberships, in display order. PDFs live in `public/files/certificates/`.
 *
 * TODO: The ISO 9001 certificate expired on 2024-11-21 and the DGZfP certificate (2010) is
 * issued to Schwarz Apparate- und Behälterbau GmbH. Replace both with current documents.
 * The build warns about expired certificates (see `warnExpiredCertificates`).
 */
export const certificates: Certificate[] = [
  {
    id: 'iso-9001',
    title: { de: 'ISO 9001:2015', en: 'ISO 9001:2015' },
    description: {
      de: 'Qualitätsmanagementsystem für manuelle zerstörungsfreie Prüfungen, Laservermessung und Spektralanalyse an metallischen Werkstoffen.',
      en: 'Quality management system for manual non-destructive testing, laser measurement and spectral analysis of metallic materials.',
    },
    issuer: 'DEKRA Certification GmbH',
    validUntil: '2024-11-21',
    files: {
      de: '/files/certificates/amp-iso-9001-2015-de.pdf',
      en: '/files/certificates/amp-iso-9001-2015-en.pdf',
    },
  },
  {
    id: 'dgzfp',
    title: { de: 'Mitglied der DGZfP', en: 'Member of the DGZfP' },
    description: {
      de: 'Korporatives Mitglied der Deutschen Gesellschaft für Zerstörungsfreie Prüfung e. V.',
      en: 'Corporate member of the German Society for Non-Destructive Testing (DGZfP).',
    },
    issuer: 'Deutsche Gesellschaft für Zerstörungsfreie Prüfung e. V.',
    files: { de: '/files/certificates/dgzfp-mitgliedschaft.pdf' },
  },
];

/**
 * Checks whether a certificate's validity has ended.
 *
 * @param certificate The certificate to check.
 * @param today Reference date, defaults to now (build time).
 * @returns `true` if `validUntil` lies before `today`.
 */
export function isExpired(certificate: Certificate, today = new Date()): boolean {
  return !!certificate.validUntil && new Date(`${certificate.validUntil}T23:59:59`) < today;
}

/**
 * Logs a build warning for every expired certificate, so outdated documents get replaced.
 */
export function warnExpiredCertificates(): void {
  for (const certificate of certificates.filter((c) => isExpired(c))) {
    console.warn(`[certificates] "${certificate.id}" expired on ${certificate.validUntil}; replace it in src/lib/certificates.ts`);
  }
}

/**
 * Returns the PDF of a certificate in the given language, or the German one.
 *
 * @param certificate The certificate.
 * @param lang Preferred language.
 * @returns File path inside `public/`, the file's language, and its size in bytes.
 */
export function getCertificateFile(certificate: Certificate, lang: Lang) {
  const fileLang: Lang = certificate.files[lang] ? lang : 'de';
  const file = certificate.files[fileLang]!;
  const size = fs.statSync(path.join(process.cwd(), 'public', file)).size;
  return { file, lang: fileLang, size };
}
