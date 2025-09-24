import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { Plus, Search, Edit, Trash2, Filter, Star, Eye, EyeOff, MoreVertical } from 'lucide-react';


const ServicesAdminPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState(null);

  const BACKEND_URL = 'https://glow-services.onrender.com';

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

  // ✅ EFFECT TO FETCH BOTH CATEGORIES AND SERVICES
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        // Fetch Categories
        const catResponse = await ApiService.getPublicCategories();
        setCategories([{ id: 'all', name: 'All Categories' }, ...catResponse]);

        // Fetch Services
        const serviceResponse = await fetch(
          `${BACKEND_URL}/api/admin/services?category=${filterCategory}`,
          { headers }
        );
        
        if (!serviceResponse.ok) throw new Error(`HTTP ${serviceResponse.status}`);
        
        const serviceData = await serviceResponse.json();
        setServices(serviceData);

      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterCategory]);


  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(
        `${BACKEND_URL}/api/admin/services`, 
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (serviceId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== serviceId));
        alert('Service deleted successfully!');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const filteredServices = services.filter(service => {
    if (!searchTerm) return true;
    return service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCategoryChange = (newCategory) => {
    setFilterCategory(newCategory);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4">Loading services...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchServices}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-pink-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Service Management
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/services/create')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>
        <p className="text-gray-600 mt-2 ml-11">
          Manage your beauty services and treatments
        </p>
      </div>

      {/* Search and Filter */}
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
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {categories.map(category => (
                <option key={category.id || category.slug} value={category.slug || 'all'}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.slug || service.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                  {service.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => navigate(`/admin/services/edit/${service.slug || service.id}`)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(service.slug || service.id, service.name)}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {service.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900">₹{service.price}</span>
                {service.duration && <span className="text-gray-500">{service.duration}</span>}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first service.'}
          </p>
          {(!searchTerm && filterCategory === 'all') && (
            <button
              onClick={() => navigate('/admin/services/create')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Create First Service
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesAdminPage;