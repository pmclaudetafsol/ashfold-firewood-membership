import * as React from 'react';
import type {
  AppNotification,
  Customer,
  Delivery,
  DeliveryStatus,
  DemoRole,
  DemoSession,
  PlanTier,
  PromotionCode,
  Supplier,
} from '@/types';
import { customers as seedCustomers, PRIMARY_CUSTOMER_ID } from '@/data/customers';
import { operationalDeliveries } from '@/data/deliveries';
import { notifications as seedNotifications } from '@/data/notifications';
import { promotionCodes as seedPromotions } from '@/data/referrals';
import { suppliers as seedSuppliers, PRIMARY_SUPPLIER_ID } from '@/data/suppliers';
import { deliveryStatusLabels } from '@/components/shared/status-badge';
import { toast } from '@/hooks/use-toast';

/**
 * The demonstration's single source of mutable state.
 *
 * Everything lives in React state and resets on reload — there is no backend,
 * no persistence and no network. The shape of the actions below is the shape a
 * real data layer would expose, so swapping this provider for React Query
 * against a live API would not change any calling component.
 */

interface DemoState {
  session: DemoSession | null;
  customers: Customer[];
  deliveries: Delivery[];
  suppliers: Supplier[];
  notifications: AppNotification[];
  promotions: PromotionCode[];
}

interface DemoContextValue extends DemoState {
  /* Session */
  signInAs: (role: DemoRole) => void;
  signOut: () => void;
  isSignedIn: boolean;
  currentCustomer: Customer | null;
  currentSupplier: Supplier | null;

  /* Deliveries */
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, note?: string) => void;
  rescheduleDelivery: (deliveryId: string, date: string, window?: string) => void;
  assignSupplier: (deliveryId: string, supplierId: string | null) => void;
  updateDeliveryNotes: (deliveryId: string, notes: string) => void;

  /* Membership */
  changePlan: (customerId: string, planId: PlanTier) => void;
  setMembershipStatus: (customerId: string, status: Customer['membershipStatus']) => void;
  updateCustomer: (customerId: string, patch: Partial<Customer>) => void;

  /* Notifications */
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  /* Promotions */
  togglePromotion: (id: string) => void;
  addPromotion: (promotion: PromotionCode) => void;
  updatePromotion: (id: string, patch: Partial<PromotionCode>) => void;

  /* Registration */
  completeRegistration: (customer: Customer, deliveries?: Delivery[]) => void;
}

const DemoContext = React.createContext<DemoContextValue | null>(null);

const demoSessions: Record<DemoRole, DemoSession> = {
  customer: {
    role: 'customer',
    name: 'Eleanor Whitfield',
    email: 'eleanor.whitfield@example.co.uk',
    linkedId: PRIMARY_CUSTOMER_ID,
  },
  admin: {
    role: 'admin',
    name: 'Rachel Adeyemi',
    email: 'rachel.adeyemi@example.co.uk',
    linkedId: null,
  },
  supplier: {
    role: 'supplier',
    name: 'Tom Hedley',
    email: 'tom.hedley@example.co.uk',
    linkedId: PRIMARY_SUPPLIER_ID,
  },
};

export const demoSessionFor = (role: DemoRole): DemoSession => demoSessions[role];

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<DemoSession | null>(null);
  const [customers, setCustomers] = React.useState<Customer[]>(seedCustomers);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>(operationalDeliveries);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(seedSuppliers);
  const [notifications, setNotifications] = React.useState<AppNotification[]>(seedNotifications);
  const [promotions, setPromotions] = React.useState<PromotionCode[]>(seedPromotions);

  const patchDelivery = React.useCallback((deliveryId: string, patch: Partial<Delivery>) => {
    setDeliveries((current) =>
      current.map((delivery) => (delivery.id === deliveryId ? { ...delivery, ...patch } : delivery)),
    );
  }, []);

  const updateDeliveryStatus = React.useCallback<DemoContextValue['updateDeliveryStatus']>(
    (deliveryId, status, note) => {
      setDeliveries((current) =>
        current.map((delivery) => {
          if (delivery.id !== deliveryId) return delivery;
          const event = {
            id: `ev-${Date.now()}`,
            at: new Date().toISOString(),
            label: deliveryStatusLabels[status],
            detail: note ?? 'Updated in the demonstration.',
          };
          return {
            ...delivery,
            status,
            deliveredAt: status === 'delivered' ? new Date().toISOString() : delivery.deliveredAt,
            timeline: [...delivery.timeline, event],
          };
        }),
      );
      toast({
        title: `Marked as ${deliveryStatusLabels[status].toLowerCase()}`,
        description: 'Demonstration only — the change is held in the browser.',
        variant: 'success',
      });
    },
    [],
  );

  const rescheduleDelivery = React.useCallback<DemoContextValue['rescheduleDelivery']>(
    (deliveryId, date, window) => {
      setDeliveries((current) =>
        current.map((delivery) => {
          if (delivery.id !== deliveryId) return delivery;
          return {
            ...delivery,
            scheduledDate: date,
            window: window ?? delivery.window,
            status: delivery.status === 'delayed' ? 'scheduled' : delivery.status,
            timeline: [
              ...delivery.timeline,
              {
                id: `ev-${Date.now()}`,
                at: new Date().toISOString(),
                label: 'Rescheduled',
                detail: `Moved to ${date.split('-').reverse().join('/')}.`,
              },
            ],
          };
        }),
      );
      toast({
        title: 'Delivery rescheduled',
        description: 'Demonstration only — no confirmation has been sent.',
        variant: 'success',
      });
    },
    [],
  );

  const assignSupplier = React.useCallback<DemoContextValue['assignSupplier']>(
    (deliveryId, supplierId) => {
      const supplier = suppliers.find((candidate) => candidate.id === supplierId) ?? null;
      patchDelivery(deliveryId, { supplierId, supplierName: supplier?.name ?? null });
      toast({
        title: supplier ? `Assigned to ${supplier.name}` : 'Supplier removed',
        variant: 'success',
      });
    },
    [patchDelivery, suppliers],
  );

  const updateDeliveryNotes = React.useCallback<DemoContextValue['updateDeliveryNotes']>(
    (deliveryId, notes) => {
      patchDelivery(deliveryId, { operationalNotes: notes });
      toast({ title: 'Notes saved', variant: 'success' });
    },
    [patchDelivery],
  );

  const updateCustomer = React.useCallback<DemoContextValue['updateCustomer']>((customerId, patch) => {
    setCustomers((current) =>
      current.map((customer) => (customer.id === customerId ? { ...customer, ...patch } : customer)),
    );
  }, []);

  const changePlan = React.useCallback<DemoContextValue['changePlan']>(
    (customerId, planId) => {
      updateCustomer(customerId, { planId });
      toast({
        title: 'Membership plan updated',
        description: 'The new plan applies from your next delivery.',
        variant: 'success',
      });
    },
    [updateCustomer],
  );

  const setMembershipStatus = React.useCallback<DemoContextValue['setMembershipStatus']>(
    (customerId, status) => {
      updateCustomer(customerId, { membershipStatus: status });
      toast({ title: `Membership set to ${status}`, variant: 'success' });
    },
    [updateCustomer],
  );

  const markNotificationRead = React.useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  }, []);

  const markAllNotificationsRead = React.useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    toast({ title: 'All notifications marked as read', variant: 'success' });
  }, []);

  const togglePromotion = React.useCallback((id: string) => {
    setPromotions((current) =>
      current.map((promotion) => (promotion.id === id ? { ...promotion, active: !promotion.active } : promotion)),
    );
  }, []);

  const addPromotion = React.useCallback((promotion: PromotionCode) => {
    setPromotions((current) => [promotion, ...current]);
    toast({ title: `Promotional code ${promotion.code} created`, variant: 'success' });
  }, []);

  const updatePromotion = React.useCallback((id: string, patch: Partial<PromotionCode>) => {
    setPromotions((current) => current.map((promotion) => (promotion.id === id ? { ...promotion, ...patch } : promotion)));
    toast({ title: 'Promotional code updated', variant: 'success' });
  }, []);

  const completeRegistration = React.useCallback((customer: Customer, newDeliveries?: Delivery[]) => {
    setCustomers((current) => [customer, ...current.filter((existing) => existing.id !== customer.id)]);
    if (newDeliveries?.length) {
      setDeliveries((current) => [
        ...newDeliveries,
        ...current.filter((delivery) => delivery.customerId !== customer.id),
      ]);
    }
    setSession({
      role: 'customer',
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      linkedId: customer.id,
    });
  }, []);

  const signInAs = React.useCallback((role: DemoRole) => {
    setSession(demoSessions[role]);
  }, []);

  const signOut = React.useCallback(() => {
    setSession(null);
    toast({ title: 'Signed out of the demonstration' });
  }, []);

  const currentCustomer = React.useMemo(() => {
    if (session?.role !== 'customer' || !session.linkedId) return null;
    return customers.find((customer) => customer.id === session.linkedId) ?? null;
  }, [customers, session]);

  const currentSupplier = React.useMemo(() => {
    if (session?.role !== 'supplier' || !session.linkedId) return null;
    return suppliers.find((supplier) => supplier.id === session.linkedId) ?? null;
  }, [session, suppliers]);

  const unreadCount = React.useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const value = React.useMemo<DemoContextValue>(
    () => ({
      session,
      customers,
      deliveries,
      suppliers,
      notifications,
      promotions,
      signInAs,
      signOut,
      isSignedIn: session !== null,
      currentCustomer,
      currentSupplier,
      updateDeliveryStatus,
      rescheduleDelivery,
      assignSupplier,
      updateDeliveryNotes,
      changePlan,
      setMembershipStatus,
      updateCustomer,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
      togglePromotion,
      addPromotion,
      updatePromotion,
      completeRegistration,
    }),
    [
      session,
      customers,
      deliveries,
      suppliers,
      notifications,
      promotions,
      signInAs,
      signOut,
      currentCustomer,
      currentSupplier,
      updateDeliveryStatus,
      rescheduleDelivery,
      assignSupplier,
      updateDeliveryNotes,
      changePlan,
      setMembershipStatus,
      updateCustomer,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
      togglePromotion,
      addPromotion,
      updatePromotion,
      completeRegistration,
    ],
  );

  // `setSuppliers` is retained for future supplier admin actions; referencing
  // it here keeps the setter in scope without an unused-variable warning.
  void setSuppliers;

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = React.useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used inside <DemoProvider>.');
  }
  return context;
}

/** Convenience hook for the customer area, which always has a customer. */
export function useCurrentCustomer(): Customer {
  const { currentCustomer, customers } = useDemo();
  // Falls back to the primary demo account so a deep link into the dashboard
  // renders sensibly even before a demo persona has been chosen.
  return currentCustomer ?? customers.find((customer) => customer.id === PRIMARY_CUSTOMER_ID) ?? customers[0]!;
}

/** Convenience hook for the supplier area, which always has a supplier. */
export function useCurrentSupplier(): Supplier {
  const { currentSupplier, suppliers } = useDemo();
  return currentSupplier ?? suppliers.find((supplier) => supplier.id === PRIMARY_SUPPLIER_ID) ?? suppliers[0]!;
}
