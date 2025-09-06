import React, { useState, useEffect, useRef } from 'react';
import { 
  Star,
  Heart,
  ShoppingCart,
  ArrowRight,
  Eye,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [likedProducts, setLikedProducts] = useState(new Set());
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

  const toggleLike = (productId) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  // Featured products only (for home page)
  const featuredProducts = [
    {
      id: 1,
      name: 'Vitamin C Brightening Serum',
      brand: 'GlowLab Professional',
      description: 'Advanced vitamin C formula that brightens, evens skin tone, and provides antioxidant protection.',
      price: 2499,
      originalPrice: 3200,
      rating: 4.9,
      reviews: 1247,
      image: '/images/vitamin-c-serum.jpg',
      badges: ['Bestseller', 'Professional Grade'],
      features: ['20% Vitamin C', 'Hyaluronic Acid', 'Anti-aging', 'Brightening'],
      gradient: 'from-orange-400 to-yellow-500',
      category: 'Skincare'
    },
    {
      id: 2,
      name: 'Luxury Hair Repair Mask',
      brand: 'Salon Elite',
      description: 'Intensive hair treatment mask with keratin and argan oil for damaged and dry hair repair.',
      price: 1899,
      originalPrice: 2400,
      rating: 4.8,
      reviews: 892,
      image: '/images/hair-mask.jpg',
      badges: ['Editor\'s Choice', 'Salon Quality'],
      features: ['Keratin Protein', 'Argan Oil', 'Deep Repair', 'Shine Boost'],
      gradient: 'from-purple-500 to-pink-500',
      category: 'Hair Care'
    },
    {
      id: 3,
      name: 'Premium Foundation Set',
      brand: 'Beauty Pro',
      description: 'Full coverage foundation with primer and setting powder for a flawless, long-lasting finish.',
      price: 3299,
      originalPrice: 4200,
      rating: 4.9,
      reviews: 1456,
      image: '/images/foundation-set.jpg',
      badges: ['Complete Set', 'Long-wearing'],
      features: ['Full Coverage', '16hr Wear', 'SPF 30', '3-piece Set'],
      gradient: 'from-rose-500 to-pink-600',
      category: 'Makeup'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.05'%3E%3Cpath d='m0 40l40-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            <span className="text-purple-600 font-medium tracking-wide uppercase text-sm">
              Featured Products
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Premium beauty
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              products delivered
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover our handpicked collection of premium beauty products from top international brands. 
            Professional quality, delivered to your doorstep.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group ${isVisible ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'}`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              {/* Product Image with Gradient Overlay */}
              <div className={`h-64 bg-gradient-to-br ${product.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.badges.map((badge, idx) => (
                    <div key={idx} className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {badge}
                    </div>
                  ))}
                </div>

                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors duration-300 ${
                      likedProducts.has(product.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-white group-hover:text-red-300'
                    }`} 
                  />
                </button>

                {/* Product Visual */}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-white/90 font-medium text-sm">{product.category}</div>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                {/* Brand & Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-purple-600 font-medium">{product.brand}</div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                    <div className="text-sm text-green-600 font-medium">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
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
                to="/products"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>View All Products</span>
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
      </div>
    </section>
  );
};

export default ProductsSection;
