import * as React from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

/**
 * Minimal toast store.
 *
 * Success messages auto-dismiss; errors do not, because an operator who missed
 * a failed save needs to still see it when they look back at the screen.
 */

const TOAST_LIMIT = 4;
const AUTO_DISMISS_MS = 6_000;

// `title` is omitted from ToastProps before widening: the underlying element
// is an <li>, whose native `title` attribute is a string, and a toast title
// needs to accept arbitrary React nodes.
type ToasterToast = Omit<ToastProps, 'title'> & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Action =
  | { type: 'ADD'; toast: ToasterToast }
  | { type: 'UPDATE'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS'; toastId?: string }
  | { type: 'REMOVE'; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let counter = 0;
function nextId(): string {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return String(counter);
}

const removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRemoval(toastId: string) {
  if (removalTimers.has(toastId)) return;
  const timeout = setTimeout(() => {
    removalTimers.delete(toastId);
    dispatch({ type: 'REMOVE', toastId });
  }, 300); // matches the close animation
  removalTimers.set(toastId, timeout);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };

    case 'UPDATE':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS': {
      const { toastId } = action;
      if (toastId) scheduleRemoval(toastId);
      else state.toasts.forEach((t) => scheduleRemoval(t.id));
      return {
        ...state,
        toasts: state.toasts.map((t) => (toastId === undefined || t.id === toastId ? { ...t, open: false } : t)),
      };
    }

    case 'REMOVE':
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
  }
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastProps['variant'];
  /** Override auto-dismiss. Errors default to staying until dismissed. */
  duration?: number;
}

function toast({ variant = 'default', duration, ...options }: ToastOptions) {
  const id = nextId();
  const dismiss = () => dispatch({ type: 'DISMISS', toastId: id });

  const persistent = variant === 'destructive' || variant === 'warning';
  const effectiveDuration = duration ?? (persistent ? Infinity : AUTO_DISMISS_MS);

  dispatch({
    type: 'ADD',
    toast: {
      ...options,
      variant,
      id,
      open: true,
      duration: effectiveDuration === Infinity ? undefined : effectiveDuration,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update: (next: Partial<ToastOptions>) => dispatch({ type: 'UPDATE', toast: { ...next, id } }),
  };
}

/** Convenience wrappers so call sites read as intent, not configuration. */
toast.success = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: 'success' });

toast.error = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: 'destructive' });

toast.warning = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: 'warning' });

toast.info = (title: React.ReactNode, description?: React.ReactNode) =>
  toast({ title, description, variant: 'information' });

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS', toastId }),
  };
}

export { useToast, toast };
