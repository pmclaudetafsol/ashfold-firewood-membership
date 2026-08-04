import * as React from 'react';
import { CheckCircle2, Gift } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { ReferralStatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { referrals as seedReferrals, REFERRAL_REWARD_PENCE } from '@/data/referrals';
import { formatDate, formatPence } from '@/utils/format';
import { toast } from '@/hooks/use-toast';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = React.useState(seedReferrals);

  const joined = referrals.filter((r) => r.status === 'joined');
  const invited = referrals.filter((r) => r.status === 'invited');
  const totalRewards = joined.reduce((sum, r) => sum + r.rewardPence, 0);

  const approve = (id: string) => {
    setReferrals((current) =>
      current.map((referral) =>
        referral.id === id ? { ...referral, status: 'joined' as const, rewardPence: REFERRAL_REWARD_PENCE } : referral,
      ),
    );
    toast.success('Referral approved', 'Reward credited to both members.');
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Referrals" description="Every referral raised across the membership base." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Successful referrals" value={joined.length} icon={CheckCircle2} tone="success" />
        <StatCard label="Awaiting approval" value={invited.length} icon={Gift} tone="warning" />
        <StatCard label="Rewards paid" value={formatPence(totalRewards, { trimWholePounds: true })} icon={Gift} />
      </div>

      <Table caption="Referrals">
        <TableHeader>
          <TableRow>
            <TableHead>Referrer</TableHead>
            <TableHead>Referred customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-medium text-foreground">{referral.referrerName}</TableCell>
              <TableCell>
                <p>{referral.friendName}</p>
                <p className="text-xs text-muted-foreground">{referral.friendEmail}</p>
              </TableCell>
              <TableCell>{formatDate(referral.date)}</TableCell>
              <TableCell>
                <ReferralStatusBadge status={referral.status} size="sm" />
              </TableCell>
              <TableCell className="tabular">{referral.rewardPence > 0 ? formatPence(referral.rewardPence) : '—'}</TableCell>
              <TableCell className="text-right">
                {referral.status === 'invited' ? (
                  <Button variant="outline" size="sm" onClick={() => approve(referral.id)}>
                    <CheckCircle2 aria-hidden="true" />
                    Approve
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
