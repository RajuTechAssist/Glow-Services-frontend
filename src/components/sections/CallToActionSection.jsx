import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar,
  ShoppingBag,
  Clock,
  Shield,
  Truck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: Clock,
      title: "Same Day Service",
      subtitle: "Book today, glow today",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Shield,
      title: "100% Guaranteed",
      subtitle: "Your satisfaction is our priority",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      subtitle: "On all product orders over ₹999",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full mix-blend-overlay filter blur-xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-1/3 w-6 h-6 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/6 w-5 h-5 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/30 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="h-5 w-5 text-white" />
            <span className="text-white font-medium tracking-wide uppercase text-sm">
              Ready to Glow?
            </span>
          </div>

          <h2 className={`text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Ready to Experience
            <span className="block">the Glow?</span>
          </h2>

          <p className={`text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join thousands of satisfied clients who have discovered the perfect blend of luxury, 
            convenience, and professional beauty services. Your glow-up is just one click away.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-20 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              to="/services"
              className="group bg-white hover:bg-gray-50 text-pink-600 font-bold px-10 py-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-3 text-lg"
            >
              <Calendar className="h-6 w-6" />
              <span>Book A Service</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/products"
              className="group bg-transparent hover:bg-white/10 text-white border-3 border-white/50 hover:border-white font-bold px-10 py-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-3 text-lg backdrop-blur-sm"
            >
              <ShoppingBag className="h-6 w-6" />
              <span>Shop Products</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center group"
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                {/* Icon Container */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Element */}
        <div className={`mt-16 flex justify-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-4 h-4 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>

      {/* Custom styles for enhanced effects */}
      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </section>
  );
};

export default CallToActionSection;
