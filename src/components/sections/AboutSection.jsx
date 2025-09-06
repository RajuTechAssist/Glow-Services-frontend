import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart,
  Target,
  Award,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
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

  const stats = [
    { number: "5+", label: "Years Experience", color: "text-pink-600" },
    { number: "50+", label: "Expert Professionals", color: "text-rose-600" },
    { number: "15", label: "Cities Served", color: "text-orange-600" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Heart className="h-5 w-5 text-pink-500" />
            <span className="text-pink-600 font-medium tracking-wide uppercase text-sm">
              Our Story
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Founder Image & Quote */}
          <div className={`relative transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            
            {/* Decorative Circle */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-60"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center relative">
                
                {/* Placeholder for founder image */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-200"></div>
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-pink-600" />
                  </div>
                  <div className="text-pink-700 font-semibold text-lg">Sarah M.</div>
                  <div className="text-pink-600">Founder & CEO</div>
                </div>
              </div>

              {/* Quote Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Sarah M.</div>
                    <div className="text-sm text-gray-700 mb-1">Founder & CEO</div>
                    <p className="text-gray-600 italic leading-relaxed text-sm">
                      "Beauty should be accessible, convenient, and luxurious for everyone."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            
            {/* Main Heading */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Beauty That Comes to You
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded with a simple belief: everyone deserves access to professional beauty 
                services without compromising their lifestyle. We've revolutionized the beauty 
                industry by bringing luxury directly to your doorstep.
              </p>
            </div>

            {/* Our Mission */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To make professional beauty services accessible, convenient, and luxurious 
                  for everyone, anywhere, anytime.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Excellence, convenience, and authenticity guide everything we do. We believe 
                  beauty is personal, and our services reflect that philosophy.
                </p>
              </div>
            </div>

            {/* Our Promise */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Promise</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Every service, every product, every interaction is designed to make you feel 
                  beautiful, confident, and absolutely radiant.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                to="/about"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                <span>Learn Our Story</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
