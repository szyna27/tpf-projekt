import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (user) return <Navigate to="/stats" replace />;
  return children;
}
