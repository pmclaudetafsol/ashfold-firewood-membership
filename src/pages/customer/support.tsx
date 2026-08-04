import * as React from 'react';
import { CheckCircle2, Clock, Mail, Phone, Send } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DemoNote } from '@/components/shared/demo';
import { useCurrentCustomer } from '@/state/demo-store';
import { brand } from '@/config/brand';

const categories = [
  'A specific delivery',
  'Membership or billing',
  'Change my address',
  'Referral rewards',
  'Something else',
];

export default function CustomerSupportPage() {
  const customer = useCurrentCustomer();
  const [category, setCategory] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'sent'>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category || message.trim().length < 10) return;
    setStatus('submitting');
    window.setTimeout(() => setStatus('sent'), 700);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Contact support" description="We can see your membership and schedule while we help." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Call us</p>
                  <a href={brand.contact.phoneHref} className="tabular text-sm text-primary underline-offset-4 hover:underline">
                    {brand.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email us</p>
                  <a href={`mailto:${brand.contact.supportEmail}`} className="break-all text-sm text-primary underline-offset-4 hover:underline">
                    {brand.contact.supportEmail}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Business hours</p>
                  <p className="text-sm text-muted-foreground">{brand.contact.businessHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Raise a request</CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'sent' ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-success-muted text-success-text">
                  <CheckCircle2 className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-lg font-semibold text-foreground">Message sent</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    We usually reply within one working day, referencing membership {customer.reference}.
                  </p>
                </div>
                <Button variant="outline" onClick={() => { setStatus('idle'); setCategory(''); setMessage(''); }}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={`${customer.firstName} ${customer.lastName}`} disabled />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Membership reference</Label>
                    <Input value={customer.reference} disabled />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="support-category" required>
                    What is this about?
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="support-category">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="support-message" required>
                    Message
                  </Label>
                  <Textarea
                    id="support-message"
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what's happening…"
                  />
                </div>
                <DemoNote>Demonstration form — nothing is sent and no ticket is created.</DemoNote>
                <Button type="submit" variant="accent" loading={status === 'submitting'} disabled={!category || message.trim().length < 10}>
                  <Send aria-hidden="true" />
                  Send message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
