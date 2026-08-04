import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/states';
import { DemoNote } from '@/components/shared/demo';
import { Photo } from '@/components/brand/imagery';
import { isValidUkPostcode } from '@/validations/uk';
import { brand } from '@/config/brand';
import { toast } from '@/hooks/use-toast';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  subject: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const subjects = [
  'Joining a membership',
  'An existing delivery',
  'Delivery areas and coverage',
  'Billing or invoices',
  'Referral rewards',
  'Something else',
];

const emptyForm: FormValues = {
  name: '',
  email: '',
  phone: '',
  postcode: '',
  subject: '',
  message: '',
  consent: false,
};

/** Client-side validation only — there is no endpoint behind this form. */
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'That does not look like a valid email address.';
  if (values.phone.trim() && !/^(\+44|0)[\d\s]{9,13}$/.test(values.phone.trim()))
    errors.phone = 'Enter a UK phone number, for example 07700 900123.';
  if (values.postcode.trim() && !isValidUkPostcode(values.postcode))
    errors.postcode = 'Enter a valid UK postcode, for example GU7 1EX.';
  if (!values.subject) errors.subject = 'Please choose what your message is about.';
  if (!values.message.trim()) errors.message = 'Please tell us how we can help.';
  else if (values.message.trim().length < 15) errors.message = 'Please give us a little more detail.';
  if (!values.consent) errors.consent = 'Please confirm we can reply to you.';
  return errors;
}

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear the message as soon as the person starts correcting the field.
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    setStatus('submitting');
    // Simulated latency so the loading state is visible in the presentation.
    window.setTimeout(() => {
      setStatus('sent');
      toast({
        title: 'Message received (demonstration)',
        description: 'Nothing was actually sent — this is a frontend demo.',
        variant: 'success',
      });
    }, 900);
  };

  const reset = () => {
    setValues(emptyForm);
    setErrors({});
    setStatus('idle');
  };

  const describedBy = (field: keyof FormValues) => (errors[field] ? `contact-${field}-error` : undefined);

  return (
    <>
      <section className="border-b border-border bg-oak-muted/60">
        <div className="container py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary">Contact</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-foreground">
              Talk to a person who can actually help
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              Our team can change a delivery date, explain an invoice or check whether we reach your postcode —
              on the first call, without a script.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
                <h2 className="font-heading text-xl font-bold text-foreground">Get in touch</h2>
                <ul className="mt-6 space-y-5">
                  <li className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <Phone className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Call us</p>
                      <a
                        href={brand.contact.phoneHref}
                        className="tabular text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {brand.contact.phone}
                      </a>
                      <p className="mt-0.5 text-xs text-muted-foreground">{brand.contact.businessHours}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <Mail className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email us</p>
                      <a
                        href={`mailto:${brand.contact.email}`}
                        className="break-all text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {brand.contact.email}
                      </a>
                      <p className="mt-0.5 text-xs text-muted-foreground">Replies within one working day</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <MessageSquare className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Existing members</p>
                      <Link
                        to="/dashboard/support"
                        className="text-sm text-primary underline-offset-4 hover:underline"
                      >
                        Raise a request from your dashboard
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Faster — we can see your schedule while we talk
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Coverage</p>
                      <p className="text-sm text-muted-foreground">
                        England, Wales and southern Scotland, from three regional yards
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                      <Clock className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Peak season hours</p>
                      <p className="text-sm text-muted-foreground">
                        Extended to 7:00pm through December and January
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Photo
                scene="delivery"
                alt="A delivery arriving at a British home"
                ratio="aspect-[16/10]"
              />
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              {status === 'sent' ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center gap-5 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-success-muted text-success-text">
                    <CheckCircle2 className="size-8" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <h2 className="font-heading text-xl font-bold text-foreground">Thank you — message sent</h2>
                    <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                      We usually reply within one working day. If it is urgent, calling {brand.contact.phone} is
                      quicker.
                    </p>
                  </div>
                  <DemoNote className="max-w-sm text-left">
                    This is a demonstration. No email was sent and nothing was stored. In production this form
                    would post to a support inbox and create a ticket.
                  </DemoNote>
                  <Button variant="outline" onClick={reset}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">Send us a message</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Fields marked with an asterisk are required.
                    </p>
                  </div>

                  {Object.keys(errors).length > 0 ? (
                    <Alert tone="destructive" title="Please check the form">
                      There {Object.keys(errors).length === 1 ? 'is 1 field' : `are ${Object.keys(errors).length} fields`}{' '}
                      that need your attention below.
                    </Alert>
                  ) : null}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name" required>
                        Full name
                      </Label>
                      <Input
                        id="contact-name"
                        autoComplete="name"
                        value={values.name}
                        invalid={Boolean(errors.name)}
                        aria-describedby={describedBy('name')}
                        onChange={(event) => setField('name', event.target.value)}
                      />
                      {errors.name ? (
                        <p id="contact-name-error" className="text-sm text-destructive-text">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email" required>
                        Email address
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        invalid={Boolean(errors.email)}
                        aria-describedby={describedBy('email')}
                        onChange={(event) => setField('email', event.target.value)}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" className="text-sm text-destructive-text">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-phone">Phone number</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="07700 900123"
                        value={values.phone}
                        invalid={Boolean(errors.phone)}
                        aria-describedby={describedBy('phone')}
                        onChange={(event) => setField('phone', event.target.value)}
                      />
                      {errors.phone ? (
                        <p id="contact-phone-error" className="text-sm text-destructive-text">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-postcode">Postcode</Label>
                      <Input
                        id="contact-postcode"
                        autoComplete="postal-code"
                        placeholder="GU7 1EX"
                        value={values.postcode}
                        invalid={Boolean(errors.postcode)}
                        aria-describedby={describedBy('postcode')}
                        onChange={(event) => setField('postcode', event.target.value.toUpperCase())}
                      />
                      {errors.postcode ? (
                        <p id="contact-postcode-error" className="text-sm text-destructive-text">
                          {errors.postcode}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject" required>
                      What is your message about?
                    </Label>
                    <Select value={values.subject} onValueChange={(value) => setField('subject', value)}>
                      <SelectTrigger id="contact-subject" aria-describedby={describedBy('subject')}>
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject ? (
                      <p id="contact-subject-error" className="text-sm text-destructive-text">
                        {errors.subject}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message" required>
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      rows={6}
                      value={values.message}
                      invalid={Boolean(errors.message)}
                      aria-describedby={describedBy('message') ?? 'contact-message-hint'}
                      onChange={(event) => setField('message', event.target.value)}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" className="text-sm text-destructive-text">
                        {errors.message}
                      </p>
                    ) : (
                      <p id="contact-message-hint" className="text-xs text-muted-foreground">
                        If it is about an existing delivery, your membership reference helps us find it faster.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="contact-consent"
                        checked={values.consent}
                        aria-describedby={describedBy('consent')}
                        onCheckedChange={(checked) => setField('consent', checked === true)}
                      />
                      <Label htmlFor="contact-consent" className="text-sm font-normal leading-relaxed">
                        I am happy for you to use these details to reply to my enquiry.{' '}
                        <span className="text-destructive-text" aria-hidden="true">
                          *
                        </span>
                      </Label>
                    </div>
                    {errors.consent ? (
                      <p id="contact-consent-error" className="text-sm text-destructive-text">
                        {errors.consent}
                      </p>
                    ) : null}
                  </div>

                  <DemoNote>
                    Demonstration form. Submitting shows the success state without sending anything or storing
                    your details.
                  </DemoNote>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    loading={status === 'submitting'}
                    loadingText="Sending your message"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send message'}
                    {status === 'idle' ? <Send aria-hidden="true" /> : null}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
