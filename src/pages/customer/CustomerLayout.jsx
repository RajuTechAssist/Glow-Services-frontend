import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Package, 
  Gift, 
  Clock, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const CustomerLayout = () => {
  const { customerUser, customerLogout } = useCustomerAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      customerLogout();
      navigate('/');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'My Profile', href: '/customer/profile', icon: User },
    { name: 'My Orders', href: '/customer/orders', icon: Package },
    { name: 'Rewards', href: '/customer/rewards', icon: Gift },
    { name: 'History', href: '/customer/history', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-white font-bold text-lg">My Account</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 rounded-md p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {customerUser?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {customerUser?.fullName || 'Customer'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">VIP Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Back to Website
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        
        {/* Top bar (mobile) */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 transition-colors duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
