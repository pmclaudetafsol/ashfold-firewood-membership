import * as React from 'react';
import { Eye, MapPin, Search, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { MembershipStatusBadge, DeliveryStatusBadge } from '@/components/shared/status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/states';
import { Separator } from '@/components/ui/misc';
import { useDemo } from '@/state/demo-store';
import { getPlan } from '@/data/plans';
import { formatAddressLines, formatDate, formatPence } from '@/utils/format';
import type { Customer, MembershipStatus, PlanTier } from '@/types';

export default function AdminCustomersPage() {
  const { customers, deliveries } = useDemo();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<MembershipStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = React.useState<PlanTier | 'all'>('all');
  const [selected, setSelected] = React.useState<Customer | null>(null);

  const filtered = customers.filter((customer) => {
    const matchesSearch =
      !search.trim() ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.address.postcode.toLowerCase().includes(search.toLowerCase()) ||
      customer.reference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.membershipStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || customer.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const nextDeliveryFor = (customer: Customer) => {
    const upcoming = deliveries.filter((delivery) => delivery.customerId === customer.id && delivery.status !== 'delivered');
    return upcoming.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0] ?? null;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description={`${customers.length} members across the platform`} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, postcode or reference"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MembershipStatus | 'all')}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Membership status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={(value) => setPlanFilter(value as PlanTier | 'all')}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="light">Light User</SelectItem>
            <SelectItem value="moderate">Moderate User</SelectItem>
            <SelectItem value="heavy">Heavy User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No customers match" description="Try a different search or clear the filters." icon={Users} />
      ) : (
        <Table caption="Customers">
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Next delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => {
              const plan = getPlan(customer.planId);
              const next = nextDeliveryFor(customer);
              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{customer.reference}</p>
                  </TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>
                    <MembershipStatusBadge status={customer.membershipStatus} size="sm" />
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      {customer.address.town}
                    </span>
                  </TableCell>
                  <TableCell>
                    {next ? (
                      <span className="flex flex-col gap-1">
                        <span className="tabular text-sm">{formatDate(next.scheduledDate)}</span>
                        <DeliveryStatusBadge status={next.status} size="sm" />
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">None scheduled</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(customer)}>
                      <Eye aria-hidden="true" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.firstName} {selected.lastName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <MembershipStatusBadge status={selected.membershipStatus} />
                  <span className="text-muted-foreground">{selected.reference}</span>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan</dt>
                    <dd className="font-medium text-foreground">{getPlan(selected.planId).name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lifetime value</dt>
                    <dd className="tabular font-medium text-foreground">{formatPence(selected.lifetimeValuePence)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Joined</dt>
                    <dd className="font-medium text-foreground">{formatDate(selected.joinedOn)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Renews</dt>
                    <dd className="font-medium text-foreground">{formatDate(selected.renewsOn)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deliveries</dt>
                    <dd className="font-medium text-foreground">
                      {selected.deliveriesCompleted} of {selected.deliveriesCompleted + selected.deliveriesRemaining}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Referral code</dt>
                    <dd className="tabular font-medium text-foreground">{selected.referralCode}</dd>
                  </div>
                </dl>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact</p>
                  <p className="mt-1 text-foreground">{selected.email}</p>
                  <p className="text-foreground">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Address</p>
                  {formatAddressLines(selected.address).map((line) => (
                    <p key={line} className="text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
                {selected.deliveryNotes ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Delivery notes</p>
                    <p className="text-foreground">{selected.deliveryNotes}</p>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
