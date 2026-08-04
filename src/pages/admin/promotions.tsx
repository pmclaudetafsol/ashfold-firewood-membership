import * as React from 'react';
import { Pencil, Plus, Tag } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useDemo } from '@/state/demo-store';
import { formatDate } from '@/utils/format';
import type { PromotionCode, PromotionType } from '@/types';

const emptyForm = {
  code: '',
  description: '',
  type: 'percentage' as PromotionType,
  value: 10,
  usageLimit: 100,
  startsOn: new Date().toISOString().slice(0, 10),
  expiresOn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
};

export default function AdminPromotionsPage() {
  const { promotions, togglePromotion, addPromotion, updatePromotion } = useDemo();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PromotionCode | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (promo: PromotionCode) => {
    setEditing(promo);
    setForm({
      code: promo.code,
      description: promo.description,
      type: promo.type,
      value: promo.value,
      usageLimit: promo.usageLimit,
      startsOn: promo.startsOn,
      expiresOn: promo.expiresOn,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      updatePromotion(editing.id, { ...form });
    } else {
      addPromotion({
        id: `promo-${Date.now()}`,
        ...form,
        usageCount: 0,
        active: true,
        appliesTo: 'all',
      });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional codes"
        description="Discount codes available at checkout."
        actions={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" />
            Create code
          </Button>
        }
      />

      <Table caption="Promotional codes">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Window</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell>
                <p className="tabular font-medium text-foreground">{promo.code}</p>
                <p className="text-xs text-muted-foreground">{promo.description}</p>
              </TableCell>
              <TableCell className="tabular">{promo.type === 'percentage' ? `${promo.value}%` : `£${(promo.value / 100).toFixed(2)}`}</TableCell>
              <TableCell>
                {formatDate(promo.startsOn)} – {formatDate(promo.expiresOn)}
              </TableCell>
              <TableCell className="tabular">{promo.usageCount} / {promo.usageLimit}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch checked={promo.active} onCheckedChange={() => togglePromotion(promo.id)} aria-label={`Toggle ${promo.code}`} />
                  <Badge variant={promo.active ? 'success' : 'neutral'} size="sm">
                    {promo.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => openEdit(promo)}>
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" aria-hidden="true" />
              {editing ? `Edit ${editing.code}` : 'Create promotional code'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-code">Code</Label>
                <Input
                  id="promo-code"
                  value={form.code}
                  className="uppercase"
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-type">Discount type</Label>
                <Select value={form.type} onValueChange={(value) => setForm((f) => ({ ...f, type: value as PromotionType }))}>
                  <SelectTrigger id="promo-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed amount (pence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="promo-description">Description</Label>
              <Input id="promo-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-value">Value {form.type === 'percentage' ? '(%)' : '(pence)'}</Label>
                <Input
                  id="promo-value"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-limit">Usage limit</Label>
                <Input
                  id="promo-limit"
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-start">Starts</Label>
                <Input id="promo-start" type="date" value={form.startsOn} onChange={(e) => setForm((f) => ({ ...f, startsOn: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-end">Expires</Label>
                <Input id="promo-end" type="date" value={form.expiresOn} onChange={(e) => setForm((f) => ({ ...f, expiresOn: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={save} disabled={!form.code.trim() || !form.description.trim()}>
              {editing ? 'Save changes' : 'Create code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
