
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, TrendingUp, Calendar, DollarSign, 
  Star, Activity, Plus, Eye, AlertCircle, CheckCircle, Clock,
  BarChart3, ShoppingCart, Briefcase
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalCategories: 0,
    monthlyRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    lowStockProducts: 0,
    activeServices: 0,
    activeProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const BACKEND_URL = 'https://glow-services.onrender.com';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch multiple endpoints in parallel
      const promises = [
        fetchServices(),
        fetchProducts(), 
        fetchCustomers(),
        fetchCategories()
      ];

      await Promise.allSettled(promises);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/services`);
      if (response.ok) {
        const services = await response.json();
        setStats(prev => ({
          ...prev,
          totalServices: services.length,
          activeServices: services.filter(s => s.active).length
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch services:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (response.ok) {
        const products = await response.json();
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          activeProducts: products.filter(p => p.active).length,
          lowStockProducts: products.filter(p => p.stockQuantity < 10).length
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch products:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/customers`);
      if (response.ok) {
        const customers = await response.json();
        setStats(prev => ({
          ...prev,
          totalCustomers: customers.length
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch customers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories`);
      if (response.ok) {
        const categories = await response.json();
        setStats(prev => ({
          ...prev,
          totalCategories: categories.length
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch categories:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {adminUser?.fullName || adminUser?.username || 'Admin'}! 
          Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Services"
          value={loading ? '...' : stats.totalServices}
          icon={Briefcase}
          color="bg-blue-500"
          description={`${stats.activeServices} active`}
        />
        <StatCard
          title="Total Products"
          value={loading ? '...' : stats.totalProducts}
          icon={Package}
          color="bg-green-500"
          description={`${stats.lowStockProducts} low stock`}
        />
        <StatCard
          title="Total Customers"
          value={loading ? '...' : stats.totalCustomers}
          icon={Users}
          color="bg-purple-500"
          description="Registered users"
        />
        <StatCard
          title="Categories"
          value={loading ? '...' : stats.totalCategories}
          icon={BarChart3}
          color="bg-indigo-500"
          description="Service & product categories"
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-600"
          trend={12}
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
          color="bg-yellow-500"
          description="Awaiting confirmation"
        />
        <StatCard
          title="Completed Bookings"
          value={stats.completedBookings}
          icon={CheckCircle}
          color="bg-emerald-500"
          description="This month"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/services/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Service</h3>
              <p className="text-sm text-gray-600">Create new service</p>
            </div>
          </Link>

          <Link
            to="/admin/products/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-600">Add to catalog</p>
            </div>
          </Link>

          <Link
            to="/admin/customers/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Customer</h3>
              <p className="text-sm text-gray-600">Register new customer</p>
            </div>
          </Link>

          <Link
            to="/admin/categories/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-indigo-100 rounded-lg mr-4">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Category</h3>
              <p className="text-sm text-gray-600">Create new category</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backend API</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Services</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-blue-600">{stats.activeServices} Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {stats.lowStockProducts > 0 && (
              <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                  <p className="text-sm text-yellow-700">{stats.lowStockProducts} products running low</p>
                </div>
              </div>
            )}

            <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">System Updated</p>
                <p className="text-sm text-green-700">All systems are running smoothly</p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Dashboard Loaded</p>
                <p className="text-sm text-blue-700">Welcome to your admin panel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
