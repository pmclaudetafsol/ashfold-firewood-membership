import { Link } from 'react-router-dom';
import { Bell, BellRing, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ChannelBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { useDemo } from '@/state/demo-store';
import { formatRelative, formatTimestamp } from '@/utils/format';
import { cn } from '@/lib/utils';

const toneDot = {
  information: 'bg-information',
  success: 'bg-success',
  warning: 'bg-warning-solid',
  destructive: 'bg-destructive',
} as const;

export default function CustomerNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useDemo();
  const sorted = [...notifications].sort((a, b) => b.sentAt.localeCompare(a.sentAt));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
        actions={
          <Button variant="outline" onClick={markAllNotificationsRead} disabled={unreadCount === 0}>
            <CheckCheck aria-hidden="true" />
            Mark all as read
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState title="No notifications" description="Updates about your deliveries and rewards will appear here." icon={Bell} />
      ) : (
        <ul className="space-y-2">
          {sorted.map((notification) => (
            <li key={notification.id}>
              <div
                className={cn(
                  'flex items-start gap-4 rounded-xl border p-4 transition-colors',
                  notification.read ? 'border-border bg-card' : 'border-primary/25 bg-primary-muted/40',
                )}
              >
                <span className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', toneDot[notification.tone as keyof typeof toneDot] ?? 'bg-muted-foreground')} aria-hidden="true" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <ChannelBadge channel={notification.channel} size="sm" />
                    {!notification.read ? <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.body}</p>
                  <p className="text-xs text-muted-foreground" title={formatTimestamp(notification.sentAt)}>
                    {formatRelative(notification.sentAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {notification.href ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link to={notification.href} onClick={() => markNotificationRead(notification.id)}>
                        View
                      </Link>
                    </Button>
                  ) : null}
                  {!notification.read ? (
                    <Button variant="ghost" size="sm" onClick={() => markNotificationRead(notification.id)}>
                      <BellRing aria-hidden="true" />
                      Mark read
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
