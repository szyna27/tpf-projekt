import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  return <Navigate to={user ? '/stats' : '/login'} replace />;
}