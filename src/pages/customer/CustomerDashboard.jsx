import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Star, 
  Gift, 
  Settings, 
  User,
  Package,
  TrendingUp,
  Heart,
  Bell,
  Award
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import config from '../../config';

const CustomerDashboard = () => {
  const { customerUser } = useCustomerAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: [],
    recentOrders: [],
    loyaltyPoints: 0,
    tier: 'Basic',
    totalSpent: 0,
    servicesCompleted: 0,
    favoriteServices: [],
    memberSince: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!customerUser?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.API_BASE_URL}/customers/${customerUser.id}/dashboard`);
        if (!res.ok) throw new Error('Unable to load dashboard');
        const data = await res.json();
        setDashboardData({
          upcomingBookings: data.upcomingBookings || [],
          recentOrders: data.recentOrders || [],
          loyaltyPoints: data.loyaltyPoints || 0,
          tier: data.tier || 'Basic',
          totalSpent: data.totalSpent || 0,
          servicesCompleted: data.servicesCompleted || 0,
          favoriteServices: (data.favoriteServices || []).filter(Boolean),
          memberSince: data.memberSince || null
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [customerUser]);

  if (!customerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 p-4">
            {error}
          </div>
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {customerUser?.fullName || 'Valued Customer'}! ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your beauty journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loyalty Points</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{dashboardData.loyaltyPoints}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/customer/rewards" className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium">
                Redeem Points →
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{dashboardData.totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">VIP Member Status</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services Done</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboardData.servicesCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/customer/history" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View History →
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dashboardData.memberSince ? new Date(dashboardData.memberSince).toLocaleDateString() : '—'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">{dashboardData.tier} Member</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Bookings & Orders */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                  Upcoming Appointments
                </h3>
                <Link to="/services" className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium">
                  Book New →
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.upcomingBookings.length === 0 && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm">No upcoming appointments yet. Book your first service to get started.</div>
                )}
                {dashboardData.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-pink-300 dark:hover:border-pink-500 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{booking.service}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {booking.time}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {booking.staff}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                          {booking.status}
                        </span>
                        <button className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Orders
                </h3>
                <Link to="/customer/orders" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentOrders.length === 0 && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm">No orders yet. Once you book a service, it will show up here.</div>
                )}
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{(order.items || []).join(', ')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{order.date ? new Date(order.date).toLocaleDateString() : '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">₹{Number(order.total || 0).toLocaleString()}</p>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs transition-colors duration-200">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Rewards */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  to="/services"
                  className="w-full flex items-center space-x-3 p-4 bg-pink-50 dark:bg-pink-900/10 hover:bg-pink-100 dark:hover:bg-pink-900/20 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Book Service</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Schedule new appointment</p>
                  </div>
                </Link>

                <Link
                  to="/customer/profile"
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Manage Profile</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update preferences</p>
                  </div>
                </Link>

                <Link
                  to="/customer/rewards"
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Rewards</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Redeem {dashboardData.loyaltyPoints} points</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Favorite Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Your Favorites
              </h3>
              <div className="space-y-3">
                {dashboardData.favoriteServices.length === 0 && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm">No favorites yet. Book services to see your favorites here.</div>
                )}
                {dashboardData.favoriteServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
                    <span className="font-medium text-gray-900 dark:text-white">{service}</span>
                    <Link
                      to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offers */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Special Offer Just for You! 🎉</h3>
              <p className="text-pink-100 mb-4">Get 20% off your next facial treatment + complimentary head massage</p>
              <button className="w-full bg-white text-pink-600 dark:text-pink-500 font-semibold py-3 px-4 rounded-xl hover:bg-pink-50 transition-colors duration-200">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
