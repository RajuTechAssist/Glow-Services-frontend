import config from '../../config';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, MoreVertical, Eye, EyeOff, Star } from 'lucide-react';

const CategoriesAdminPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [error, setError] = useState(null);

  const BACKEND_URL = config.BASE_URL;

  // ✅ JWT Authentication Helper Function
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
    fetchCategories();
  }, []);

  // ✅ Updated fetchCategories with JWT auth
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated handleDelete with JWT auth
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id));
        alert('Category deleted successfully!');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  // ✅ Updated toggleStatus with JWT auth
  const toggleStatus = async (id, currentStatus) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${id}/toggle-status`, {
        method: 'PATCH',
        headers
      });

      if (response.ok) {
        setCategories(categories.map(cat => 
          cat.id === id ? { ...cat, active: !currentStatus } : cat
        ));
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || category.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (icon) => {
    return icon || '✨';
  };

  const getCategoryBadgeClass = (type) => {
    switch (type) {
      case 'SERVICE':
        return 'bg-blue-100 text-blue-800';
      case 'PRODUCT':
        return 'bg-green-100 text-green-800';
      case 'BOTH':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
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
            onClick={fetchCategories}
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
              Category Management
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/categories/create')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>
        <p className="text-gray-600 mt-2 ml-11">
          Organize your beauty services and products into categories
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="ALL">All Types</option>
              <option value="SERVICE">Services</option>
              <option value="PRODUCT">Products</option>
              <option value="BOTH">Both</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-${category.color || 'pink'}-100 flex items-center justify-center text-xl`}>
                  {getCategoryIcon(category.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryBadgeClass(category.type)}`}>
                    {category.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStatus(category.id, category.active)}
                  className={`p-2 rounded-lg transition-colors ${
                    category.active 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={category.active ? 'Active' : 'Inactive'}
                >
                  {category.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {category.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Sort Order: {category.sortOrder || 0}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                category.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType !== 'ALL' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first category.'}
          </p>
          {(!searchTerm && filterType === 'ALL') && (
            <button
              onClick={() => navigate('/admin/categories/create')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Create First Category
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesAdminPage;