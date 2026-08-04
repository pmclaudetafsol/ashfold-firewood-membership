import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Link to="/" className="rounded-md">
        <Logo />
      </Link>

      <div className="space-y-3">
        <p className="tabular font-heading text-6xl font-bold text-border-strong">404</p>
        <h1 className="font-heading text-heading font-bold text-foreground">We could not find that page</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The link may be out of date, or the page may not exist in this demonstration build.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary">
          <Link to="/">
            <Home aria-hidden="true" />
            Back to the homepage
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/sign-in">
            <ArrowLeft aria-hidden="true" />
            Demonstration logins
          </Link>
        </Button>
      </div>
    </div>
  );
}
