import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Small supporting line under the value. */
  hint?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  /** Signed proportion, e.g. 0.064 renders as "+6.4%". */
  change?: number;
  /** For metrics where a rise is bad (failed payments, delays). */
  invertChange?: boolean;
  tone?: 'default' | 'accent' | 'warning' | 'destructive' | 'success';
  to?: string;
  className?: string;
}

const toneStyles = {
  default: { icon: 'bg-primary-muted text-primary', border: 'border-border' },
  accent: { icon: 'bg-accent/12 text-accent-hover', border: 'border-border' },
  warning: { icon: 'bg-warning-muted text-warning-text', border: 'border-warning/30' },
  destructive: { icon: 'bg-destructive-muted text-destructive-text', border: 'border-destructive/30' },
  success: { icon: 'bg-success-muted text-success-text', border: 'border-success/25' },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  change,
  invertChange = false,
  tone = 'default',
  to,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];
  const isPositive = change !== undefined && change >= 0;
  const isGood = invertChange ? !isPositive : isPositive;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', styles.icon)}>
            <Icon className="size-[1.125rem]" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="tabular mt-3 font-heading text-3xl font-bold leading-none tracking-tight text-foreground">
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {change !== undefined ? (
          <span
            className={cn(
              'tabular inline-flex items-center gap-0.5 font-medium',
              isGood ? 'text-success-text' : 'text-destructive-text',
            )}
          >
            <ChangeIcon className="size-3.5" aria-hidden="true" />
            {Math.abs(change * 100).toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="min-w-0">{hint}</span> : null}
      </div>
      {to ? (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
          View
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    'group flex flex-col rounded-xl border bg-card p-5 shadow-subtle transition-shadow',
    styles.border,
    to && 'hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}
