import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Status badges pair a tinted background with a darker text shade of the same
 * hue so the label itself meets AA contrast — the colour is never the only
 * carrier of meaning. `StatusBadge` adds a leading icon on top of this.
 */
const badgeVariants = cva(
  cn(
    'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5',
    'text-xs font-medium leading-5 whitespace-nowrap',
    '[&_svg]:size-3.5 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        neutral: 'border-border bg-muted text-foreground',
        primary: 'border-primary/20 bg-primary-muted text-primary',
        success: 'border-success/20 bg-success-muted text-success-text',
        warning: 'border-warning/25 bg-warning-muted text-warning-text',
        destructive: 'border-destructive/20 bg-destructive-muted text-destructive-text',
        information: 'border-information/20 bg-information-muted text-information-text',
        oak: 'border-oak/30 bg-oak-muted text-foreground',
        /** Solid treatment for the single "recommended" marketing marker. */
        solidPrimary: 'border-transparent bg-primary text-primary-foreground',
        solidAccent: 'border-transparent bg-accent text-accent-foreground',
      },
      size: {
        sm: 'px-1.5 py-0 text-[0.6875rem]',
        md: '',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
