/**
 * Brand and business details.
 *
 * ⚠ PLACEHOLDER CONTENT — every value in `placeholder: true` blocks below must
 * be replaced with the real business details before launch. The trading name
 * used throughout the Beta is a stand-in chosen so the interface reads
 * naturally; it is not a registered name and carries no claim.
 *
 * Nothing here asserts a certification, sustainability, forestry or
 * product-quality claim. Verified credentials belong in `verifiedBadges`,
 * which is deliberately empty — see docs/KNOWN_LIMITATIONS.md.
 */

export const brand = {
  /** PLACEHOLDER trading name. */
  name: 'Ashfold Firewood',
  /** PLACEHOLDER short name for tight spaces (mobile nav, emails). */
  shortName: 'Ashfold',
  tagline: 'Kiln-dried firewood, delivered on a schedule.',
  description:
    'An annual membership that brings kiln-dried hardwood to your door across the burning season, without the reordering.',

  /** PLACEHOLDER contact details. */
  contact: {
    email: 'hello@example.com',
    supportEmail: 'support@example.com',
    phone: '01234 567890',
    phoneHref: 'tel:+441234567890',
    businessHours: 'Monday to Friday, 9:00am – 5:30pm',
    addressLines: ['Registered office address', 'To be confirmed'],
  },

  /** PLACEHOLDER registration details required on UK invoices. */
  legal: {
    companyName: 'Ashfold Firewood Ltd',
    companyNumber: 'PLACEHOLDER',
    /**
     * VAT is NOT assumed to be enabled. When the business registers, set
     * `vatRegistered: true` and populate the number; invoices and reports read
     * from platform_settings at runtime, not from this file.
     */
    vatRegistered: false,
    vatNumber: null as string | null,
  },

  /**
   * Verified quality / sustainability credentials.
   *
   * Intentionally empty. The UI renders a reserved, correctly-sized slot for
   * these badges but displays nothing until the business supplies verified
   * credentials. Do not populate this with unverified claims.
   */
  verifiedBadges: [] as Array<{
    id: string;
    label: string;
    /** Path to the badge asset supplied by the certifying body. */
    assetUrl: string;
    /** Public URL where the credential can be independently checked. */
    verificationUrl: string;
  }>,

  social: {
    /** PLACEHOLDER — leave null to hide the link entirely. */
    instagram: null as string | null,
    facebook: null as string | null,
  },
} as const;

export type Brand = typeof brand;
