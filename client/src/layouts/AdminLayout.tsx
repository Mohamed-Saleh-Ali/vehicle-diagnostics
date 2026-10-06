import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/StatusViews';

export default function AdminLayout() {
  const { user, isAdmin, checkingSession } = useAuth();

  if (checkingSession) return <Loading label="Restoring your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: '/admin/parts' }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
