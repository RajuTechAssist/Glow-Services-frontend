import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Clock, 
  Award, 
  Users, 
  Shield, 
  Heart,
  Sparkles,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';

const WhyChooseSection = () => {
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
      icon: Home,
      title: "At-Home Convenience",
      description: "No need to travel. Our certified professionals come to your doorstep with all equipment and premium products.",
      gradient: "from-pink-500 to-rose-500",
      delay: "delay-0"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book appointments that fit your schedule. Available 7 days a week, including evenings and weekends.",
      gradient: "from-purple-500 to-pink-500",
      delay: "delay-100"
    },
    {
      icon: Award,
      title: "Certified Experts",
      description: "All our beauty professionals are licensed, experienced, and trained in the latest techniques and trends.",
      gradient: "from-rose-500 to-orange-500",
      delay: "delay-200"
    },
    {
      icon: Shield,
      title: "Safety & Hygiene",
      description: "We follow strict sanitization protocols and use only sterilized, professional-grade tools and products.",
      gradient: "from-emerald-500 to-teal-500",
      delay: "delay-300"
    },
    {
      icon: Sparkles,
      title: "Premium Products",
      description: "We exclusively use high-end, professional beauty products from trusted brands for exceptional results.",
      gradient: "from-indigo-500 to-purple-500",
      delay: "delay-400"
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Every service is customized to your unique skin type, preferences, and beauty goals.",
      gradient: "from-pink-500 to-red-500",
      delay: "delay-500"
    }
  ];

  const stats = [
    { number: "2847+", label: "Happy Clients", icon: Users },
    { number: "98.5%", label: "Satisfaction Rate", icon: Star },
    { number: "500+", label: "Services Completed", icon: CheckCircle },
    { number: "24/7", label: "Customer Support", icon: Zap }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-3 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span className="text-pink-600 font-medium tracking-wide uppercase text-sm">
              Why Choose Glow Services
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Beauty redefined with
            <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              professional excellence
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Experience the difference with our premium at-home beauty services. We bring luxury, 
            convenience, and exceptional results right to your doorstep.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-pink-200 transition-all duration-500 hover:-translate-y-2 ${isVisible ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-8'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className={`bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl p-12 shadow-2xl transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to experience the Glow difference?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
              <span>Book Your Service Now</span>
              <CheckCircle className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            
            <button className="bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2">
              <span>Learn More</span>
              <Sparkles className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseSection;
