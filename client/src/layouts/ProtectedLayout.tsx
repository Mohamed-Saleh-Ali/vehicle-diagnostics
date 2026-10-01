import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/StatusViews';

// UX only, the API checks the token anyway
export default function ProtectedLayout() {
  const { user, checkingSession } = useAuth();
  const location = useLocation();

  if (checkingSession) return <Loading label="Restoring your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
