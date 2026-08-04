import * as React from 'react';
import { Mail, MessageSquare, Bell } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { communicationTemplates as seedTemplates } from '@/data/notifications';
import { formatDate, formatPercent } from '@/utils/format';
import { toast } from '@/hooks/use-toast';
import type { NotificationChannel } from '@/types';

const channelIcon: Record<NotificationChannel, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquare,
  'in-app': Bell,
};

export default function AdminCommunicationsPage() {
  const [templates, setTemplates] = React.useState(seedTemplates);

  const toggle = (id: string) => {
    setTemplates((current) =>
      current.map((template) => (template.id === id ? { ...template, active: !template.active } : template)),
    );
    toast.success('Template updated');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Communications" description="Automated messages sent to members across the season." />

      <Table caption="Communication templates">
        <TableHeader>
          <TableRow>
            <TableHead>Template</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Last sent</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => {
            const Icon = channelIcon[template.channel];
            return (
              <TableRow key={template.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.audience}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm">
                    <Icon aria-hidden="true" />
                    {template.channel}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-64 text-muted-foreground">{template.trigger}</TableCell>
                <TableCell>{formatDate(template.lastSent)}</TableCell>
                <TableCell>
                  <span className="tabular">{template.sentCount.toLocaleString('en-GB')} sent</span>
                  <p className="tabular text-xs text-muted-foreground">{formatPercent(template.openRate)} open rate</p>
                </TableCell>
                <TableCell className="text-right">
                  <Switch checked={template.active} onCheckedChange={() => toggle(template.id)} aria-label={`Toggle ${template.name}`} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
