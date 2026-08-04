import { Link } from 'react-router-dom';
import { ArrowRight, Award, Handshake, Leaf, Sparkles, Target, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/shared/page-header';
import { Photo, type SceneName } from '@/components/brand/imagery';
import { aboutSections, companyStats } from '@/data/marketing';

const sectionOrder: Array<{
  id: string;
  key: keyof typeof aboutSections;
  Icon: React.ComponentType<{ className?: string }>;
  scene: SceneName;
}> = [
  { id: 'mission', key: 'mission', Icon: Target, scene: 'room' },
  { id: 'kiln-drying', key: 'kilnDrying', Icon: Thermometer, scene: 'kiln' },
  { id: 'quality', key: 'quality', Icon: Award, scene: 'logs' },
  { id: 'sustainability', key: 'sustainability', Icon: Leaf, scene: 'forestry' },
  { id: 'suppliers', key: 'suppliers', Icon: Handshake, scene: 'delivery' },
  { id: 'service', key: 'service', Icon: Sparkles, scene: 'fireplace' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0" aria-hidden="true">
          <Photo scene="forestry" alt="" ratio="" rounded={false} className="size-full shadow-none" />
          <div className="absolute inset-0 bg-primary/[0.87]" />
        </div>
        <div className="container relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="border-white/20 bg-white/10 text-primary-foreground">About us</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-primary-foreground">
              We took the worst purchase of the year and made it one decision
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-primary-foreground/80">
              A membership for British households who heat with wood and would rather not think about it eight
              times a winter.
            </p>
          </div>

          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="tabular block font-heading text-2xl font-bold text-oak sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-primary-foreground/70">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Section index — a client demo benefits from obvious navigation. */}
      <section className="border-b border-border bg-card">
        <div className="container py-5">
          <nav aria-label="On this page">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {sectionOrder.map(({ id, key }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="rounded-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
                  >
                    {aboutSections[key].title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container space-y-16 lg:space-y-24">
          {sectionOrder.map(({ id, key, Icon, scene }, index) => {
            const section = aboutSections[key];
            const reversed = index % 2 === 1;
            return (
              <article key={id} id={id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={reversed ? 'lg:order-2' : undefined}>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary-muted text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-balance font-heading text-heading font-bold text-foreground">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-pretty leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <Photo
                  scene={scene}
                  alt={section.title}
                  ratio="aspect-[5/4]"
                  className={reversed ? 'lg:order-1' : undefined}
                />
              </article>
            );
          })}
        </div>
      </section>

      <section className="section bg-card">
        <div className="container">
          <SectionHeading
            eyebrow="Demonstration notice"
            title="About this build"
            description="This is a frontend demonstration prepared for client review. The company, the members, the suppliers and every figure shown are fictional. Nothing here connects to a payment provider, a database or a live delivery operation."
          />
          <div className="mt-8 text-center">
            <Button asChild variant="accent" size="lg">
              <Link to="/join">
                Walk through the sign-up
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
