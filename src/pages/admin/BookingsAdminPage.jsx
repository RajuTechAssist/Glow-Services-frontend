import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  IndianRupee,
  Mail,
  MapPin,
  Check,
  X,
  RefreshCw
} from 'lucide-react';

const BookingsAdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // To track which row is updating
  
  // Filter States
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    try {
      setProcessingId(id);
      await api.updateBookingStatus(id, newStatus);
      
      // Refresh data locally to reflect changes immediately
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, status: newStatus } : b
      ));
      
      alert(`Booking #${id} marked as ${newStatus}`);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- Derived Data & Stats ---
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      booking.customer?.fullName?.toLowerCase().includes(searchLower) ||
      booking.service?.name?.toLowerCase().includes(searchLower) ||
      booking.id?.toString().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    revenue: bookings
      .filter(b => b.status !== 'CANCELLED') // Don't count cancelled revenue
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
  };

  // --- UI Helpers ---
  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-200"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  if (loading && bookings.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 mt-1">Track appointments and process requests</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={fetchBookings}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Bookings" 
          value={stats.total} 
          icon={Calendar} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Action Required" 
          value={stats.pending} 
          icon={AlertCircle} 
          color="text-yellow-600" 
          bg="bg-yellow-50" 
        />
        <StatCard 
          title="Confirmed" 
          value={stats.confirmed} 
          icon={CheckCircle} 
          color="text-green-600" 
          bg="bg-green-50" 
        />
        <StatCard 
          title="Est. Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={IndianRupee} 
          color="text-pink-600" 
          bg="bg-pink-50" 
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customer, service or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Customer */}
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-bold mr-3">
                          {booking.customer?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer?.fullName || 'Guest'}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {booking.customer?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{booking.service?.name}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1 max-w-[150px] truncate">
                         <MapPin className="w-3 h-3 mr-1" />
                         {booking.address || booking.serviceLocation}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {booking.bookingDate}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-2 text-gray-400" />
                        {booking.bookingTime}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">₹{booking.totalPrice}</span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {processingId === booking.id ? (
                          <span className="text-xs text-pink-600 animate-pulse">Updating...</span>
                        ) : (
                          <>
                            {booking.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                  title="Confirm Booking"
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                  title="Cancel Booking"
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                               <button 
                               onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                               title="Mark as Completed"
                               className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium px-3"
                             >
                               Complete
                             </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">No bookings found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export default BookingsAdminPage;