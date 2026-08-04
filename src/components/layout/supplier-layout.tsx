import { ClipboardList } from 'lucide-react';
import DashboardShell, { type NavSection } from '@/components/layout/dashboard-shell';

/**
 * The supplier area is deliberately narrow. Partners see the deliveries
 * assigned to them and nothing else — no member contact details, no pricing,
 * no other suppliers' work.
 */
const sections: NavSection[] = [
  {
    items: [{ label: 'Assigned deliveries', to: '/supplier', Icon: ClipboardList, end: true }],
  },
];

export default function SupplierLayout() {
  return (
    <DashboardShell
      sections={sections}
      areaLabel="Operations partner"
      restrictedNotice="Restricted view. Suppliers see only the deliveries assigned to them, with the customer area rather than the full address."
    />
  );
}
