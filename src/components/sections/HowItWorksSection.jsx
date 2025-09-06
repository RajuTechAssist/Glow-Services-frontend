import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar,
  MapPin,
  UserCheck,
  Sparkles,
  ShoppingBag,
  Truck,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState('services');
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

  const serviceSteps = [
    {
      step: "01",
      icon: Calendar,
      title: "Book Your Service",
      description: "Choose your preferred service, date, and time slot. Our easy booking system lets you schedule in just minutes.",
      duration: "2 minutes",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      step: "02", 
      icon: UserCheck,
      title: "Professional Assignment",
      description: "We match you with a certified beauty expert based on your location and service requirements.",
      duration: "Instant",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      icon: MapPin,
      title: "Expert Arrives",
      description: "Your assigned professional arrives at your doorstep with all premium equipment and products.",
      duration: "On time",
      gradient: "from-rose-500 to-orange-500"
    },
    {
      step: "04",
      icon: Sparkles,
      title: "Enjoy Your Service",
      description: "Relax and enjoy your personalized beauty treatment in the comfort of your own home.",
      duration: "30-120 mins",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const productSteps = [
    {
      step: "01",
      icon: ShoppingBag,
      title: "Browse & Select",
      description: "Explore our curated collection of premium beauty products from top brands worldwide.",
      duration: "Browse freely",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      step: "02",
      icon: CreditCard,
      title: "Secure Checkout",
      description: "Add items to cart and complete your purchase with our secure payment gateway.",
      duration: "2 minutes",
      gradient: "from-pink-500 to-red-500"
    },
    {
      step: "03",
      icon: Package,
      title: "Careful Packaging",
      description: "Your products are carefully packaged with eco-friendly materials to ensure safe delivery.",
      duration: "Same day",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      step: "04",
      icon: Truck,
      title: "Fast Delivery",
      description: "Receive your premium beauty products within 24-48 hours with free shipping on orders above ₹999.",
      duration: "1-2 days",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const currentSteps = activeTab === 'services' ? serviceSteps : productSteps;

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Play className="h-5 w-5 text-pink-500" />
            <span className="text-pink-600 font-medium tracking-wide uppercase text-sm">
              How It Works
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Simple steps to
            <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              beauty perfection
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Whether you're booking a service or ordering products, we've made it incredibly simple 
            and convenient for you to access premium beauty solutions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Book Services
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              Order Products
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {currentSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={`${activeTab}-${index}`}
                className={`relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group ${isVisible ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  {step.description}
                </p>

                {/* Duration Badge */}
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-pink-500" />
                  <span className="text-pink-600 font-medium text-sm">{step.duration}</span>
                </div>

                {/* Connector Arrow - Hide on last item */}
                {index < currentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-pink-300 group-hover:text-pink-500 transition-colors duration-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Features */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Satisfaction</h3>
            <p className="text-gray-600">Love it or we'll make it right - guaranteed.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Always On Time</h3>
            <p className="text-gray-600">Punctual service delivery, every single time.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">Only the finest products and expert techniques.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl p-12 shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h3>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have experienced the convenience 
            and luxury of our premium beauty services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group bg-white text-pink-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
              <span>
                {activeTab === 'services' ? 'Book a Service' : 'Shop Products'}
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
