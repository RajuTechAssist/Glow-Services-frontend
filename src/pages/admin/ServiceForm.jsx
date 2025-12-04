import config from '../../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Check, Palette } from 'lucide-react';
import ApiService from '../../services/api';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '', // ✅ Added missing field
    category: '',
    price: '',
    originalPrice: '',
    duration: '',
    rating: 4.5,
    reviews: 0,
    features: [],
    benefits: [],
    services: [], // For Combo services
    popular: false,
    active: true,
    image: '',  
    gallery: [],
    gradient: 'from-pink-500 to-purple-500' // ✅ Added missing field
  });

  const [isUploading, setIsUploading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newService, setNewService] = useState('');

  const BACKEND_URL = config.BASE_URL;

  // Gradient options for card styling
  const gradientOptions = [
    { label: 'Pink-Purple', value: 'from-pink-500 to-purple-500' },
    { label: 'Blue-Cyan', value: 'from-blue-500 to-cyan-500' },
    { label: 'Green-Emerald', value: 'from-green-500 to-emerald-500' },
    { label: 'Orange-Red', value: 'from-orange-500 to-red-500' },
    { label: 'Indigo-Purple', value: 'from-indigo-500 to-purple-500' },
    { label: 'Rose-Red', value: 'from-rose-400 to-red-500' },
    { label: 'Teal-Blue', value: 'from-teal-400 to-blue-500' },
    { label: 'Gold-Orange', value: 'from-yellow-400 to-orange-500' }
  ];

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
    const fetchCategories = async () => {
      try {
        const categoryData = await ApiService.getPublicCategories();
        setCategories(categoryData);
        if (categoryData.length > 0 && !isEdit) {
          setFormData(prev => ({ ...prev, category: categoryData[0].slug }));
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      fetchService();
    }
  }, [isEdit, id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/services`, { headers });
      if (response.ok) {
        const services = await response.json();
        // Find service by ID since admin endpoint returns all
        const service = services.find(s => s.id.toString() === id);

        if (service) {
          setFormData({
            ...service,
            longDescription: service.longDescription || '', // Ensure not null
            features: service.features || [],
            benefits: service.benefits || [],
            services: service.services || [],
            gallery: service.gallery || [],
            gradient: service.gradient || 'from-pink-500 to-purple-500'
          });
        }
      } 
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  };

  const handleNameChange = (value) => {
    handleInputChange('name', value);
    if (!isEdit) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await ApiService.uploadFile(file);
      if (field === 'gallery') {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
      } else {
        setFormData(prev => ({ ...prev, [field]: url }));
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = isEdit ? `${BACKEND_URL}/api/admin/services/${id}` : `${BACKEND_URL}/api/admin/services`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          duration: String(formData.duration)
        })
      });

      if (response.ok) {
        alert(`Service ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/admin/services');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      alert('Error saving service: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/services')} className="p-2 bg-white rounded-lg border hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Service' : 'Create Service'}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
              <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
              <input type="text" value={formData.slug} onChange={(e) => handleInputChange('slug', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" required />
            </div>
          </div>

          {/* 2. Category & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full p-3 border rounded-lg" required>
                <option value="">Select...</option>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (e.g. 30 mins)</label>
              <input type="text" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input type="number" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input type="number" value={formData.originalPrice} onChange={(e) => handleInputChange('originalPrice', e.target.value)} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          {/* 3. Visual Styling (Gradient) - ✅ NEW SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Card Color Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {gradientOptions.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => handleInputChange('gradient', opt.value)}
                  className={`h-12 rounded-lg cursor-pointer bg-gradient-to-r ${opt.value} relative flex items-center justify-center transition-all ${formData.gradient === opt.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                  title={opt.label}
                >
                  {formData.gradient === opt.value && <Check className="text-white w-5 h-5 drop-shadow-md" />}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Descriptions - ✅ ADDED LONG DESCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={5} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description (Long)</label>
              <textarea 
                value={formData.longDescription} 
                onChange={(e) => handleInputChange('longDescription', e.target.value)} 
                rows={5} 
                className="w-full p-3 border rounded-lg" 
                placeholder="Explain the service process, benefits, and details here..."
              />
            </div>
          </div>

          {/* 5. Features & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Add feature" />
                <button type="button" onClick={() => addItem('features', newFeature, setNewFeature)} className="bg-blue-600 text-white p-2 rounded-lg"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((f, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {f} <X className="w-3 h-3 cursor-pointer" onClick={() => removeItem('features', i)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Add benefit" />
                <button type="button" onClick={() => addItem('benefits', newBenefit, setNewBenefit)} className="bg-green-600 text-white p-2 rounded-lg"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((b, i) => (
                  <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {b} <X className="w-3 h-3 cursor-pointer" onClick={() => removeItem('benefits', i)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Combo Services (If applicable) */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Included Services (For Combos)</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="e.g. Manicure" />
              <button type="button" onClick={() => addItem('services', newService, setNewService)} className="bg-purple-600 text-white p-2 rounded-lg"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((s, i) => (
                <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {s} <X className="w-3 h-3 cursor-pointer" onClick={() => removeItem('services', i)} />
                </span>
              ))}
            </div>
          </div>

          {/* 7. Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <input type="file" onChange={(e) => handleUpload(e, 'image')} className="w-full" disabled={isUploading} />
              {formData.image && <img src={formData.image} alt="Main" className="mt-4 w-full h-40 object-cover rounded-lg border" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
              <input type="file" onChange={(e) => handleUpload(e, 'gallery')} className="w-full" disabled={isUploading} />
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {formData.gallery.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 flex-shrink-0">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeItem('gallery', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Status & Submit */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={(e) => handleInputChange('active', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                <span className="text-gray-700 font-medium">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.popular} onChange={(e) => handleInputChange('popular', e.target.checked)} className="w-5 h-5 text-yellow-500 rounded" />
                <span className="text-gray-700 font-medium">Popular</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/admin/services')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Service</>}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ServiceForm;