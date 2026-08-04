import * as React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { MembershipStatusBadge } from '@/components/shared/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useDemo } from '@/state/demo-store';
import { getPlan } from '@/data/plans';
import { formatDate, formatPence } from '@/utils/format';
import type { MembershipStatus, PlanTier } from '@/types';

const statusOptions: MembershipStatus[] = ['active', 'pending', 'paused', 'cancelled', 'expired'];

export default function AdminMembershipsPage() {
  const { customers, setMembershipStatus } = useDemo();
  const [planFilter, setPlanFilter] = React.useState<PlanTier | 'all'>('all');

  const filtered = customers.filter((customer) => planFilter === 'all' || customer.planId === planFilter);
  const activeCount = customers.filter((c) => c.membershipStatus === 'active').length;
  const pendingCount = customers.filter((c) => c.membershipStatus === 'pending').length;
  const totalRevenue = customers.reduce((sum, c) => sum + getPlan(c.planId).annualPricePence, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Memberships" description="Plan, pricing and status for every membership." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active memberships" value={activeCount} icon={Sparkles} />
        <StatCard label="Pending activation" value={pendingCount} icon={Sparkles} tone="warning" />
        <StatCard label="Combined annual value" value={formatPence(totalRevenue, { trimWholePounds: true })} icon={Sparkles} tone="success" />
      </div>

      <Select value={planFilter} onValueChange={(value) => setPlanFilter(value as PlanTier | 'all')}>
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="Filter by plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All plans</SelectItem>
          <SelectItem value="light">Light User</SelectItem>
          <SelectItem value="moderate">Moderate User</SelectItem>
          <SelectItem value="heavy">Heavy User</SelectItem>
        </SelectContent>
      </Select>

      <Table caption="Memberships">
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Annual price</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>Renews</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((customer) => {
            const plan = getPlan(customer.planId);
            return (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-foreground">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell className="tabular">{formatPence(plan.annualPricePence, { trimWholePounds: true })}</TableCell>
                <TableCell>{formatDate(customer.joinedOn)}</TableCell>
                <TableCell>{formatDate(customer.renewsOn)}</TableCell>
                <TableCell>
                  <MembershipStatusBadge status={customer.membershipStatus} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Change status
                        <ChevronDown aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Set status</DropdownMenuLabel>
                      {statusOptions.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onSelect={() => setMembershipStatus(customer.id, status)}
                          disabled={status === customer.membershipStatus}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
