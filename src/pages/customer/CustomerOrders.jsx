import React, { useEffect, useState } from 'react';
import { Package, Calendar, Clock, MapPin, Star, Download, Eye } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import config from '../../config';

const CustomerOrders = () => {
  const { customerUser } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerUser?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.API_BASE_URL}/customers/${customerUser.id}/orders?status=${activeTab}`);
        if (!res.ok) throw new Error('Unable to load orders');
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerUser, activeTab]);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
      upcoming: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
      processing: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`;
  };

  const normalizeStatus = (status) => (status || 'pending').toLowerCase();

  const filteredOrders = orders.filter(order => {
    const status = normalizeStatus(order.status);
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return status !== 'completed' && status !== 'cancelled';
    return status === activeTab;
  });

  if (!customerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Loading your orders...</p>
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your beauty service bookings</p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-8 transition-colors duration-200">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'upcoming', label: 'Upcoming', count: orders.filter(o => {
                const status = normalizeStatus(o.status);
                return status !== 'completed' && status !== 'cancelled';
              }).length },
              { key: 'completed', label: 'Completed', count: orders.filter(o => normalizeStatus(o.status) === 'completed').length },
              { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => normalizeStatus(o.status) === 'cancelled').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const statusLabel = normalizeStatus(order.status);
            const total = Number(order.total || 0);
            return (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-200">
              
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Placed on {order.date ? new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={getStatusBadge(statusLabel)}>
                      {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                    </span>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-pink-500" />
                      Services Booked
                    </h4>
                    <div className="space-y-2">
                      {(order.services || []).map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      Appointment Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>
                          {order.bookingDate ? new Date(order.bookingDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : '—'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{order.bookingTime || '—'}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{order.location || '—'}</p>
                          <p className="text-gray-600 dark:text-gray-400">{order.address || order.city || order.pincode || '—'}</p>
                        </div>
                      </div>
                      {order.staff && (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                          <span>Beautician: {order.staff}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    {statusLabel === 'completed' && order.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Your rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {statusLabel === 'completed' && !order.rating && (
                      <button className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium text-sm">
                        Rate Service
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {order.invoice && (
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                        <span>Invoice</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    {statusLabel !== 'completed' && statusLabel !== 'cancelled' && (
                      <button className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );})}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders in this category yet.</p>
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
