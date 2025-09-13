import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuthStore from '@/stores/authStore';

const Layout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="h-screen flex overflow-hidden ">
      <Sidebar />
      
      <div className="flex flex-col flex-1 md:ml-72">
        <Navbar />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;