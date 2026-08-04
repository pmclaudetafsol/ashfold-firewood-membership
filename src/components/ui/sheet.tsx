import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Slide-over panel built on the same Radix Dialog primitive as the modal, so
 * focus trapping, escape handling and scroll locking behave identically.
 * Used for the mobile navigation drawer and dashboard filter panels.
 */

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-foreground/50 backdrop-blur-[2px]',
      'data-[state=open]:animate-fade-in',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sideClasses = {
  left: 'inset-y-0 left-0 h-full w-[min(20rem,85vw)] border-r data-[state=open]:slide-in-from-left',
  right: 'inset-y-0 right-0 h-full w-[min(22rem,85vw)] border-l data-[state=open]:slide-in-from-right',
  bottom: 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t data-[state=open]:slide-in-from-bottom',
} as const;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: keyof typeof sideClasses;
  /** Required for assistive technology; rendered visually unless hidden. */
  title: string;
  description?: string;
  hideTitle?: boolean;
}

const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, children, side = 'right', title, description, hideTitle, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-4 overflow-y-auto border-border bg-card p-6 shadow-elevated',
          'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        <div className={cn('flex items-start justify-between gap-4', hideTitle && 'sr-only')}>
          <div className="space-y-1">
            <DialogPrimitive.Title className="font-heading text-lg font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
        </div>
        {!description && hideTitle ? (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        ) : null}
        {children}
        <DialogPrimitive.Close
          className={cn(
            'absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors',
            'hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetPortal, SheetOverlay };
