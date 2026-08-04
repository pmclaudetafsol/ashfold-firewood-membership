import { Link } from 'react-router-dom';
import { ArrowRight, Check, Gift, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/misc';
import { SectionHeading } from '@/components/shared/page-header';
import { PlanCard } from '@/components/marketing/plan-card';
import { membershipPlans } from '@/data/plans';
import { faqs } from '@/data/marketing';
import { REFERRAL_REWARD_PENCE } from '@/data/referrals';
import { formatPence, formatVolume } from '@/utils/format';

/** Feature rows for the desktop comparison table. */
const comparisonRows: Array<{
  label: string;
  values: (plan: (typeof membershipPlans)[number]) => React.ReactNode;
}> = [
  {
    label: 'Annual membership',
    values: (plan) => (
      <span className="tabular font-heading text-lg font-bold text-foreground">
        {formatPence(plan.annualPricePence, { trimWholePounds: true })}
      </span>
    ),
  },
  { label: 'Deliveries included', values: (plan) => plan.deliveriesPerYear },
  {
    label: 'Crates per delivery',
    values: (plan) => `${plan.cratesPerDelivery} ${plan.cratesPerDelivery === 1 ? 'crate' : 'crates'}`,
  },
  { label: 'Volume per delivery', values: (plan) => formatVolume(plan.volumePerDeliveryM3) },
  { label: 'Approximate weight', values: (plan) => `${plan.weightPerDeliveryKg}kg` },
  {
    label: 'Total wood per season',
    values: (plan) => formatVolume(plan.volumePerDeliveryM3 * plan.deliveriesPerYear),
  },
  { label: 'Kiln-dried under 20% moisture', values: () => true },
  { label: 'Free kindling', values: () => true },
  { label: 'Free rescheduling (48 hours)', values: () => true },
  { label: 'Priority member support', values: () => true },
  { label: 'Stacking service', values: (plan) => (plan.id === 'heavy' ? 'Included' : plan.id === 'moderate' ? 'On request' : 'Paid add-on') },
  { label: 'Named account manager', values: (plan) => plan.id === 'heavy' },
  { label: 'Emergency top-up deliveries', values: (plan) => (plan.id === 'heavy' ? '2 per year' : false) },
  { label: 'Discount on extra orders', values: (plan) => (plan.id === 'heavy' ? '10%' : false) },
];

function ComparisonValue({ value }: { value: React.ReactNode }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto size-5 text-primary" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="mx-auto size-5 text-border-strong" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="tabular">{value}</span>;
}

export default function PlansPage() {
  const planFaqs = faqs.filter((faq) =>
    ['faq-013', 'faq-012', 'faq-003', 'faq-014', 'faq-016', 'faq-017'].includes(faq.id),
  );

  return (
    <>
      <section className="border-b border-border bg-oak-muted/60">
        <div className="container py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary">Membership plans</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-foreground">
              Pick the plan that matches how much you burn
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              Every plan includes eight scheduled deliveries of the same kiln-dried British hardwood. The only
              difference is how much arrives each time.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {membershipPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {plan.name} — is this you?
                </h3>
                <ul className="mt-3 space-y-2">
                  {plan.householdProfile.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-oak" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── Comparison table ───────────────────── */}
      <section className="section bg-card">
        <div className="container">
          <SectionHeading
            eyebrow="Side by side"
            title="Compare every plan"
            description="The full detail, in one table."
          />

          <div className="mt-10">
            <Table caption="Membership plan comparison">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="min-w-48">
                    Feature
                  </TableHead>
                  {membershipPlans.map((plan) => (
                    <TableHead key={plan.id} scope="col" className="min-w-36 text-center">
                      <span className="flex flex-col items-center gap-1">
                        {plan.name}
                        {plan.recommended ? (
                          <Badge variant="solidPrimary" size="sm">
                            Recommended
                          </Badge>
                        ) : null}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                    {membershipPlans.map((plan) => (
                      <TableCell key={plan.id} className="text-center text-muted-foreground">
                        <ComparisonValue value={row.values(plan)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell />
                  {membershipPlans.map((plan) => (
                    <TableCell key={plan.id} className="text-center">
                      <Button asChild size="sm" variant={plan.recommended ? 'accent' : 'outline'}>
                        <Link to={`/join?plan=${plan.id}`}>Join</Link>
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Referrals ───────────────────────── */}
      <section id="referrals" className="section">
        <div className="container">
          <div className="flex flex-col items-center gap-8 rounded-2xl border border-oak/40 bg-oak-muted px-8 py-12 text-center sm:px-12">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Gift className="size-7" aria-hidden="true" />
            </span>
            <div className="max-w-2xl space-y-3">
              <h2 className="text-balance font-heading text-heading-lg font-bold text-foreground">
                Every membership comes with a referral code
              </h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Share it and you both receive{' '}
                {formatPence(REFERRAL_REWARD_PENCE, { trimWholePounds: true })} in credit when they join. There
                is no cap on how many friends you can refer or how much credit you can build up against your
                renewal.
              </p>
            </div>
            <Button asChild variant="primary">
              <Link to="/dashboard/referrals">
                See the referral centre
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section bg-card">
        <div className="container max-w-3xl">
          <SectionHeading eyebrow="Questions" title="About the plans" />
          <Accordion type="single" collapsible className="mt-10 w-full">
            {planFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <Button asChild variant="accent" size="lg">
              <Link to="/join">
                Join membership
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
