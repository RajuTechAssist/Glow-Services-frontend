import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Star,
  Clock,
  ArrowRight,
  Calendar,
  Tag,
  Heart,
  CheckCircle,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import ApiService from "../services/api";
import { useCart } from "../context/CartContext";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedServices, setLikedServices] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const sectionRef = useRef(null);

  const { addToCart } = useCart();
  const handleAddToCart = (e, service) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link (though button is separate here)
    addToCart(service, 1); // Add 1 quantity
    alert(`${service.name} added to cart! 🛒`);
  };

  // ✅ COMBINED AND CORRECTED useEffect to handle all data fetching and filtering
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories from the new public endpoint
        const catData = await ApiService.getPublicCategories();
        const allOption = {
          id: "all",
          name: "All Services",
          slug: "all",
          icon: "✨",
          color: "from-pink-400 to-purple-500",
        };
        setCategories([allOption, ...catData]);

        // Fetch services using the currently selected category slug
        const serviceData = await ApiService.getAllServices(
          selectedCategory,
          searchTerm,
          sortBy
        );
        if (Array.isArray(serviceData)) {
          setServices(serviceData);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch page data", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm, sortBy]); // ✅ Re-runs correctly when a filter changes

  // // ✅ ADDED useEffect to fetch categories from the backend
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const data = await ApiService.getPublicCategories();
  //       // Manually add the "All Services" option to the front of the list
  //       const allOption = { id: 'all', name: 'All Services', icon: '✨', color: 'from-pink-400 to-purple-500' };
  //       setCategories([allOption, ...data]);
  //     } catch (err) {
  //       console.error("Failed to fetch categories", err);
  //       // Fallback to a minimal list if API fails
  //       setCategories([{ id: 'all', name: 'All Services', icon: '✨', color: 'from-pink-400 to-purple-500' }]);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const sortOptions = [
    {
      id: "popular",
      name: "Most Popular",
      icon: "⭐",
      color: "from-yellow-400 to-orange-400",
    },
    {
      id: "price-low",
      name: "Price: Low to High",
      icon: "💰",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: "price-high",
      name: "Price: High to Low",
      icon: "💎",
      color: "from-blue-400 to-indigo-500",
    },
    {
      id: "rating",
      name: "Highest Rated",
      icon: "🌟",
      color: "from-amber-400 to-yellow-500",
    },
    {
      id: "newest",
      name: "Newest First",
      icon: "🆕",
      color: "from-teal-400 to-cyan-500",
    },
  ];

  const getServiceCategory = (service) => {
    const serviceImageMap = {
      // FACIAL SERVICES
      "facial-treatment": "facial",
      "deep-cleansing-facial": "facial",
      "anti-aging-facial": "facial",
      "hydrating-facial": "facial",

      // WAXING SERVICES
      "full-body-waxing": "waxing",
      "brazilian-waxing": "waxing",
      "bikini-waxing": "waxing",
      "leg-waxing": "waxing",

      // NAIL CARE
      manicure: "nails",
      pedicure: "nails",
      "nail-art": "nails",
      "gel-nails": "nails",
      "nail-extension": "nails",

      // BODY CARE
      "body-scrub": "body",
      "body-wrap": "body",
      "body-polishing": "body",
      "tan-removal": "body",
      "body-brightening": "body",

      // MASSAGE
      "relaxing-massage": "massage",
      "deep-tissue-massage": "massage",
      "hot-stone-massage": "massage",
      "aromatherapy-massage": "massage",

      // MAKEUP
      "party-makeup": "makeup",
      "corporate-makeup": "makeup",
      "photoshoot-makeup": "makeup",
      "evening-makeup": "makeup",

      // THREADING & BLEACH
      "eyebrow-threading": "threading",
      "upper-lip-threading": "threading",
      "chin-threading": "threading",
      "face-bleach": "threading",

      // HAIR CARE
      "hair-spa": "haircare",
      "hair-treatment": "haircare",
      "hair-cut-style": "haircare",
      "hair-coloring": "haircare",

      // SKINCARE
      "skin-consultation": "skincare",
      "pigmentation-treatment": "skincare",
      "acne-scar-treatment": "skincare",
      "skin-rejuvenation": "skincare",

      // BRIDAL
      "bridal-makeup": "bridal",
      "bridal-hair": "bridal",
      "bridal-mehendi": "bridal",
      "bridal-package": "bridal",

      // PARTY
      "birthday-makeup": "party",
      "anniversary-makeup": "party",
      "date-night-makeup": "party",
      "festival-makeup": "party",

      // COMBO
      "beauty-combo": "combo",
      "facial-waxing-combo": "combo",
      "mani-pedi-combo": "combo",
      "bride-to-be-package": "combo",
    };

    return serviceImageMap[service.slug] || service.category || "facial";
  };

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


  // Fetch and sort services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from API (Backend now handles sorting too)
        const data = await ApiService.getAllServices(
          selectedCategory,
          searchTerm,
          sortBy
        );

        if (Array.isArray(data)) {
          // ✅ EXTRA SAFETY: Apply client-side sort to ensure immediate UI update
          const sortedData = sortServices(data, sortBy);
          setServices(sortedData);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError("Failed to load services.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search slightly to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm, sortBy]);

  // ✅ FIXED: Sort functionality
  const sortServices = (servicesArray, sortType) => {
    const sorted = [...servicesArray];

    switch (sortType) {
      case "popular":
        return sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      default:
        return sorted;
    }
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
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    // ✅ FIXED: Added proper spacing from header (pt-24 instead of pt-8)
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 pt-24 transition-colors duration-300">
      {/* ✅ ENHANCED: Beautiful Header Section with feminine colors */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Sparkles className="w-8 h-8 text-white mr-3 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Our Services
              </h1>
              <Sparkles className="w-8 h-8 text-white ml-3 animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
              Discover our complete range of professional beauty services
              delivered to your doorstep. From rejuvenating facials to stunning
              bridal makeup, we've got everything you need to look and feel
              absolutely gorgeous! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== ENHANCED VERTICAL FILTERS SIDEBAR ===== */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center w-full p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                <Filter className="w-5 h-5 mr-2" />
                <span className="font-semibold">Filters & Categories</span>
                <ArrowRight
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                    showFilters ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>

            {/* Filter Panel */}
            <div
              className={`${
                showFilters ? "block" : "hidden lg:block"
              } space-y-6`}
            >
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-gray-700 p-6 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg mr-3">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  Search Services
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    placeholder="Search for your perfect service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-pink-200 dark:focus:ring-gray-700 focus:border-pink-400 dark:focus:border-pink-500 transition-all duration-300 bg-pink-50/50 dark:bg-gray-700 placeholder-pink-400 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Categories - Vertical List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-gray-700 p-6 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mr-3">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategory(category.slug || category.id)
                      }
                      className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === (category.slug || category.id)
                          ? `bg-gradient-to-r ${
                              category.color || "from-pink-400 to-purple-500"
                            } text-white shadow-lg border-2 border-transparent`
                          : "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-750 hover:from-pink-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-650 border-2 border-pink-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <span className="text-xl mr-4">{category.icon}</span>
                      <span className="font-semibold flex-1">
                        {category.name}
                      </span>
                      {selectedCategory === (category.slug || category.id) && (
                        <CheckCircle className="w-6 h-6 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options - Vertical List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-100 dark:border-gray-700 p-6 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
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
                        console.log("🔄 Sorting by:", option.id);
                        setSortBy(option.id);
                      }}
                      className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                        sortBy === option.id
                          ? `bg-gradient-to-r ${option.color} text-white shadow-lg border-2 border-transparent`
                          : "bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700 dark:to-gray-750 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-650 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <span className="text-xl mr-4">{option.icon}</span>
                      <span className="font-semibold flex-1">
                        {option.name}
                      </span>
                      {sortBy === option.id && (
                        <CheckCircle className="w-6 h-6 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== ENHANCED VERTICAL SERVICES LIST ===== */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-gray-700 p-6 mb-8 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Heart className="w-6 h-6 text-pink-500 mr-2" />
                    {searchTerm
                      ? `Search Results for "${searchTerm}"`
                      : selectedCategory === "all"
                      ? "All Services"
                      : serviceCategories.find(
                          (cat) => cat.id === selectedCategory
                        )?.name}
                  </h2>
                  <p className="text-pink-600 dark:text-pink-400 mt-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {loading
                      ? "Loading beautiful services..."
                      : `${services.length} amazing service${
                          services.length !== 1 ? "s" : ""
                        } found`}
                  </p>
                </div>
              </div>
            </div>

            {/* Services Content */}
            <div ref={sectionRef}>
              {loading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-gray-700 p-6 animate-pulse"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-80 h-60 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                          <div className="h-4 bg-pink-100 dark:bg-gray-700 rounded w-1/2"></div>
                          <div className="h-4 bg-purple-100 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-indigo-100 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : services.length === 0 ? (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-12 text-center">
                  <div className="text-8xl mb-6">🌸</div>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4">
                    No Services Found
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 text-lg">
                    {searchTerm ? (
                      <>
                        We couldn't find any services matching "{searchTerm}".
                        Try a different search! 💫
                      </>
                    ) : selectedCategory !== "all" ? (
                      <>
                        No services available in "
                        {
                          serviceCategories.find(
                            (cat) => cat.id === selectedCategory
                          )?.name
                        }
                        " right now. Check back soon! ✨
                      </>
                    ) : (
                      "No services available at the moment. Our beauticians are preparing something amazing! 🌟"
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {services.map((service, index) => (
                    <div
                      key={service.id || service.slug}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] ${
                        isVisible ? "animate-fade-in" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Service Image */}
                        <div className="lg:w-80 h-64 lg:h-80 relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-700 dark:to-purple-900">
                          <img
                            // ✅ FIX: Use service.image (S3 URL) if available, otherwise fallback to local logic
                            src={
                              service.image ||
                              `/images/services/${
                                service.category || "facial"
                              }-service.png`
                            }
                            alt={service.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              // ✅ FIX: Improved fallback to prevent infinite loop
                              e.target.onerror = null;
                              e.target.style.display = "none"; // Hide image to show the gradient background below if both fail
                            }}
                          />
                          <button
                            onClick={() => toggleLike(service.id)}
                            className="absolute top-4 right-4 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg transform hover:scale-110"
                          >
                            <Heart
                              className={`w-6 h-6 transition-colors duration-300 ${
                                likedServices.has(service.id)
                                  ? "text-red-500 fill-current"
                                  : "text-pink-400 hover:text-red-400"
                              }`}
                            />
                          </button>
                          {service.popular && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              ✨ Popular
                            </div>
                          )}
                        </div>

                        {/* Service Content */}
                        <div className="flex-1 p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                {service.name}
                              </h3>
                              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center bg-purple-50 dark:bg-gray-700 px-3 py-2 rounded-full">
                                  <Clock className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
                                  <span className="font-medium dark:text-gray-300">
                                    {service.duration}
                                  </span>
                                </div>
                                <div className="flex items-center bg-yellow-50 dark:bg-gray-700 px-3 py-2 rounded-full">
                                  {renderStars(service.rating)}
                                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                                    {service.rating} ({service.reviews} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                ₹{service.price}
                              </div>
                              {service.originalPrice &&
                                service.originalPrice > service.price && (
                                  <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                    ₹{service.originalPrice}
                                  </div>
                                )}
                            </div>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed line-clamp-2">
                            {service.description}
                          </p>

                          {/* Features */}
                          {service.features && service.features.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center text-lg">
                                <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                                What's Included:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {service.features
                                  .slice(0, 4)
                                  .map((feature, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-lg"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                                      <span className="font-medium">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                              {service.features.length > 4 && (
                                <p className="text-purple-600 dark:text-purple-400 font-medium mt-3 flex items-center">
                                  <Sparkles className="w-4 h-4 mr-1" />+
                                  {service.features.length - 4} more amazing
                                  benefits included!
                                </p>
                              )}
                            </div>
                          )}

                          {/* Services List for Combos */}
                          {service.services && service.services.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center text-lg">
                                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                                Services Included:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {service.services.map((subService, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center text-gray-700 dark:text-gray-300 bg-pink-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-pink-200 dark:border-gray-600"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-3 text-purple-600 dark:text-purple-400" />
                                    <span className="font-medium">
                                      {subService}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                              to={`/services/${service.slug}`}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center flex items-center justify-center shadow-lg transform hover:scale-105"
                            >
                              <Sparkles className="w-5 h-5 mr-2" />
                              View Details
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <button
                              onClick={(e) => handleAddToCart(e, service)}
                              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </button>
                          </div>
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

export default ServicesPage;
