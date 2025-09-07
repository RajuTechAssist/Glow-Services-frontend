import React, { useState } from 'react';
import { Package, Calendar, Clock, MapPin, Star, Download, Eye } from 'lucide-react';

const CustomerOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders] = useState([
    {
      id: 'ORD-2025-001',
      date: '2025-09-05',
      services: ['Facial Treatment', 'Hair Styling'],
      total: 1800,
      status: 'completed',
      bookingDate: '2025-09-08',
      bookingTime: '2:00 PM',
      location: 'Home Service',
      address: '123 Park Street, Mumbai',
      staff: 'Priya Sharma',
      rating: 5,
      invoice: 'INV-001.pdf'
    },
    {
      id: 'ORD-2025-002',
      date: '2025-09-03',
      services: ['Professional Manicure', 'Pedicure'],
      total: 900,
      status: 'upcoming',
      bookingDate: '2025-09-10',
      bookingTime: '11:00 AM',
      location: 'Salon Visit',
      address: 'Glow Services Salon, Bandra',
      staff: 'Anjali Verma',
      rating: null,
      invoice: null
    },
    {
      id: 'ORD-2025-003',
      date: '2025-08-28',
      services: ['Full Body Waxing'],
      total: 2000,
      status: 'cancelled',
      bookingDate: '2025-08-30',
      bookingTime: '3:00 PM',
      location: 'Home Service',
      address: '123 Park Street, Mumbai',
      staff: null,
      rating: null,
      invoice: null
    }
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      processing: 'bg-yellow-100 text-yellow-800'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your beauty service bookings</p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'upcoming', label: 'Upcoming', count: orders.filter(o => o.status === 'upcoming').length },
              { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
              { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={getStatusBadge(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-xl font-bold text-gray-900 mt-2">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-pink-500" />
                      Services Booked
                    </h4>
                    <div className="space-y-2">
                      {order.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      Appointment Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(order.bookingDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{order.bookingTime}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{order.location}</p>
                          <p className="text-gray-600">{order.address}</p>
                        </div>
                      </div>
                      {order.staff && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                          <span>Beautician: {order.staff}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {order.status === 'completed' && order.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Your rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {order.status === 'completed' && !order.rating && (
                      <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                        Rate Service
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {order.invoice && (
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                        <span>Invoice</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    {order.status === 'upcoming' && (
                      <button className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders in this category yet.</p>
            <button
              onClick={() => window.location.href = '/services'}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Book Your First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
