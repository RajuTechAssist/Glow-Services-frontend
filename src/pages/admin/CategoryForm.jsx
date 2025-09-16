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

    const BACKEND_URL = 'https://glow-services.onrender.com';

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

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/admin/categories/${id}`);
            if (response.ok) {
                const data = await response.json();
                setForm(data);
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
            const url = isEdit 
                ? `${BACKEND_URL}/api/admin/categories/${id}`
                : `${BACKEND_URL}/api/admin/categories`;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    sortOrder: parseInt(form.sortOrder) || 0
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
                navigate('/admin/categories');
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
            <div className="p-6 flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => navigate('/admin/categories')}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEdit ? 'Edit Category' : 'Create Category'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEdit ? 'Update category information' : 'Add a new category for services or products'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter category name"
                                />
                                {errors.name && (
                                    <div className="mt-1 flex items-center text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.slug}
                                    onChange={(e) => handleChange('slug', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.slug ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="category-slug"
                                />
                                {errors.slug && (
                                    <div className="mt-1 flex items-center text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.slug}
                                    </div>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    URL-friendly version of the name (lowercase, hyphens only)
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Category description (optional)"
                            />
                            {errors.description && (
                                <div className="mt-1 flex items-center text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.description}
                                </div>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {form.description.length}/1000 characters
                            </p>
                        </div>
                    </div>

                    {/* Category Type */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Type</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categoryTypes.map(type => (
                                <label key={type.value} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.value}
                                        checked={form.type === type.value}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 border-2 rounded-lg transition-all ${
                                        form.type === type.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="font-medium text-gray-900">{type.label}</div>
                                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.type && (
                            <div className="mt-2 flex items-center text-sm text-red-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.type}
                            </div>
                        )}
                    </div>

                    {/* Visual Settings */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Icon
                                </label>
                                <select
                                    value={form.icon}
                                    onChange={(e) => handleChange('icon', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Icon (Optional)</option>
                                    {iconOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {form.icon && (
                                    <div className="mt-2 flex items-center">
                                        <span className="text-2xl mr-2">{form.icon}</span>
                                        <span className="text-sm text-gray-500">Preview</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color Theme
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => handleChange('color', color.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                form.color === color.value
                                                    ? 'border-gray-800'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full mx-auto ${color.class}`}></div>
                                            <div className="text-xs mt-1">{color.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) => handleChange('sortOrder', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Lower numbers appear first in lists
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={form.active}
                                        onChange={(e) => handleChange('active', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                                        Active (visible to users)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/categories')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;