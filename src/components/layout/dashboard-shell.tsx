import * as React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, ExternalLink, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/brand/logo';
import { demoPersonas } from '@/components/layout/demo-switcher';
import { useDemo } from '@/state/demo-store';
import { cn } from '@/lib/utils';
import type { DemoRole } from '@/types';

export interface NavItem {
  label: string;
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Rendered as a small count on the right of the item. */
  badge?: number;
  end?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface DashboardShellProps {
  sections: NavSection[];
  /** Shown under the logo in the sidebar, e.g. "Member area". */
  areaLabel: string;
  /** Tinted strip identifying restricted areas. */
  restrictedNotice?: string;
  notificationsHref?: string;
  accountHref?: string;
}

function SidebarNav({ sections, onNavigate }: { sections: NavSection[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-6 overflow-y-auto py-2">
      {sections.map((section, index) => (
        <div key={section.title ?? index} className="space-y-1">
          {section.title ? (
            <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {section.title}
            </p>
          ) : null}
          {section.items.map(({ label, to, Icon, badge, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-foreground/80 hover:bg-primary-muted hover:text-primary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('size-[1.125rem] shrink-0', isActive ? '' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {badge ? (
                    <span
                      className={cn(
                        'tabular flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                        isActive ? 'bg-white/20 text-primary-foreground' : 'bg-accent text-accent-foreground',
                      )}
                    >
                      {badge}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

export default function DashboardShell({
  sections,
  areaLabel,
  restrictedNotice,
  notificationsHref,
  accountHref,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { session, signInAs, signOut, unreadCount } = useDemo();
  const navigate = useNavigate();

  const switchTo = (role: DemoRole, to: string) => {
    signInAs(role);
    navigate(to);
  };

  const sidebarInner = (onNavigate?: () => void) => (
    <>
      <div className="space-y-3 pb-4">
        <Link to="/" className="block rounded-md" onClick={onNavigate}>
          <Logo />
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{areaLabel}</p>
      </div>
      <SidebarNav sections={sections} onNavigate={onNavigate} />
      <div className="space-y-2 border-t border-border pt-4">
        {restrictedNotice ? (
          <p className="rounded-md bg-oak-muted px-3 py-2 text-xs leading-relaxed text-foreground/75">
            {restrictedNotice}
          </p>
        ) : null}
        <Button asChild variant="ghost" size="sm" className="w-full justify-start" onClick={onNavigate}>
          <Link to="/">
            <ExternalLink aria-hidden="true" />
            Back to the website
          </Link>
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[var(--admin-sidebar-width)] shrink-0 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        {sidebarInner()}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" title="Navigation" hideTitle className="px-4 py-5">
                <SheetClose asChild>
                  <span className="sr-only">Close navigation</span>
                </SheetClose>
                {sidebarInner(() => setMobileOpen(false))}
              </SheetContent>
            </Sheet>
            <Link to="/" className="rounded-md lg:hidden">
              <Logo className="[&_span]:text-base" />
            </Link>
            <Badge variant="oak" className="hidden sm:inline-flex">
              Demonstration
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {notificationsHref ? (
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link to={notificationsHref} aria-label={`Notifications (${unreadCount} unread)`}>
                  <Bell aria-hidden="true" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[0.625rem] font-bold text-accent-foreground">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary-muted text-primary">
                    <User className="size-4" aria-hidden="true" />
                  </span>
                  <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                    {session?.name ?? 'Demo user'}
                  </span>
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Signed in as (demo)</DropdownMenuLabel>
                <div className="px-2.5 pb-2">
                  <p className="truncate text-sm font-medium text-foreground">{session?.name ?? 'Demo user'}</p>
                  <p className="truncate text-xs text-muted-foreground">{session?.email ?? '—'}</p>
                </div>
                <DropdownMenuSeparator />
                {accountHref ? (
                  <DropdownMenuItem asChild>
                    <Link to={accountHref}>
                      <User aria-hidden="true" />
                      Account settings
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch demo persona</DropdownMenuLabel>
                {demoPersonas.map(({ role, label, to, Icon }) => (
                  <DropdownMenuItem key={role} onSelect={() => switchTo(role, to)}>
                    <Icon aria-hidden="true" />
                    {label}
                  </DropdownMenuItem>
                ))}
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 lg:space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
