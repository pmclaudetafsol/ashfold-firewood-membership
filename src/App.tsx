import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LoadingState } from '@/components/ui/states';
import PublicLayout from '@/components/layout/public-layout';
import CustomerLayout from '@/components/layout/customer-layout';
import AdminLayout from '@/components/layout/admin-layout';
import SupplierLayout from '@/components/layout/supplier-layout';

/* Public */
import HomePage from '@/pages/public/home';
import HowItWorksPage from '@/pages/public/how-it-works';
import PlansPage from '@/pages/public/plans';
import AboutPage from '@/pages/public/about';
import FaqPage from '@/pages/public/faq';
import ContactPage from '@/pages/public/contact';
import SignInPage from '@/pages/public/sign-in';
import NotFoundPage from '@/pages/public/not-found';

/* Registration */
import RegisterPage from '@/pages/register/register';

/* Customer — the dashboard is the heaviest area, so it is split out of the
   initial bundle. The public site is what most visitors load first. */
const CustomerOverview = lazy(() => import('@/pages/customer/overview'));
const CustomerCalendar = lazy(() => import('@/pages/customer/calendar'));
const CustomerDeliveryDetail = lazy(() => import('@/pages/customer/delivery-detail'));
const CustomerMembership = lazy(() => import('@/pages/customer/membership'));
const CustomerPayments = lazy(() => import('@/pages/customer/payments'));
const CustomerReferrals = lazy(() => import('@/pages/customer/referrals'));
const CustomerNotifications = lazy(() => import('@/pages/customer/notifications'));
const CustomerSettings = lazy(() => import('@/pages/customer/settings'));
const CustomerSupport = lazy(() => import('@/pages/customer/support'));

/* Admin */
const AdminOverview = lazy(() => import('@/pages/admin/overview'));
const AdminCustomers = lazy(() => import('@/pages/admin/customers'));
const AdminMemberships = lazy(() => import('@/pages/admin/memberships'));
const AdminDeliveries = lazy(() => import('@/pages/admin/deliveries'));
const AdminCalendar = lazy(() => import('@/pages/admin/calendar'));
const AdminSuppliers = lazy(() => import('@/pages/admin/suppliers'));
const AdminPayments = lazy(() => import('@/pages/admin/payments'));
const AdminPromotions = lazy(() => import('@/pages/admin/promotions'));
const AdminReferrals = lazy(() => import('@/pages/admin/referrals'));
const AdminCommunications = lazy(() => import('@/pages/admin/communications'));
const AdminReports = lazy(() => import('@/pages/admin/reports'));
const AdminSettings = lazy(() => import('@/pages/admin/settings'));

/* Supplier */
const SupplierOverview = lazy(() => import('@/pages/supplier/overview'));

/** Restores the top of the page on navigation, as a full page load would. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingState label="Loading the demonstration" />}>
        <Routes>
          {/* ── Public website ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
          </Route>

          {/* ── Registration and mock checkout ── */}
          <Route path="/join" element={<RegisterPage />} />

          {/* ── Customer dashboard ── */}
          <Route path="/dashboard" element={<CustomerLayout />}>
            <Route index element={<CustomerOverview />} />
            <Route path="calendar" element={<CustomerCalendar />} />
            <Route path="deliveries/:deliveryId" element={<CustomerDeliveryDetail />} />
            <Route path="membership" element={<CustomerMembership />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="referrals" element={<CustomerReferrals />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="settings" element={<CustomerSettings />} />
            <Route path="support" element={<CustomerSupport />} />
          </Route>

          {/* ── Administrator dashboard ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="memberships" element={<AdminMemberships />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="communications" element={<AdminCommunications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── Supplier / operations preview ── */}
          <Route path="/supplier" element={<SupplierLayout />}>
            <Route index element={<SupplierOverview />} />
          </Route>

          <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
