import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, TrendingUp, Calendar, DollarSign, 
  Star, Activity, Plus, Eye, AlertCircle, CheckCircle, Clock,
  BarChart3, ShoppingCart, Briefcase, Sparkles, Heart, Scissors
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const navigate = useNavigate();

  // Beauty business specific stats
  const [stats, setStats] = useState({
    totalServices: 12,
    totalProducts: 45,
    totalCustomers: 234,
    totalCategories: 8,
    monthlyRevenue: 125000,
    pendingBookings: 8,
    completedBookings: 156,
    averageRating: 4.8,
    lowStockProducts: 3,
    activeServices: 12,
    activeProducts: 42,
    revPATH: 85, // Revenue per Available Treatment Hour
    treatmentOccupancy: 78, // Treatment room occupancy %
    staffUtilization: 82, // Staff utilization %
    customerRetention: 68, // Customer retention rate %
    averageTicketSize: 850, // Average ticket size
    blogPosts: 24,
    blogViews: 15420,
    totalBlogs: 24
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Quick Action Click Handlers
  const handleQuickAction = (action) => {
    console.log(`🎯 Beauty Admin Quick Action: ${action}`);

    try {
      switch (action) {
        case 'service':
          navigate('/admin/services/create');
          break;
        case 'product':
          navigate('/admin/products/create');
          break;
        case 'customer':
          navigate('/admin/customers/create');
          break;
        case 'category':
          navigate('/admin/categories/create');
          break;
        case 'blog':
          navigate('/admin/blogs/create');
          break;
        case 'analytics':
          navigate('/admin/analytics');
          break;
        default:
          console.warn('Unknown quick action:', action);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert(`Failed to navigate to ${action} page. Checking routes...`);
    }
  };

  const BeautyStatCard = ({ title, value, icon: Icon, color, description, trend, suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}{suffix}</p>
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
          <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      {/* Header - Beauty Business Style */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Sparkles className="w-8 h-8 text-pink-600 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Glow Services Dashboard
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Welcome back, {adminUser?.fullName || 'Admin'}! ✨ 
          Here's your beauty business overview.
        </p>
      </div>

      {/* Beauty Business KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BeautyStatCard
          title="Total Services"
          value={stats.totalServices}
          icon={Scissors}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
          description={`${stats.activeServices} active services`}
          trend={8}
        />
        <BeautyStatCard
          title="Beauty Products"
          value={stats.totalProducts}
          icon={Heart}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          description={`${stats.lowStockProducts} low stock`}
          trend={12}
        />
        <BeautyStatCard
          title="Happy Clients"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-gradient-to-br from-rose-500 to-rose-600"
          description="Registered customers"
          trend={15}
        />
        <BeautyStatCard
          title="Service Categories"
          value={stats.totalCategories}
          icon={BarChart3}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          description="Beauty & wellness"
        />
      </div>

      {/* Beauty Business Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BeautyStatCard
          title="RevPATH"
          value={stats.revPATH}
          suffix="₹"
          icon={TrendingUp}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          description="Revenue per treatment hour"
          trend={18}
        />
        <BeautyStatCard
          title="Room Occupancy"
          value={stats.treatmentOccupancy}
          suffix="%"
          icon={Calendar}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          description="Treatment rooms"
          trend={-3}
        />
        <BeautyStatCard
          title="Staff Utilization"
          value={stats.staffUtilization}
          suffix="%"
          icon={Users}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          description="Therapist efficiency"
          trend={5}
        />
        <BeautyStatCard
          title="Avg. Ticket Size"
          value={`₹${stats.averageTicketSize}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-green-600"
          description="Per customer spend"
          trend={22}
        />
      </div>

      {/* Revenue & Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BeautyStatCard
          title="Monthly Revenue"
          value={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-600 to-emerald-600"
          description="This month's earnings"
          trend={25}
        />
        <BeautyStatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
          color="bg-gradient-to-br from-yellow-500 to-amber-500"
          description="Awaiting confirmation"
        />
        <BeautyStatCard
          title="Completed Services"
          value={stats.completedBookings}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-green-500"
          description="This month"
          trend={12}
        />
      </div>

      {/* ✅ FIXED: Beauty Business Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Sparkles className="w-6 h-6 text-pink-600 mr-2" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Add Service */}
          <button
            onClick={() => handleQuickAction('service')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-pink-100 hover:border-pink-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl mr-4 group-hover:from-pink-200 group-hover:to-pink-300">
              <Scissors className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">Add Beauty Service</h3>
              <p className="text-sm text-gray-600">Create new treatment</p>
            </div>
          </button>

          {/* Add Product */}
          <button
            onClick={() => handleQuickAction('product')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 hover:border-purple-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mr-4 group-hover:from-purple-200 group-hover:to-purple-300">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Add Beauty Product</h3>
              <p className="text-sm text-gray-600">Add to catalog</p>
            </div>
          </button>

          {/* Add Customer */}
          <button
            onClick={() => handleQuickAction('customer')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-rose-50 hover:to-rose-100 hover:border-rose-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl mr-4 group-hover:from-rose-200 group-hover:to-rose-300">
              <Users className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-rose-600">Add New Client</h3>
              <p className="text-sm text-gray-600">Register customer</p>
            </div>
          </button>

          {/* Add Category */}
          <button
            onClick={() => handleQuickAction('category')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 hover:border-indigo-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl mr-4 group-hover:from-indigo-200 group-hover:to-indigo-300">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Add Category</h3>
              <p className="text-sm text-gray-600">Organize services</p>
            </div>
          </button>

          {/* Add Blog Post */}
          <button
            onClick={() => handleQuickAction('blog')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mr-4 group-hover:from-blue-200 group-hover:to-blue-300">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Write Beauty Blog</h3>
              <p className="text-sm text-gray-600">Share beauty tips</p>
            </div>
          </button>

          {/* View Analytics */}
          <button
            onClick={() => handleQuickAction('analytics')}
            className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-300 transition-all duration-300 text-left group"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl mr-4 group-hover:from-emerald-200 group-hover:to-emerald-300">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">View Analytics</h3>
              <p className="text-sm text-gray-600">Business insights</p>
            </div>
          </button>

        </div>
      </div>

      {/* Beauty Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 text-pink-600 mr-2" />
            Recent Beauty Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="p-2 bg-pink-100 rounded-full">
                <Scissors className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New facial treatment booked</p>
                <p className="text-sm text-gray-600">Advanced Anti-Aging Facial - Priya Sharma</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Product order received</p>
                <p className="text-sm text-gray-600">Vitamin C Serum - 5 units</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">5-star review received</p>
                <p className="text-sm text-gray-600">"Amazing spa experience!" - Anjali M.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New blog post published</p>
                <p className="text-sm text-gray-600">"Summer Skincare Tips" - 234 views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
            Beauty Business Performance
          </h3>
          <div className="space-y-4">

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Customer Satisfaction</span>
                  <p className="text-xs text-gray-600">Average rating from reviews</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-emerald-600">{stats.averageRating}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Client Retention</span>
                  <p className="text-xs text-gray-600">Repeat customers</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.customerRetention}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Blog Engagement</span>
                  <p className="text-xs text-gray-600">{stats.totalBlogs} posts published</p>
                </div>
              </div>
              <span className="text-xl font-bold text-purple-600">{(stats.blogViews / 1000).toFixed(1)}K views</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Growth Rate</span>
                  <p className="text-xs text-gray-600">Monthly growth</p>
                </div>
              </div>
              <span className="text-xl font-bold text-pink-600">+18%</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;