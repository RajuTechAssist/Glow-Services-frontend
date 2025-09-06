import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail,
  Gift,
  Bell,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Heart,
  Users
} from 'lucide-react';

const NewsletterSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle newsletter signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual newsletter API call
      // await subscribeToNewsletter(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Get 20% off your first service + early access to new treatments",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Bell,
      title: "Beauty Tips",
      description: "Weekly expert tips, tutorials, and personalized skincare advice",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Sparkles,
      title: "Latest Trends",
      description: "Be the first to know about new products and seasonal services",
      gradient: "from-rose-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "25K+", label: "Subscribers", icon: Users },
    { number: "Weekly", label: "Beauty Tips", icon: Star },
    { number: "20%", label: "First Order Discount", icon: Gift }
  ];

  if (isSubscribed) {
    return (
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to the Glow Family! ✨
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for subscribing! Check your inbox for your exclusive 20% discount code 
              and get ready for amazing beauty tips and offers.
            </p>
            <div className="flex items-center justify-center space-x-4 text-green-600">
              <Heart className="h-5 w-5 fill-current" />
              <span className="font-medium">Your glow journey starts now!</span>
              <Heart className="h-5 w-5 fill-current" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/4 text-purple-300 animate-bounce" style={{ animationDelay: '0s' }}>
          <Mail className="h-6 w-6" />
        </div>
        <div className="absolute top-32 right-1/3 text-pink-300 animate-bounce" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute bottom-32 left-1/6 text-indigo-300 animate-bounce" style={{ animationDelay: '2s' }}>
          <Gift className="h-7 w-7" />
        </div>
        <div className="absolute bottom-16 right-1/4 text-rose-300 animate-bounce" style={{ animationDelay: '3s' }}>
          <Heart className="h-5 w-5 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Mail className="h-5 w-5 text-purple-500" />
            <span className="text-purple-600 font-medium tracking-wide uppercase text-sm">
              Stay Beautiful
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join Our Beauty
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Newsletter
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Get exclusive beauty tips, early access to new services, and special offers delivered 
            straight to your inbox. Plus, enjoy 20% off your first service when you subscribe!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Newsletter Form */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your 20% Discount!
                </h3>
                <p className="text-gray-600">
                  Subscribe now and receive instant access to exclusive offers
                </p>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Subscribe & Get 20% Off</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company. 
                  You can unsubscribe at any time.
                </p>
              </form>

              {/* Stats */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex justify-center mb-2">
                          <IconComponent className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                What You'll Get:
              </h3>
            </div>

            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-6 group"
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Additional Incentive */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mt-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white fill-current" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">VIP Treatment</h4>
              </div>
              <p className="text-gray-700">
                Newsletter subscribers get priority booking, exclusive member-only services, 
                and birthday surprises!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
