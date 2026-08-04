import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders the error border treatment; pair with `aria-describedby`. */
  invalid?: boolean;
}

/**
 * Uses `border-strong` rather than the decorative border token: WCAG 1.4.11
 * requires 3:1 contrast for the boundary of an interactive control, which the
 * light cream divider colour cannot reach.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        invalid ? 'border-destructive' : 'border-border-strong',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      'flex min-h-20 w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70',
      invalid ? 'border-destructive' : 'border-border-strong',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Input, Textarea };
