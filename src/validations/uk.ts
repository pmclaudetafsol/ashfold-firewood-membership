import { z } from 'zod';
import { formatPostcode } from '@/utils/format';

/**
 * Reusable UK-specific validators.
 *
 * These are the client-side mirror of the constraints enforced in the database
 * and Edge Functions. Client validation is for feedback quality only — every
 * one of these rules is re-applied server-side before anything is persisted.
 */

/**
 * UK postcode.
 *
 * Matches the standard Royal Mail formats (A9 9AA, A99 9AA, A9A 9AA, AA9 9AA,
 * AA99 9AA, AA9A 9AA) with optional internal space. The final letter pair
 * excludes C, I, K, M, O and V, which are never used in the inward code.
 *
 * Deliberately does not accept BFPO, Girobank (GIR 0AA is allowed as it is a
 * genuine postcode) or overseas territory codes — the service area is GB only.
 */
const UK_POSTCODE_PATTERN =
  /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|[A-HK-Y][0-9]{1,2}|[0-9][A-HJKPS-UW]|[A-HK-Y][0-9][ABEHMNPRV-Y]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

export const ukPostcodeSchema = z
  .string()
  .trim()
  .min(1, 'Enter your postcode')
  .max(8, 'That postcode is too long')
  .refine((value) => UK_POSTCODE_PATTERN.test(value.replace(/\s+/g, ' ').trim()), {
    message: 'Enter a valid UK postcode, for example SW1A 1AA',
  })
  // Store the canonical spaced, uppercase form so service-area lookups match.
  .transform(formatPostcode);

export function isValidUkPostcode(value: string): boolean {
  return UK_POSTCODE_PATTERN.test(value.replace(/\s+/g, ' ').trim());
}

/**
 * UK telephone number, with international numbers permitted.
 *
 * Accepts: 01234 567890, 07700 900123, +44 7700 900123, 0044 20 7946 0958,
 * and any `+<country code><digits>` for members with an overseas contact
 * number. Rejects obviously-wrong lengths rather than attempting full
 * per-area-code validation, which would reject valid new number ranges.
 */
export const ukPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Enter a contact telephone number')
  .refine(
    (value) => {
      const compact = value.replace(/[\s()-]/g, '');

      // Non-UK international: + followed by 7–15 digits (ITU-T E.164 max).
      if (/^\+/.test(compact) && !compact.startsWith('+44')) {
        return /^\+[1-9]\d{6,14}$/.test(compact);
      }

      // Normalise UK prefixes to the national 0-led form.
      let national = compact;
      if (national.startsWith('+44')) national = `0${national.slice(3)}`;
      else if (national.startsWith('0044')) national = `0${national.slice(4)}`;

      // UK national numbers are 10 or 11 digits including the leading zero.
      return /^0\d{9,10}$/.test(national);
    },
    { message: 'Enter a valid telephone number, for example 07700 900123' },
  );

/**
 * Normalise a UK number to E.164 for Twilio. Returns null when the input is
 * not a number we can confidently dial, so callers must handle the failure
 * rather than sending to a malformed destination.
 */
export function toE164(value: string): string | null {
  const compact = value.replace(/[\s()-]/g, '');
  if (/^\+[1-9]\d{6,14}$/.test(compact)) return compact;

  let national = compact;
  if (national.startsWith('0044')) national = `0${national.slice(4)}`;
  if (/^0\d{9,10}$/.test(national)) return `+44${national.slice(1)}`;
  return null;
}

/** UK address line — permissive, but bounded and non-blank. */
export const addressLineSchema = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(120, 'Keep this under 120 characters');

export const optionalAddressLineSchema = z
  .string()
  .trim()
  .max(120, 'Keep this under 120 characters')
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? value : null));

/** County/region is optional per the UK addressing rules for this platform. */
export const ukCountySchema = optionalAddressLineSchema;

export const ukAddressSchema = z.object({
  line1: addressLineSchema,
  line2: optionalAddressLineSchema,
  town: addressLineSchema,
  county: ukCountySchema,
  postcode: ukPostcodeSchema,
});

export type UkAddressInput = z.input<typeof ukAddressSchema>;
export type UkAddress = z.output<typeof ukAddressSchema>;

/* ─────────────────────── Shared primitive schemas ─────────────────────── */

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .max(254, 'That email address is too long')
  .email('Enter a valid email address')
  .transform((value) => value.toLowerCase());

/**
 * Password policy for the Beta: length is the dominant factor in resistance to
 * guessing, so we require 10 characters and a mix, rather than a short password
 * with many symbol rules that pushes people towards predictable substitutions.
 */
export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(72, 'Passwords cannot be longer than 72 characters')
  .refine((value) => /[a-z]/i.test(value), 'Include at least one letter')
  .refine((value) => /\d/.test(value), 'Include at least one number');

export const personNameSchema = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(60, 'Keep this under 60 characters')
  // Allows accents, hyphens, apostrophes and spaces; rejects digits and markup.
  .regex(/^[\p{L}\p{M}'\-. ]+$/u, 'Use letters, spaces, hyphens and apostrophes only');

/** Promotional and referral codes are stored and compared uppercase. */
export const promoCodeSchema = z
  .string()
  .trim()
  .min(3, 'Codes are at least 3 characters')
  .max(32, 'Codes are at most 32 characters')
  .regex(/^[A-Za-z0-9_-]+$/, 'Codes use letters, numbers, hyphens and underscores only')
  .transform((value) => value.toUpperCase());

export const referralCodeSchema = promoCodeSchema;

/** Money entered by an administrator, captured as integer pence. */
export const pencePriceSchema = z
  .number({ invalid_type_error: 'Enter an amount' })
  .int('Amounts are held in whole pence')
  .min(0, 'Amount cannot be negative')
  .max(10_000_000, 'That amount looks too large'); // £100,000 ceiling

export const deliveryCountSchema = z
  .number({ invalid_type_error: 'Enter a number of deliveries' })
  .int('Enter a whole number')
  .min(1, 'A membership must include at least one delivery')
  .max(52, 'A membership cannot include more than 52 deliveries');

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')
  .refine((value) => {
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y!, m! - 1, d!));
    return date.getUTCMonth() === m! - 1 && date.getUTCDate() === d!;
  }, 'That date does not exist');

/** Start must not fall after end. Attach with `.superRefine` on the parent. */
export function assertDateRange(
  start: string,
  end: string,
  ctx: z.RefinementCtx,
  path: (string | number)[] = ['end_date'],
): void {
  if (start && end && start > end) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path,
      message: 'The end date must be on or after the start date',
    });
  }
}
