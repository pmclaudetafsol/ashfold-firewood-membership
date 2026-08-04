import { Link } from 'react-router-dom';
import { Info, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/states';
import { DemoSwitcher } from '@/components/layout/demo-switcher';
import { Photo } from '@/components/brand/imagery';

/**
 * There is no authentication in this build. The form below is rendered so the
 * client can see the intended sign-in layout, but it is disabled — the three
 * persona buttons are the way into every area.
 */
export default function SignInPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="primary">Demonstration access</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-foreground">
              Choose a demonstration login
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Three personas, each opening a different area of the platform. Nothing is authenticated and no
              credentials are needed.
            </p>
          </div>

          <DemoSwitcher variant="full" className="mt-10" />

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">The real sign-in form</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Shown for layout purposes only. It is disabled in this build.
              </p>

              <Alert tone="information" icon={Info} title="Not connected" className="mt-5">
                Authentication, password reset and session management are intentionally out of scope for the
                demonstration. The fields below do nothing.
              </Alert>

              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => event.preventDefault()}
                aria-describedby="sign-in-disabled"
              >
                <p id="sign-in-disabled" className="sr-only">
                  This form is disabled in the demonstration build.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email">Email address</Label>
                  <Input id="signin-email" type="email" autoComplete="email" disabled placeholder="you@example.co.uk" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <span className="text-sm text-muted-foreground">Forgotten it?</span>
                  </div>
                  <Input id="signin-password" type="password" autoComplete="current-password" disabled />
                </div>
                <Button type="submit" className="w-full" disabled>
                  <Lock aria-hidden="true" />
                  Sign in
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Not a member yet?{' '}
                  <Link to="/join" className="font-medium text-primary underline underline-offset-4">
                    Join the membership
                  </Link>
                </p>
              </form>
            </div>

            <Photo
              scene="room"
              alt="A warm sitting room with a lit stove"
              ratio="aspect-[4/3]"
              className="hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
