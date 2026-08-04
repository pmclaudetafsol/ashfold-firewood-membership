import * as React from 'react';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Honest labelling for the client presentation.
 *
 * Every screen that could be mistaken for a working system carries one of
 * these, so nobody in the room thinks a real payment, account or delivery has
 * been created.
 */

export function DemoBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-primary text-primary-foreground">
      <div className="container flex items-center justify-center gap-3 py-2 pr-8 text-center">
        <Info className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />
        <p className="text-xs leading-relaxed sm:text-sm">
          <span className="font-semibold">Demonstration build.</span>{' '}
          <span className="text-primary-foreground/85">
            All data is fictional. No payments are processed and no accounts are created.
          </span>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-primary-foreground/70',
            'transition-colors hover:bg-white/10 hover:text-primary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0',
          )}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Dismiss the demonstration notice</span>
        </button>
      </div>
    </div>
  );
}

/** Inline chip for individual panels containing demonstration data. */
export function DemoChip({ label = 'Demo data', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-oak/40 bg-oak-muted px-2 py-0.5',
        'text-[0.6875rem] font-semibold uppercase tracking-wide text-foreground/75',
        className,
      )}
    >
      {label}
    </span>
  );
}

/** A framed note explaining what a screen would do against a real backend. */
export function DemoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex gap-2 rounded-lg border border-dashed border-border bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
