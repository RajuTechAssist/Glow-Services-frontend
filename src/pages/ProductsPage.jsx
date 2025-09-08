import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    Star,
    ShoppingCart,
    ArrowRight,
    Tag,
    Heart,
    CheckCircle,
    Sparkles,
    Package,
    TrendingUp,
    Zap
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductsApi from '../services/ProductsApiService';
import { productCategories, sortOptions, getCategoryById } from '../utils/ProductCategories';

const ProductsPage = () => {
    // PARAMETER HANDLING
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [isVisible, setIsVisible] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const sectionRef = useRef(null);

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // ✅ UPDATE URL WHEN FILTERS CHANGE
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') {
            params.set('category', selectedCategory);
        }
        if (searchTerm) {
            params.set('search', searchTerm);
        }
        setSearchParams(params);
    }, [selectedCategory, searchTerm, setSearchParams]);

    // SYNC STATE WITH URL CHANGES
    useEffect(() => {
        const urlCategory = searchParams.get('category') || 'all';
        const urlSearch = searchParams.get('search') || '';

        setSelectedCategory(urlCategory);
        setSearchTerm(urlSearch);
    }, [searchParams]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('🔄 ProductsPage: Fetching products:', { selectedCategory, searchTerm, sortBy });

                // Use the correct category parameter
                const categoryParam = selectedCategory === 'all' ? null : selectedCategory;
                const searchParam = searchTerm || null;

                const data = await ProductsApi.getAllProducts(categoryParam, searchParam, sortBy);
                console.log('📦 ProductsPage: Products received:', data);

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('⚠️ ProductsPage: API returned non-array data:', data);
                    setProducts([]);
                }
            } catch (err) {
                console.error('❌ ProductsPage: Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, searchTerm, sortBy]);

    const toggleLike = (productId) => {
        const newLiked = new Set(likedProducts);
        if (newLiked.has(productId)) {
            newLiked.delete(productId);
        } else {
            newLiked.add(productId);
        }
        setLikedProducts(newLiked);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                />
            );
        }
        return stars;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }

        // Fallback gradient based on category
        const gradients = {
            skincare: 'from-rose-400 via-pink-400 to-rose-500',
            makeup: 'from-fuchsia-400 via-pink-400 to-rose-500',
            haircare: 'from-purple-400 via-fuchsia-400 to-pink-500',
            'bath-body': 'from-violet-400 via-purple-400 to-violet-500',
            fragrance: 'from-pink-300 via-rose-300 to-pink-400',
            'nail-care': 'from-rose-400 via-pink-400 to-fuchsia-500',
            tools: 'from-indigo-400 via-purple-400 to-indigo-500',
            mens: 'from-gray-500 via-blue-500 to-indigo-500',
            'sun-care': 'from-yellow-400 via-orange-400 to-red-400',
            specialty: 'from-purple-500 via-indigo-500 to-purple-600',
            natural: 'from-green-400 via-emerald-400 to-teal-500'
        };

        return gradients[product.category] || 'from-pink-400 via-purple-400 to-indigo-500';
    };

    const getProductIcon = (category) => {
        const icons = {
            skincare: '🧴', makeup: '💄', haircare: '💇', 'bath-body': '🛁',
            fragrance: '🌸', 'nail-care': '💅', tools: '🎀', mens: '🧔',
            'sun-care': '☀️', specialty: '💎', natural: '🌿'
        };
        return icons[category] || '✨';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24">

            {/* Beautiful Header Section */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <Package className="w-8 h-8 text-white mr-3 animate-pulse" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Beauty Products
                            </h1>
                            <Package className="w-8 h-8 text-white ml-3 animate-pulse" />
                        </div>
                        <p className="text-lg md:text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
                            Discover our curated collection of premium beauty products from top brands.
                            From skincare essentials to makeup must-haves, find everything you need to enhance your natural beauty! ✨
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Vertical Filters Sidebar */}
                    <div className="lg:w-80 flex-shrink-0">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center w-full p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                            >
                                <Filter className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Filters & Categories</span>
                                <ArrowRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {/* Filter Panel */}
                        <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>

                            {/* Search */}
                            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg mr-3">
                                        <Search className="w-5 h-5 text-white" />
                                    </div>
                                    Search Products
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for beauty products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 bg-pink-50/50 placeholder-pink-400"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mr-3">
                                        <Tag className="w-5 h-5 text-white" />
                                    </div>
                                    Categories
                                </h3>
                                <div className="space-y-3">
                                    {productCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                                                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg border-2 border-transparent`
                                                    : 'bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 hover:border-purple-300 text-gray-700'
                                                }`}
                                        >
                                            <span className="text-xl mr-4">{category.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-semibold">{category.name}</div>
                                                {selectedCategory !== category.id && (
                                                    <div className="text-xs opacity-75 mt-1">{category.description}</div>
                                                )}
                                            </div>
                                            {selectedCategory === category.id && (
                                                <CheckCircle className="w-6 h-6 ml-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg mr-3">
                                        <Filter className="w-5 h-5 text-white" />
                                    </div>
                                    Sort By
                                </h3>
                                <div className="space-y-3">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                console.log('🔄 Sorting by:', option.id);
                                                setSortBy(option.id);
                                            }}
                                            className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${sortBy === option.id
                                                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg border-2 border-transparent`
                                                    : 'bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50 border-2 border-gray-200 hover:border-indigo-300 text-gray-700'
                                                }`}
                                        >
                                            <span className="text-xl mr-4">{option.icon}</span>
                                            <span className="font-semibold flex-1">{option.name}</span>
                                            {sortBy === option.id && (
                                                <CheckCircle className="w-6 h-6 ml-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Sparkles className="w-6 h-6 text-pink-500 mr-2" />
                                        {searchTerm ? `Search Results for "${searchTerm}"` :
                                            selectedCategory === 'all' ? 'All Products' :
                                                getCategoryById(selectedCategory)?.name}
                                    </h2>
                                    <p className="text-pink-600 mt-2 flex items-center">
                                        <Package className="w-4 h-4 mr-1" />
                                        {loading ? 'Loading amazing products...' : `${products.length} beautiful product${products.length !== 1 ? 's' : ''} found`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products Content */}
                        <div ref={sectionRef}>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 animate-pulse">
                                            <div className="w-full h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl mb-4"></div>
                                            <div className="space-y-3">
                                                <div className="h-6 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-3/4"></div>
                                                <div className="h-4 bg-pink-100 rounded w-1/2"></div>
                                                <div className="h-8 bg-purple-100 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                                    <div className="text-6xl mb-4">😔</div>
                                    <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                                    <p className="text-red-600">{error}</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-12 text-center">
                                    <div className="text-8xl mb-6">🛍️</div>
                                    <h3 className="text-2xl font-bold text-purple-900 mb-4">No Products Found</h3>
                                    <p className="text-purple-600 text-lg">
                                        {searchTerm ? (
                                            <>We couldn't find any products matching "{searchTerm}". Try a different search! 💫</>
                                        ) : selectedCategory !== 'all' ? (
                                            <>No products available in "{getCategoryById(selectedCategory)?.name}" right now. Check back soon! ✨</>
                                        ) : (
                                            'No products available at the moment. We\'re adding new items daily! 🌟'
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product, index) => (
                                        <div
                                            key={product.id || product.slug}
                                            className={`bg-white rounded-2xl shadow-xl border border-pink-100 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] ${isVisible ? 'animate-fade-in' : 'opacity-0'
                                                }`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Product Image */}
                                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${getProductImage(product)} flex flex-col items-center justify-center text-white`}>
                                                        <div className="text-6xl mb-3">{getProductIcon(product.category)}</div>
                                                        <div className="font-bold text-lg text-center px-4">{product.name}</div>
                                                    </div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    {product.popular && (
                                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            <TrendingUp className="w-3 h-3 inline mr-1" />
                                                            Popular
                                                        </div>
                                                    )}
                                                    {product.newArrival && (
                                                        <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            <Zap className="w-3 h-3 inline mr-1" />
                                                            New
                                                        </div>
                                                    )}
                                                    {product.onSale && (
                                                        <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            🔥 Sale
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Heart Button */}
                                                <button
                                                    onClick={() => toggleLike(product.id)}
                                                    className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg transform hover:scale-110"
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 transition-colors duration-300 ${likedProducts.has(product.id)
                                                                ? 'text-red-500 fill-current'
                                                                : 'text-pink-400 hover:text-red-400'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                <div className="mb-4">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    {product.brand && (
                                                        <p className="text-purple-600 font-medium text-sm mb-2">
                                                            {product.brand}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex items-center">
                                                            {renderStars(product.rating)}
                                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                                {product.rating} ({product.reviewCount})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                            <>
                                                                <span className="text-lg text-gray-500 line-through">
                                                                    {formatPrice(product.originalPrice)}
                                                                </span>
                                                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stock Status */}
                                                {product.stockQuantity !== undefined && (
                                                    <div className="mb-4">
                                                        {product.stockQuantity > 0 ? (
                                                            <span className="text-green-600 text-sm font-medium flex items-center">
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                In Stock ({product.stockQuantity} available)
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 text-sm font-medium">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        to={`/products/${product.slug}`}
                                                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center text-sm"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <button
                                                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                                                        disabled={product.stockQuantity === 0}
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;