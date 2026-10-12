import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/** Guards authenticated routes. No session -> /auth. */
export function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
