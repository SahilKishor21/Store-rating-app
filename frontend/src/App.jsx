import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Users from './pages/Users';
import MyRatings from './components/user/MyRatings';
import StoreDashboard from './components/store-owner/StoreDashboard';
import StoreManagement from './components/admin/StoreManagement';
import RatingsManagement from './components/admin/RatingsManagement';
import useAuthStore from './stores/authStore';
import useThemeStore from './stores/themeStore';
import { USER_ROLES } from './utils/constants';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/stores" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    const redirectPath = user?.role === USER_ROLES.ADMIN ? '/dashboard' : '/stores';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  const { initializeAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/stores" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="admin/stores" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <StoreManagement />
              </ProtectedRoute>
            } />
            <Route path="admin/ratings" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <RatingsManagement />
              </ProtectedRoute>
            } />
            <Route path="stores" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.USER, USER_ROLES.ADMIN]}>
                <Stores />
              </ProtectedRoute>
            } />
            <Route path="my-ratings" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                <MyRatings />
              </ProtectedRoute>
            } />
            <Route path="store-dashboard" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER]}>
                <StoreDashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <div>Profile - Coming Soon</div>
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <div>Settings - Coming Soon</div>
              </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
