import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  CheckCircle,
  Heart,
  Share2,
  Phone,
  MessageSquare,
  Users,
  Award,
  Shield,
  ArrowRight,
} from "lucide-react";
import ApiService from "../services/api";
import { useCart } from "../context/CartContext";

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchService = async () => {
      try {
        console.log("🔍 ServiceDetailPage: URL slug received:", slug);

        if (!slug) {
          setError("No service slug provided");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        console.log("🚀 ServiceDetailPage: Fetching service...");
        const serviceData = await ApiService.getServiceBySlug(slug);

        console.log(
          "✅ ServiceDetailPage: Service data received:",
          serviceData
        );

        if (serviceData) {
          setService(serviceData);

          // Get related services
          try {
            const allServices = await ApiService.getAllServices(
              serviceData.category
            );
            const related = allServices
              .filter((s) => s.id !== serviceData.id)
              .slice(0, 3);
            setRelatedServices(related);
          } catch (relatedErr) {
            console.warn("Could not fetch related services:", relatedErr);
            setRelatedServices([]);
          }
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.error("❌ ServiceDetailPage: Error:", err);
        setError(err.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(service, quantity);
    alert(`Added ${quantity} × ${service.name} to cart`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 dark:border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 dark:text-red-400 text-3xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Slug: {slug}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              Go Back
            </button>
            <Link
              to="/services"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 text-center"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No service data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-20 z-40 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/services" className="hover:text-pink-600 dark:hover:text-pink-400">
                Services
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{service.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Service Image */}
          <div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
              {/* 1. LOGIC: Check for Image, otherwise use Gradient */}
              {service.image ? (
                <>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none"; // Hide broken image
                      // You could show a fallback gradient here if you had a ref,
                      // but simpler to just let the background color show or rely on the gradient div below if rendered conditionally.
                    }}
                  />
                  {/* Dark Overlay so text remains readable over the image */}
                  <div className="absolute inset-0 bg-black/40"></div>
                </>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    service.gradient || "from-pink-500 to-purple-500"
                  }`}
                ></div>
              )}

              {/* 2. Content Overlay (Badges, Icon, Title) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                {/* Badges - Top Left */}
                <div className="absolute top-6 left-6 flex flex-col space-y-2">
                  {service.popular && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                      <Star className="h-4 w-4" />
                      <span>Popular</span>
                    </div>
                  )}
                  {service.category === "combo" && (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Combo Offer
                    </div>
                  )}
                </div>

                {/* Action Buttons - Top Right */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 dark:hover:bg-black/60 transition-all duration-300"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isLiked ? "text-red-500 fill-red-500" : "text-white"
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 dark:hover:bg-black/60 transition-all duration-300"
                  >
                    <Share2 className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Center Content (Icon & Title) */}
                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/30">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">
                    {service.name}
                  </h1>
                  <p className="text-white/90 text-lg capitalize font-medium drop-shadow-sm">
                    {service.category} Service
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Card (Kept as is) */}
            <div className="flex items-center justify-between mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(service.rating) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {service.rating}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {service.reviews} reviews
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{service.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Service Details */}
          <div>
            <div className="mb-8">
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.longDescription || service.description}
              </p>
            </div>

            {/* Pricing and Booking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{service.price * quantity}
                  </div>
                  {service.originalPrice && (
                    <div className="text-lg text-gray-400 dark:text-gray-500 line-through">
                      ₹{service.originalPrice * quantity}
                    </div>
                  )}
                  {service.savings && (
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      Save ₹{service.savings * quantity}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Qty:</span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>

                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 font-semibold py-4 px-6 rounded-xl transition-all duration-300">
                  <Phone className="h-5 w-5" />
                </button>

                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 font-semibold py-4 px-6 rounded-xl transition-all duration-300">
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Safe & Hygienic
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Certified Experts
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  2847+ Happy Clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {(service.features && service.features.length > 0) ||
        (service.benefits && service.benefits.length > 0) ||
        (service.services && service.services.length > 0) ? (
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              What's Included
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Service Features:
                  </h3>
                  <div className="space-y-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Benefits:
                  </h3>
                  <div className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="h-5 w-5 text-emerald-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Combo Services */}
              {service.services && service.services.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Combo Includes:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {service.services.map((item, index) => (
                      <div
                        key={index}
                        className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 flex items-center space-x-3"
                      >
                        <CheckCircle className="h-5 w-5 text-pink-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <div
                  key={relatedService.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-32 relative overflow-hidden">
                    {relatedService.image ? (
                      <img
                        src={relatedService.image}
                        alt={relatedService.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : null}

                    {/* Fallback Gradient (sits behind the image, visible if image is missing or fails to load) */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        relatedService.gradient || "from-pink-500 to-purple-500"
                      } flex items-center justify-center`}
                    >
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {relatedService.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {relatedService.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{relatedService.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {relatedService.rating}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/services/${relatedService.slug}`}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Booking Confirmation
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Service:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{service.name}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Quantity:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{quantity}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Duration:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{service.duration}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-pink-600 dark:text-pink-400">
                  ₹{service.price * quantity}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  alert("Booking confirmed! We will contact you shortly.");
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
