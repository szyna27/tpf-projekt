import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import Plans from './pages/plans/index';
import HomeRedirect from './components/guards/HomeRedirect';
import ProtectedRoute from './components/guards/ProtectedRoute';
import PublicOnlyRoute from './components/guards/PublicOnlyRoute';
import ActivationResult from './pages/auth/ActivationResult';
import ChangePassword from './pages/auth/ChangePassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PasswordReset from './pages/auth/PasswordReset';
import PasswordResetConfirm from './pages/auth/PasswordResetConfirm';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } />
        <Route path="/register" element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        } />
        <Route path="/password-reset" element={
          <PublicOnlyRoute>
            <PasswordReset />
          </PublicOnlyRoute>
        } />
        <Route path="/password-reset/confirm/:uid/:token" element={
          <PublicOnlyRoute>
            <PasswordResetConfirm />
          </PublicOnlyRoute>
        } />
        <Route path="/activate/:uid/:token" element={<ActivationResult />} />
        <Route path="/activated" element={<ActivationResult />} />
        <Route
          path="/password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}
