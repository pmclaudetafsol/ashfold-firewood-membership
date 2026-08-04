import * as React from 'react';
import { KeyRound, MapPin, MessageSquare, Save, User } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/misc';
import { useCurrentCustomer, useDemo } from '@/state/demo-store';
import { toast } from '@/hooks/use-toast';

export default function CustomerSettingsPage() {
  const customer = useCurrentCustomer();
  const { updateCustomer } = useDemo();

  const [profile, setProfile] = React.useState({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone });
  const [address, setAddress] = React.useState({
    line1: customer.address.line1,
    line2: customer.address.line2 ?? '',
    town: customer.address.town,
    postcode: customer.address.postcode,
    instructions: customer.deliveryNotes ?? '',
  });
  const [preferences, setPreferences] = React.useState({
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: true,
  });
  const [password, setPassword] = React.useState({ current: '', next: '', confirm: '' });

  return (
    <div className="space-y-8">
      <PageHeader title="Account settings" description="Keep your details up to date so every delivery goes smoothly." />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" aria-hidden="true" />
            Personal details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="settings-first">First name</Label>
              <Input id="settings-first" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-last">Last name</Label>
              <Input id="settings-last" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5 sm:max-w-xs">
            <Label htmlFor="settings-phone">Phone number</Label>
            <Input id="settings-phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <Button
            onClick={() => {
              updateCustomer(customer.id, profile);
              toast.success('Personal details updated');
            }}
          >
            <Save aria-hidden="true" />
            Save details
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
            Delivery address and instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="settings-line1">Address line 1</Label>
            <Input id="settings-line1" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-line2">Address line 2</Label>
            <Input id="settings-line2" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="settings-town">Town or city</Label>
              <Input id="settings-town" value={address.town} onChange={(e) => setAddress((a) => ({ ...a, town: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-postcode">Postcode</Label>
              <Input id="settings-postcode" value={address.postcode} onChange={(e) => setAddress((a) => ({ ...a, postcode: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-instructions">Delivery instructions</Label>
            <Textarea id="settings-instructions" rows={3} value={address.instructions} onChange={(e) => setAddress((a) => ({ ...a, instructions: e.target.value }))} />
          </div>
          <Button
            onClick={() => {
              updateCustomer(customer.id, {
                address: { ...customer.address, line1: address.line1, line2: address.line2 || null, town: address.town, postcode: address.postcode },
                deliveryNotes: address.instructions,
              });
              toast.success('Delivery address updated');
            }}
          >
            <Save aria-hidden="true" />
            Save address
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-4 text-muted-foreground" aria-hidden="true" />
            Communication preferences
          </CardTitle>
          <CardDescription>Delivery updates are always sent — these control everything else.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { key: 'emailNotifications', label: 'Email notifications', description: 'Delivery reminders and account updates by email' },
              { key: 'smsNotifications', label: 'SMS notifications', description: 'Text updates on the morning of a delivery' },
              { key: 'marketingConsent', label: 'Marketing and offers', description: 'Seasonal offers, referral rewards and product news' },
            ] as const
          ).map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-sm text-muted-foreground">{row.description}</p>
              </div>
              <Switch
                checked={preferences[row.key]}
                onCheckedChange={(checked) => setPreferences((p) => ({ ...p, [row.key]: checked === true }))}
                aria-label={row.label}
              />
            </div>
          ))}
          <Button
            onClick={() => toast.success('Preferences saved')}
          >
            <Save aria-hidden="true" />
            Save preferences
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
            Change password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:max-w-md">
            <div className="space-y-1.5">
              <Label htmlFor="settings-current-password">Current password</Label>
              <Input id="settings-current-password" type="password" value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-new-password">New password</Label>
              <Input id="settings-new-password" type="password" value={password.next} onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-confirm-password">Confirm new password</Label>
              <Input id="settings-confirm-password" type="password" value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} />
            </div>
          </div>
          <Separator className="max-w-md" />
          <Button
            onClick={() => {
              if (!password.current || !password.next || password.next !== password.confirm) {
                toast.error('Check your password fields', 'New password and confirmation must match.');
                return;
              }
              setPassword({ current: '', next: '', confirm: '' });
              toast.success('Password updated', 'Demonstration only — nothing is stored.');
            }}
          >
            Update password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
