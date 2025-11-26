import config from '../../config';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
    type: 'SERVICE',
    active: true,
    sortOrder: 0
  });

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

  const categoryTypes = [
    { value: 'SERVICE', label: 'Service Category', description: 'For beauty services like facials, massages, etc.' },
    { value: 'PRODUCT', label: 'Product Category', description: 'For beauty products like skincare, makeup, etc.' },
    { value: 'BOTH', label: 'Service & Product Category', description: 'For categories that include both services and products' }
  ];

  const iconOptions = [
    { value: '✨', label: '✨ Sparkles', category: 'General' },
    { value: '💄', label: '💄 Makeup', category: 'Beauty' },
    { value: '🧴', label: '🧴 Skincare', category: 'Beauty' },
    { value: '💇', label: '💇 Hair Care', category: 'Beauty' },
    { value: '💅', label: '💅 Nail Care', category: 'Beauty' },
    { value: '🛁', label: '🛁 Bath & Body', category: 'Beauty' },
    { value: '🌸', label: '🌸 Fragrance', category: 'Beauty' },
    { value: '🎀', label: '🎀 Tools & Accessories', category: 'Beauty' },
    { value: '💎', label: '💎 Premium', category: 'Luxury' },
    { value: '🌿', label: '🌿 Natural & Organic', category: 'Natural' },
    { value: '🪒', label: '🪒 Hair Removal', category: 'Beauty' },
    { value: '💆', label: '💆 Massage & Spa', category: 'Wellness' },
    { value: '🧘', label: '🧘 Wellness', category: 'Wellness' },
    { value: '🎨', label: '🎨 Creative', category: 'General' },
    { value: '⭐', label: '⭐ Featured', category: 'General' }
  ];

  const colorOptions = [
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [isEdit, id]);

  // ✅ FIXED: Added JWT auth to fetchCategory
  const fetchCategory = async () => {
    try {
      setLoading(true);

      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${id}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert('Failed to load category');
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('Failed to load category');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (form.name.trim().length > 100) {
      newErrors.name = 'Category name cannot exceed 100 characters';
    }

    if (!form.slug.trim()) {
      newErrors.slug = 'Category slug is required';
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (form.description && form.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!form.type) {
      newErrors.type = 'Category type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-generate slug when name changes (only for new categories)
    if (field === 'name' && !isEdit) {
      const slug = value.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = isEdit ? `${BACKEND_URL}/api/admin/categories/${id}` : `${BACKEND_URL}/api/admin/categories`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...form,
          sortOrder: parseInt(form.sortOrder) || 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/categories');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        if (data.message) {
          alert(`Failed to save category: ${data.message}`);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600">Loading category...</span>
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
            onClick={() => navigate('/admin/categories')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <span className="text-2xl mr-2">✨</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Category' : 'Create New Category'}
            </h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2 ml-12">
          {isEdit ? 'Update category information' : 'Add a new category for services or products'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter category name..."
                disabled={saving}
              />
              {errors.name && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Category Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.slug ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="category-slug"
                disabled={saving}
              />
              {errors.slug && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.slug}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                URL-friendly version of the name (lowercase, hyphens only)
              </p>
            </div>

            {/* Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={saving}
              >
                {categoryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.type}
                </div>
              )}
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Icon
              </label>
              <div className="grid grid-cols-6 gap-3">
                {iconOptions.map(icon => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => handleChange('icon', icon.value)}
                    className={`p-3 rounded-lg border-2 text-lg hover:shadow-md transition-all ${
                      form.icon === icon.value
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    disabled={saving}
                  >
                    {icon.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className={`w-10 h-10 rounded-lg ${color.class} border-4 hover:scale-110 transition-transform ${
                      form.color === color.value ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    disabled={saving}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter category description..."
                disabled={saving}
              />
              {errors.description && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="0"
                disabled={saving}
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first in lists
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                disabled={saving}
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                Active (visible to users)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/categories')}
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
                <span>{saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;