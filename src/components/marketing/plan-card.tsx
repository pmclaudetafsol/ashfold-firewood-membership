import { Link } from 'react-router-dom';
import { Check, Home, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPence, formatVolume } from '@/utils/format';
import type { MembershipPlan } from '@/types';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  plan: MembershipPlan;
  /** `compact` drops the household profile block for tighter grids. */
  variant?: 'full' | 'compact';
  /** Overrides the default "Join" action, e.g. inside the registration wizard. */
  action?: React.ReactNode;
  className?: string;
}

export function PlanCard({ plan, variant = 'full', action, className }: PlanCardProps) {
  const highlighted = plan.recommended;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow sm:p-7',
        highlighted
          ? 'border-primary shadow-elevated lg:-my-3 lg:pb-10 lg:pt-10'
          : 'border-border shadow-card hover:shadow-elevated',
        className,
      )}
    >
      {highlighted ? (
        <Badge
          variant="solidAccent"
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 shadow-subtle"
        >
          Most popular
        </Badge>
      ) : null}

      <div className="space-y-1.5">
        <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.strapline}</p>
      </div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="tabular font-heading text-4xl font-bold tracking-tight text-foreground">
          {formatPence(plan.annualPricePence, { trimWholePounds: true })}
        </span>
        <span className="text-sm font-medium text-muted-foreground">/ year</span>
      </div>
      <p className="tabular mt-1.5 text-sm text-muted-foreground">
        Works out at {formatPence(plan.perDeliveryPence)} per delivery
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-muted/70 p-4 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deliveries</dt>
          <dd className="tabular mt-0.5 font-heading text-lg font-bold text-foreground">
            {plan.deliveriesPerYear}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Per delivery</dt>
          <dd className="tabular mt-0.5 font-heading text-lg font-bold text-foreground">
            {plan.cratesPerDelivery} {plan.cratesPerDelivery === 1 ? 'crate' : 'crates'}
          </dd>
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="tabular inline-flex items-center gap-1.5">
            <Package className="size-3.5" aria-hidden="true" />
            {formatVolume(plan.volumePerDeliveryM3)} · approx. {plan.weightPerDeliveryKg}kg
          </span>
        </div>
      </dl>

      <p className="mt-5 flex items-start gap-2 text-sm text-foreground">
        <Home className="mt-0.5 size-4 shrink-0 text-accent-hover" aria-hidden="true" />
        <span>
          <span className="font-medium">Recommended for: </span>
          <span className="text-muted-foreground">{plan.recommendedFor}</span>
        </span>
      </p>

      {variant === 'full' ? (
        <ul className="mt-5 space-y-2.5 text-sm">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-7 pt-1">
        {action ?? (
          <Button asChild variant={highlighted ? 'accent' : 'outline'} className="w-full">
            <Link to={`/join?plan=${plan.id}`}>Join {plan.name}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
