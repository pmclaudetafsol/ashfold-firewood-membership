import type { MonthlyPoint, PlanSplitPoint, RegionPoint } from '@/types';

/**
 * DEMONSTRATION DATA — the figures behind the administrator charts.
 *
 * Chart series colours reference the brand tokens so the charts stay in step
 * with the design system rather than carrying their own palette.
 */

export const chartColours = {
  primary: 'hsl(155 45% 16%)',
  accent: 'hsl(15 65% 47%)',
  oak: 'hsl(38 47% 60%)',
  sage: 'hsl(116 10% 69%)',
  information: 'hsl(204 43% 34%)',
  muted: 'hsl(40 21% 84%)',
} as const;

export const monthlyPerformance: MonthlyPoint[] = [
  { month: 'Sep 25', revenuePence: 4210000, newMembers: 84, deliveries: 396, churn: 0.021 },
  { month: 'Oct 25', revenuePence: 5680000, newMembers: 121, deliveries: 512, churn: 0.018 },
  { month: 'Nov 25', revenuePence: 6940000, newMembers: 143, deliveries: 604, churn: 0.016 },
  { month: 'Dec 25', revenuePence: 5120000, newMembers: 97, deliveries: 548, churn: 0.024 },
  { month: 'Jan 26', revenuePence: 3860000, newMembers: 72, deliveries: 470, churn: 0.031 },
  { month: 'Feb 26', revenuePence: 3420000, newMembers: 61, deliveries: 418, churn: 0.028 },
  { month: 'Mar 26', revenuePence: 4780000, newMembers: 96, deliveries: 442, churn: 0.022 },
  { month: 'Apr 26', revenuePence: 6210000, newMembers: 134, deliveries: 508, churn: 0.017 },
  { month: 'May 26', revenuePence: 6890000, newMembers: 148, deliveries: 566, churn: 0.015 },
  { month: 'Jun 26', revenuePence: 7340000, newMembers: 159, deliveries: 611, churn: 0.014 },
  { month: 'Jul 26', revenuePence: 7920000, newMembers: 171, deliveries: 648, churn: 0.013 },
  { month: 'Aug 26', revenuePence: 8460000, newMembers: 182, deliveries: 694, churn: 0.012 },
];

export const planSplit: PlanSplitPoint[] = [
  { plan: 'Light User', members: 486, revenuePence: 18905400, fill: chartColours.sage },
  { plan: 'Moderate User', members: 892, revenuePence: 57890800, fill: chartColours.primary },
  { plan: 'Heavy User', members: 271, revenuePence: 27072900, fill: chartColours.accent },
];

export const regionPerformance: RegionPoint[] = [
  { region: 'South East', members: 512, deliveries: 1840 },
  { region: 'South West', members: 288, deliveries: 1024 },
  { region: 'Midlands', members: 241, deliveries: 892 },
  { region: 'North', members: 334, deliveries: 1216 },
  { region: 'Scotland', members: 187, deliveries: 664 },
  { region: 'Wales', members: 87, deliveries: 312 },
];

export const deliveryStatusBreakdown = [
  { status: 'Delivered', count: 4218, fill: chartColours.primary },
  { status: 'Dispatched', count: 96, fill: chartColours.accent },
  { status: 'Preparing', count: 148, fill: chartColours.oak },
  { status: 'Confirmed', count: 312, fill: chartColours.information },
  { status: 'Scheduled', count: 806, fill: chartColours.sage },
  { status: 'Delayed', count: 37, fill: 'hsl(0 51% 47%)' },
];

/** Headline figures for the administrator overview summary cards. */
export const adminSummary = {
  totalMembers: 1649,
  activeMemberships: 1583,
  newMembersThisMonth: 182,
  newMembersChange: 0.064,
  annualRevenuePence: 103869100,
  revenueChange: 0.183,
  upcomingDeliveries: 1262,
  upcomingThisWeek: 148,
  delayedDeliveries: 37,
  failedPayments: 14,
  failedPaymentValuePence: 892400,
  referralConversions: 468,
  referralConversionRate: 0.312,
  averageOnTimeRate: 0.951,
  averageMoistureCompliance: 0.987,
};

/** Rows for the Reports page export table. */
export const savedReports = [
  {
    id: 'rep-001',
    name: 'Membership revenue by plan',
    period: 'Season 2026/27 to date',
    generated: '2026-08-01',
    format: 'CSV',
    rows: 1649,
  },
  {
    id: 'rep-002',
    name: 'Delivery performance by supplier',
    period: 'Last 90 days',
    generated: '2026-08-01',
    format: 'CSV',
    rows: 1834,
  },
  {
    id: 'rep-003',
    name: 'Failed payments and recovery',
    period: 'Last 30 days',
    generated: '2026-07-31',
    format: 'PDF',
    rows: 14,
  },
  {
    id: 'rep-004',
    name: 'Referral programme conversions',
    period: 'Season 2026/27 to date',
    generated: '2026-07-28',
    format: 'CSV',
    rows: 468,
  },
  {
    id: 'rep-005',
    name: 'Regional coverage and capacity',
    period: 'Rolling 12 months',
    generated: '2026-07-25',
    format: 'PDF',
    rows: 6,
  },
];
