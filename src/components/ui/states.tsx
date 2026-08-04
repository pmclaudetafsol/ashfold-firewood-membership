import * as React from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * The four states every data-backed view must handle. Having them as shared
 * components keeps the loading/empty/error experience identical across the
 * customer, administrator and operations areas.
 */

/* ───────────────────────────── Skeleton ───────────────────────────── */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

/**
 * Loading placeholder for a table. Rendering the real row/column count avoids
 * the layout shift that a generic spinner causes when data arrives.
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className={cn('h-10', colIndex === 0 ? 'w-1/3' : 'flex-1')} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Full-region spinner for transitions that have no meaningful skeleton. */
export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 py-12" role="status">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}…</p>
    </div>
  );
}

/* ────────────────────────────── Empty ─────────────────────────────── */

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border',
        'bg-card/50 px-6 py-14 text-center',
        className,
      )}
    >
      <span
        className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ────────────────────────────── Error ─────────────────────────────── */

interface ErrorStateProps {
  title?: string;
  /** Shown to the user. Keep it actionable and free of internal detail. */
  description?: string;
  /** The underlying error, surfaced only outside production. */
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this information. Please try again.',
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const detail =
    !import.meta.env.PROD && error instanceof Error ? error.message : null;

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30',
        'bg-destructive-muted px-6 py-12 text-center',
        className,
      )}
    >
      <span
        className="flex size-12 items-center justify-center rounded-full bg-card text-destructive-text"
        aria-hidden="true"
      >
        <AlertTriangle className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {detail ? (
          <p className="max-w-md pt-2 font-mono text-xs text-destructive-text">{detail}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/* ────────────────────────────── Alert ─────────────────────────────── */

const alertTones = {
  information: 'border-information/25 bg-information-muted',
  success: 'border-success/25 bg-success-muted',
  warning: 'border-warning/30 bg-warning-muted',
  destructive: 'border-destructive/25 bg-destructive-muted',
  neutral: 'border-border bg-muted',
} as const;

const alertIconTones = {
  information: 'text-information-text',
  success: 'text-success-text',
  warning: 'text-warning-text',
  destructive: 'text-destructive-text',
  neutral: 'text-muted-foreground',
} as const;

interface AlertProps {
  tone?: keyof typeof alertTones;
  title?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  className?: string;
  /** Errors and warnings announce themselves; informational notes do not. */
  live?: boolean;
}

export function Alert({
  tone = 'information',
  title,
  icon: Icon = AlertTriangle,
  children,
  className,
  live,
}: AlertProps) {
  const shouldAnnounce = live ?? (tone === 'destructive' || tone === 'warning');
  return (
    <div
      role={shouldAnnounce ? 'alert' : undefined}
      className={cn('flex gap-3 rounded-lg border p-4 text-sm', alertTones[tone], className)}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', alertIconTones[tone])} aria-hidden="true" />
      <div className="space-y-1">
        {title ? <p className="font-semibold text-foreground">{title}</p> : null}
        {children ? <div className="text-muted-foreground [&_a]:text-primary [&_a]:underline">{children}</div> : null}
      </div>
    </div>
  );
}
