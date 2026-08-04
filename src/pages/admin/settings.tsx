import * as React from 'react';
import { Save, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/misc';
import { serviceableOutwardCodes } from '@/data/service-areas';
import { toast } from '@/hooks/use-toast';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState({
    betaMemberLimit: 2000,
    registrationOpen: true,
    waitingListEnabled: true,
    seasonStart: '2026-04-01',
    seasonEnd: '2027-03-31',
    defaultDeliveries: 8,
    maxDailyDeliveries: 45,
    referralProgrammeEnabled: true,
    promotionalCodesEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
  });
  const [deliveryDays, setDeliveryDays] = React.useState<Set<string>>(new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']));

  const set = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const toggleDay = (day: string) => {
    setDeliveryDays((current) => {
      const next = new Set(current);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Platform settings" description="Beta configuration for registration, deliveries and programmes." />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="size-4 text-muted-foreground" aria-hidden="true" />
            Membership and registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="beta-limit">Beta member limit</Label>
              <Input id="beta-limit" type="number" value={settings.betaMemberLimit} onChange={(e) => set('betaMemberLimit', Number(e.target.value))} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Registration open</p>
              <p className="text-sm text-muted-foreground">Turn off to stop accepting new members</p>
            </div>
            <Switch checked={settings.registrationOpen} onCheckedChange={(v) => set('registrationOpen', v === true)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Waiting list</p>
              <p className="text-sm text-muted-foreground">Show a waiting list for unserviceable postcodes</p>
            </div>
            <Switch checked={settings.waitingListEnabled} onCheckedChange={(v) => set('waitingListEnabled', v === true)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery season</CardTitle>
          <CardDescription>Dates and volumes that drive every member's season plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="season-start">Season start</Label>
              <Input id="season-start" type="date" value={settings.seasonStart} onChange={(e) => set('seasonStart', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="season-end">Season end</Label>
              <Input id="season-end" type="date" value={settings.seasonEnd} onChange={(e) => set('seasonEnd', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="default-deliveries">Default deliveries per membership</Label>
              <Input id="default-deliveries" type="number" value={settings.defaultDeliveries} onChange={(e) => set('defaultDeliveries', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-daily">Maximum daily deliveries</Label>
              <Input id="max-daily" type="number" value={settings.maxDailyDeliveries} onChange={(e) => set('maxDailyDeliveries', Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>Delivery weekdays</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {weekdays.map((day) => (
                <label key={day} className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox checked={deliveryDays.has(day)} onCheckedChange={() => toggleDay(day)} />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <Label>Serviceable postcode areas</Label>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {serviceableOutwardCodes.map((code) => (
                <span key={code} className="tabular rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                  {code}
                </span>
              ))}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programmes and notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              { key: 'referralProgrammeEnabled', label: 'Referral programme', description: 'Members can earn credit for referring friends' },
              { key: 'promotionalCodesEnabled', label: 'Promotional codes', description: 'Allow codes to be applied at checkout' },
              { key: 'emailNotificationsEnabled', label: 'Email notifications', description: 'Delivery, billing and renewal emails' },
              { key: 'smsNotificationsEnabled', label: 'SMS notifications', description: 'Delivery day text reminders' },
            ] as const
          ).map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-sm text-muted-foreground">{row.description}</p>
              </div>
              <Switch checked={settings[row.key]} onCheckedChange={(v) => set(row.key, v === true)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" onClick={() => toast.success('Platform settings saved')}>
        <Save aria-hidden="true" />
        Save settings
      </Button>
    </div>
  );
}
