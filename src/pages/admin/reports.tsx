import * as React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminSummary, chartColours, regionPerformance, savedReports } from '@/data/reports';
import { formatDate, formatPence } from '@/utils/format';
import { toast } from '@/hooks/use-toast';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 13,
};

export default function AdminReportsPage() {
  const [period, setPeriod] = React.useState('90');
  const [planFilter, setPlanFilter] = React.useState('all');
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Membership, delivery and revenue performance across the platform."
        actions={
          <Button variant="outline" onClick={() => toast.info('Demonstration export', 'A CSV would download here.')}>
            <Download aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last 12 months</SelectItem>
            <SelectItem value="season">Season to date</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="light">Light User</SelectItem>
            <SelectItem value="moderate">Moderate User</SelectItem>
            <SelectItem value="heavy">Heavy User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All suppliers</SelectItem>
            <SelectItem value="sup-001">Wealden Timber Co.</SelectItem>
            <SelectItem value="sup-002">Chilterns Woodfuel</SelectItem>
            <SelectItem value="sup-003">Dales Kiln & Log</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Delivery status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Annual revenue" value={formatPence(adminSummary.annualRevenuePence, { trimWholePounds: true })} change={adminSummary.revenueChange} />
        <StatCard label="Active memberships" value={adminSummary.activeMemberships} />
        <StatCard label="On-time delivery rate" value={`${(adminSummary.averageOnTimeRate * 100).toFixed(1)}%`} tone="success" />
        <StatCard label="Referral conversions" value={adminSummary.referralConversions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regional performance</CardTitle>
          <CardDescription>Members and deliveries by UK region</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionPerformance} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="members" name="Members" fill={chartColours.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="deliveries" name="Deliveries" fill={chartColours.oak} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table caption="Saved reports">
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="flex items-center gap-2 font-medium text-foreground">
                    <FileSpreadsheet className="size-4 text-muted-foreground" aria-hidden="true" />
                    {report.name}
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>{formatDate(report.generated)}</TableCell>
                  <TableCell className="tabular">{report.rows.toLocaleString('en-GB')}</TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">
                      {report.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Demonstration export', `${report.name}.${report.format.toLowerCase()} would download here.`)}
                    >
                      <Download aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
