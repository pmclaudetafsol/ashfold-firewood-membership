import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Home,
  MapPin,
  MessageSquareText,
  Package,
  Truck,
  User,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DeliveryStatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, EmptyState } from '@/components/ui/states';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useCurrentCustomer, useDemo } from '@/state/demo-store';
import { formatDateLong, formatTimestamp, todayInUk } from '@/utils/format';
import { cn } from '@/lib/utils';

const reschedulableStatuses = new Set(['draft', 'scheduled', 'confirmed', 'delayed']);

export default function CustomerDeliveryDetailPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const customer = useCurrentCustomer();
  const { deliveries: allDeliveries, rescheduleDelivery } = useDemo();

  const deliveries = allDeliveries.filter((item) => item.customerId === customer.id);
  const delivery = deliveries.find((item) => item.id === deliveryId);

  const [open, setOpen] = React.useState(false);
  const [newDate, setNewDate] = React.useState(delivery?.scheduledDate ?? '');
  const [newWindow, setNewWindow] = React.useState(delivery?.window ?? '08:00 – 12:00');

  if (!delivery) {
    return (
      <div className="space-y-6">
        <PageHeader title="Delivery not found" breadcrumbs={[{ label: 'Delivery calendar', to: '/dashboard/calendar' }, { label: 'Not found' }]} />
        <EmptyState
          title="We couldn't find that delivery"
          description="It may have been part of a different membership year. Return to your calendar to see all eight deliveries."
          icon={Package}
          action={
            <Button asChild>
              <Link to="/dashboard/calendar">Back to calendar</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const canReschedule = reschedulableStatuses.has(delivery.status);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Delivery ${delivery.sequence} of 8`}
        description={formatDateLong(delivery.scheduledDate)}
        breadcrumbs={[{ label: 'Delivery calendar', to: '/dashboard/calendar' }, { label: `Delivery ${delivery.sequence}` }]}
        actions={
          <>
            <DeliveryStatusBadge status={delivery.status} />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!canReschedule}>
                  <CalendarClock aria-hidden="true" />
                  Reschedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reschedule delivery {delivery.sequence}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reschedule-date">New date</Label>
                    <Input
                      id="reschedule-date"
                      type="date"
                      min={todayInUk()}
                      value={newDate}
                      onChange={(event) => setNewDate(event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reschedule-window">Arrival window</Label>
                    <Select value={newWindow} onValueChange={setNewWindow}>
                      <SelectTrigger id="reschedule-window">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00 – 12:00">08:00 – 12:00</SelectItem>
                        <SelectItem value="12:00 – 16:00">12:00 – 16:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Free of charge, up to 48 hours before the scheduled date.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      rescheduleDelivery(delivery.id, newDate, newWindow);
                      setOpen(false);
                    }}
                  >
                    Confirm new date
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {delivery.status === 'delayed' && delivery.delayReason ? (
        <Alert tone="warning" icon={AlertTriangle} title="This delivery was delayed" live>
          {delivery.delayReason}
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Delivery details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date and window</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{formatDateLong(delivery.scheduledDate)}</dd>
                  <dd className="tabular text-sm text-muted-foreground">{delivery.window}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {delivery.crates} {delivery.crates === 1 ? 'crate' : 'crates'} · approx. {delivery.volumeM3}m³
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supplier</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{delivery.supplierName ?? 'To be assigned'}</dd>
                  {delivery.driver ? <dd className="text-sm text-muted-foreground">Driver: {delivery.driver}</dd> : null}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Delivery address</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {customer.address.line1}, {customer.address.town}, {customer.address.postcode}
                  </dd>
                </div>
              </div>
              {delivery.instructions ? (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Home className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your instructions</dt>
                    <dd className="mt-0.5 text-foreground">{delivery.instructions}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5 border-l-2 border-border pl-5">
              {[...delivery.timeline].reverse().map((event, index) => (
                <li key={event.id} className="relative">
                  <span
                    className={cn(
                      'absolute -left-[1.6rem] flex size-4 items-center justify-center rounded-full border-2 border-background',
                      index === 0 ? 'bg-primary' : 'bg-border-strong',
                    )}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-foreground">{event.label}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(event.at)}</p>
                  {event.detail ? <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p> : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquareText className="size-4 text-muted-foreground" aria-hidden="true" />
            Need to change anything?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link to="/dashboard/support">
              <User aria-hidden="true" />
              Contact support
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard/calendar')}>
            Back to calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
