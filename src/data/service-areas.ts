import { suppliers } from './suppliers';
import { postcodeOutwardCode } from '@/utils/format';

/**
 * DEMONSTRATION DATA — mock serviceable postcode areas for the registration
 * journey, derived from the coverage areas already assigned to the three
 * demo suppliers. A real implementation would check this against a live
 * service-area table rather than deriving it from supplier data.
 */
export const serviceableOutwardCodes = Array.from(
  new Set(suppliers.flatMap((supplier) => supplier.coverageAreas)),
).sort();

/** Outward codes shown to the client as a "try one of these" hint. */
export const exampleServiceablePostcodes = ['GU7 1EX', 'TN4 8HR', 'BA1 2NF', 'HG1 4DX', 'EH7 5BS'];

export function isPostcodeServiceable(postcode: string): boolean {
  const outward = postcodeOutwardCode(postcode);
  // Match on the letter prefix of the outward code (e.g. "GU7" -> "GU").
  const letters = outward.match(/^[A-Z]+/)?.[0] ?? outward;
  return serviceableOutwardCodes.includes(letters);
}
