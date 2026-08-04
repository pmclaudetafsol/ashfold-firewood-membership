import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Confirmation dialog for destructive and financially significant actions.
 *
 * Two levels of friction:
 *   - `tone="destructive"` gives a red confirm button, visually separated from
 *     the cancel action.
 *   - `confirmPhrase` additionally requires the operator to type an exact
 *     phrase, which is used for irreversible operations such as cancelling a
 *     paid membership or issuing a refund.
 */

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'destructive' | 'primary';
  /** When set, the confirm button stays disabled until typed exactly. */
  confirmPhrase?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'destructive',
  confirmPhrase,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = React.useState('');
  const phraseId = React.useId();

  // Reset the typed phrase whenever the dialog is reopened.
  React.useEffect(() => {
    if (open) setTyped('');
  }, [open]);

  const phraseSatisfied = !confirmPhrase || typed.trim() === confirmPhrase;

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-foreground/50 backdrop-blur-[2px]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <AlertDialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4',
            'rounded-lg border border-border bg-card p-6 shadow-elevated',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          <div className="flex gap-3">
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                tone === 'destructive' ? 'bg-destructive-muted text-destructive-text' : 'bg-primary-muted text-primary',
              )}
              aria-hidden="true"
            >
              <AlertTriangle className="size-5" />
            </span>
            <div className="space-y-1.5">
              <AlertDialogPrimitive.Title className="font-heading text-lg font-semibold leading-snug">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description asChild>
                <div className="text-sm text-muted-foreground">{description}</div>
              </AlertDialogPrimitive.Description>
            </div>
          </div>

          {confirmPhrase ? (
            <div className="space-y-2">
              <Label htmlFor={phraseId}>
                Type <span className="font-semibold text-foreground">{confirmPhrase}</span> to confirm
              </Label>
              <Input
                id={phraseId}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <AlertDialogPrimitive.Cancel
              className={cn(buttonVariants({ variant: 'secondary' }))}
              disabled={loading}
            >
              {cancelLabel}
            </AlertDialogPrimitive.Cancel>
            <button
              type="button"
              className={cn(buttonVariants({ variant: tone === 'destructive' ? 'destructive' : 'primary' }))}
              disabled={!phraseSatisfied || loading}
              aria-busy={loading || undefined}
              onClick={() => void onConfirm()}
            >
              {loading ? 'Working…' : confirmLabel}
            </button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
