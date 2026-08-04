import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-3', className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square size-5 shrink-0 rounded-full border-2 border-border-strong bg-card text-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block size-2.5 rounded-full bg-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

/**
 * A full-width selectable card wrapping a radio input — used for plan choice
 * and payment method selection, where the whole block should be clickable.
 */
interface RadioCardProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
}

const RadioCard = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioCardProps>(
  ({ className, label, description, trailing, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          'group flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-4 transition-colors',
          'border-border hover:border-primary/50 hover:bg-primary-muted/40',
          'has-[:checked]:border-primary has-[:checked]:bg-primary-muted/60 has-[:checked]:shadow-subtle',
          className,
        )}
      >
        <RadioGroupPrimitive.Item
          ref={ref}
          id={inputId}
          className={cn(
            'mt-0.5 aspect-square size-5 shrink-0 rounded-full border-2 border-border-strong bg-card',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
          )}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <span className="block size-2.5 rounded-full bg-primary" />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          {description ? <span className="block text-sm text-muted-foreground">{description}</span> : null}
        </span>
        {trailing ? <span className="shrink-0 text-sm font-medium text-foreground">{trailing}</span> : null}
      </label>
    );
  },
);
RadioCard.displayName = 'RadioCard';

export { RadioGroup, RadioGroupItem, RadioCard };
