import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  ArrowRight,
  Heart,
  Sparkles,
  Users,
  Award,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react';
import ApiService from '../../services/api';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedServices, setLikedServices] = useState(new Set());
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

  // ✅ Fetch top 4 featured services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 ServicesSection: Fetching featured services...');

        const allServices = await ApiService.getAllServices();
        console.log('📦 ServicesSection: Services received:', allServices);

        if (Array.isArray(allServices) && allServices.length > 0) {
          // Take top 4 services for the section (prioritize featured ones)
          const featuredServices = allServices
            .filter(service => service.featured)
            .slice(0, 4);

          // If not enough featured services, fill with popular ones
          if (featuredServices.length < 4) {
            const remainingServices = allServices
              .filter(service => !service.featured)
              .slice(0, 4 - featuredServices.length);
            setServices([...featuredServices, ...remainingServices]);
          } else {
            setServices(featuredServices);
          }
        } else {
          console.warn('⚠️ ServicesSection: No services found');
          setServices([]);
        }
      } catch (err) {
        console.error('❌ ServicesSection: Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ✅ Infinite scroll carousel
  useEffect(() => {
    if (services.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 4000); // Auto-scroll every 4 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [services.length]);

  // Manual carousel navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 4000);
    }
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % services.length;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? services.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

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

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) {
      return service.images[0];
    }

    // Fallback gradient based on service category
    const gradients = {
      facial: 'from-rose-400 via-pink-400 to-rose-500',
      massage: 'from-purple-400 via-indigo-400 to-purple-500',
      haircare: 'from-violet-400 via-purple-400 to-indigo-500',
      manicure: 'from-pink-400 via-rose-400 to-pink-500',
      pedicure: 'from-fuchsia-400 via-pink-400 to-rose-500',
      skincare: 'from-emerald-400 via-teal-400 to-cyan-500',
      makeup: 'from-amber-400 via-orange-400 to-red-500',
      eyebrow: 'from-indigo-400 via-blue-400 to-indigo-500',
      waxing: 'from-green-400 via-emerald-400 to-teal-500',
      threading: 'from-yellow-400 via-amber-400 to-orange-500'
    };

    const category = service.category?.toLowerCase() || 'default';
    return gradients[category] || 'from-pink-400 via-purple-400 to-indigo-500';
  };

  const getServiceIcon = (category) => {
    const icons = {
      facial: '✨', massage: '💆', haircare: '💇', manicure: '💅',
      pedicure: '🦶', skincare: '🧴', makeup: '💄', eyebrow: '👁️',
      waxing: '🪒', threading: '🧵'
    };
    return icons[category?.toLowerCase()] || '💫';
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            Featured Services
          </h2>

          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            Experience luxury beauty treatments in the comfort of your home.
            Our certified professionals bring salon-quality services right to your doorstep.
          </p>
        </div>

        {/* Services Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mr-3"></div>
              <span className="text-purple-700 font-medium">Loading our amazing services...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Featured Services</h3>
            <p className="text-gray-600 mb-8">We're working on adding more services for you.</p>
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Browse All Services
            </Link>
          </div>
        ) : (
          <>
            {/* ✅ Infinite Scroll Carousel */}
            <div className="relative mb-16">
              <div
                ref={carouselRef}
                className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-purple-100"
              >
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {services.map((service, index) => (
                    <div key={service.id} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                        {/* Service Image */}
                        <div className="relative">
                          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl">
                            {service.images && service.images.length > 0 ? (
                              <img
                                src={service.images[0]}
                                alt={service.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getServiceImage(service)} flex flex-col items-center justify-center text-white`}>
                                <div className="text-8xl mb-4">{getServiceIcon(service.category)}</div>
                                <div className="text-2xl font-bold text-center px-4">{service.name}</div>
                              </div>
                            )}

                            {/* Service Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {service.featured && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  <Award className="w-4 h-4 inline mr-1" />
                                  Featured
                                </div>
                              )}
                              {service.popular && (
                                <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  <TrendingUp className="w-4 h-4 inline mr-1" />
                                  Popular
                                </div>
                              )}
                              {service.newService && (
                                <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  <Zap className="w-4 h-4 inline mr-1" />
                                  New
                                </div>
                              )}
                            </div>

                            {/* Like Button */}
                            <button
                              onClick={() => toggleLike(service.id)}
                              className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg transform hover:scale-110"
                            >
                              <Heart
                                className={`w-6 h-6 transition-colors duration-300 ${likedServices.has(service.id)
                                  ? 'text-red-500 fill-current'
                                  : 'text-pink-400 hover:text-red-400'
                                  }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="flex flex-col justify-center">
                          <div className="mb-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                              {service.name}
                            </h3>

                            {/* Service Details */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-purple-500" />
                                <span>{service.duration || '60'} mins</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                                <span>At Home</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-indigo-500" />
                                <span>Professional</span>
                              </div>
                            </div>

                            {/* Rating */}
                            {service.rating && (
                              <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                  {renderStars(service.rating)}
                                  <span className="ml-2 text-lg font-semibold text-gray-700">
                                    {service.rating}
                                  </span>
                                </div>
                                {service.reviewCount && (
                                  <span className="text-gray-600">
                                    ({service.reviewCount} reviews)
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                              {service?.description || 'Professional service description'}
                            </p>

                            {/* Service Features */}
                            {service.features && service.features.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">What's Included:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {service.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-gray-600">
                                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-2"></div>
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
                                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                                    {formatPrice(service.price)}
                                  </span>
                                  {service.originalPrice && service.originalPrice > service.price && (
                                    <>
                                      <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(service.originalPrice)}
                                      </span>
                                      <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                                        {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
                                      </span>
                                    </>
                                  )}
                                </div>

                                <p className="text-purple-600 text-sm font-medium">
                                  📍 Available at your location
                                </p>
                              </div>

                              <div className="flex gap-3">
                                <Link
                                  to={`/services/${service.slug}`}
                                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                >
                                  View Details
                                </Link>
                                <Link
                                  to="/book"
                                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 flex items-center"
                                >
                                  <Calendar className="w-5 h-5 mr-2" />
                                  Book Now
                                </Link>
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
              {services.length > 1 && (
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
                    {services.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 scale-125'
                          : 'bg-white/70 hover:bg-white'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Call to Action - Services */}
            <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-purple-500" />
                    <span className="text-purple-600 font-medium">Certified Professionals</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-pink-500" />
                    <span className="text-pink-600 font-medium">On-time Appointments</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <span className="text-yellow-600 font-medium">Top Rated Services</span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Explore Our Complete Beauty Services
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  From salon-quality facials and hair treatments to bridal makeup and grooming — book certified professionals
                  for in-home services or at our partner salons. Trusted, convenient and tailored to you.
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
                      <span className="text-sm">100+ Services</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Home Visits Available</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Starting ₹199</span>
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

export default ServicesSection;