import { Download, Receipt } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { PaymentStatusBadge } from '@/components/shared/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { useCurrentCustomer } from '@/state/demo-store';
import { paymentsForCustomer } from '@/data/payments';
import { formatDate, formatPence } from '@/utils/format';
import { toast } from '@/hooks/use-toast';

export default function CustomerPaymentsPage() {
  const customer = useCurrentCustomer();
  const payments = paymentsForCustomer(customer.id);

  return (
    <div className="space-y-8">
      <PageHeader title="Payments and invoices" description="Every charge against your membership, in one place." />

      {payments.length === 0 ? (
        <EmptyState title="No payments yet" description="Invoices will appear here once your membership is active." icon={Receipt} />
      ) : (
        <Table caption="Payment history">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium text-foreground">{payment.invoiceNumber}</TableCell>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell className="max-w-64 text-muted-foreground">{payment.description}</TableCell>
                <TableCell className="tabular font-medium">{formatPence(payment.amountPence)}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} size="sm" />
                  {payment.failureReason ? (
                    <p className="mt-1 max-w-56 text-xs text-destructive-text">{payment.failureReason}</p>
                  ) : null}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.info('Demonstration download', `${payment.invoiceNumber}.pdf would download here.`)
                    }
                  >
                    <Download aria-hidden="true" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
