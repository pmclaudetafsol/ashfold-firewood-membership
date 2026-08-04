import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { SeasonCalendar } from '@/components/shared/season-calendar';
import { DeliveryStatusBadge } from '@/components/shared/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDemo } from '@/state/demo-store';
import { formatDateLong } from '@/utils/format';
import type { Delivery } from '@/types';

export default function AdminCalendarPage() {
  const { deliveries, suppliers } = useDemo();
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [active, setActive] = React.useState<Delivery | null>(null);

  const filtered = deliveries.filter((delivery) => supplierFilter === 'all' || delivery.supplierId === supplierFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Delivery calendar" description="Every delivery across the platform, in one season view." />

      <Select value={supplierFilter} onValueChange={setSupplierFilter}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Filter by supplier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All suppliers</SelectItem>
          {suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <SeasonCalendar deliveries={filtered} onSelect={setActive} />

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle>{active.customerName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <DeliveryStatusBadge status={active.status} />
                <p className="text-foreground">
                  Delivery {active.sequence} of 8 · {formatDateLong(active.scheduledDate)} · {active.window}
                </p>
                <p className="text-muted-foreground">
                  {active.area} · {active.crates} crates · {active.supplierName ?? 'Unassigned'}
                </p>
                {active.operationalNotes ? <p className="text-muted-foreground">{active.operationalNotes}</p> : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
