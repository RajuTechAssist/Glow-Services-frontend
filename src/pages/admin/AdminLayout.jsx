import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Home } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        
        {/* Admin Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{adminUser?.fullName || 'Admin'}</h3>
              <p className="text-sm text-gray-400">{adminUser?.role || 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink 
            to="/admin/services" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Manage Services</span>
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Manage Products</span>
          </NavLink>

          <NavLink 
            to="/admin/customers" 
            className={({isActive}) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <User className="h-5 w-5" />
            <span>Manage Customers</span>
          </NavLink>

          <div className="border-t border-gray-700 pt-4 mt-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 w-full"
            >
              <Home className="h-5 w-5" />
              <span>Back to Website</span>
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminUser?.fullName || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
