import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  Clipboard,
  Droplets,
  Flame,
  Gift,
  Leaf,
  LineChart,
  Lock,
  Quote,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/misc';
import { SectionHeading } from '@/components/shared/page-header';
import { PlanCard } from '@/components/marketing/plan-card';
import { Photo } from '@/components/brand/imagery';
import { membershipPlans, seasonSchedule } from '@/data/plans';
import { faqs, journeySteps, kilnBenefits, testimonials, companyStats } from '@/data/marketing';
import { REFERRAL_REWARD_PENCE } from '@/data/referrals';
import { formatPence } from '@/utils/format';

const membershipBenefits = [
  {
    Icon: CalendarCheck,
    title: 'Eight deliveries, planned in advance',
    detail:
      'Your whole season is scheduled the day you join, weighted towards the coldest months. Nothing to reorder.',
  },
  {
    Icon: Lock,
    title: 'One price, fixed for the year',
    detail:
      'What you pay on the day you join is what you pay all season, whatever happens to timber prices or the weather.',
  },
  {
    Icon: Droplets,
    title: 'Moisture tested, every crate',
    detail:
      'Under 20% at the core, probe-tested before crating, and the reading recorded against your delivery.',
  },
  {
    Icon: BellRing,
    title: 'Told before you need to ask',
    detail:
      'An email when a date is set, a text three days out, and another the morning the driver loads.',
  },
  {
    Icon: LineChart,
    title: 'Everything in one dashboard',
    detail:
      'Move a date, add a top-up, download an invoice or check a moisture reading — all from the same screen.',
  },
  {
    Icon: ShieldCheck,
    title: 'Change your mind at any point',
    detail:
      'Move deliveries up to 48 hours ahead, pause for up to three months, or change plan mid-season.',
  },
];

const journeyIcons: Array<React.ComponentType<{ className?: string }>> = [
  Clipboard,
  Truck,
  CalendarCheck,
  BellRing,
  LineChart,
];

export default function HomePage() {
  const homepageFaqs = faqs.filter((faq) =>
    ['faq-001', 'faq-006', 'faq-010', 'faq-013', 'faq-015', 'faq-018'].includes(faq.id),
  );

  return (
    <>
      {/* ─────────────────────────────── Hero ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Editorial imagery sits behind a forest scrim so the headline keeps
            its contrast whatever the artwork underneath is doing. */}
        <div className="absolute inset-0" aria-hidden="true">
          <Photo scene="fireplace" alt="" ratio="" rounded={false} className="size-full shadow-none" />
          <div className="absolute inset-0 bg-primary/[0.86]" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
        </div>

        <div className="container relative py-16 sm:py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl">
              <Badge
                variant="neutral"
                className="border-white/20 bg-white/10 text-primary-foreground backdrop-blur-sm"
              >
                <Flame className="size-3.5" aria-hidden="true" />
                Membership now open for the 2026/27 season
              </Badge>

              <h1 className="mt-5 text-balance font-heading text-display-lg font-bold text-primary-foreground">
                Kiln-dried firewood, delivered eight times a season.
              </h1>

              <p className="mt-5 text-pretty text-lg leading-relaxed text-primary-foreground/85 sm:text-xl">
                One annual membership. Eight scheduled deliveries of properly dried British hardwood, timed to
                the cold and planned before the season starts. No reordering, no guesswork, no wet logs.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg">
                  <Link to="/join">
                    Join membership
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-primary-foreground hover:bg-white hover:text-primary"
                >
                  <Link to="/how-it-works">See how it works</Link>
                </Button>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/80">
                {['Under 20% moisture, guaranteed', 'Free reschedules', 'Cancel within 14 days'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-oak" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Season-at-a-glance card — shows the product idea in one look. */}
            <div className="relative">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-elevated backdrop-blur-md sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-heading text-base font-semibold text-primary-foreground">
                    Your season at a glance
                  </p>
                  <Badge className="border-white/25 bg-white/10 text-primary-foreground">2026/27</Badge>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2.5">
                  {Array.from({ length: 8 }).map((_, index) => {
                    const delivered = index < 3;
                    const next = index === 3;
                    return (
                      <div
                        key={index}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 ${
                          delivered
                            ? 'border-oak/40 bg-oak/20'
                            : next
                              ? 'border-accent bg-accent/25'
                              : 'border-white/15 bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-primary-foreground/60">
                          {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                        </span>
                        <span
                          className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                            delivered
                              ? 'bg-oak text-oak-foreground'
                              : next
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-white/10 text-primary-foreground/70'
                          }`}
                        >
                          {delivered ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-center">
                  <div>
                    <dt className="text-xs text-primary-foreground/60">Delivered</dt>
                    <dd className="tabular font-heading text-2xl font-bold text-primary-foreground">3</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-primary-foreground/60">Remaining</dt>
                    <dd className="tabular font-heading text-2xl font-bold text-primary-foreground">5</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-primary-foreground/60">Next</dt>
                    <dd className="tabular font-heading text-2xl font-bold text-oak">11 Aug</dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs text-primary-foreground/55">
                  Illustration of the member dashboard. Demonstration data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── Trust strip ────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="container py-8">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="tabular block font-heading text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Five steps, then you can forget about firewood"
            description="Set it up once in about three minutes. The rest of the season looks after itself."
          />

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journeySteps.map((step, index) => {
              const Icon = journeyIcons[index] ?? Clipboard;
              return (
                <li
                  key={step.number}
                  className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-subtle transition-shadow hover:shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="tabular font-heading text-3xl font-bold text-border-strong/70">
                      0{step.number}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </li>
              );
            })}

            <li className="flex flex-col justify-center gap-4 rounded-xl border border-dashed border-primary/30 bg-primary-muted/50 p-6 text-center">
              <p className="font-heading text-lg font-semibold text-primary">Ready in about three minutes</p>
              <p className="text-sm text-muted-foreground">
                Choose a plan, add your address, and your eight dates appear straight away.
              </p>
              <Button asChild variant="primary">
                <Link to="/join">
                  Start now
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </li>
          </ol>
        </div>
      </section>

      {/* ─────────────────────── Membership plans ─────────────────────── */}
      <section id="plans" className="section bg-oak-muted/50">
        <div className="container">
          <SectionHeading
            eyebrow="Membership plans"
            title="Three plans, eight deliveries, one annual price"
            description="Every plan includes the same eight deliveries and the same kiln-dried hardwood. They differ only in how much arrives each time."
          />

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Not sure which fits?{' '}
            <Link to="/plans" className="font-medium text-primary underline underline-offset-4">
              Compare the plans in detail
            </Link>{' '}
            or change plan at any point in the season.
          </p>
        </div>
      </section>

      {/* ────────────────────── Membership benefits ────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Why a membership"
                align="left"
                title="The firewood problem, solved once a year"
                description="Buying wood is the household purchase most likely to go wrong: the wrong moisture, the wrong week, the wrong price. A membership removes every one of those decisions."
              />
              <Photo
                scene="room"
                alt="A warm British living room with a stove and a full log basket"
                ratio="aspect-[4/3]"
                className="mt-8"
              />
            </div>

            <ul className="grid gap-5 sm:grid-cols-2">
              {membershipBenefits.map(({ Icon, title, detail }) => (
                <li key={title} className="rounded-xl border border-border bg-card p-5 shadow-subtle">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent/12 text-accent-hover">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──────────────────── Kiln-dried firewood ──────────────────── */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-oak">The wood itself</p>
              <h2 className="mt-3 text-balance font-heading text-heading-lg font-bold text-primary-foreground">
                Why kiln-dried changes everything
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
                Wet wood is the reason most fires disappoint. Water in the timber has to be boiled off before
                anything burns properly, and that energy comes out of your room rather than going into it.
                Everything we deliver leaves the kiln under 20% moisture at the core.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="tabular inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm">
                  <Droplets className="size-4 text-oak" aria-hidden="true" />
                  <span className="font-semibold">&lt;20%</span> core moisture
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm">
                  <Leaf className="size-4 text-oak" aria-hidden="true" />
                  British managed woodland
                </span>
              </div>

              <Photo
                scene="kiln"
                alt="Crated hardwood inside a low-temperature drying kiln"
                ratio="aspect-[16/10]"
                className="mt-9"
                caption="Crates are probe-tested at the core before they leave the yard."
              />
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {kilnBenefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="rounded-xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-sm"
                >
                  <h3 className="font-heading text-base font-semibold text-primary-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">{benefit.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────────────── Seasonal deliveries ────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="The delivery season"
            title="Eight deliveries, weighted towards the cold"
            description="Deliveries are not spread evenly. They follow how a British household actually burns wood — light through the summer, heavy from the first frost."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Photo
              scene="delivery"
              alt="A flatbed lorry delivering crated firewood to a British home"
              ratio="aspect-[4/3]"
            />

            <ol className="relative space-y-6 border-l-2 border-border pl-7">
              {seasonSchedule.map((entry, index) => (
                <li key={entry.month} className="relative">
                  <span
                    className="absolute -left-[2.3125rem] flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[0.625rem] font-bold text-primary-foreground"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-hover">
                    {entry.month}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{entry.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Testimonials ─────────────────────────── */}
      <section className="section bg-card">
        <div className="container">
          <SectionHeading
            eyebrow="Members"
            title="What members say"
            description="Demonstration testimonials, written to reflect the kind of feedback the service is designed to earn."
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.id}
                className="flex flex-col rounded-xl border border-border bg-background p-6 shadow-subtle"
              >
                <Quote className="size-7 text-oak" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <div className="mt-5 flex items-center gap-1" aria-label={`Rated ${testimonial.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`size-4 ${
                        index < testimonial.rating ? 'fill-oak text-oak' : 'text-border-strong'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <footer className="mt-3 border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location} · {testimonial.plan} · {testimonial.memberSince}
                  </p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────── Referrals ─────────────────────────── */}
      <section id="referrals" className="section">
        <div className="container">
          <div className="overflow-hidden rounded-2xl border border-oak/40 bg-oak-muted">
            <div className="grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-hover">
                  <Gift className="size-3.5" aria-hidden="true" />
                  Referral programme
                </span>
                <h2 className="mt-4 text-balance font-heading text-heading-lg font-bold text-foreground">
                  Give {formatPence(REFERRAL_REWARD_PENCE, { trimWholePounds: true })}, get{' '}
                  {formatPence(REFERRAL_REWARD_PENCE, { trimWholePounds: true })}
                </h2>
                <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                  Share your personal code with a neighbour, a friend, anyone with a stove. When they join, you
                  both get £15 in credit against your next renewal. There is no cap — several members cover an
                  entire delivery this way each season.
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { Icon: Clipboard, text: 'Copy your code from the dashboard' },
                    { Icon: Users, text: 'They join and pay their first membership' },
                    { Icon: Gift, text: 'Credit lands automatically for both of you' },
                  ].map(({ Icon, text }, index) => (
                    <li key={text} className="flex gap-3 rounded-lg border border-oak/30 bg-card/70 p-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm text-muted-foreground">
                        <span className="mb-0.5 block text-xs font-semibold text-foreground">
                          Step {index + 1}
                        </span>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="primary" className="mt-7">
                  <Link to="/dashboard/referrals">
                    See the referral centre
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your referral code
                </p>
                <p className="tabular mt-2 rounded-lg border border-dashed border-border-strong bg-muted px-4 py-3 text-center font-heading text-xl font-bold tracking-wider text-primary">
                  ELEANOR-W26
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Friends joined</dt>
                    <dd className="tabular font-semibold text-foreground">3</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Invitations open</dt>
                    <dd className="tabular font-semibold text-foreground">1</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <dt className="font-medium text-foreground">Credit earned</dt>
                    <dd className="tabular font-heading text-lg font-bold text-primary">£45.00</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">Demonstration data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FAQ ─────────────────────────────── */}
      <section className="section bg-card">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                align="left"
                eyebrow="Questions"
                title="The things members ask first"
                description="Everything else is answered in full on the FAQ page."
              />
              <Button asChild variant="outline" className="mt-6">
                <Link to="/faq">
                  Read all questions
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {homepageFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Final call to action ───────────────────────── */}
      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="absolute inset-0" aria-hidden="true">
          <Photo scene="forestry" alt="" ratio="" rounded={false} className="size-full shadow-none" />
          <div className="absolute inset-0 bg-primary/[0.88]" />
        </div>

        <div className="container relative text-center">
          <h2 className="mx-auto max-w-2xl text-balance font-heading text-heading-lg font-bold text-primary-foreground">
            Sort your firewood for the whole season, today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            Choose a plan, add your address, and your eight delivery dates are booked before you close the tab.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link to="/join">
                Join membership
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/5 text-primary-foreground hover:bg-white hover:text-primary"
            >
              <Link to="/contact">Talk to us first</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Demonstration build — no payment is taken and no account is created.
          </p>
        </div>
      </section>
    </>
  );
}
