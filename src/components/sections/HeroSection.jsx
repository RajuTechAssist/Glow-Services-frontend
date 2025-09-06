import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Sparkles, Heart, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        {/* Decorative leaf pattern */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-10">
          <img 
            src="/images/leaf.png" 
            alt="Decorative leaf" 
            className="w-32 h-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-pink-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-1/3 w-6 h-6 bg-rose-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/6 w-5 h-5 bg-orange-300 rounded-full opacity-50 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8 lg:pr-12">
            
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="text-pink-600 font-medium tracking-wide uppercase text-sm">
                Premium Beauty Services
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Beauty that</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                  comes to you
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Experience professional beauty services in the comfort of your home. 
                Our certified experts bring luxury, convenience, and exceptional results 
                right to your doorstep.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center space-x-8 py-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2847+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/services"
                className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Book Your Service</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <button className="group flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition-colors duration-300">
                <div className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <Play className="h-5 w-5 text-pink-500 ml-1" fill="currentColor" />
                </div>
                <span className="font-medium">Watch Our Story</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">+</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600">Certified professionals</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative lg:block">
            <div className="relative">
              
              {/* Main Hero Image */}
              <div className="relative bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src="/images/service/indianBride2.png"
                  alt="Professional beauty service"
                  className="w-full h-auto rounded-2xl object-cover"
                  onError={(e) => {
                    // Fallback gradient if image doesn't load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-96 bg-gradient-to-br from-pink-200 to-rose-300 rounded-2xl flex items-center justify-center">
                        <div class="text-center">
                          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                          <p class="text-pink-600 font-medium">Beautiful Service Image</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Available 24/7</div>
                    <div className="text-xs text-gray-600">Book anytime</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Premium Products</div>
                    <div className="text-xs text-gray-600">Luxury brands only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-12 text-white"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
