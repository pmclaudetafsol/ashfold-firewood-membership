import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Shield, Truck, User, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDemo } from '@/state/demo-store';
import type { DemoRole } from '@/types';
import { cn } from '@/lib/utils';

const personas: Array<{
  role: DemoRole;
  label: string;
  description: string;
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    role: 'customer',
    label: 'Customer Demo',
    description: 'Eleanor Whitfield — Moderate User',
    to: '/dashboard',
    Icon: User,
  },
  {
    role: 'admin',
    label: 'Admin Demo',
    description: 'Rachel Adeyemi — Operations lead',
    to: '/admin',
    Icon: Shield,
  },
  {
    role: 'supplier',
    label: 'Supplier Demo',
    description: 'Tom Hedley — Wealden Timber Co.',
    to: '/supplier',
    Icon: Truck,
  },
];

interface DemoSwitcherProps {
  /** `full` shows the persona cards; `compact` is the header dropdown. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Mock sign-in. Choosing a persona sets the demo session in memory and moves
 * to that area — there is no authentication of any kind.
 */
export function DemoSwitcher({ variant = 'compact', className }: DemoSwitcherProps) {
  const { session, signInAs, signOut } = useDemo();
  const navigate = useNavigate();

  const enter = (role: DemoRole, to: string) => {
    signInAs(role);
    navigate(to);
  };

  if (variant === 'full') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
        {personas.map(({ role, label, description, to, Icon }) => (
          <button
            key={role}
            type="button"
            onClick={() => enter(role, to)}
            className={cn(
              'group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left',
              'shadow-subtle transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="space-y-1">
              <span className="block font-heading text-base font-semibold text-foreground">{label}</span>
              <span className="block text-sm text-muted-foreground">{description}</span>
            </span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary group-hover:underline">
              <PlayCircle className="size-4" aria-hidden="true" />
              Enter demo
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {session ? session.name.split(' ')[0] : 'Demo logins'}
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Mock sign-in</DropdownMenuLabel>
        {personas.map(({ role, label, description, to, Icon }) => (
          <DropdownMenuItem key={role} onSelect={() => enter(role, to)} className="items-start py-2.5">
            <Icon className="mt-0.5" aria-hidden="true" />
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </span>
          </DropdownMenuItem>
        ))}
        {session ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                signOut();
                navigate('/');
              }}
            >
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { personas as demoPersonas };
