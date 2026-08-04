/**
 * UK formatting helpers.
 *
 * Every user-visible date, time and money value in the platform goes through
 * this module so the localisation rules live in exactly one place:
 *   - GBP (£) with 2dp, using en-GB grouping
 *   - DD/MM/YYYY dates
 *   - Europe/London display timezone, DST-aware
 *
 * Money is stored in the database as integer pence to avoid float drift; these
 * helpers are the boundary where pence becomes a displayable string.
 */

export const UK_TIMEZONE = 'Europe/London';
export const UK_LOCALE = 'en-GB';

/* ────────────────────────────── Money ────────────────────────────── */

const gbpFormatter = new Intl.NumberFormat(UK_LOCALE, {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const gbpWholeFormatter = new Intl.NumberFormat(UK_LOCALE, {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format integer pence as GBP.
 *
 * @param pence  Amount in pence. 49900 -> "£499.00"
 * @param options.trimWholePounds  Drop ".00" when the amount is whole pounds.
 */
export function formatPence(
  pence: number | null | undefined,
  options: { trimWholePounds?: boolean } = {},
): string {
  if (pence === null || pence === undefined || !Number.isFinite(pence)) return '—';
  const pounds = pence / 100;
  if (options.trimWholePounds && pence % 100 === 0) {
    return gbpWholeFormatter.format(pounds);
  }
  return gbpFormatter.format(pounds);
}

/** Parse a user-entered pound amount ("499", "£499.50", "1,299") into pence. */
export function parsePoundsToPence(input: string): number | null {
  const cleaned = input.replace(/[£,\s]/g, '').trim();
  if (cleaned === '') return null;
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  // Round rather than truncate: 19.995 -> 2000, not 1999.
  return Math.round(Number(cleaned) * 100);
}

/* ────────────────────────────── Dates ────────────────────────────── */

/**
 * A calendar date with no time component, stored as `YYYY-MM-DD`.
 * Delivery dates are calendar dates — a delivery on 03/11/2026 is on that day
 * regardless of timezone, so these must never round-trip through UTC instants.
 */
export type IsoDate = string;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Format an `IsoDate` (`2026-11-03`) as `03/11/2026`. */
export function formatDate(iso: IsoDate | null | undefined): string {
  if (!iso) return '—';
  const match = DATE_ONLY.exec(iso);
  if (!match) {
    // Tolerate a full timestamp by taking its Europe/London calendar date.
    return formatTimestampDate(iso);
  }
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

/** Format an `IsoDate` as `Tue 3 November 2026`. */
export function formatDateLong(iso: IsoDate | null | undefined): string {
  if (!iso) return '—';
  const date = isoDateToUtcNoon(iso);
  if (!date) return '—';
  return new Intl.DateTimeFormat(UK_LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Format an `IsoDate` as `3 Nov` — for dense tables and calendar cells. */
export function formatDateShort(iso: IsoDate | null | undefined): string {
  if (!iso) return '—';
  const date = isoDateToUtcNoon(iso);
  if (!date) return '—';
  return new Intl.DateTimeFormat(UK_LOCALE, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Convert `YYYY-MM-DD` to a Date at 12:00 UTC.
 *
 * Noon is deliberate: it keeps the calendar date stable under any ±12h
 * timezone shift, so a date-only value can never display as the day before.
 */
export function isoDateToUtcNoon(iso: IsoDate): Date | null {
  const match = DATE_ONLY.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
  // Reject impossible dates that JS would silently roll over (e.g. 2026-02-30).
  if (date.getUTCMonth() !== Number(m) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date;
}

/** Convert a Date to `YYYY-MM-DD` using its Europe/London calendar date. */
export function toIsoDate(date: Date): IsoDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: UK_TIMEZONE,
  }).format(date);
  // en-CA yields YYYY-MM-DD directly.
  return parts;
}

/** Today's date in Europe/London, as `YYYY-MM-DD`. */
export function todayInUk(): IsoDate {
  return toIsoDate(new Date());
}

/* ─────────────────────────── Timestamps ─────────────────────────── */

/**
 * Format a UTC timestamp from the database as a Europe/London date+time,
 * e.g. `03/11/2026, 14:30`. DST is handled by the Intl timezone database.
 */
export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(UK_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: UK_TIMEZONE,
  }).format(date);
}

/** The Europe/London calendar date of a UTC timestamp, as `DD/MM/YYYY`. */
export function formatTimestampDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(UK_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: UK_TIMEZONE,
  }).format(date);
}

/** Relative phrasing for notification lists: "2 days ago", "in 3 weeks". */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '—';
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return '—';

  const diffMs = target.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(UK_LOCALE, { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms) return rtf.format(Math.round(diffMs / ms), unit);
  }
  return 'just now';
}

/* ─────────────────────── Addresses & contact ─────────────────────── */

/**
 * Normalise a UK postcode to its canonical spaced, uppercase form.
 * "sw1a1aa" -> "SW1A 1AA". Returns the trimmed uppercase input if it does not
 * look like a postcode, so validation (not formatting) owns rejection.
 */
export function formatPostcode(input: string): string {
  const compact = input.replace(/\s+/g, '').toUpperCase();
  if (compact.length < 5 || compact.length > 7) return input.trim().toUpperCase();
  // The inward code is always exactly three characters.
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

/** The outward code ("SW1A" from "SW1A 1AA") — used for service-area matching. */
export function postcodeOutwardCode(input: string): string {
  const compact = input.replace(/\s+/g, '').toUpperCase();
  return compact.length > 3 ? compact.slice(0, -3) : compact;
}

/**
 * Format a UK phone number for display: `01234 567890`, `07700 900123`,
 * `020 7946 0958`. International numbers are returned with spacing preserved.
 */
export function formatPhone(input: string | null | undefined): string {
  if (!input) return '—';
  const trimmed = input.trim();
  if (trimmed.startsWith('+') && !trimmed.startsWith('+44')) return trimmed;

  // Normalise +44 / 0044 to the national 0-prefixed form for display.
  let digits = trimmed.replace(/[^\d+]/g, '');
  if (digits.startsWith('+44')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('0044')) digits = `0${digits.slice(4)}`;

  if (!/^0\d{9,10}$/.test(digits)) return trimmed;

  // London and other 2+8 area codes.
  if (/^0(20|23|24|28|29)/.test(digits)) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  // Mobile (07…) and standard 5+6 geographic codes.
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Join UK address parts into display lines, dropping blanks. */
export function formatAddressLines(address: {
  line1: string;
  line2?: string | null;
  town: string;
  county?: string | null;
  postcode: string;
}): string[] {
  return [
    address.line1,
    address.line2 || null,
    address.town,
    address.county || null,
    formatPostcode(address.postcode),
  ].filter((line): line is string => Boolean(line && line.trim()));
}

/** Single-line address for tables and CSV exports. */
export function formatAddressInline(address: Parameters<typeof formatAddressLines>[0]): string {
  return formatAddressLines(address).join(', ');
}

/* ───────────────────────────── Misc ─────────────────────────────── */

/** "1 delivery" / "2 deliveries" — avoids the "(s)" construction. */
export function pluralise(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

/** Format a cubic-metre volume the way UK firewood suppliers quote it. */
export function formatVolume(cubicMetres: number | null | undefined): string {
  if (cubicMetres === null || cubicMetres === undefined) return '—';
  const value = Number(cubicMetres);
  if (!Number.isFinite(value)) return '—';
  const formatted = new Intl.NumberFormat(UK_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} m³`;
}

/** Format a percentage for reports: 0.8734 -> "87.3%". */
export function formatPercent(ratio: number | null | undefined, decimals = 1): string {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(decimals)}%`;
}
