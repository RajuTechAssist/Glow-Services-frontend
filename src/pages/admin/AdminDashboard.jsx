import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingBag, TrendingUp, Calendar, DollarSign, Star, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate(); // ✅ ADD: For navigation
    const [stats, setStats] = useState({
        totalServices: 12,
        totalProducts: 45,
        totalCustomers: 234,
        monthlyRevenue: 125000,
        pendingBookings: 8,
        completedBookings: 156,
        averageRating: 4.8,
        lowStockProducts: 3
    });

    // ✅ ADD: Quick Action Click Handlers
    const handleQuickAction = (action) => {
        console.log(`📱 Quick action clicked: ${action}`);

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
                default:
                    console.warn('Unknown quick action:', action);
            }
        } catch (error) {
            console.error('Navigation error:', error);
            alert(`Failed to navigate to ${action} creation page. Please check if the route exists.`);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
            </div>

            {/* Stats Grid - Your Original Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Services */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Services</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalServices}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <ShoppingBag className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Your Original Layout with Working Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* ✅ FIXED: Add New Service - Now Clickable */}
                <button
                    onClick={() => handleQuickAction('service')}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left"
                >
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add New Service</h3>
                            <p className="text-gray-600">Create a new service offering</p>
                        </div>
                    </div>
                </button>

                {/* ✅ FIXED: Add New Product - Now Clickable */}
                <button
                    onClick={() => handleQuickAction('product')}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 text-left"
                >
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-green-100 rounded-full mr-4">
                            <ShoppingBag className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                            <p className="text-gray-600">Add product to catalog</p>
                        </div>
                    </div>
                </button>

                {/* ✅ FIXED: Add Customer - Now Clickable */}
                <button
                    onClick={() => handleQuickAction('customer')}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 text-left"
                >
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-purple-100 rounded-full mr-4">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add Customer</h3>
                            <p className="text-gray-600">Register new customer</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Add Category Quick Action - New Addition */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                {/* ✅ NEW: Add Category - Working Button */}
                <button
                    onClick={() => handleQuickAction('category')}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200 text-left"
                >
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full mr-4">
                            <Star className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
                            <p className="text-gray-600">Create new category</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Recent Activity - Your Original Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">New booking received</p>
                                <p className="text-sm text-gray-600">Facial Treatment - Priya Sharma</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">New customer registered</p>
                                <p className="text-sm text-gray-600">Anjali Verma joined</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">New 5-star review</p>
                                <p className="text-sm text-gray-600">Excellent service! - Rahul M.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <Activity className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                                <p className="text-sm text-gray-600">{stats.lowStockProducts} products running low</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Average Rating</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                        </div>

                        <div className="text-sm text-gray-600">
                            Average rating from 247 reviews
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Completed Bookings</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.completedBookings}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Pending Bookings</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;