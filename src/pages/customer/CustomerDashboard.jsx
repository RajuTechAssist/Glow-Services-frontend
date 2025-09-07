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

const CustomerDashboard = () => {
  const { customerUser } = useCustomerAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: [
      {
        id: 1,
        service: 'Facial Treatment',
        date: '2025-09-10',
        time: '2:00 PM',
        staff: 'Priya Sharma',
        status: 'confirmed'
      },
      {
        id: 2,
        service: 'Professional Manicure',
        date: '2025-09-15',
        time: '11:00 AM',
        staff: 'Anjali Verma',
        status: 'confirmed'
      }
    ],
    recentOrders: [
      {
        id: 'ORD-001',
        date: '2025-09-01',
        items: ['Facial Treatment', 'Hair Styling'],
        total: 1800,
        status: 'completed'
      },
      {
        id: 'ORD-002',
        date: '2025-08-28',
        items: ['Professional Manicure'],
        total: 500,
        status: 'completed'
      }
    ],
    loyaltyPoints: 1250,
    totalSpent: 8450,
    servicesCompleted: 12,
    favoriteServices: ['Facial Treatment', 'Professional Manicure', 'Hair Styling']
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {customerUser?.fullName || 'Valued Customer'}! ✨
          </h1>
          <p className="text-gray-600">Here's what's happening with your beauty journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                <p className="text-2xl font-bold text-pink-600">{dashboardData.loyaltyPoints}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/customer/rewards" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                Redeem Points →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">₹{dashboardData.totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">VIP Member Status</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Done</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.servicesCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/customer/history" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View History →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-purple-600">Jan 2024</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">Loyal Customer</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Bookings & Orders */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                  Upcoming Appointments
                </h3>
                <Link to="/services" className="text-pink-600 hover:text-pink-700 font-medium">
                  Book New →
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{booking.service}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
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
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {booking.status}
                        </span>
                        <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Orders
                </h3>
                <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600 mt-1">{order.items.join(', ')}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total}</p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  to="/services"
                  className="w-full flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Book Service</p>
                    <p className="text-sm text-gray-600">Schedule new appointment</p>
                  </div>
                </Link>

                <Link
                  to="/customer/profile"
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Profile</p>
                    <p className="text-sm text-gray-600">Update preferences</p>
                  </div>
                </Link>

                <Link
                  to="/customer/rewards"
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rewards</p>
                    <p className="text-sm text-gray-600">Redeem {dashboardData.loyaltyPoints} points</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Favorite Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Your Favorites
              </h3>
              <div className="space-y-3">
                {dashboardData.favoriteServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{service}</span>
                    <Link
                      to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-pink-600 hover:text-pink-700 text-sm font-medium"
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
              <button className="w-full bg-white text-pink-600 font-semibold py-3 px-4 rounded-xl hover:bg-pink-50 transition-colors duration-200">
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
