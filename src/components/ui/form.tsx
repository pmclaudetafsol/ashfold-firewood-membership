import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

/**
 * React Hook Form bindings that wire up the accessibility attributes for us:
 * every field gets a real `<label for>`, `aria-describedby` pointing at both
 * its description and its error, and `aria-invalid` when the field fails.
 *
 * Error messages are rendered in a `role="alert"` region so screen readers
 * announce them as they appear.
 */

const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);
const FormItemContext = React.createContext<{ id: string } | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) throw new Error('useFormField must be used within <FormField>');
  if (!itemContext) throw new Error('useFormField must be used within <FormItem>');

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-control`,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
    ...fieldState,
  };
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(error && 'text-destructive-text', className)}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    return (
      <p ref={ref} id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />
    );
  },
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message ?? '') : children;
    if (!body) return null;

    return (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        className={cn('text-sm font-medium text-destructive-text', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';

/**
 * Summary of all validation errors, rendered above a long form and focusable
 * so keyboard and screen-reader users are not left hunting for the failure.
 */
function FormErrorSummary({ className }: { className?: string }) {
  const { formState } = useFormContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const entries = Object.entries(formState.errors);

  React.useEffect(() => {
    if (entries.length > 0 && formState.submitCount > 0) ref.current?.focus();
    // Re-focus on each failed submit, not on every keystroke.
  }, [formState.submitCount, entries.length]);

  if (entries.length === 0 || formState.submitCount === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className={cn(
        'rounded-md border border-destructive/30 bg-destructive-muted p-4 text-sm text-destructive-text',
        className,
      )}
    >
      <p className="font-semibold">There is a problem with this form</p>
      <ul className="mt-2 list-inside list-disc space-y-1">
        {entries.map(([name, error]) => (
          <li key={name}>{String((error as { message?: string })?.message ?? 'This field is invalid')}</li>
        ))}
      </ul>
    </div>
  );
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormErrorSummary,
  useFormField,
};
