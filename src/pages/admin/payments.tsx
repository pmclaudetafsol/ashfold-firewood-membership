import * as React from 'react';
import { Download, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { PaymentStatusBadge } from '@/components/shared/status-badge';
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
import { CreditCard, CircleCheck, TriangleAlert } from 'lucide-react';
import { payments } from '@/data/payments';
import { formatDate, formatPence } from '@/utils/format';
import { toast } from '@/hooks/use-toast';
import type { PaymentStatus } from '@/types';

export default function AdminPaymentsPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PaymentStatus | 'all'>('all');

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amountPence, 0);
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amountPence, 0);
  const totalFailed = payments.filter((p) => p.status === 'failed').reduce((sum, p) => sum + p.amountPence, 0);

  const filtered = payments
    .filter((payment) => statusFilter === 'all' || payment.status === statusFilter)
    .filter(
      (payment) =>
        !search.trim() ||
        payment.customerName.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8">
      <PageHeader title="Payments" description="All membership and add-on charges across the platform." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatPence(totalPaid, { trimWholePounds: true })} icon={CircleCheck} tone="success" />
        <StatCard label="Pending" value={formatPence(totalPending, { trimWholePounds: true })} icon={CreditCard} tone="warning" />
        <StatCard label="Failed" value={formatPence(totalFailed, { trimWholePounds: true })} icon={TriangleAlert} tone="destructive" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer or invoice" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table caption="Payments">
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium text-foreground">{payment.invoiceNumber}</TableCell>
              <TableCell>{payment.customerName}</TableCell>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell className="tabular">{formatPence(payment.amountPence)}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={payment.status} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => toast.info('Demonstration download', `${payment.invoiceNumber}.pdf would download here.`)}>
                  <Download aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
