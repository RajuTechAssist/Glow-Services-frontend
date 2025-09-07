import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Settings, 
  Home, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Star,
  Package2,
  UserCheck,
  Megaphone,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

  const navigation = [
    // OVERVIEW
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: BarChart3, 
      current: location.pathname === '/admin/dashboard',
      section: 'overview'
    },

    // BUSINESS MANAGEMENT
    { 
      name: 'Bookings', 
      href: '/admin/bookings', 
      icon: Calendar, 
      current: location.pathname.startsWith('/admin/bookings'),
      badge: '8',
      section: 'business'
    },
    
    { 
      name: 'Services', 
      href: '/admin/services', 
      icon: Package, 
      current: location.pathname.startsWith('/admin/services'),
      section: 'business'
    },
    
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: ShoppingBag, 
      current: location.pathname.startsWith('/admin/products'),
      section: 'business'
    },

    // PEOPLE
    { 
      name: 'Customers', 
      href: '/admin/customers', 
      icon: Users, 
      current: location.pathname.startsWith('/admin/customers'),
      section: 'people'
    },
    
    { 
      name: 'Staff', 
      href: '/admin/staff', 
      icon: UserCheck, 
      current: location.pathname.startsWith('/admin/staff'),
      section: 'people'
    },

    // OPERATIONS
    { 
      name: 'Orders', 
      href: '/admin/orders', 
      icon: ShoppingCart, 
      current: location.pathname.startsWith('/admin/orders'),
      section: 'operations'
    },
    
    { 
      name: 'Inventory', 
      href: '/admin/inventory', 
      icon: Package2, 
      current: location.pathname.startsWith('/admin/inventory'),
      badge: '3',
      section: 'operations'
    },

    // INSIGHTS
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: TrendingUp, 
      current: location.pathname.startsWith('/admin/analytics'),
      section: 'insights'
    },
    
    { 
      name: 'Reviews', 
      href: '/admin/reviews', 
      icon: Star, 
      current: location.pathname.startsWith('/admin/reviews'),
      section: 'insights'
    },

    // GROWTH
    { 
      name: 'Marketing', 
      href: '/admin/marketing', 
      icon: Megaphone, 
      current: location.pathname.startsWith('/admin/marketing'),
      section: 'growth'
    },

    // SYSTEM
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings, 
      current: location.pathname.startsWith('/admin/settings'),
      section: 'system'
    }
  ];

  // Group navigation by sections
  const navigationSections = {
    overview: navigation.filter(item => item.section === 'overview'),
    business: navigation.filter(item => item.section === 'business'),
    people: navigation.filter(item => item.section === 'people'),
    operations: navigation.filter(item => item.section === 'operations'),
    insights: navigation.filter(item => item.section === 'insights'),
    growth: navigation.filter(item => item.section === 'growth'),
    system: navigation.filter(item => item.section === 'system')
  };

  const renderNavItem = (item) => (
    <NavLink
      key={item.name}
      to={item.href}
      onClick={() => onClose && onClose()} // Close sidebar on mobile after click
      className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        item.current
          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <item.icon
          className={`mr-3 h-4 w-4 ${
            item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
          }`}
        />
        {item.name}
      </div>
      {item.badge && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          item.current 
            ? 'bg-white bg-opacity-20 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-pink-600 to-purple-600 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 rounded-md p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Admin info */}
        <div className="px-6 py-4 bg-gray-50 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{adminUser?.fullName || 'Admin'}</p>
              <p className="text-xs text-gray-500">{adminUser?.role || 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          
          {/* Overview */}
          <div>
            {navigationSections.overview.map(renderNavItem)}
          </div>

          {/* Business Management */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Business
            </h3>
            <div className="space-y-1">
              {navigationSections.business.map(renderNavItem)}
            </div>
          </div>

          {/* People */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              People
            </h3>
            <div className="space-y-1">
              {navigationSections.people.map(renderNavItem)}
            </div>
          </div>

          {/* Operations */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Operations
            </h3>
            <div className="space-y-1">
              {navigationSections.operations.map(renderNavItem)}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Insights
            </h3>
            <div className="space-y-1">
              {navigationSections.insights.map(renderNavItem)}
            </div>
          </div>

          {/* Growth */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Growth
            </h3>
            <div className="space-y-1">
              {navigationSections.growth.map(renderNavItem)}
            </div>
          </div>

          {/* System */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              System
            </h3>
            <div className="space-y-1">
              {navigationSections.system.map(renderNavItem)}
            </div>
          </div>
        </nav>

        {/* Bottom section - Fixed */}
        <div className="px-4 py-4 border-t space-y-2 flex-shrink-0">
          <button
            onClick={() => {
              navigate('/');
              onClose && onClose();
            }}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Home className="mr-3 h-4 w-4 text-gray-500" />
            Back to Website
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
