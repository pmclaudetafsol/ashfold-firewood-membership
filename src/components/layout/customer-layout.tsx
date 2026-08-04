import {
  Bell,
  CalendarDays,
  CreditCard,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Sparkles,
} from 'lucide-react';
import DashboardShell, { type NavSection } from '@/components/layout/dashboard-shell';
import { useDemo } from '@/state/demo-store';

export default function CustomerLayout() {
  const { unreadCount } = useDemo();

  const sections: NavSection[] = [
    {
      items: [
        { label: 'Overview', to: '/dashboard', Icon: LayoutDashboard, end: true },
        { label: 'Delivery calendar', to: '/dashboard/calendar', Icon: CalendarDays },
        { label: 'Membership', to: '/dashboard/membership', Icon: Sparkles },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Payments and invoices', to: '/dashboard/payments', Icon: CreditCard },
        { label: 'Referral centre', to: '/dashboard/referrals', Icon: Gift },
        { label: 'Notifications', to: '/dashboard/notifications', Icon: Bell, badge: unreadCount },
        { label: 'Account settings', to: '/dashboard/settings', Icon: Settings },
      ],
    },
    {
      title: 'Help',
      items: [{ label: 'Contact support', to: '/dashboard/support', Icon: LifeBuoy }],
    },
  ];

  return (
    <DashboardShell
      sections={sections}
      areaLabel="Member area"
      notificationsHref="/dashboard/notifications"
      accountHref="/dashboard/settings"
    />
  );
}
