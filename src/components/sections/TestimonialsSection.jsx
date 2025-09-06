import React, { useState, useEffect, useRef } from 'react';
import { 
  Star,
  MessageCircle,
  ArrowRight,
  Calendar,
  MapPin,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Simulated Google Maps reviews (replace with real API call)
  const fetchGoogleReviews = async () => {
    setLoading(true);
    
    // TODO: Replace with actual Google Maps API call
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&fields=reviews&key=YOUR_API_KEY`);
    
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockGoogleReviews = [
      {
        id: 1,
        author_name: "Jessica Chen",
        author_url: "https://www.google.com/maps/contrib/...",
        profile_photo_url: "/images/profiles/jessica.jpg",
        rating: 5,
        relative_time_description: "5 days ago",
        text: "Absolutely incredible experience! The facial was better than any spa I've been to, and I didn't even have to leave my house. The products they used made my skin glow for days. I'm definitely booking again!",
        time: 1693890000,
        location: "San Francisco, CA",
        service_type: "Signature Facial"
      },
      {
        id: 2,
        author_name: "Maria Rodriguez",
        author_url: "https://www.google.com/maps/contrib/...",
        profile_photo_url: "/images/profiles/maria.jpg",
        rating: 5,
        relative_time_description: "1 week ago",
        text: "I was skeptical about at-home services, but Glow Services exceeded all my expectations. The nail technician was professional, skilled, and my manicure lasted longer than salon visits. Plus, the convenience is unmatched!",
        time: 1693630000,
        location: "Los Angeles, CA",
        service_type: "Professional Manicure"
      },
      {
        id: 3,
        author_name: "Amanda Thompson",
        author_url: "https://www.google.com/maps/contrib/...",
        profile_photo_url: "/images/profiles/amanda.jpg",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "The hair styling service was phenomenal! The stylist understood exactly what I wanted and created the perfect look for my wedding day. All my guests were asking where I got my hair done. Highly recommend!",
        time: 1693200000,
        location: "New York, NY",
        service_type: "Hair Styling"
      },
      {
        id: 4,
        author_name: "Sarah Johnson",
        author_url: "https://www.google.com/maps/contrib/...",
        profile_photo_url: "/images/profiles/sarah.jpg",
        rating: 5,
        relative_time_description: "3 weeks ago",
        text: "As a busy mom, finding time for beauty treatments was impossible until I discovered Glow Services. Now I can get pampered while my kids nap. The lash and brow service was incredible - I woke up looking amazing every day for weeks!",
        time: 1692800000,
        location: "Chicago, IL",
        service_type: "Lash & Brow Enhancement"
      },
      {
        id: 5,
        author_name: "Michael Davis",
        author_url: "https://www.google.com/maps/contrib/...",
        profile_photo_url: "/images/profiles/michael.jpg",
        rating: 5,
        relative_time_description: "1 month ago",
        text: "The product quality is outstanding! I ordered the skincare set and have seen dramatic improvements in my skin texture and brightness. The delivery was fast, packaging was beautiful, and the results speak for themselves.",
        time: 1691700000,
        location: "Miami, FL",
        service_type: "Product Order"
      }
    ];
    
    setReviews(mockGoogleReviews);
    setLoading(false);
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "2,847", label: "Happy Clients", icon: "👥" },
    { number: "98.5%", label: "Satisfaction Rate", icon: "💯" },
    { number: "95%", label: "Return Clients", icon: "🔄" }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 shadow-lg mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-orange-600 font-medium tracking-wide uppercase text-sm">
              Client Love
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            What Our Clients Say
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Don't just take our word for it. Here's what thousands of satisfied clients have to say 
            about their Glow Services experience.
          </p>

          {/* Refresh Reviews Button */}
          <button
            onClick={fetchGoogleReviews}
            disabled={loading}
            className={`inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading Reviews...' : 'Latest Google Reviews'}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.slice(0, 5).map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative ${isVisible ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'}`}
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {/* Google Maps Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>Google</span>
                </div>
              </div>

              {/* Rating & Time */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{review.relative_time_description}</span>
                </div>
              </div>

              {/* Review Text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 italic text-lg">
                "{review.text}"
              </blockquote>

              {/* Service Type Badge */}
              {review.service_type && (
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                    {review.service_type}
                  </span>
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{review.author_name}</div>
                  <div className="text-gray-600 text-sm flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{review.location}</span>
                  </div>
                </div>
                <a 
                  href={review.author_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics & CTA Section */}
        <div className={`bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 rounded-3xl p-12 shadow-xl transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-2">{stat.icon}</div>
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
                {stat.label === "Average Rating" && (
                  <div className="flex justify-center mt-2">
                    {renderStars(5)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Community of Satisfied Clients
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the difference that professional, convenient beauty services can make in your life.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="https://www.google.com/search?q=glow+services+reviews" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Read More Reviews</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Reviews</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Verified Customers</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
