import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const ServiceForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    category: 'facial',
    price: '',
    originalPrice: '',
    duration: '',
    rating: 4.5,
    reviews: 0,
    features: [],
    benefits: [],
    services: [],
    popular: false,
    active: true,
    gradient: 'from-pink-500 to-purple-500'
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newService, setNewService] = useState('');

  const BACKEND_URL = 'https://glow-services.onrender.com';

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

  const categories = [
    { value: 'facial', label: 'Facial & Clean Up' },
    { value: 'waxing', label: 'Waxing & Hair Removal' },
    { value: 'nails', label: 'Nail Care' },
    { value: 'body', label: 'Body Care' },
    { value: 'makeup', label: 'Makeup & Bridal' },
    { value: 'threading', label: 'Threading & Bleach' },
    { value: 'combo', label: 'Combo Offers' }
  ];

  const gradientOptions = [
    'from-pink-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-purple-500'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchService();
    }
  }, [isEdit, slug]);

  // ✅ FIXED: Added JWT auth to fetchService
  const fetchService = async () => {
    try {
      setLoading(true);

      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/services/${slug}`, {
        headers
      });

      if (response.ok) {
        const service = await response.json();
        setFormData({
          ...service,
          features: service.features || [],
          benefits: service.benefits || [],
          services: service.services || []
        });
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert('Failed to load service');
        navigate('/admin/services');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      alert('Failed to load service');
      navigate('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value) => {
    handleInputChange('name', value);
    if (!isEdit) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = isEdit 
        ? `${BACKEND_URL}/api/admin/services/${slug}` 
        : `${BACKEND_URL}/api/admin/services`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
        })
      });

      if (response.ok) {
        alert(`Service ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/services');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600">Loading service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <span className="text-2xl mr-2">✨</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Service' : 'Create New Service'}
            </h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2 ml-12">
          {isEdit ? 'Update service information' : 'Add a new beauty service'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter service name..."
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="service-slug"
                  required
                  disabled={saving || isEdit}
                />
              </div>
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                  disabled={saving}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="30"
                  min="1"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Brief description of the service..."
                required
                disabled={saving}
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Add a feature..."
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  disabled={saving}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                      disabled={saving}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => handleInputChange('popular', e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  disabled={saving}
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Popular Service
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  disabled={saving}
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/services')}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;