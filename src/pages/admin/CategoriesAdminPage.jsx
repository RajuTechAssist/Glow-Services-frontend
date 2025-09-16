import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';

const CategoriesAdminPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalCategories: 0,
        activeCategories: 0,
        serviceCategories: 0,
        productCategories: 0,
        bothCategories: 0
    });

    const BACKEND_URL = 'https://glow-services.onrender.com';

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/admin/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/categories/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchStats();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Category deleted successfully!');
                fetchCategories(); // Refresh list
                fetchStats(); // Refresh stats
            } else {
                const error = await response.json();
                alert(`Failed to delete category: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const toggleActive = async (category) => {
        try {
            const updatedCategory = { ...category, active: !category.active };
            const response = await fetch(`${BACKEND_URL}/api/admin/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCategory)
            });

            if (response.ok) {
                fetchCategories(); // Refresh list
                fetchStats(); // Refresh stats
            } else {
                alert('Failed to update category status');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category status');
        }
    };

    // Filter categories based on type and search term
    const filteredCategories = categories.filter(category => {
        const matchesFilter = filter === 'ALL' || category.type === filter;
        const matchesSearch = searchTerm === '' || 
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'SERVICE': return 'bg-green-100 text-green-800';
            case 'PRODUCT': return 'bg-blue-100 text-blue-800';
            case 'BOTH': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage service and product categories</p>
                </div>
                <Link
                    to="/admin/categories/create"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCategories}</div>
                    <div className="text-sm text-gray-600">Total Categories</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{stats.activeCategories}</div>
                    <div className="text-sm text-gray-600">Active Categories</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.serviceCategories}</div>
                    <div className="text-sm text-gray-600">Service Categories</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">{stats.productCategories}</div>
                    <div className="text-sm text-gray-600">Product Categories</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-indigo-600">{stats.bothCategories}</div>
                    <div className="text-sm text-gray-600">Both Types</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="ALL">All Types</option>
                            <option value="SERVICE">Services</option>
                            <option value="PRODUCT">Products</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sort Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{category.icon || '📁'}</span>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {category.slug}
                                                    </div>
                                                    {category.description && (
                                                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                                            {category.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(category.type)}`}>
                                                {category.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleActive(category)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                    category.active
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {category.active ? (
                                                    <>
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-4 h-4 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {category.sortOrder}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(category.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    to={`/admin/categories/edit/${category.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-100 rounded transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-100 rounded transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredCategories.length === 0 && !loading && (
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">📁</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm || filter !== 'ALL' 
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first category.'
                                    }
                                </p>
                                {(!searchTerm && filter === 'ALL') && (
                                    <Link
                                        to="/admin/categories/create"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Category
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesAdminPage;