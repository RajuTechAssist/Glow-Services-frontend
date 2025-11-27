import config from '../../config';
import ApiService from '../../services/api';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Plus, X } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'skincare',
    subCategory: '',
    price: 0,
    originalPrice: '',
    stockQuantity: 0,
    lowStockThreshold: 10,
    brand: '',
    description: '',
    shortDescription: '',
    productCode: '',
    sku: '',
    images: [],
    ingredients: [],
    benefits: [],
    howToUse: '',
    featured: false,
    active: true
  });

  const [newImage, setNewImage] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

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

  const categories = [
    { value: 'skincare', label: 'Skincare' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'haircare', label: 'Hair Care' },
    { value: 'bodycare', label: 'Body Care' },
    { value: 'fragrance', label: 'Fragrance' },
    { value: 'tools', label: 'Beauty Tools' },
    { value: 'accessories', label: 'Accessories' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [isEdit]);

  // ✅ FIXED: Added JWT auth to fetchProduct
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setForm({
          ...data,
          images: data.images || [],
          ingredients: data.ingredients || [],
          benefits: data.benefits || []
        });
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert('Failed to load product');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (value) => {
    handleChange('name', value);
    if (!isEdit) {
      handleChange('slug', generateSlug(value));
    }
  };

  const addToArray = (key, value, setValueFn) => {
    if (!value.trim()) return;
    setForm(prev => ({
      ...prev,
      [key]: [...prev[key], value.trim()]
    }));
    setValueFn('');
  };

  const removeFromArray = (key, index) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = isEdit 
        ? `${BACKEND_URL}/api/admin/products/${id}` 
        : `${BACKEND_URL}/api/admin/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
          originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
          stockQuantity: parseInt(form.stockQuantity) || 0,
          lowStockThreshold: parseInt(form.lowStockThreshold) || 10
        })
      });

      if (response.ok) {
        alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/products');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  // Add this state for loading status
  const [isUploading, setIsUploading] = useState(false);

  // Add this function to handle file selection
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to AWS via Backend
      const imageUrl = await ApiService.uploadFile(file);
      
      // Add URL to form state
      setForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  // Add this function to remove an image
  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <span className="text-2xl mr-2">📦</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Product' : 'Create New Product'}
            </h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2 ml-12">
          {isEdit ? 'Update product information' : 'Add a new beauty product'}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter product name..."
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="product-slug"
                  required
                  disabled={saving || isEdit}
                />
              </div>
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
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
                  Brand
                </label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Brand name..."
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code
                </label>
                <input
                  type="text"
                  value={form.productCode}
                  onChange={(e) => handleChange('productCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="PRD-001"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
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
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={form.stockQuantity}
                  onChange={(e) => handleChange('stockQuantity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="0"
                  min="0"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="10"
                  min="0"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Brief product description..."
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Detailed product description..."
                  disabled={saving}
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Benefits
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Add a benefit..."
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => addToArray('benefits', newBenefit, setNewBenefit)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center space-x-1"
                  disabled={saving}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeFromArray('benefits', index)}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                      disabled={saving}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>


              {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-pink-400 transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
                    <span className="text-sm text-gray-500">Uploading to cloud...</span>
                  </div>
                ) : (
                  <>
                    <input 
                        type="file" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        id="product-image-upload"
                        accept="image/*"
                    />
                    <label 
                        htmlFor="product-image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <div className="p-3 bg-pink-50 rounded-full mb-2">
                            <Plus className="w-6 h-6 text-pink-500" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">Click to Upload Image</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG supported</span>
                    </label>
                  </>
                )}
              </div>

              {/* Image Previews */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Product ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>



            {/* Status Toggles */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  disabled={saving}
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Featured Product
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => handleChange('active', e.target.checked)}
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
                onClick={() => navigate('/admin/products')}
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
                <span>{saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;