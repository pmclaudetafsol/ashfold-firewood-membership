import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Gift,
  Info,
  Lock,
  MapPin,
  Package,
  PartyPopper,
  Shield,
  Smartphone,
  Sparkles,
  Tag,
  Truck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress, Separator } from '@/components/ui/misc';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/ui/states';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlanCard } from '@/components/marketing/plan-card';
import { DemoNote } from '@/components/shared/demo';
import { Logo } from '@/components/brand/logo';
import { membershipPlans, getPlan } from '@/data/plans';
import { findPromotion } from '@/data/referrals';
import { customers } from '@/data/customers';
import { createSeasonDeliveries } from '@/data/deliveries';
import { isPostcodeServiceable, exampleServiceablePostcodes } from '@/data/service-areas';
import {
  addressLineSchema,
  emailSchema,
  passwordSchema,
  personNameSchema,
  ukPhoneSchema,
  ukPostcodeSchema,
} from '@/validations/uk';
import { formatDateLong, formatPence, formatPostcode, postcodeOutwardCode } from '@/utils/format';
import { useDemo } from '@/state/demo-store';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Customer, Delivery, PromotionCode, PlanTier } from '@/types';

/* ─────────────────────────────── Wizard shell ─────────────────────────────── */

const STEP_LABELS = ['Membership', 'Account', 'Delivery', 'Offers', 'Payment', 'Confirmation'] as const;

function addOneYear(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y! + 1}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function computeDiscountPence(pricePence: number, promo: PromotionCode | null): number {
  if (!promo) return 0;
  if (promo.type === 'percentage') return Math.round(pricePence * (promo.value / 100));
  return Math.min(promo.value, pricePence);
}

interface AccountDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  marketingConsent: boolean;
}

interface DeliveryDetails {
  line1: string;
  line2: string | null;
  town: string;
  county: string | null;
  postcode: string;
  instructions: string;
  preferredDay: string;
  preferredWindow: string;
  safeLocation: string;
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const { completeRegistration } = useDemo();

  const requestedPlan = searchParams.get('plan') as PlanTier | null;
  const initialPlan: PlanTier =
    requestedPlan && membershipPlans.some((plan) => plan.id === requestedPlan) ? requestedPlan : 'moderate';

  const [step, setStep] = React.useState(1);
  const [planId, setPlanId] = React.useState<PlanTier>(initialPlan);
  const [account, setAccount] = React.useState<AccountDetails | null>(null);
  const [delivery, setDelivery] = React.useState<DeliveryDetails | null>(null);
  const [appliedPromo, setAppliedPromo] = React.useState<PromotionCode | null>(null);
  const [referrer, setReferrer] = React.useState<Customer | null>(null);
  const [result, setResult] = React.useState<{ customer: Customer; deliveries: Delivery[] } | null>(null);

  const plan = getPlan(planId);

  const goTo = (target: number) => {
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmMembership = () => {
    if (!account || !delivery) return;

    const todayIso = new Date().toISOString().slice(0, 10);
    const newId = `cus-${Date.now()}`;
    const reference = `MEM-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const referralCode = `${account.firstName.toUpperCase()}-${account.lastName.charAt(0).toUpperCase()}${String(
      new Date().getFullYear(),
    ).slice(-2)}`;
    const discountPence = computeDiscountPence(plan.annualPricePence, appliedPromo);
    const finalPence = plan.annualPricePence - discountPence;
    const outward = postcodeOutwardCode(delivery.postcode);

    const customer: Customer = {
      id: newId,
      reference,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phone,
      address: {
        line1: delivery.line1,
        line2: delivery.line2,
        town: delivery.town,
        county: delivery.county,
        postcode: formatPostcode(delivery.postcode),
      },
      planId,
      membershipStatus: 'pending',
      joinedOn: todayIso,
      renewsOn: addOneYear(todayIso),
      deliveriesCompleted: 0,
      deliveriesRemaining: 8,
      referralBalancePence: 0,
      referralCode,
      lifetimeValuePence: finalPence,
      deliveryNotes: delivery.instructions || undefined,
      accessNotes: delivery.safeLocation || undefined,
    };

    const deliveries = createSeasonDeliveries({
      customerId: newId,
      customerName: `${account.firstName} ${account.lastName}`,
      area: outward,
      postcode: formatPostcode(delivery.postcode),
      town: delivery.town,
      crates: plan.cratesPerDelivery,
      volumeM3: plan.volumePerDeliveryM3,
      instructions: delivery.instructions || undefined,
      startDate: new Date(),
    });

    completeRegistration(customer, deliveries);
    setResult({ customer, deliveries });
    goTo(6);
  };

  return (
    <section className="bg-oak-muted/30 py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex" aria-label="Home">
            <Logo />
          </Link>

          {step < 6 ? (
            <div className="mt-8">
              {/* Desktop stepper */}
              <ol className="hidden items-center sm:flex">
                {STEP_LABELS.slice(0, 5).map((label, index) => {
                  const number = index + 1;
                  const active = number === step;
                  const done = number < step;
                  return (
                    <li key={label} className="flex flex-1 items-center last:flex-initial">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                            done
                              ? 'border-primary bg-primary text-primary-foreground'
                              : active
                                ? 'border-primary bg-card text-primary'
                                : 'border-border-strong bg-card text-muted-foreground',
                          )}
                        >
                          {done ? <Check className="size-4" aria-hidden="true" /> : number}
                        </span>
                        <span
                          className={cn(
                            'text-xs font-medium',
                            active || done ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {label}
                        </span>
                      </div>
                      {number < 5 ? (
                        <span
                          className={cn('mx-2 h-0.5 flex-1 rounded-full', done ? 'bg-primary' : 'bg-border')}
                          aria-hidden="true"
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              {/* Mobile stepper */}
              <div className="sm:hidden">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    Step {step} of 5: {STEP_LABELS[step - 1]}
                  </span>
                  <span className="text-muted-foreground">{Math.round((step / 5) * 100)}%</span>
                </div>
                <Progress value={(step / 5) * 100} className="mt-2" />
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            {step === 1 ? <StepPlan planId={planId} onSelect={setPlanId} onNext={() => goTo(2)} /> : null}
            {step === 2 ? (
              <StepAccount
                initial={account}
                onBack={() => goTo(1)}
                onNext={(values) => {
                  setAccount(values);
                  goTo(3);
                }}
              />
            ) : null}
            {step === 3 ? (
              <StepDelivery
                initial={delivery}
                onBack={() => goTo(2)}
                onNext={(values) => {
                  setDelivery(values);
                  goTo(4);
                }}
              />
            ) : null}
            {step === 4 ? (
              <StepOffers
                appliedPromo={appliedPromo}
                referrer={referrer}
                onApplyPromo={setAppliedPromo}
                onApplyReferrer={setReferrer}
                onBack={() => goTo(3)}
                onNext={() => goTo(5)}
              />
            ) : null}
            {step === 5 && account && delivery ? (
              <StepPayment
                plan={plan}
                account={account}
                delivery={delivery}
                appliedPromo={appliedPromo}
                referrer={referrer}
                onBack={() => goTo(4)}
                onConfirm={handleConfirmMembership}
              />
            ) : null}
            {step === 6 && result ? <StepConfirmation customer={result.customer} deliveries={result.deliveries} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Step 1 — plan ───────────────────────────── */

function StepPlan({
  planId,
  onSelect,
  onNext,
}: {
  planId: PlanTier;
  onSelect: (id: PlanTier) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Badge variant="primary">Step 1 of 5</Badge>
        <h1 className="mt-4 text-balance font-heading text-heading-lg font-bold text-foreground">
          Choose your membership
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Every plan includes eight scheduled deliveries. You can switch plans at any renewal.
        </p>
      </div>

      <div role="radiogroup" aria-label="Membership plan" className="grid gap-5 lg:grid-cols-3">
        {membershipPlans.map((plan) => {
          const selected = plan.id === planId;
          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(plan.id)}
              className="w-full text-left"
            >
              <PlanCard
                plan={plan}
                variant="compact"
                className={cn(
                  'h-full cursor-pointer',
                  selected && 'ring-2 ring-accent ring-offset-2 ring-offset-oak-muted',
                )}
                action={
                  <div
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md border-2 py-2.5 text-sm font-semibold transition-colors',
                      selected
                        ? 'border-accent bg-accent/10 text-accent-hover'
                        : 'border-border-strong text-muted-foreground',
                    )}
                  >
                    {selected ? (
                      <>
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Selected
                      </>
                    ) : (
                      'Select this plan'
                    )}
                  </div>
                }
              />
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button variant="accent" size="lg" onClick={onNext}>
          Continue
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/* ──────────────────────────── Step 2 — account ─────────────────────────── */

const accountSchema = z
  .object({
    firstName: personNameSchema,
    lastName: personNameSchema,
    email: emailSchema,
    phone: ukPhoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    marketingConsent: z.boolean(),
    termsAccepted: z
      .boolean()
      .refine((value) => value === true, { message: 'You must accept the terms of membership to continue' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AccountFormValues = z.infer<typeof accountSchema>;

function StepAccount({
  initial,
  onBack,
  onNext,
}: {
  initial: AccountDetails | null;
  onBack: () => void;
  onNext: (values: AccountDetails) => void;
}) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: initial?.firstName ?? '',
      lastName: initial?.lastName ?? '',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      password: initial?.password ?? '',
      confirmPassword: initial?.password ?? '',
      marketingConsent: initial?.marketingConsent ?? false,
      termsAccepted: false,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    onNext({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      marketingConsent: values.marketingConsent,
    });
  });

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <Badge variant="primary">Step 2 of 5</Badge>
        <h1 className="mt-4 font-heading text-heading-lg font-bold text-foreground">Create your account</h1>
        <p className="mt-2 text-muted-foreground">This is how we will identify you and your membership.</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>First name</FormLabel>
                  <FormControl>
                    <Input autoComplete="given-name" placeholder="Eleanor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Last name</FormLabel>
                  <FormControl>
                    <Input autoComplete="family-name" placeholder="Whitfield" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email address</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.co.uk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Phone number</FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="tel" placeholder="07700 900418" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="font-normal">
                    Keep me updated with offers, seasonal advice and referral rewards by email
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel required className="font-normal">
                    I accept the terms of membership and privacy notice
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <Button type="submit" variant="accent" size="lg">
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ─────────────────────────── Step 3 — delivery ─────────────────────────── */

/** Plain optional line — kept untransformed so the RHF field stays a string, not string|null. */
const optionalLineSchema = z.string().trim().max(120, 'Keep this under 120 characters').optional().or(z.literal(''));

const deliverySchema = z.object({
  line1: addressLineSchema,
  line2: optionalLineSchema,
  town: addressLineSchema,
  county: optionalLineSchema,
  postcode: ukPostcodeSchema,
  instructions: z.string().max(300, 'Keep this under 300 characters').optional().or(z.literal('')),
  preferredDay: z.string().min(1, 'Choose a preferred day'),
  preferredWindow: z.string().min(1, 'Choose a preferred time window'),
  safeLocation: z.string().max(120, 'Keep this under 120 characters').optional().or(z.literal('')),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

function StepDelivery({
  initial,
  onBack,
  onNext,
}: {
  initial: DeliveryDetails | null;
  onBack: () => void;
  onNext: (values: DeliveryDetails) => void;
}) {
  const [waitingList, setWaitingList] = React.useState(false);
  const [joinedWaitingList, setJoinedWaitingList] = React.useState(false);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      line1: initial?.line1 ?? '',
      line2: initial?.line2 ?? '',
      town: initial?.town ?? '',
      county: initial?.county ?? '',
      postcode: initial?.postcode ?? '',
      instructions: initial?.instructions ?? '',
      preferredDay: initial?.preferredDay ?? '',
      preferredWindow: initial?.preferredWindow ?? '',
      safeLocation: initial?.safeLocation ?? '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!isPostcodeServiceable(values.postcode)) {
      setWaitingList(true);
      setJoinedWaitingList(false);
      return;
    }
    setWaitingList(false);
    onNext({
      line1: values.line1,
      line2: values.line2 ? values.line2 : null,
      town: values.town,
      county: values.county ? values.county : null,
      postcode: values.postcode,
      instructions: values.instructions ?? '',
      preferredDay: values.preferredDay,
      preferredWindow: values.preferredWindow,
      safeLocation: values.safeLocation ?? '',
    });
  });

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <Badge variant="primary">Step 3 of 5</Badge>
        <h1 className="mt-4 font-heading text-heading-lg font-bold text-foreground">Where should we deliver?</h1>
        <p className="mt-2 text-muted-foreground">
          We ask about access once, so every driver for the rest of the year already knows how your property works.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Address line 1</FormLabel>
                <FormControl>
                  <Input autoComplete="address-line1" placeholder="Bramble Cottage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address line 2</FormLabel>
                <FormControl>
                  <Input autoComplete="address-line2" placeholder="14 Mill Lane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="town"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Town or city</FormLabel>
                  <FormControl>
                    <Input autoComplete="address-level2" placeholder="Godalming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input autoComplete="address-level1" placeholder="Surrey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Postcode</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="postal-code"
                    placeholder="GU7 1EX"
                    className="max-w-40 uppercase"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setWaitingList(false);
                    }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Try {exampleServiceablePostcodes.slice(0, 3).join(', ')} to see the full journey.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {waitingList ? (
            <Alert tone="warning" title="This postcode is not in our delivery area yet" live>
              <p>
                We are expanding coverage every season and do not want to promise a date we cannot keep. Join the
                waiting list and we will email you the moment we reach you — or try a postcode in
                {' '}{exampleServiceablePostcodes.join(', ')}{' '}to continue this demonstration.
              </p>
              {!joinedWaitingList ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    setJoinedWaitingList(true);
                    toast.success('Added to the waiting list', 'We will email you as soon as we reach this area.');
                  }}
                >
                  Join the waiting list
                </Button>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 font-medium text-foreground">
                  <CheckCircle2 className="size-4 text-success-text" aria-hidden="true" />
                  You are on the waiting list
                </p>
              )}
            </Alert>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="preferredDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Preferred delivery day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger invalid={!!form.formState.errors.preferredDay}>
                        <SelectValue placeholder="Choose a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'No preference'].map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Preferred time window</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger invalid={!!form.formState.errors.preferredWindow}>
                        <SelectValue placeholder="Choose a window" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['08:00 – 12:00', '12:00 – 16:00', 'No preference'].map((window) => (
                        <SelectItem key={window} value={window}>
                          {window}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="safeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safe delivery location</FormLabel>
                <FormControl>
                  <Input placeholder="Log store to the left of the garage" {...field} />
                </FormControl>
                <p className="text-sm text-muted-foreground">Where we should leave your wood if you are out.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery instructions</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Gate code, parking, access notes for the driver…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <Button type="submit" variant="accent" size="lg">
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ──────────────────────── Step 4 — promo & referral ─────────────────────── */

function StepOffers({
  appliedPromo,
  referrer,
  onApplyPromo,
  onApplyReferrer,
  onBack,
  onNext,
}: {
  appliedPromo: PromotionCode | null;
  referrer: Customer | null;
  onApplyPromo: (promo: PromotionCode | null) => void;
  onApplyReferrer: (customer: Customer | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [promoInput, setPromoInput] = React.useState(appliedPromo?.code ?? '');
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [referralInput, setReferralInput] = React.useState(referrer?.referralCode ?? '');
  const [referralError, setReferralError] = React.useState<string | null>(null);

  const applyPromo = () => {
    const found = findPromotion(promoInput);
    if (!found || !found.active) {
      setPromoError('This code is not valid or has expired.');
      onApplyPromo(null);
      return;
    }
    if (found.appliesTo !== 'all' && !found.appliesTo.includes('moderate') && !found.appliesTo.includes('heavy') && !found.appliesTo.includes('light')) {
      setPromoError('This code does not apply to any plan.');
      onApplyPromo(null);
      return;
    }
    setPromoError(null);
    onApplyPromo(found);
    toast.success('Promotional code applied', found.description);
  };

  const applyReferral = () => {
    const normalised = referralInput.trim().toUpperCase();
    const found = customers.find((customer) => customer.referralCode === normalised);
    if (!found) {
      setReferralError("We couldn't find that referral code.");
      onApplyReferrer(null);
      return;
    }
    setReferralError(null);
    onApplyReferrer(found);
    toast.success('Referral code applied', `You and ${found.firstName} will both receive £15.00 in credit.`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <Badge variant="primary">Step 4 of 5</Badge>
        <h1 className="mt-4 font-heading text-heading-lg font-bold text-foreground">Promotions and referrals</h1>
        <p className="mt-2 text-muted-foreground">Both are optional — you can also add these later from your dashboard.</p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Tag className="size-4" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-semibold text-foreground">Promotional code</h2>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              value={promoInput}
              onChange={(event) => {
                setPromoInput(event.target.value);
                setPromoError(null);
              }}
              placeholder="e.g. FIRSTSEASON"
              className="uppercase"
              invalid={!!promoError}
            />
            <Button type="button" variant="outline" onClick={applyPromo} disabled={!promoInput.trim()}>
              Apply
            </Button>
          </div>
          {promoError ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive-text">
              <XCircle className="size-4" aria-hidden="true" />
              {promoError}
            </p>
          ) : null}
          {appliedPromo ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success-text">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {appliedPromo.code} applied — {appliedPromo.description}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Try FIRSTSEASON or AUTUMN10.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Gift className="size-4" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-semibold text-foreground">Referral code</h2>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              value={referralInput}
              onChange={(event) => {
                setReferralInput(event.target.value);
                setReferralError(null);
              }}
              placeholder="e.g. ELEANOR-W26"
              className="uppercase"
              invalid={!!referralError}
            />
            <Button type="button" variant="outline" onClick={applyReferral} disabled={!referralInput.trim()}>
              Apply
            </Button>
          </div>
          {referralError ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive-text">
              <XCircle className="size-4" aria-hidden="true" />
              {referralError}
            </p>
          ) : null}
          {referrer ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success-text">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Referred by {referrer.firstName} {referrer.lastName}. Credit lands for both of you once your first
              payment clears.
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Try ELEANOR-W26 or DUNCAN-M25.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button type="button" variant="accent" size="lg" onClick={onNext}>
          Continue
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Step 5 — payment ──────────────────────────── */

function StepPayment({
  plan,
  account,
  delivery,
  appliedPromo,
  referrer,
  onBack,
  onConfirm,
}: {
  plan: ReturnType<typeof getPlan>;
  account: AccountDetails;
  delivery: DeliveryDetails;
  appliedPromo: PromotionCode | null;
  referrer: Customer | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [method, setMethod] = React.useState<'card' | 'apple' | 'google'>('card');
  const [card, setCard] = React.useState({ name: '', number: '', expiry: '', cvc: '' });
  const [cardError, setCardError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const discountPence = computeDiscountPence(plan.annualPricePence, appliedPromo);
  const finalPence = plan.annualPricePence - discountPence;

  const handleCardPay = () => {
    if (!card.name.trim() || card.number.replace(/\s/g, '').length < 12 || !card.expiry.trim() || card.cvc.trim().length < 3) {
      setCardError('Enter a demonstration card name, number, expiry and CVC to continue.');
      return;
    }
    setCardError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onConfirm();
    }, 500);
  };

  const handleWalletPay = (label: string) => {
    toast.info(`${label} selected`, 'This is a demonstration — no payment is taken.');
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onConfirm();
    }, 500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <Badge variant="primary">Step 5 of 5</Badge>
        <h1 className="mt-4 font-heading text-heading-lg font-bold text-foreground">Review and pay</h1>
        <p className="mt-2 text-muted-foreground">Check the details below, then confirm your membership.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Order summary */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-base font-semibold text-foreground">Order summary</h2>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.deliveriesPerYear} deliveries · {plan.cratesPerDelivery} crates each</p>
              </div>
              <p className="tabular font-semibold text-foreground">{formatPence(plan.annualPricePence)}</p>
            </div>

            {appliedPromo ? (
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-success-text">
                  <Tag className="size-3.5" aria-hidden="true" />
                  {appliedPromo.code}
                </span>
                <span className="tabular font-medium text-success-text">−{formatPence(discountPence)}</span>
              </div>
            ) : null}

            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <p className="font-heading text-base font-semibold text-foreground">Total due today</p>
              <p className="tabular font-heading text-2xl font-bold text-primary">{formatPence(finalPence)}</p>
            </div>

            {referrer ? (
              <p className="mt-3 flex items-start gap-2 rounded-md bg-oak-muted px-3 py-2 text-xs text-foreground/80">
                <Gift className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                Referred by {referrer.firstName} {referrer.lastName} — £15.00 credit for both of you once your
                first payment clears.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-sm">
            <h2 className="font-heading text-base font-semibold text-foreground">Delivering to</h2>
            <address className="mt-2 not-italic leading-relaxed text-muted-foreground">
              {account.firstName} {account.lastName}
              <br />
              {delivery.line1}
              {delivery.line2 ? <>, {delivery.line2}</> : null}
              <br />
              {delivery.town}
              {delivery.county ? <>, {delivery.county}</> : null}
              <br />
              {formatPostcode(delivery.postcode)}
            </address>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              {delivery.preferredDay} · {delivery.preferredWindow}
            </p>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
          <Alert tone="information" icon={Info} title="This is a demonstration payment">
            No card details are stored and no payment is taken. This screen exists to show the intended checkout
            experience.
          </Alert>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {(
              [
                { id: 'card', label: 'Card', Icon: CreditCard },
                { id: 'apple', label: 'Apple Pay', Icon: Smartphone },
                { id: 'google', label: 'Google Pay', Icon: Smartphone },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-3 text-xs font-medium transition-colors',
                  method === id ? 'border-primary bg-primary-muted text-primary' : 'border-border text-muted-foreground hover:border-border-strong',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {method === 'card' ? (
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  placeholder="E Whitfield"
                  value={card.name}
                  onChange={(event) => setCard((c) => ({ ...c, name: event.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(event) => setCard((c) => ({ ...c, number: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(event) => setCard((c) => ({ ...c, expiry: event.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    inputMode="numeric"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(event) => setCard((c) => ({ ...c, cvc: event.target.value }))}
                  />
                </div>
              </div>
              {cardError ? (
                <p className="text-sm text-destructive-text" role="alert">
                  {cardError}
                </p>
              ) : null}
              <Button
                type="button"
                variant="accent"
                size="lg"
                className="w-full"
                loading={submitting}
                loadingText="Confirming"
                onClick={handleCardPay}
              >
                <Lock aria-hidden="true" />
                Confirm membership — {formatPence(finalPence)}
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-dashed border-border bg-muted/60 p-5 text-center text-sm text-muted-foreground">
                {method === 'apple' ? 'Apple Pay' : 'Google Pay'} checkout would appear here on a real device.
              </div>
              <Button
                type="button"
                variant="accent"
                size="lg"
                className="w-full"
                loading={submitting}
                loadingText="Confirming"
                onClick={() => handleWalletPay(method === 'apple' ? 'Apple Pay' : 'Google Pay')}
              >
                {method === 'apple' ? <BadgeCheck aria-hidden="true" /> : <CircleDollarSign aria-hidden="true" />}
                Pay with {method === 'apple' ? 'Apple Pay' : 'Google Pay'}
              </Button>
            </div>
          )}

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="size-3.5" aria-hidden="true" />
            Demonstration only — no real transaction occurs
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
      </div>
    </div>
  );
}

/* ────────────────────────── Step 6 — confirmation ──────────────────────── */

function StepConfirmation({ customer, deliveries }: { customer: Customer; deliveries: Delivery[] }) {
  const navigate = useNavigate();
  const plan = getPlan(customer.planId);
  const firstDelivery = deliveries[0];

  return (
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-muted text-success-text">
        <PartyPopper className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-balance font-heading text-heading-lg font-bold text-foreground">
        Welcome to {plan.name}, {customer.firstName}
      </h1>
      <p className="mt-2 text-pretty text-muted-foreground">
        Membership reference <span className="font-semibold text-foreground">{customer.reference}</span>. A
        confirmation email would be sent to {customer.email} in a live system.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 text-left shadow-card sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Membership</p>
              <p className="font-medium text-foreground">{plan.name}</p>
              <p className="tabular text-sm text-muted-foreground">{formatPence(customer.lifetimeValuePence)} paid today</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Renews on</p>
              <p className="font-medium text-foreground">{formatDateLong(customer.renewsOn)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Package className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deliveries planned</p>
              <p className="font-medium text-foreground">8 of 8, across your season</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Truck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">First delivery</p>
              <p className="font-medium text-foreground">
                {firstDelivery ? formatDateLong(firstDelivery.scheduledDate) : '—'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <address className="not-italic leading-relaxed text-muted-foreground">
            {customer.address.line1}
            {customer.address.line2 ? <>, {customer.address.line2}</> : null}, {customer.address.town},{' '}
            {customer.address.postcode}
          </address>
        </div>
      </div>

      <DemoNote className="mt-6 text-left">
        This is a demonstration build. No account was created, no email was sent and no payment was taken — your
        membership exists only in this browser session.
      </DemoNote>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="accent" size="lg" onClick={() => navigate('/dashboard')}>
          Open your dashboard
          <ArrowRight aria-hidden="true" />
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/">Return to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
