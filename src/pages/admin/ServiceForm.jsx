import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

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

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://glow-services.onrender.com/api/services/${slug}`);
      if (response.ok) {
        const service = await response.json();
        setFormData({
          ...service,
          features: service.features || [],
          benefits: service.benefits || [],
          services: service.services || []
        });
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      alert('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    e.preventDefault(); // ✅ Prevent GET request
    setSaving(true);

    try {
      const url = isEdit
        ? `https://glow-services.onrender.com/api/admin/services/${slug}`
        : 'https://glow-services.onrender.com/api/admin/services';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
        })
      });

      if (response.ok) {
        alert(`Service ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/services');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error saving service:', error);
      alert('Failed to save service: ' + error.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading service...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Service' : 'Create New Service'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter service name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="service-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="60 mins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Optional)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="650.00"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Brief description for cards and previews"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Detailed description for service page"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>

          <div className="space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Benefits</h2>

          <div className="space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Combo Services (only show if category is combo) */}
        {formData.category === 'combo' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Combo Services</h2>

            <div className="space-y-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add a service to combo"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                min="0"
                max="5"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                value={formData.reviews}
                onChange={(e) => handleInputChange('reviews', e.target.value)}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient Color
              </label>
              <select
                value={formData.gradient}
                onChange={(e) => handleInputChange('gradient', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {gradientOptions.map(gradient => (
                  <option key={gradient} value={gradient}>
                    {gradient}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => handleInputChange('popular', e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">Popular Service</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
