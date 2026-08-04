import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/brand/logo';
import { DemoBanner } from '@/components/shared/demo';
import { DemoSwitcher } from '@/components/layout/demo-switcher';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Membership plans', to: '/plans' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link to="/" className="rounded-md focus-visible:ring-offset-4" aria-label={`${brand.name} home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-muted text-primary' : 'text-foreground/80 hover:bg-muted hover:text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <DemoSwitcher />
          </div>
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link to="/join">Join membership</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" title="Menu" hideTitle>
              <div className="mt-2">
                <Logo />
              </div>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'rounded-md px-3 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary-muted text-primary'
                            : 'text-foreground hover:bg-muted hover:text-primary',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t border-border pt-5">
                <SheetClose asChild>
                  <Button asChild variant="accent" className="w-full">
                    <Link to="/join">Join membership</Link>
                  </Button>
                </SheetClose>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Demonstration logins
                </p>
                <DemoSwitcher className="w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* A quiet progress hint so the client can see which page is open. */}
      <span className="sr-only" aria-live="polite">
        {navigation.find((item) => item.to === pathname)?.label ?? 'Home'}
      </span>
    </header>
  );
}

const footerColumns = [
  {
    title: 'Membership',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Membership plans', to: '/plans' },
      { label: 'Join membership', to: '/join' },
      { label: 'Referral programme', to: '/plans#referrals' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Our suppliers', to: '/about#suppliers' },
      { label: 'Sustainability', to: '/about#sustainability' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Frequently asked questions', to: '/faq' },
      { label: 'Delivery areas', to: '/faq#delivery-areas' },
      { label: 'Rescheduling', to: '/faq#rescheduling-and-cancellation' },
      { label: 'Member sign in', to: '/sign-in' },
    ],
  },
];

function PublicFooter() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-5">
            <Logo tone="light" showTagline />
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/75">
              An annual membership that brings kiln-dried hardwood to your door across the burning season —
              without a single reorder.
            </p>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href={brand.contact.phoneHref} className="hover:text-primary-foreground hover:underline">
                  {brand.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-primary-foreground hover:underline"
                >
                  {brand.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>Deliveries across England, Wales and southern Scotland</span>
              </li>
            </ul>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="rounded-sm text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} {brand.legal.companyName}. Demonstration build — fictional company,
            fictional data.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/60">
            <span>Terms of membership</span>
            <span>Privacy notice</span>
            <span>Delivery policy</span>
            <Link to="/sign-in" className="inline-flex items-center gap-1 hover:text-primary-foreground hover:underline">
              Demo logins
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <DemoBanner />
      <PublicHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
