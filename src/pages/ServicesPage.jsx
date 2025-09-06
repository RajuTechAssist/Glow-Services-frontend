import React, { useState, useEffect, useRef } from 'react';
import { 
  Search,
  Filter,
  Star,
  Clock,
  ArrowRight,
  Calendar,
  Tag,
  Heart,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedServices, setLikedServices] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '✨' },
    { id: 'facial', name: 'Facial & Clean Up', icon: '🧴' },
    { id: 'waxing', name: 'Waxing & Hair Removal', icon: '🪒' },
    { id: 'nails', name: 'Nail Care', icon: '💅' },
    { id: 'body', name: 'Body Care', icon: '🧖‍♀️' },
    { id: 'makeup', name: 'Makeup & Bridal', icon: '💄' },
    { id: 'threading', name: 'Threading & Bleach', icon: '🎯' },
    { id: 'combo', name: 'Combo Offers', icon: '🎁' }
  ];

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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 ServicesPage: Fetching services:', { selectedCategory, searchTerm, sortBy });
        
        const data = await ApiService.getAllServices(selectedCategory, searchTerm, sortBy);
        console.log('📦 ServicesPage: Services received:', data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('⚠️ ServicesPage: API returned non-array data:', data);
          setServices([]);
        }
        
      } catch (err) {
        console.error('❌ ServicesPage: Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchTerm, sortBy]);

  const toggleLike = (serviceId) => {
    const newLiked = new Set(likedServices);
    if (newLiked.has(serviceId)) {
      newLiked.delete(serviceId);
    } else {
      newLiked.add(serviceId);
    }
    setLikedServices(newLiked);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-pink-50">
      
      {/* Header Section */}
      <section 
        ref={sectionRef}
        className="py-16 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className={`text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Professional Beauty Services
            </h1>
            <p className={`text-xl text-white/90 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Discover our complete range of professional beauty services delivered to your doorstep. 
              From facials to bridal makeup, we've got everything you need to look and feel your best.
            </p>
            
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            <span className="font-medium">{services.length}</span> services found
            {selectedCategory !== 'all' && (
              <span> in <span className="font-medium text-pink-600">
                {serviceCategories.find(cat => cat.id === selectedCategory)?.name}
              </span></span>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Services</h3>
              <p className="text-red-600 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm ? (
                  <>No services found for "<span className="font-medium">{searchTerm}</span>"</>
                ) : selectedCategory !== 'all' ? (
                  <>No services found in "<span className="font-medium">{serviceCategories.find(cat => cat.id === selectedCategory)?.name}</span>"</>
                ) : (
                  'No services available at the moment'
                )}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Service Image */}
                  <div className={`h-64 bg-gradient-to-br ${service.gradient || 'from-pink-500 to-purple-500'} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Combo Badge */}
                    {service.category === 'combo' && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>Combo</span>
                        </div>
                      </div>
                    )}

                    {/* Like Button */}
                    <button 
                      onClick={() => toggleLike(service.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors duration-300 ${
                          likedServices.has(service.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-white group-hover:text-red-300'
                        }`} 
                      />
                    </button>

                    {/* Service Visual */}
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <div className="text-white/90 font-medium text-sm uppercase tracking-wide">
                        {service.category}
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    {/* Rating and Duration */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(service.rating)}
                        </div>
                        <span>({service.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors duration-300">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Services List for Combos */}
                    {service.services && service.services.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Includes:</div>
                        <div className="flex flex-wrap gap-1">
                          {service.services.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              {item}
                            </span>
                          ))}
                          {service.services.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{service.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">₹{service.price}</span>
                        {service.originalPrice && (
                          <span className="text-lg text-gray-400 line-through ml-2">₹{service.originalPrice}</span>
                        )}
                        {service.savings && (
                          <div className="text-sm text-green-600 font-medium">
                            Save ₹{service.savings}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/services/${service.slug}`}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 text-center"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      
                      <button className="bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
