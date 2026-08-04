import { cn } from '@/lib/utils';
import { brand } from '@/config/brand';

/**
 * The wordmark. The mark itself is three stacked log ends inside a rounded
 * square — it reads at 24px in the mobile header and at 48px in the footer.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-9 shrink-0', className)}>
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <g fill="none" stroke="hsl(var(--background))" strokeWidth="2">
        <circle cx="14" cy="15" r="6" />
        <circle cx="26" cy="15" r="6" />
        <circle cx="20" cy="26" r="6" />
      </g>
      <g fill="hsl(var(--background))">
        <circle cx="14" cy="15" r="1.7" />
        <circle cx="26" cy="15" r="1.7" />
        <circle cx="20" cy="26" r="1.7" />
      </g>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** `light` renders the wordmark in cream for use on the dark footer. */
  tone?: 'default' | 'light';
  showTagline?: boolean;
}

export function Logo({ className, tone = 'default', showTagline = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={tone === 'light' ? 'text-background' : 'text-primary'} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-lg font-bold tracking-tight',
            tone === 'light' ? 'text-background' : 'text-primary',
          )}
        >
          {brand.name}
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1 text-[0.6875rem] font-medium tracking-wide',
              tone === 'light' ? 'text-background/70' : 'text-muted-foreground',
            )}
          >
            Kiln-dried firewood membership
          </span>
        ) : null}
      </span>
    </span>
  );
}
