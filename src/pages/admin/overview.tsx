import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, CreditCard, Gift, Package, Truck, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { DemoChip } from '@/components/shared/demo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  adminSummary,
  chartColours,
  deliveryStatusBreakdown,
  monthlyPerformance,
  planSplit,
} from '@/data/reports';
import { formatPence, formatPercent } from '@/utils/format';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 13,
  boxShadow: '0 4px 12px -2px rgb(31 37 33 / 0.12)',
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard overview"
        description="A live picture of membership, revenue and delivery performance."
        actions={<DemoChip label="Demo dataset" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total members"
          value={adminSummary.totalMembers.toLocaleString('en-GB')}
          change={adminSummary.newMembersChange}
          hint="vs. last month"
          icon={Users}
        />
        <StatCard
          label="Active memberships"
          value={adminSummary.activeMemberships.toLocaleString('en-GB')}
          hint={`${adminSummary.newMembersThisMonth} new this month`}
          icon={Users}
          tone="accent"
        />
        <StatCard
          label="Annual membership revenue"
          value={formatPence(adminSummary.annualRevenuePence, { trimWholePounds: true })}
          change={adminSummary.revenueChange}
          hint="vs. last month"
          icon={CreditCard}
          tone="success"
        />
        <StatCard
          label="Upcoming deliveries"
          value={adminSummary.upcomingDeliveries.toLocaleString('en-GB')}
          hint={`${adminSummary.upcomingThisWeek} this week`}
          icon={Package}
        />
        <StatCard
          label="Delayed deliveries"
          value={adminSummary.delayedDeliveries}
          hint="Requiring a new date"
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Failed payments"
          value={adminSummary.failedPayments}
          hint={formatPence(adminSummary.failedPaymentValuePence)}
          icon={CreditCard}
          tone="destructive"
        />
        <StatCard
          label="Referral conversions"
          value={adminSummary.referralConversions}
          hint={formatPercent(adminSummary.referralConversionRate)}
          icon={Gift}
        />
        <StatCard
          label="On-time delivery rate"
          value={formatPercent(adminSummary.averageOnTimeRate)}
          hint={`${formatPercent(adminSummary.averageMoistureCompliance)} moisture compliant`}
          icon={Truck}
          tone="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Membership growth</CardTitle>
            <CardDescription>New members joining each month</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="memberGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColours.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chartColours.primary} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={40} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="newMembers"
                  name="New members"
                  stroke={chartColours.primary}
                  fill="url(#memberGrowth)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Membership revenue recognised per month</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={52}
                  tickFormatter={(value: number) => `£${Math.round(value / 100000) / 10}k`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatPence(value)} />
                <Bar dataKey="revenuePence" name="Revenue" fill={chartColours.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership plan distribution</CardTitle>
            <CardDescription>Active members by plan</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planSplit} dataKey="members" nameKey="plan" innerRadius={64} outerRadius={96} paddingAngle={2}>
                  {planSplit.map((entry) => (
                    <Cell key={entry.plan} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value} members`} />
                <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery status</CardTitle>
            <CardDescription>All deliveries this season, by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryStatusBreakdown} layout="vertical" margin={{ left: 16, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name="Deliveries" radius={[0, 4, 4, 0]}>
                  {deliveryStatusBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
