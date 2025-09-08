import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Plus,
    Minus,
    Check,
    Package,
    Truck,
    Shield,
    ArrowLeft,
    Zap,
    Award,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ProductsApi from '../services/ProductsApiService';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('🔄 ProductDetail: Fetching product:', slug);

                const data = await ProductsApi.getProductBySlug(slug);
                console.log('📦 ProductDetail: Product received:', data);

                setProduct(data);
            } catch (err) {
                console.error('❌ ProductDetail: Error fetching product:', err);
                if (err.message === 'Product not found') {
                    setError('Product not found');
                } else {
                    setError('Failed to load product. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-5 h-5 ${
                        i < Math.floor(rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                    }`}
                />
            );
        }
        return stars;
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        console.log('Adding to cart:', { product: product.id, quantity });
        // Implement cart functionality
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Product link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                        <div className="w-full h-96 bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl"></div>
                        <div className="space-y-6">
                            <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-3/4"></div>
                            <div className="h-4 bg-pink-100 rounded w-1/2"></div>
                            <div className="h-12 bg-purple-100 rounded w-2/3"></div>
                            <div className="h-32 bg-indigo-100 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <div className="text-8xl mb-6">😞</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const hasImages = product.images && product.images.length > 0;
    const currentImage = hasImages ? product.images[selectedImageIndex] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link to="/" className="hover:text-purple-600">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-purple-600">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Product Images */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-pink-100">
                            {hasImages ? (
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="w-full h-96 object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center text-white">
                                    <div className="text-8xl mb-4">
                                        {{
                                            skincare: '🧴', makeup: '💄', haircare: '💇',
                                            'bath-body': '🛁', fragrance: '🌸', 'nail-care': '💅',
                                            tools: '🎀', mens: '🧔', 'sun-care': '☀️',
                                            specialty: '💎', natural: '🌿'
                                        }[product.category] || '✨'}
                                    </div>
                                    <div className="text-2xl font-bold text-center px-4">
                                        {product.name}
                                    </div>
                                </div>
                            )}

                            {/* Image Navigation */}
                            {hasImages && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : product.images.length - 1)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(selectedImageIndex < product.images.length - 1 ? selectedImageIndex + 1 : 0)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Product Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.popular && (
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        🔥 Popular
                                    </div>
                                )}
                                {product.newArrival && (
                                    <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        ⚡ New
                                    </div>
                                )}
                                {product.onSale && (
                                    <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        💥 Sale
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {hasImages && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImageIndex === index
                                                ? 'border-purple-500 shadow-lg'
                                                : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            {product.brand && (
                                <p className="text-purple-600 font-semibold mb-2">{product.brand}</p>
                            )}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    {renderStars(product.rating)}
                                    <span className="ml-2 text-lg font-semibold text-gray-700">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-gray-600">
                                    ({product.reviewCount} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                            <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                                                Save {formatPrice(product.originalPrice - product.price)}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <p className="text-green-600 font-medium">
                                        🎉 You save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% on this purchase!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="bg-white rounded-xl p-4 border border-pink-100">
                            {product.stockQuantity > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <Check className="w-5 h-5 mr-2" />
                                    <span className="font-semibold">In Stock</span>
                                    <span className="text-gray-600 ml-2">({product.stockQuantity} available)</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <span className="font-semibold">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stockQuantity > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-pink-100 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-gray-700">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stockQuantity}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            isLiked
                                                ? 'bg-red-50 border-red-300 text-red-600'
                                                : 'bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600'
                                        }`}
                                    >
                                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-4 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                                    >
                                        <Share2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Features/Benefits */}
                        {product.features && product.features.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-pink-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                                    Key Benefits
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {product.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border border-pink-100">
                                <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <p className="text-sm font-medium text-gray-700">Authentic Products</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-pink-100">
                                <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                <p className="text-sm font-medium text-gray-700">Free Delivery</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-pink-100">
                                <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm font-medium text-gray-700">Easy Returns</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'description', label: 'Description' },
                                    { id: 'ingredients', label: 'Ingredients' },
                                    { id: 'how-to-use', label: 'How to Use' },
                                    { id: 'reviews', label: 'Reviews' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-purple-500 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {product.description || 'No description available.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'ingredients' && (
                                <div>
                                    {product.ingredients ? (
                                        <p className="text-gray-700 leading-relaxed">
                                            {product.ingredients}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">Ingredient information not available.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'how-to-use' && (
                                <div>
                                    {product.howToUse ? (
                                        <p className="text-gray-700 leading-relaxed">
                                            {product.howToUse}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">Usage instructions not available.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="text-center py-12">
                                        <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Reviews Coming Soon</h3>
                                        <p className="text-gray-500">Customer reviews will be displayed here.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Back to Products */}
                <div className="mt-12 text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;