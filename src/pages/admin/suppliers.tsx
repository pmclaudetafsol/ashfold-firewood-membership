import * as React from 'react';
import { Eye, Star, Truck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/misc';
import { useDemo } from '@/state/demo-store';
import { formatPercent } from '@/utils/format';
import type { Supplier } from '@/types';

const statusVariant = {
  active: 'success',
  onboarding: 'warning',
  paused: 'neutral',
} as const;

export default function AdminSuppliersPage() {
  const { suppliers, deliveries } = useDemo();
  const [selected, setSelected] = React.useState<Supplier | null>(null);

  const upcomingFor = (supplierId: string) =>
    deliveries.filter((delivery) => delivery.supplierId === supplierId && delivery.status !== 'delivered').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="The regional partners fulfilling every membership delivery." />

      <div className="grid gap-4 sm:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <CardTitle className="text-base">{supplier.name}</CardTitle>
              <Badge variant={statusVariant[supplier.status]} size="sm" className="capitalize">
                {supplier.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{supplier.town}, {supplier.county}</p>
              <div className="flex items-center gap-1.5 text-foreground">
                <Star className="size-3.5 fill-oak text-oak" aria-hidden="true" />
                {supplier.rating.toFixed(1)} · {formatPercent(supplier.onTimeRate)} on time
              </div>
              <p className="tabular text-muted-foreground">{upcomingFor(supplier.id)} upcoming deliveries</p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setSelected(supplier)}>
                <Eye aria-hidden="true" />
                View details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Table caption="Supplier directory">
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Upcoming</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
              <TableCell>
                <p>{supplier.contactName}</p>
                <p className="text-xs text-muted-foreground">{supplier.phone}</p>
              </TableCell>
              <TableCell>{supplier.coverageAreas.join(', ')}</TableCell>
              <TableCell className="tabular">{supplier.capacityPerWeek}/week</TableCell>
              <TableCell>
                <Badge variant={statusVariant[supplier.status]} size="sm" className="capitalize">
                  {supplier.status}
                </Badge>
              </TableCell>
              <TableCell className="tabular text-right">{upcomingFor(supplier.id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="size-4 text-muted-foreground" aria-hidden="true" />
                  {selected.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  {selected.contactName} · {selected.email} · {selected.phone}
                </p>
                <Separator />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">On-time rate</dt>
                    <dd className="font-medium text-foreground">{formatPercent(selected.onTimeRate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Moisture compliance</dt>
                    <dd className="font-medium text-foreground">{formatPercent(selected.moistureComplianceRate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Weekly capacity</dt>
                    <dd className="font-medium text-foreground">{selected.capacityPerWeek} deliveries</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active deliveries</dt>
                    <dd className="font-medium text-foreground">{selected.activeDeliveries}</dd>
                  </div>
                </dl>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Coverage areas</p>
                  <p className="mt-1 text-foreground">{selected.coverageAreas.join(', ')}</p>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
