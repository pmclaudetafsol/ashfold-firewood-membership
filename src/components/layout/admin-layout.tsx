import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Gift,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  Sparkles,
  Tag,
  Truck,
  Users,
} from 'lucide-react';
import DashboardShell, { type NavSection } from '@/components/layout/dashboard-shell';

const sections: NavSection[] = [
  {
    items: [{ label: 'Dashboard overview', to: '/admin', Icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Members',
    items: [
      { label: 'Customers', to: '/admin/customers', Icon: Users },
      { label: 'Memberships', to: '/admin/memberships', Icon: Sparkles },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Deliveries', to: '/admin/deliveries', Icon: Package },
      { label: 'Delivery calendar', to: '/admin/calendar', Icon: CalendarDays },
      { label: 'Suppliers', to: '/admin/suppliers', Icon: Truck },
    ],
  },
  {
    title: 'Commercial',
    items: [
      { label: 'Payments', to: '/admin/payments', Icon: CreditCard },
      { label: 'Promotional codes', to: '/admin/promotions', Icon: Tag },
      { label: 'Referrals', to: '/admin/referrals', Icon: Gift },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Communications', to: '/admin/communications', Icon: Megaphone },
      { label: 'Reports', to: '/admin/reports', Icon: BarChart3 },
      { label: 'Platform settings', to: '/admin/settings', Icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  return (
    <DashboardShell
      sections={sections}
      areaLabel="Administrator"
      restrictedNotice="Administrator area. Actions update the demonstration state in this browser only."
      accountHref="/admin/settings"
    />
  );
}
