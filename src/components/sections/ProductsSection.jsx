import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, ShoppingCart, Heart, ArrowRight, Package, Sparkles, TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import ProductsApi from '../../services/ProductsApiService';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

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

  // ✅ Fetch top 4 featured products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 ProductsSection: Fetching featured products...');

        const featuredProducts = await ProductsApi.getFeaturedProducts();
        console.log('📦 ProductsSection: Products received:', featuredProducts);

        if (Array.isArray(featuredProducts) && featuredProducts.length > 0) {
          // Take top 4 products for the section
          setProducts(featuredProducts.slice(0, 4));
        } else {
          console.warn('⚠️ ProductsSection: No featured products found');
          setProducts([]);
        }
      } catch (err) {
        console.error('❌ ProductsSection: Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Infinite scroll carousel
  useEffect(() => {
    if (products.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 4000); // Auto-scroll every 4 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [products.length]);

  // Manual carousel navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 4000);
    }
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % products.length;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

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
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            Featured Products
          </h2>

          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            Discover our handpicked collection of premium beauty products from top international brands.
            Professional quality, delivered to your doorstep.
          </p>
        </div>

        {/* Products Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mr-3"></div>
              <span className="text-pink-700 font-medium">Loading our amazing products...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Featured Products</h3>
            <p className="text-gray-600 mb-8">We're working on adding more products for you.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              <Package className="w-5 h-5 mr-2" />
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* ✅ Infinite Scroll Carousel */}
            <div className="relative mb-16">
              <div
                ref={carouselRef}
                className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-pink-100"
              >
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {products.map((product, index) => (
                    <div key={product.id} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                        {/* Product Image */}
                        <div className="relative">
                          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 shadow-xl">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getProductImage(product)} flex flex-col items-center justify-center text-white`}>
                                <div className="text-8xl mb-4">{getProductIcon(product.category)}</div>
                                <div className="text-2xl font-bold text-center px-4">{product.name}</div>
                              </div>
                            )}

                            {/* Product Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {product.featured && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  <Sparkles className="w-4 h-4 inline mr-1" />
                                  Featured
                                </div>
                              )}
                              {product.popular && (
                                <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  <TrendingUp className="w-4 h-4 inline mr-1" />
                                  Popular
                                </div>
                              )}
                              {product.onSale && (
                                <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  🔥 Sale
                                </div>
                              )}
                            </div>

                            {/* Like Button */}
                            <button
                              onClick={() => toggleLike(product.id)}
                              className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg transform hover:scale-110"
                            >
                              <Heart
                                className={`w-6 h-6 transition-colors duration-300 ${likedProducts.has(product.id)
                                  ? 'text-red-500 fill-current'
                                  : 'text-pink-400 hover:text-red-400'
                                  }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                          <div className="mb-4">
                            {product.brand && (
                              <p className="text-purple-600 font-semibold mb-2 text-lg">
                                {product.brand}
                              </p>
                            )}
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                              {product.name}
                            </h3>

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

                            {/* Description */}
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                              {product.description}
                            </p>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">Key Benefits:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {product.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-gray-600">
                                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-2"></div>
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Price & Actions */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                      <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                      <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                      </span>
                                    </>
                                  )}
                                </div>

                                {product.stockQuantity > 0 ? (
                                  <p className="text-green-600 text-sm font-medium">
                                    ✓ In Stock ({product.stockQuantity} available)
                                  </p>
                                ) : (
                                  <p className="text-red-600 text-sm font-medium">
                                    Out of Stock
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-3">
                                <Link
                                  to={`/products/${product.slug}`}
                                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                >
                                  View Details
                                </Link>
                                <button
                                  className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105"
                                  disabled={product.stockQuantity === 0}
                                >
                                  <ShoppingCart className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation */}
              {products.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all duration-300 z-10 hover:scale-110"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-700 rotate-180" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all duration-300 z-10 hover:scale-110"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 scale-125'
                          : 'bg-white/70 hover:bg-white'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Call to Action */}
            <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-purple-500" />
                    <span className="text-purple-600 font-medium">Premium Brands</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-pink-500" />
                    <span className="text-pink-600 font-medium">Fast Delivery</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <span className="text-yellow-600 font-medium">Top Rated</span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Explore Our Complete Beauty Collection
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Browse through our extensive catalog of 200+ premium beauty products.
                  From skincare essentials to makeup must-haves - find everything you need.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link
                    to="/services"
                    className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <span>View All Services</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">200+ Products</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Free Shipping ₹999+</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;