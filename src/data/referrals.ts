import type { Referral, PromotionCode } from '@/types';

/** DEMONSTRATION DATA — referral activity and promotional codes. */

/** Reward paid to both parties when a referred friend joins, in pence. */
export const REFERRAL_REWARD_PENCE = 1500;

export const referrals: Referral[] = [
  {
    id: 'ref-001',
    referrerId: 'cus-001',
    referrerName: 'Eleanor Whitfield',
    friendName: 'Hannah Pryce',
    friendEmail: 'h.pryce@example.co.uk',
    status: 'joined',
    rewardPence: 1500,
    date: '2026-05-21',
  },
  {
    id: 'ref-002',
    referrerId: 'cus-001',
    referrerName: 'Eleanor Whitfield',
    friendName: 'Oliver Grant',
    friendEmail: 'o.grant@example.co.uk',
    status: 'joined',
    rewardPence: 1500,
    date: '2026-06-14',
  },
  {
    id: 'ref-003',
    referrerId: 'cus-001',
    referrerName: 'Eleanor Whitfield',
    friendName: 'Marianne Lowe',
    friendEmail: 'm.lowe@example.co.uk',
    status: 'joined',
    rewardPence: 1500,
    date: '2026-07-19',
  },
  {
    id: 'ref-004',
    referrerId: 'cus-001',
    referrerName: 'Eleanor Whitfield',
    friendName: 'Nathan Clarke',
    friendEmail: 'n.clarke@example.co.uk',
    status: 'invited',
    rewardPence: 0,
    date: '2026-07-30',
  },
  {
    id: 'ref-005',
    referrerId: 'cus-001',
    referrerName: 'Eleanor Whitfield',
    friendName: 'Beatrice Hall',
    friendEmail: 'b.hall@example.co.uk',
    status: 'expired',
    rewardPence: 0,
    date: '2026-04-28',
  },
  {
    id: 'ref-006',
    referrerId: 'cus-002',
    referrerName: 'James Okonkwo',
    friendName: 'Ade Balogun',
    friendEmail: 'a.balogun@example.co.uk',
    status: 'joined',
    rewardPence: 1500,
    date: '2026-05-02',
  },
  {
    id: 'ref-007',
    referrerId: 'cus-004',
    referrerName: 'Duncan MacAllister',
    friendName: 'Fiona Kerr',
    friendEmail: 'f.kerr@example.co.uk',
    status: 'joined',
    rewardPence: 1500,
    date: '2026-03-11',
  },
  {
    id: 'ref-008',
    referrerId: 'cus-006',
    referrerName: 'Michael Thornbury',
    friendName: 'Sara Whitmore',
    friendEmail: 's.whitmore@example.co.uk',
    status: 'invited',
    rewardPence: 0,
    date: '2026-07-24',
  },
];

export function referralsForCustomer(customerId: string): Referral[] {
  return referrals
    .filter((referral) => referral.referrerId === customerId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const promotionCodes: PromotionCode[] = [
  {
    id: 'promo-001',
    code: 'FIRSTSEASON',
    description: '£50 off a first-year membership',
    type: 'fixed',
    value: 5000,
    usageCount: 187,
    usageLimit: 500,
    startsOn: '2026-03-01',
    expiresOn: '2026-12-31',
    active: true,
    appliesTo: 'all',
  },
  {
    id: 'promo-002',
    code: 'AUTUMN10',
    description: '10% off any membership booked before the first frost',
    type: 'percentage',
    value: 10,
    usageCount: 64,
    usageLimit: 250,
    startsOn: '2026-08-01',
    expiresOn: '2026-10-31',
    active: true,
    appliesTo: 'all',
  },
  {
    id: 'promo-003',
    code: 'UPGRADE25',
    description: '£25 off when moving up to Moderate or Heavy',
    type: 'fixed',
    value: 2500,
    usageCount: 41,
    usageLimit: 150,
    startsOn: '2026-05-01',
    expiresOn: '2027-03-31',
    active: true,
    appliesTo: ['moderate', 'heavy'],
  },
  {
    id: 'promo-004',
    code: 'NEIGHBOUR15',
    description: '15% off for a second household on the same street',
    type: 'percentage',
    value: 15,
    usageCount: 23,
    usageLimit: 100,
    startsOn: '2026-04-15',
    expiresOn: '2026-11-30',
    active: true,
    appliesTo: 'all',
  },
  {
    id: 'promo-005',
    code: 'WINTER24',
    description: 'Legacy winter promotion — 2025/26 season',
    type: 'percentage',
    value: 12,
    usageCount: 312,
    usageLimit: 312,
    startsOn: '2025-10-01',
    expiresOn: '2026-02-28',
    active: false,
    appliesTo: 'all',
  },
];

/**
 * Frontend-only promotion validation for the demo checkout. A real
 * implementation would verify the code server-side before any charge.
 */
export function findPromotion(code: string): PromotionCode | undefined {
  const normalised = code.trim().toUpperCase();
  return promotionCodes.find((promotion) => promotion.code === normalised);
}
