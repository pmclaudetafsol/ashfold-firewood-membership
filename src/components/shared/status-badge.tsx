import {
  CheckCircle2,
  CircleDashed,
  Clock,
  FileText,
  Flame,
  PauseCircle,
  Package,
  Truck,
  TriangleAlert,
  XCircle,
  CalendarCheck,
  BadgeCheck,
  Mail,
  MessageSquare,
  Bell,
  RotateCcw,
  Hourglass,
} from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import type {
  DeliveryStatus,
  MembershipStatus,
  NotificationChannel,
  PaymentStatus,
  ReferralStatus,
} from '@/types';

/**
 * Status is never carried by colour alone: every badge pairs a tinted swatch
 * with an icon and a written label, which keeps the meaning available to
 * colour-blind users and in greyscale print-outs.
 */

type Entry = { label: string; variant: BadgeVariant; Icon: React.ComponentType<{ className?: string }> };

const deliveryStatuses: Record<DeliveryStatus, Entry> = {
  draft: { label: 'Draft', variant: 'neutral', Icon: FileText },
  scheduled: { label: 'Scheduled', variant: 'information', Icon: CalendarCheck },
  confirmed: { label: 'Confirmed', variant: 'primary', Icon: BadgeCheck },
  preparing: { label: 'Preparing', variant: 'oak', Icon: Package },
  dispatched: { label: 'Dispatched', variant: 'warning', Icon: Truck },
  delivered: { label: 'Delivered', variant: 'success', Icon: CheckCircle2 },
  delayed: { label: 'Delayed', variant: 'destructive', Icon: TriangleAlert },
};

const membershipStatuses: Record<MembershipStatus, Entry> = {
  active: { label: 'Active', variant: 'success', Icon: Flame },
  pending: { label: 'Pending', variant: 'warning', Icon: Hourglass },
  paused: { label: 'Paused', variant: 'neutral', Icon: PauseCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive', Icon: XCircle },
  expired: { label: 'Expired', variant: 'neutral', Icon: CircleDashed },
};

const paymentStatuses: Record<PaymentStatus, Entry> = {
  paid: { label: 'Paid', variant: 'success', Icon: CheckCircle2 },
  pending: { label: 'Pending', variant: 'warning', Icon: Clock },
  failed: { label: 'Failed', variant: 'destructive', Icon: XCircle },
  refunded: { label: 'Refunded', variant: 'information', Icon: RotateCcw },
};

const referralStatuses: Record<ReferralStatus, Entry> = {
  joined: { label: 'Joined', variant: 'success', Icon: CheckCircle2 },
  invited: { label: 'Invited', variant: 'information', Icon: Clock },
  expired: { label: 'Expired', variant: 'neutral', Icon: CircleDashed },
};

const channels: Record<NotificationChannel, Entry> = {
  email: { label: 'Email', variant: 'neutral', Icon: Mail },
  sms: { label: 'SMS', variant: 'neutral', Icon: MessageSquare },
  'in-app': { label: 'In-app', variant: 'neutral', Icon: Bell },
};

function render({ label, variant, Icon }: Entry, size?: 'sm' | 'md') {
  return (
    <Badge variant={variant} size={size}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function DeliveryStatusBadge({ status, size }: { status: DeliveryStatus; size?: 'sm' | 'md' }) {
  return render(deliveryStatuses[status], size);
}

export function MembershipStatusBadge({ status, size }: { status: MembershipStatus; size?: 'sm' | 'md' }) {
  return render(membershipStatuses[status], size);
}

export function PaymentStatusBadge({ status, size }: { status: PaymentStatus; size?: 'sm' | 'md' }) {
  return render(paymentStatuses[status], size);
}

export function ReferralStatusBadge({ status, size }: { status: ReferralStatus; size?: 'sm' | 'md' }) {
  return render(referralStatuses[status], size);
}

export function ChannelBadge({ channel, size }: { channel: NotificationChannel; size?: 'sm' | 'md' }) {
  return render(channels[channel], size);
}

export const deliveryStatusLabels = Object.fromEntries(
  Object.entries(deliveryStatuses).map(([key, entry]) => [key, entry.label]),
) as Record<DeliveryStatus, string>;
