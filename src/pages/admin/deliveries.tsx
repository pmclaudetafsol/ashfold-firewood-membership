import * as React from 'react';
import { CalendarDays, ClipboardList, ListChecks, NotebookPen, Search, Truck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SeasonCalendar } from '@/components/shared/season-calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/misc';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/states';
import { useDemo } from '@/state/demo-store';
import { deliveryStatusOrder } from '@/data/deliveries';
import { formatDate } from '@/utils/format';
import { toast } from '@/hooks/use-toast';
import type { Delivery, DeliveryStatus } from '@/types';

export default function AdminDeliveriesPage() {
  const { deliveries, suppliers, updateDeliveryStatus, assignSupplier, updateDeliveryNotes } = useDemo();

  const [statusFilter, setStatusFilter] = React.useState<DeliveryStatus | 'all'>('all');
  const [supplierFilter, setSupplierFilter] = React.useState<string>('all');
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [assignTarget, setAssignTarget] = React.useState<Delivery | null>(null);
  const [assignSupplierId, setAssignSupplierId] = React.useState<string>('none');
  const [noteTarget, setNoteTarget] = React.useState<Delivery | null>(null);
  const [noteText, setNoteText] = React.useState('');

  const filtered = deliveries
    .filter((delivery) => statusFilter === 'all' || delivery.status === statusFilter)
    .filter((delivery) => supplierFilter === 'all' || delivery.supplierId === supplierFilter)
    .filter(
      (delivery) => !customerSearch.trim() || delivery.customerName.toLowerCase().includes(customerSearch.toLowerCase()),
    )
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((current) => (current.size === filtered.length ? new Set() : new Set(filtered.map((d) => d.id))));
  };

  const bulkMarkDispatched = () => {
    selected.forEach((id) => updateDeliveryStatus(id, 'dispatched', 'Bulk-updated by an administrator.'));
    toast.success(`${selected.size} ${selected.size === 1 ? 'delivery' : 'deliveries'} marked as dispatched`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Deliveries" description={`${deliveries.length} deliveries across every member`} />

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">
            <ListChecks aria-hidden="true" />
            Table
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays aria-hidden="true" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                placeholder="Search customer"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatus | 'all')}>
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {deliveryStatusOrder.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All suppliers</SelectItem>
                <SelectItem value="none">Unassigned</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-muted px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                {selected.size} {selected.size === 1 ? 'delivery' : 'deliveries'} selected
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
                  Clear
                </Button>
                <Button size="sm" onClick={bulkMarkDispatched}>
                  <Truck aria-hidden="true" />
                  Mark as dispatched
                </Button>
              </div>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <EmptyState title="No deliveries match" description="Try a different filter." icon={ClipboardList} />
          ) : (
            <Table caption="Deliveries">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all deliveries"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((delivery) => (
                  <TableRow key={delivery.id} data-state={selected.has(delivery.id) ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(delivery.id)}
                        onCheckedChange={() => toggleSelected(delivery.id)}
                        aria-label={`Select delivery for ${delivery.customerName}`}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{delivery.customerName}</p>
                      <p className="text-xs text-muted-foreground">Delivery {delivery.sequence} of 8</p>
                    </TableCell>
                    <TableCell>
                      <span className="tabular">{formatDate(delivery.scheduledDate)}</span>
                      <p className="text-xs text-muted-foreground">{delivery.window}</p>
                    </TableCell>
                    <TableCell>{delivery.area}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="text-left text-sm text-primary underline-offset-4 hover:underline"
                        onClick={() => {
                          setAssignTarget(delivery);
                          setAssignSupplierId(delivery.supplierId ?? 'none');
                        }}
                      >
                        {delivery.supplierName ?? 'Assign supplier'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Select value={delivery.status} onValueChange={(value) => updateDeliveryStatus(delivery.id, value as DeliveryStatus)}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryStatusOrder.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNoteTarget(delivery);
                          setNoteText(delivery.operationalNotes ?? '');
                        }}
                      >
                        <NotebookPen aria-hidden="true" />
                        Note
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <SeasonCalendar
            deliveries={filtered}
            onSelect={(delivery) => {
              setNoteTarget(delivery);
              setNoteText(delivery.operationalNotes ?? '');
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Assign supplier modal */}
      <Dialog open={!!assignTarget} onOpenChange={(open) => !open && setAssignTarget(null)}>
        <DialogContent>
          {assignTarget ? (
            <>
              <DialogHeader>
                <DialogTitle>Assign supplier — {assignTarget.customerName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="assign-supplier">Supplier</Label>
                <Select value={assignSupplierId} onValueChange={setAssignSupplierId}>
                  <SelectTrigger id="assign-supplier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} — {supplier.town}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    assignSupplier(assignTarget.id, assignSupplierId === 'none' ? null : assignSupplierId);
                    setAssignTarget(null);
                  }}
                >
                  Save assignment
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Internal note modal */}
      <Dialog open={!!noteTarget} onOpenChange={(open) => !open && setNoteTarget(null)}>
        <DialogContent>
          {noteTarget ? (
            <>
              <DialogHeader>
                <DialogTitle>Internal note — {noteTarget.customerName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="delivery-note">Visible to staff only</Label>
                <Textarea id="delivery-note" rows={4} value={noteText} onChange={(event) => setNoteText(event.target.value)} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    updateDeliveryNotes(noteTarget.id, noteText);
                    setNoteTarget(null);
                  }}
                >
                  Save note
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
