import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TripDraftProvider } from '@/context/TripDraftContext';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { MockModeBanner } from '@/components/MockModeBanner';
import { AppLayout } from '@/components/AppLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Lazy-load every page so each tab is a separate chunk => smaller initial bundle.
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TripsListPage = lazy(() => import('@/pages/TripsListPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const TripDetailPage = lazy(() => import('@/pages/TripDetailPage'));
const TripEditPage = lazy(() => import('@/pages/TripEditPage'));
const WherePage = lazy(() => import('@/pages/trip/WherePage'));
const ServicePage = lazy(() => import('@/pages/trip/ServicePage'));
const RentPage = lazy(() => import('@/pages/trip/RentPage'));
const ShipPage = lazy(() => import('@/pages/trip/ShipPage'));
const ExtrasPage = lazy(() => import('@/pages/trip/ExtrasPage'));
const CheckoutPage = lazy(() => import('@/pages/trip/CheckoutPage'));

export default function App() {
  const { loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <MockModeBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Public: reachable from the landing/login too. */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />

        <Route element={<ProtectedRoute />}>
          {/* Primary tabs share the bottom navigation. */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/:id/edit" element={<TripEditPage />} />

          {/* Trip planning flow shares a single draft via TripDraftProvider. */}
          <Route
            element={
              <TripDraftProvider>
                <Outlet />
              </TripDraftProvider>
            }
          >
            <Route path="/trip/where" element={<WherePage />} />
            <Route path="/trip/service" element={<ServicePage />} />
            <Route path="/trip/rent" element={<RentPage />} />
            <Route path="/trip/ship" element={<ShipPage />} />
            <Route path="/trip/extras" element={<ExtrasPage />} />
            <Route path="/trip/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
