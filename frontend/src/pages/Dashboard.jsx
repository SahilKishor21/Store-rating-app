import React from 'react';
import AdminDashboard from '../components/admin/Dashboard';
import useAuthStore from '../stores/authStore';
import { USER_ROLES } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === USER_ROLES.ADMIN) {
    return <AdminDashboard />;
  }

  // Redirect non-admin users
  return (
    <div className="text-center py-12 bg-muted/50">
      <h2 className="text-2xl font-bold text-muted-foreground">
        Access Denied
      </h2>
      <p className="text-muted-foreground mt-2">
        You don't have permission to access this page.
      </p>
    </div>
  );
};

export default Dashboard;