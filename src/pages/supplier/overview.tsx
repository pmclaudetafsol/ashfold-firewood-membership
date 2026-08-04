import * as React from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPin, NotebookPen, Package, Truck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { DeliveryStatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/states';
import { useCurrentSupplier, useDemo } from '@/state/demo-store';
import { formatDateLong } from '@/utils/format';
import type { DeliveryStatus } from '@/types';

const statusActions: Array<{ status: DeliveryStatus; label: string }> = [
  { status: 'confirmed', label: 'Accept' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'delayed', label: 'Delayed' },
];

export default function SupplierOverviewPage() {
  const supplier = useCurrentSupplier();
  const { deliveries, updateDeliveryStatus } = useDemo();
  const [statusFilter, setStatusFilter] = React.useState<DeliveryStatus | 'all'>('all');

  const assigned = deliveries
    .filter((delivery) => delivery.supplierId === supplier.id)
    .filter((delivery) => statusFilter === 'all' || delivery.status === statusFilter)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const upcoming = deliveries.filter((delivery) => delivery.supplierId === supplier.id && delivery.status !== 'delivered');
  const thisWeekCount = upcoming.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${supplier.contactName.split(' ')[0]}`}
        description={`${supplier.name} — assigned deliveries and workload.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned deliveries" value={deliveries.filter((d) => d.supplierId === supplier.id).length} icon={Package} />
        <StatCard label="Upcoming workload" value={thisWeekCount} icon={Truck} tone="accent" />
        <StatCard label="On-time rate" value={`${(supplier.onTimeRate * 100).toFixed(1)}%`} icon={CheckCircle2} tone="success" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-lg font-semibold text-foreground">Your deliveries</p>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatus | 'all')}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statusActions.map((action) => (
              <SelectItem key={action.status} value={action.status}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {assigned.length === 0 ? (
        <EmptyState title="No deliveries assigned" description="Deliveries assigned to you by the operations team will appear here." icon={Package} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {assigned.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 font-heading text-base font-semibold text-foreground">
                      <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                      {formatDateLong(delivery.scheduledDate)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {delivery.window}
                    </p>
                  </div>
                  <DeliveryStatusBadge status={delivery.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/60 p-4 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Area</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      {delivery.area} · {delivery.town}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</p>
                    <p className="mt-0.5 font-medium text-foreground">
                      {delivery.crates} crates · {delivery.volumeM3}m³
                    </p>
                  </div>
                </div>

                {delivery.instructions ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Instructions: </span>
                    {delivery.instructions}
                  </p>
                ) : null}

                {delivery.operationalNotes ? (
                  <p className="flex items-start gap-2 rounded-md border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
                    <NotebookPen className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    {delivery.operationalNotes}
                  </p>
                ) : null}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Update status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Set status</DropdownMenuLabel>
                    {statusActions.map((action) => (
                      <DropdownMenuItem
                        key={action.status}
                        onSelect={() => updateDeliveryStatus(delivery.id, action.status)}
                        disabled={action.status === delivery.status}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
