import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, Package, Eye, EyeOff, MoreVertical, Star } from 'lucide-react';

const ProductsAdminPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStock, setFilterStock] = useState('ALL');
  const [error, setError] = useState(null);

  const BACKEND_URL = 'https://glow-services.onrender.com/';

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
    fetchProducts();
  }, []);

  // ✅ Updated fetchProducts with JWT auth
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/products`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
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

      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // ✅ Updated toggleStatus with JWT auth
  const toggleStatus = async (id, currentStatus) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}/toggle-status`, {
        method: 'PATCH',
        headers
      });

      if (response.ok) {
        setProducts(products.map(product => 
          product.id === id ? { ...product, active: !currentStatus } : product
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

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'skincare', label: 'Skincare' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'haircare', label: 'Hair Care' },
    { value: 'bodycare', label: 'Body Care' },
    { value: 'fragrance', label: 'Fragrance' },
    { value: 'tools', label: 'Beauty Tools' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const stockFilters = [
    { value: 'ALL', label: 'All Stock Levels' },
    { value: 'IN_STOCK', label: 'In Stock' },
    { value: 'LOW_STOCK', label: 'Low Stock' },
    { value: 'OUT_OF_STOCK', label: 'Out of Stock' }
  ];

  const getStockStatus = (product) => {
    if (product.stockQuantity <= 0) return 'OUT_OF_STOCK';
    if (product.stockQuantity <= (product.lowStockThreshold || 10)) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
    const stockStatus = getStockStatus(product);
    const matchesStock = filterStock === 'ALL' || stockStatus === filterStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

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
            onClick={fetchProducts}
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
            <Package className="w-8 h-8 text-pink-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Product Management
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/products/create')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
        <p className="text-gray-600 mt-2 ml-11">
          Manage your beauty products and inventory
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {stockFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {product.brand}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleStatus(product.id, product.active)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      product.active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={product.active ? 'Active' : 'Inactive'}
                  >
                    {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className="relative group">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                    stockStatus === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stockStatus === 'IN_STOCK' ? 'In Stock' :
                     stockStatus === 'LOW_STOCK' ? 'Low Stock' :
                     'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Stock: {product.stockQuantity}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'ALL' || filterStock !== 'ALL'
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first product.'}
          </p>
          {(!searchTerm && filterCategory === 'ALL' && filterStock === 'ALL') && (
            <button
              onClick={() => navigate('/admin/products/create')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Create First Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsAdminPage;