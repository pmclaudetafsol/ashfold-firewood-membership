import type { MembershipPlan, PlanTier } from '@/types';

/**
 * DEMONSTRATION DATA — indicative pricing for the client presentation only.
 *
 * Three annual memberships, each including eight scheduled deliveries across
 * the burning season. Prices are held in pence to match the rest of the app.
 */
export const membershipPlans: MembershipPlan[] = [
  {
    id: 'light',
    name: 'Light User',
    strapline: 'Occasional evenings by the fire',
    annualPricePence: 38900,
    perDeliveryPence: 4863,
    deliveriesPerYear: 8,
    cratesPerDelivery: 1,
    volumePerDeliveryM3: 0.8,
    weightPerDeliveryKg: 250,
    recommendedFor: 'Flats, cottages and weekend fires',
    householdProfile: [
      'One fireplace or small stove',
      'Two to three fires each week',
      'Roughly 6–8 hours of burning weekly',
    ],
    benefits: [
      'One crate per delivery (approx. 0.8m³)',
      'Eight deliveries across the season',
      'Kiln-dried hardwood under 20% moisture',
      'Free kindling with every delivery',
      'Reschedule any delivery up to 48 hours ahead',
      'Priority member support line',
    ],
    recommended: false,
  },
  {
    id: 'moderate',
    name: 'Moderate User',
    strapline: 'The everyday family fire',
    annualPricePence: 64900,
    perDeliveryPence: 8113,
    deliveriesPerYear: 8,
    cratesPerDelivery: 2,
    volumePerDeliveryM3: 1.6,
    weightPerDeliveryKg: 500,
    recommendedFor: 'Three and four-bedroom family homes',
    householdProfile: [
      'A main wood burner in daily use',
      'Four to five fires each week',
      'Roughly 15–20 hours of burning weekly',
    ],
    benefits: [
      'Two crates per delivery (approx. 1.6m³)',
      'Eight deliveries across the season',
      'Kiln-dried hardwood under 20% moisture',
      'Free kindling and natural firelighters',
      'Reschedule any delivery up to 48 hours ahead',
      'Priority member support line',
      'Stacking service included on request',
      'Annual flue and stove care guide',
    ],
    recommended: true,
  },
  {
    id: 'heavy',
    name: 'Heavy User',
    strapline: 'Wood as your main heat source',
    annualPricePence: 99900,
    perDeliveryPence: 12488,
    deliveriesPerYear: 8,
    cratesPerDelivery: 3,
    volumePerDeliveryM3: 2.4,
    weightPerDeliveryKg: 750,
    recommendedFor: 'Larger homes, farmhouses and multi-stove properties',
    householdProfile: [
      'Two or more stoves, or a wood-burning range',
      'Daily fires through the season',
      'Roughly 30+ hours of burning weekly',
    ],
    benefits: [
      'Three crates per delivery (approx. 2.4m³)',
      'Eight deliveries across the season',
      'Kiln-dried hardwood under 20% moisture',
      'Free kindling, firelighters and a seasoned log store audit',
      'Reschedule any delivery up to 48 hours ahead',
      'Named account manager',
      'Stacking service included as standard',
      'Two emergency top-up deliveries per year',
      'Ten per cent off all additional orders',
    ],
    recommended: false,
  },
];

export const plansById: Record<PlanTier, MembershipPlan> = membershipPlans.reduce(
  (accumulator, plan) => {
    accumulator[plan.id] = plan;
    return accumulator;
  },
  {} as Record<PlanTier, MembershipPlan>,
);

export function getPlan(id: PlanTier): MembershipPlan {
  return plansById[id];
}

/** Copy for the "how the membership year works" explainer. */
export const seasonSchedule = [
  {
    month: 'April – May',
    title: 'Season opens',
    detail: 'Your first two deliveries land early so your store is full before the cold arrives.',
  },
  {
    month: 'June – August',
    title: 'Building the store',
    detail: 'Steady summer deliveries at quieter times, when our routes and prices are at their best.',
  },
  {
    month: 'September – November',
    title: 'Peak season',
    detail: 'The heaviest deliveries of the year, timed to the first frosts.',
  },
  {
    month: 'December – March',
    title: 'Through the winter',
    detail: 'Top-up deliveries keep you burning without a single reorder.',
  },
];
