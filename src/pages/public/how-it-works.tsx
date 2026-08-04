import { Link } from 'react-router-dom';
import { ArrowRight, BellRing, CalendarCheck, Clipboard, LineChart, Truck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/shared/page-header';
import { Photo, type SceneName } from '@/components/brand/imagery';
import { journeySteps } from '@/data/marketing';
import { seasonSchedule as schedule } from '@/data/plans';

interface StepMeta {
  Icon: React.ComponentType<{ className?: string }>;
  scene: SceneName;
  points: string[];
}

const stepMeta: StepMeta[] = [
  {
    Icon: Clipboard,
    scene: 'logs',
    points: [
      'Three plans, all with eight deliveries',
      'Change plan mid-season without a penalty',
      'Pay annually or spread it over twelve months',
    ],
  },
  {
    Icon: Truck,
    scene: 'delivery',
    points: [
      'UK address with postcode lookup',
      'Access notes: gate codes, side paths, soft tracks',
      'Tell us once — every driver sees it afterwards',
    ],
  },
  {
    Icon: CalendarCheck,
    scene: 'room',
    points: [
      'All eight dates appear the moment you join',
      'Weighted towards the coldest months',
      'Move any of them from the calendar',
    ],
  },
  {
    Icon: BellRing,
    scene: 'fireplace',
    points: [
      'Email when a date is confirmed',
      'Text three days before',
      'Text again on the morning the driver loads',
    ],
  },
  {
    Icon: LineChart,
    scene: 'kiln',
    points: [
      'Every delivery, invoice and moisture reading',
      'Reschedule, pause or add a top-up crate',
      'Share your referral code and track credit',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-border bg-oak-muted/60">
        <div className="container py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary">How it works</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-foreground">
              From signing up to a full log store, in five steps
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              The whole point of the membership is that you make one decision a year. Here is exactly what
              happens either side of it.
            </p>
            <Button asChild variant="accent" size="lg" className="mt-8">
              <Link to="/join">
                Start your membership
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container space-y-16 lg:space-y-24">
          {journeySteps.map((step, index) => {
            const { Icon, scene, points } = stepMeta[index] ?? stepMeta[0]!;
            const reversed = index % 2 === 1;
            return (
              <div
                key={step.number}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={reversed ? 'lg:order-2' : undefined}>
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="tabular font-heading text-5xl font-bold text-border-strong/60">
                      0{step.number}
                    </span>
                  </div>

                  <h2 className="mt-5 text-balance font-heading text-heading font-bold text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-base font-medium text-accent-hover">{step.summary}</p>
                  <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{step.detail}</p>

                  <ul className="mt-6 space-y-2.5">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Photo
                  scene={scene}
                  alt={step.title}
                  ratio="aspect-[5/4]"
                  className={reversed ? 'lg:order-1' : undefined}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="section bg-card">
        <div className="container">
          <SectionHeading
            eyebrow="The membership year"
            title="How the eight deliveries are spread"
            description="Deliveries follow the burning season rather than the calendar year, so the heaviest drops land when you are actually using the stove."
          />

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {schedule.map((entry, index) => (
              <li key={entry.month} className="rounded-xl border border-border bg-background p-6 shadow-subtle">
                <span className="tabular flex size-9 items-center justify-center rounded-lg bg-primary-muted font-heading text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent-hover">
                  {entry.month}
                </p>
                <h3 className="mt-1 font-heading text-base font-semibold text-foreground">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="rounded-2xl border border-border bg-primary px-8 py-12 text-center text-primary-foreground sm:px-12">
            <h2 className="mx-auto max-w-2xl text-balance font-heading text-heading-lg font-bold">
              Everything above takes about three minutes to set up
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              After that, the only thing you do all season is open the door.
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
                <Link to="/plans">Compare the plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
