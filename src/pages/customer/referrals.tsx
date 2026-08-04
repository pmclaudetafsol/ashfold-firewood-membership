import { Check, Copy, Gift, Share2, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { ReferralStatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/states';
import { useCurrentCustomer } from '@/state/demo-store';
import { referralsForCustomer, REFERRAL_REWARD_PENCE } from '@/data/referrals';
import { formatDate, formatPence } from '@/utils/format';
import { toast } from '@/hooks/use-toast';

export default function CustomerReferralsPage() {
  const customer = useCurrentCustomer();
  const referrals = referralsForCustomer(customer.id);
  const joined = referrals.filter((referral) => referral.status === 'joined');
  const invited = referrals.filter((referral) => referral.status === 'invited');
  const referralLink = `https://ashfoldfirewood.example.co.uk/join?ref=${customer.referralCode}`;

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy', 'Copy it manually instead.');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join my firewood membership', url: referralLink });
      } catch {
        /* user cancelled the share sheet — nothing to do */
      }
      return;
    }
    await copy(referralLink, 'Referral link');
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Referral centre" description="Share your code — you both receive credit when a friend joins." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Successful referrals" value={joined.length} icon={Users} />
        <StatCard label="Invitations pending" value={invited.length} icon={Gift} />
        <StatCard label="Reward balance" value={formatPence(customer.referralBalancePence)} icon={Gift} tone="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your referral code</CardTitle>
          <CardDescription>
            Give {formatPence(REFERRAL_REWARD_PENCE, { trimWholePounds: true })}, get{' '}
            {formatPence(REFERRAL_REWARD_PENCE, { trimWholePounds: true })} — no cap on how many friends you refer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="tabular flex-1 rounded-lg border border-dashed border-border-strong bg-muted px-4 py-3 text-center font-heading text-xl font-bold tracking-wider text-primary sm:text-left">
              {customer.referralCode}
            </p>
            <Button variant="outline" onClick={() => copy(customer.referralCode, 'Referral code')}>
              <Copy aria-hidden="true" />
              Copy code
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 truncate rounded-lg border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              {referralLink}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => copy(referralLink, 'Referral link')}>
                <Copy aria-hidden="true" />
                Copy link
              </Button>
              <Button variant="primary" onClick={share}>
                <Share2 aria-hidden="true" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your referrals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {referrals.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No referrals yet"
                description="Share your code above and this list will fill up."
                icon={Users}
              />
            </div>
          ) : (
            <Table caption="Referral history">
              <TableHeader>
                <TableRow>
                  <TableHead>Friend</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{referral.friendName}</p>
                      <p className="text-xs text-muted-foreground">{referral.friendEmail}</p>
                    </TableCell>
                    <TableCell>{formatDate(referral.date)}</TableCell>
                    <TableCell>
                      <ReferralStatusBadge status={referral.status} size="sm" />
                    </TableCell>
                    <TableCell className="tabular text-right font-medium">
                      {referral.rewardPence > 0 ? (
                        <span className="flex items-center justify-end gap-1 text-success-text">
                          <Check className="size-3.5" aria-hidden="true" />
                          {formatPence(referral.rewardPence)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
