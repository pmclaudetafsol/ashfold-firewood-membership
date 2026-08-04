import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Gift, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { DeliveryStatusBadge, MembershipStatusBadge } from '@/components/shared/status-badge';
import { DemoChip } from '@/components/shared/demo';
import { useCurrentCustomer, useDemo } from '@/state/demo-store';
import { getPlan } from '@/data/plans';
import { formatDateLong, formatPence, formatRelative } from '@/utils/format';
import { cn } from '@/lib/utils';

const toneDot = {
  information: 'bg-information',
  success: 'bg-success',
  warning: 'bg-warning-solid',
  destructive: 'bg-destructive',
} as const;

export default function CustomerOverviewPage() {
  const customer = useCurrentCustomer();
  const { notifications, deliveries: allDeliveries } = useDemo();
  const plan = getPlan(customer.planId);
  const deliveries = allDeliveries
    .filter((delivery) => delivery.customerId === customer.id)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  const next = [...deliveries]
    .filter((delivery) => delivery.status !== 'delivered')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0];
  const recentNotifications = [...notifications].sort((a, b) => b.sentAt.localeCompare(a.sentAt)).slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${customer.firstName}`}
        description={`Here's how your ${plan.name} membership is looking this season.`}
        actions={
          <Button asChild variant="accent">
            <Link to="/dashboard/calendar">
              View delivery calendar
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Membership plan"
          value={plan.name}
          hint={<MembershipStatusBadge status={customer.membershipStatus} size="sm" />}
          icon={Sparkles}
          to="/dashboard/membership"
        />
        <StatCard
          label="Deliveries completed"
          value={`${customer.deliveriesCompleted} of 8`}
          hint="This season"
          icon={CheckCircle2}
          to="/dashboard/calendar"
        />
        <StatCard
          label="Deliveries remaining"
          value={customer.deliveriesRemaining}
          hint={next ? `Next: ${formatDateLong(next.scheduledDate)}` : 'Season complete'}
          icon={Package}
          to="/dashboard/calendar"
        />
        <StatCard
          label="Referral reward balance"
          value={formatPence(customer.referralBalancePence)}
          hint="Applied at renewal"
          icon={Gift}
          to="/dashboard/referrals"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Next delivery</CardTitle>
              <CardDescription>{next ? `Delivery ${next.sequence} of 8` : 'Nothing scheduled'}</CardDescription>
            </div>
            {next ? <DeliveryStatusBadge status={next.status} /> : null}
          </CardHeader>
          <CardContent>
            {next ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                    <CalendarDays className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-xl font-bold text-foreground">{formatDateLong(next.scheduledDate)}</p>
                    <p className="text-sm text-muted-foreground">{next.window}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-4 rounded-lg bg-muted/60 p-4 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{next.crates} crates</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supplier</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{next.supplierName ?? 'To be assigned'}</dd>
                  </div>
                </dl>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/dashboard/deliveries/${next.id}`}>
                    View delivery details
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No deliveries scheduled yet"
                description="Your delivery calendar will appear here once your season plan is confirmed."
                icon={Package}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.href ?? '/dashboard/notifications'}
                className="-mx-2.5 flex items-start gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-muted/60"
              >
                <span
                  className={cn('mt-1.5 size-2 shrink-0 rounded-full', toneDot[notification.tone as keyof typeof toneDot] ?? 'bg-muted-foreground')}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{notification.title}</span>
                  <span className="block text-xs text-muted-foreground">{formatRelative(notification.sentAt)}</span>
                </span>
              </Link>
            ))}
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to="/dashboard/notifications">View all notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Your season at a glance</CardTitle>
          <DemoChip />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {deliveries.map((delivery) => (
              <Link
                key={delivery.id}
                to={`/dashboard/deliveries/${delivery.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors hover:border-primary/50 hover:bg-primary-muted/40"
              >
                <span className="tabular text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  #{delivery.sequence}
                </span>
                <DeliveryStatusBadge status={delivery.status} size="sm" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
