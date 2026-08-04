import * as React from 'react';
import { Check, Sparkles, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { MembershipStatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioCard } from '@/components/ui/radio-group';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useCurrentCustomer, useDemo } from '@/state/demo-store';
import { membershipPlans, getPlan } from '@/data/plans';
import { formatDateLong, formatPence } from '@/utils/format';
import type { PlanTier } from '@/types';

export default function CustomerMembershipPage() {
  const customer = useCurrentCustomer();
  const { changePlan, setMembershipStatus } = useDemo();
  const plan = getPlan(customer.planId);

  const [selectedPlan, setSelectedPlan] = React.useState<PlanTier>(customer.planId);
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const planChanged = selectedPlan !== customer.planId;

  return (
    <div className="space-y-8">
      <PageHeader title="Membership" description="Your plan, benefits and renewal details." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.strapline}</CardDescription>
            </div>
            <MembershipStatusBadge status={customer.membershipStatus} />
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="tabular font-heading text-3xl font-bold text-foreground">
              {formatPence(plan.annualPricePence, { trimWholePounds: true })}
              <span className="ml-1 text-base font-medium text-muted-foreground">/ year</span>
            </p>
            <dl className="grid grid-cols-2 gap-4 rounded-lg bg-muted/60 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Included deliveries</dt>
                <dd className="mt-0.5 font-medium text-foreground">{plan.deliveriesPerYear} per year</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Per delivery</dt>
                <dd className="mt-0.5 font-medium text-foreground">{plan.cratesPerDelivery} crates</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Member since</dt>
                <dd className="mt-0.5 font-medium text-foreground">{formatDateLong(customer.joinedOn)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Renews on</dt>
                <dd className="mt-0.5 font-medium text-foreground">{formatDateLong(customer.renewsOn)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
            Change your plan
          </CardTitle>
          <CardDescription>Takes effect from your next delivery. No penalty for switching.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanTier)}>
            {membershipPlans.map((candidate) => (
              <RadioCard
                key={candidate.id}
                value={candidate.id}
                label={candidate.name}
                description={`${candidate.cratesPerDelivery} crates per delivery · ${candidate.recommendedFor}`}
                trailing={formatPence(candidate.annualPricePence, { trimWholePounds: true })}
              />
            ))}
          </RadioGroup>
          <Button
            disabled={!planChanged}
            onClick={() => {
              changePlan(customer.id, selectedPlan);
            }}
          >
            Save plan change
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/25">
        <CardHeader>
          <CardTitle className="text-destructive-text">Cancel membership</CardTitle>
          <CardDescription>
            You can cancel at any time. We refund the value of undelivered crates, less any promotional discount
            already used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive-outline"
            onClick={() => setCancelOpen(true)}
            disabled={customer.membershipStatus === 'cancelled'}
          >
            <XCircle aria-hidden="true" />
            Request cancellation
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel your membership?"
        description="Your remaining deliveries will be stopped and your undelivered balance refunded. This demonstration only updates the state in this browser."
        confirmLabel="Cancel membership"
        tone="destructive"
        onConfirm={() => {
          setMembershipStatus(customer.id, 'cancelled');
          setCancelOpen(false);
        }}
      />
    </div>
  );
}
