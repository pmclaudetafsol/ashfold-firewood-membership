/**
 * Domain types for the frontend demonstration.
 *
 * These mirror the shape a real API would return so the mock data layer in
 * `src/data` can later be swapped for network calls without touching any view.
 * Money is always integer pence; calendar dates are always `YYYY-MM-DD`.
 */

import type { IsoDate } from '@/utils/format';

/* ─────────────────────────── Membership plans ─────────────────────────── */

export type PlanTier = 'light' | 'moderate' | 'heavy';

export interface MembershipPlan {
  id: PlanTier;
  name: string;
  strapline: string;
  /** Annual membership price in pence. */
  annualPricePence: number;
  /** Indicative equivalent per delivery, for the "works out at" line. */
  perDeliveryPence: number;
  deliveriesPerYear: number;
  /** Crates per delivery — the unit the business quotes to customers. */
  cratesPerDelivery: number;
  /** Approximate loose volume per delivery in cubic metres. */
  volumePerDeliveryM3: number;
  /** Approximate weight per delivery in kilograms. */
  weightPerDeliveryKg: number;
  recommendedFor: string;
  householdProfile: string[];
  benefits: string[];
  recommended: boolean;
}

/* ───────────────────────────── Customers ──────────────────────────────── */

export interface UkAddress {
  line1: string;
  line2?: string | null;
  town: string;
  county?: string | null;
  postcode: string;
}

export type MembershipStatus = 'active' | 'pending' | 'paused' | 'cancelled' | 'expired';

export interface Customer {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: UkAddress;
  planId: PlanTier;
  membershipStatus: MembershipStatus;
  joinedOn: IsoDate;
  renewsOn: IsoDate;
  deliveriesCompleted: number;
  deliveriesRemaining: number;
  /** Referral credit balance in pence. */
  referralBalancePence: number;
  referralCode: string;
  lifetimeValuePence: number;
  deliveryNotes?: string;
  accessNotes?: string;
}

/* ───────────────────────────── Deliveries ─────────────────────────────── */

export type DeliveryStatus =
  | 'draft'
  | 'scheduled'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'delayed';

export interface DeliveryEvent {
  id: string;
  at: string;
  label: string;
  detail?: string;
}

export interface Delivery {
  id: string;
  /** 1–8 within the membership year. */
  sequence: number;
  customerId: string;
  customerName: string;
  /** Outward postcode area, e.g. "GU7" — all the supplier view needs. */
  area: string;
  postcode: string;
  town: string;
  scheduledDate: IsoDate;
  /** Two-hour arrival window, e.g. "08:00 – 12:00". */
  window: string;
  status: DeliveryStatus;
  crates: number;
  volumeM3: number;
  supplierId: string | null;
  supplierName: string | null;
  driver?: string | null;
  instructions?: string;
  operationalNotes?: string;
  /** Populated only when a delivery slips; shown as the reason to the customer. */
  delayReason?: string;
  deliveredAt?: string | null;
  timeline: DeliveryEvent[];
}

/* ───────────────────────────── Suppliers ──────────────────────────────── */

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  town: string;
  county: string;
  coverageAreas: string[];
  /** Percentage of deliveries completed within the promised window. */
  onTimeRate: number;
  /** Average customer rating out of 5. */
  rating: number;
  activeDeliveries: number;
  capacityPerWeek: number;
  moistureComplianceRate: number;
  status: 'active' | 'onboarding' | 'paused';
}

/* ────────────────────────── Payments & invoices ───────────────────────── */

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  description: string;
  amountPence: number;
  status: PaymentStatus;
  date: IsoDate;
  method: string;
  /** Present for failures so the UI can explain what happened. */
  failureReason?: string;
}

/* ────────────────────────── Referrals & promos ────────────────────────── */

export type ReferralStatus = 'joined' | 'invited' | 'expired';

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  friendName: string;
  friendEmail: string;
  status: ReferralStatus;
  rewardPence: number;
  date: IsoDate;
}

export type PromotionType = 'percentage' | 'fixed';

export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  type: PromotionType;
  /** Percent (0–100) or pence, depending on `type`. */
  value: number;
  usageCount: number;
  usageLimit: number;
  startsOn: IsoDate;
  expiresOn: IsoDate;
  active: boolean;
  appliesTo: PlanTier[] | 'all';
}

/* ──────────────────────────── Notifications ───────────────────────────── */

export type NotificationTone = 'information' | 'success' | 'warning' | 'destructive';
export type NotificationChannel = 'email' | 'sms' | 'in-app';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  tone: NotificationTone;
  channel: NotificationChannel;
  /** ISO timestamp. */
  sentAt: string;
  read: boolean;
  /** Optional in-app destination for the "View" action. */
  href?: string;
}

/* ─────────────────────────── Communications ───────────────────────────── */

export interface CommunicationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  trigger: string;
  audience: string;
  lastSent: IsoDate;
  sentCount: number;
  openRate: number;
  active: boolean;
}

/* ─────────────────────────────── Reports ──────────────────────────────── */

export interface MonthlyPoint {
  month: string;
  revenuePence: number;
  newMembers: number;
  deliveries: number;
  churn: number;
}

export interface PlanSplitPoint {
  plan: string;
  members: number;
  revenuePence: number;
  fill: string;
}

export interface RegionPoint {
  region: string;
  members: number;
  deliveries: number;
}

/* ───────────────────────────── Marketing ──────────────────────────────── */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  plan: string;
  rating: number;
  memberSince: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

/* ─────────────────────────── Demo personas ────────────────────────────── */

export type DemoRole = 'customer' | 'admin' | 'supplier';

export interface DemoSession {
  role: DemoRole;
  name: string;
  email: string;
  /** Customer id for the customer persona; supplier id for the supplier one. */
  linkedId: string | null;
}
