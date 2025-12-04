import config from '../../config';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { 
  Plus, Search, Edit, Trash2, Filter, Star, 
  Eye, EyeOff, MoreVertical, AlertTriangle, X 
} from 'lucide-react';

const ServicesAdminPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState(null);

  // Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    serviceId: null,
    serviceName: ''
  });

  const BACKEND_URL = config.BASE_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Authentication error. Please log in again.');
      navigate('/admin/login');
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchData();
  }, [filterCategory]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Categories
      const categoryData = await ApiService.getPublicCategories();
      setCategories([{ id: 'all', name: 'All Categories', slug: 'all' }, ...categoryData]);

      // Services
      const headers = getAuthHeaders();
      if (!headers) return;

      const serviceResponse = await fetch(`${BACKEND_URL}/api/admin/services`, { headers });
      if (!serviceResponse.ok) throw new Error(`HTTP ${serviceResponse.status}`);
      
      const serviceData = await serviceResponse.json();
      
      let filteredServices = serviceData;
      if (filterCategory && filterCategory !== 'all') {
        filteredServices = serviceData.filter(service => service.category === filterCategory);
      }
      setServices(filteredServices);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. OPEN MODAL
  const confirmDelete = (id, name) => {
    setDeleteModal({ isOpen: true, serviceId: id, serviceName: name });
  };

  // 2. HARD DELETE (Permanent)
  const handlePermanentDelete = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/services/${deleteModal.serviceId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setServices(services.filter(s => s.id !== deleteModal.serviceId));
        setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' });
      } else {
        alert('Failed to delete service.');
      }
    } catch (error) {
      alert('Error deleting service');
    }
  };

  // 3. SOFT DELETE (Make Inactive)
  const handleSoftDelete = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      // First get the current service data to preserve other fields
      const currentService = services.find(s => s.id === deleteModal.serviceId);
      
      const response = await fetch(`${BACKEND_URL}/api/admin/services/${deleteModal.serviceId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...currentService,
          active: false // Only change status
        })
      });

      if (response.ok) {
        // Update local state to reflect inactive status
        setServices(services.map(s => 
          s.id === deleteModal.serviceId ? { ...s, active: false } : s
        ));
        setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' });
      } else {
        alert('Failed to deactivate service.');
      }
    } catch (error) {
      alert('Error updating service');
    }
  };

  // Filter local results
  const filteredServices = services.filter(service => {
    if (!searchTerm) return true;
    return service.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 relative">
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <button 
                  onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Service?
              </h3>
              <p className="text-gray-600 mb-6">
                What would you like to do with <strong>"{deleteModal.serviceName}"</strong>?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSoftDelete}
                  className="w-full py-3 px-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold rounded-xl border border-yellow-200 transition-all flex items-center justify-center group"
                >
                  <EyeOff className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Make Inactive (Hide from users)
                </button>

                <button
                  onClick={handlePermanentDelete}
                  className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl border border-red-200 transition-all flex items-center justify-center group"
                >
                  <Trash2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Delete Permanently (Cannot undo)
                </button>

                <button
                  onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                  className="w-full py-3 px-4 text-gray-500 font-medium hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-pink-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Service Management
            </h1>
          </div>
          <Link
            to="/admin/services/create"
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              {categories.map(category => (
                <option key={category.id || category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all ${
                !service.active ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <div className="flex gap-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                      {service.category}
                    </span>
                    {!service.active && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <Link
                      to={`/admin/services/edit/${service.id}`}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => confirmDelete(service.id, service.name)}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">₹{service.price}</span>
                {service.duration && <span className="text-gray-500">{service.duration} mins</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesAdminPage;