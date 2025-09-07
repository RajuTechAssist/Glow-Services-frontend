import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, User, Menu } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  const { adminUser } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current page name
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path.startsWith('/admin/services')) return 'Services';
    if (path.startsWith('/admin/products')) return 'Products';
    if (path.startsWith('/admin/customers')) return 'Customers';
    if (path.startsWith('/admin/bookings')) return 'Bookings';
    if (path.startsWith('/admin/staff')) return 'Staff';
    if (path.startsWith('/admin/orders')) return 'Orders';
    if (path.startsWith('/admin/inventory')) return 'Inventory';
    if (path.startsWith('/admin/analytics')) return 'Analytics';
    if (path.startsWith('/admin/reviews')) return 'Reviews';
    if (path.startsWith('/admin/marketing')) return 'Marketing';
    if (path.startsWith('/admin/settings')) return 'Settings';
    return 'Admin Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar Component */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        
        {/* Top header bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left side - Mobile menu + Page title */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Page title */}
              <h1 className="text-2xl font-bold text-gray-900">
                {getCurrentPageName()}
              </h1>
            </div>
            
            {/* Right side - Actions & User */}
            <div className="flex items-center space-x-4">
              
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative focus:outline-none focus:ring-2 focus:ring-pink-500">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User info */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {adminUser?.fullName || 'Admin'}
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
