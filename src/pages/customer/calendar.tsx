import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, List } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SeasonCalendar } from '@/components/shared/season-calendar';
import { DeliveryStatusBadge } from '@/components/shared/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/misc';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCurrentCustomer, useDemo } from '@/state/demo-store';
import { formatDateLong } from '@/utils/format';

export default function CustomerCalendarPage() {
  const customer = useCurrentCustomer();
  const { deliveries: allDeliveries } = useDemo();
  const deliveries = allDeliveries
    .filter((delivery) => delivery.customerId === customer.id)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Delivery calendar"
        description="All eight deliveries for your 2026/27 membership year. Select any delivery for full detail."
      />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarDays aria-hidden="true" />
            Calendar view
          </TabsTrigger>
          <TabsTrigger value="list">
            <List aria-hidden="true" />
            List view
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <SeasonCalendar deliveries={deliveries} hrefFor={(delivery) => `/dashboard/deliveries/${delivery.id}`} />
        </TabsContent>

        <TabsContent value="list">
          <Table caption="Your scheduled deliveries">
            <TableHeader>
              <TableRow>
                <TableHead>Delivery</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium text-foreground">{delivery.sequence} of 8</TableCell>
                  <TableCell>{formatDateLong(delivery.scheduledDate)}</TableCell>
                  <TableCell className="tabular">{delivery.window}</TableCell>
                  <TableCell>{delivery.crates} crates</TableCell>
                  <TableCell>{delivery.supplierName ?? 'To be assigned'}</TableCell>
                  <TableCell>
                    <DeliveryStatusBadge status={delivery.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/dashboard/deliveries/${delivery.id}`}>
                        View
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
