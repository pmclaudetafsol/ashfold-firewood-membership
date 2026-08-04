import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button variants follow the brand hierarchy:
 *   accent      — Burnt Orange. Reserved for the single highest-priority action
 *                 on a view (Join Membership, Complete Payment, Renew…).
 *   primary     — Deep Forest Green. The standard confirming action.
 *   outline     — Forest Green border. Secondary actions.
 *   ghost/link  — Tertiary actions.
 *   destructive — Kept visually distinct so it never sits adjacent to a
 *                 primary action by accident.
 */
const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        accent: 'bg-accent text-accent-foreground shadow-subtle hover:bg-accent-hover active:bg-accent-hover',
        primary: 'bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90 active:bg-primary/95',
        outline:
          'border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        secondary: 'bg-muted text-foreground hover:bg-muted/70 border border-border',
        ghost: 'text-primary hover:bg-primary-muted',
        link: 'text-primary underline-offset-4 hover:underline h-auto p-0',
        destructive:
          'bg-destructive text-destructive-foreground shadow-subtle hover:bg-destructive/90',
        'destructive-outline':
          'border border-destructive bg-transparent text-destructive hover:bg-destructive-muted',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and disables the button. Width is preserved to avoid shift. */
  loading?: boolean;
  /** Announced to screen readers while `loading` is true. */
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    // `asChild` composes onto a single child (e.g. a Link), so the spinner
    // markup cannot be injected without breaking Slot's single-child contract.
    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {loading && loadingText ? <span className="sr-only">{loadingText}</span> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
