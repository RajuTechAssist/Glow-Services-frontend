import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  // Intersection Observer for animations
  useEffect(() => {
    const observers = {};
    
    Object.keys(sectionRefs.current).forEach(key => {
      if (sectionRefs.current[key]) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.1 }
        );
        observers[key].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.values(observers).forEach(observer => observer.disconnect());
    };
  }, []);

  const milestones = [
    {
      year: "2021",
      title: "The Beginning",
      description: "Glow Services was born from a simple thought – every woman deserves to feel beautiful and cared for.",
      icon: Sparkles
    },
    {
      year: "2022",
      title: "Growing Strong",
      description: "Expanded our team of certified beauticians and launched across Delhi NCR.",
      icon: Users
    },
    {
      year: "2023",
      title: "Premium Services",
      description: "Introduced advanced treatments and partnered with leading beauty brands.",
      icon: Award
    },
    {
      year: "2024",
      title: "Trusted Name",
      description: "Served 2000+ happy clients and became Delhi NCR's trusted salon-at-home service.",
      icon: Star
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Beauty is for Everyone",
      description: "We believe every woman deserves to feel gorgeous, regardless of her circumstances or schedule.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Home,
      title: "Comfort First",
      description: "Experience premium salon services in the comfort and safety of your own home.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Hygiene & Safety",
      description: "We maintain the highest standards of cleanliness and use only sterilized equipment.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Clock,
      title: "Your Time Matters",
      description: "No rushing, no waiting, no leaving your loved ones behind. Beauty on your schedule.",
      gradient: "from-blue-500 to-indigo-500"
    }
  ];

  const stats = [
    { number: "2021", label: "Founded", icon: Calendar },
    { number: "2847+", label: "Happy Clients", icon: Users },
    { number: "15+", label: "Cities Served", icon: MapPin },
    { number: "98.5%", label: "Satisfaction Rate", icon: Star }
  ];

  return (
    <div className="min-h-screen pt-20">
      
      {/* Hero Section */}
      <section 
        ref={el => sectionRefs.current.hero = el}
        className="py-24 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-8 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-pink-600 font-medium tracking-wide uppercase text-sm">
                Our Story
              </span>
            </div>

            <h1 className={`text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8 transition-all duration-1000 delay-100 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              About Us – 
              <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                Our Story ✨
              </span>
            </h1>

            <p className={`text-2xl text-gray-600 leading-relaxed mb-12 transition-all duration-1000 delay-200 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The idea of Glow Services was born from a simple thought – every woman deserves to feel beautiful, confident, and cared for.
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-400 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="h-8 w-8 text-pink-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section 
        ref={el => sectionRefs.current.story = el}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Story Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible.story ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Every Woman Deserves 
                  <span className="block text-pink-500">Her Moment to Shine</span>
                </h2>
                
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    I noticed how many women, especially mothers, put their families first and forget to take time for themselves. A new mother, for example, spends her days and nights caring for her baby – often leaving no time to visit a salon.
                  </p>
                  
                  <p>
                    Yet, she too deserves those moments of self-care, relaxation, and glow.
                  </p>
                  
                  <p className="text-xl font-semibold text-gray-800">
                    That's when I decided to create Glow Services – Salon at Your Doorstep. 🌸
                  </p>
                  
                  <p>
                    We bring professional, hygienic, and affordable salon services directly to your home across Delhi NCR. No rushing, no waiting, no leaving your little one behind. Just comfort, care, and beauty delivered with love.
                  </p>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-pink-500" />
                  <span>Our Mission</span>
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is to make beauty accessible, convenient, and affordable – because every woman deserves her glow. ✨
                </p>
              </div>
            </div>

            {/* Visual Element */}
            <div className={`relative transition-all duration-1000 delay-200 ${isVisible.story ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-12 w-12 text-pink-600" />
                    </div>
                    <h3 className="text-pink-700 font-bold text-xl mb-2">Beauty at Home</h3>
                    <p className="text-pink-600">Comfort • Care • Convenience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        ref={el => sectionRefs.current.values = el}
        className="py-24 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              At Glow Services, 
              <span className="block text-pink-500">We Believe</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group text-center ${isVisible.values ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: `${400 + index * 150}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    💖 {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section 
        ref={el => sectionRefs.current.timeline = el}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible.timeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Our Journey
              <span className="block text-pink-500">Since 2021</span>
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible.timeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              From a simple idea to Delhi NCR's trusted salon-at-home service
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-rose-500"></div>
              
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={index}
                    className={`relative flex items-center mb-12 ${isEven ? 'md:flex-row-reverse' : ''} transition-all duration-1000 ${isVisible.timeline ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'}`}
                    style={{ animationDelay: `${400 + index * 200}ms` }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg z-10">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className={`bg-white rounded-2xl shadow-xl p-8 ml-24 md:ml-0 md:w-5/12 ${isEven ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8'} border border-gray-100 hover:shadow-2xl transition-shadow duration-300`}>
                      <div className="text-3xl font-bold text-pink-500 mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section 
        ref={el => sectionRefs.current.whoWeAre = el}
        className="py-24 bg-gradient-to-br from-gray-50 to-pink-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${isVisible.whoWeAre ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Who We Are 🌸
            </h2>
            
            <div className={`space-y-8 text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-200 ${isVisible.whoWeAre ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p>
                We are Glow Services, a passionate team dedicated to making beauty simple, safe, and accessible. Our goal is to bring professional salon services right to your doorstep, so you never have to compromise between your busy schedule and self-care.
              </p>
              
              <p>
                Our beauticians are skilled, trained, and committed to providing you with the same experience you'd expect in a premium salon – but with the added comfort of your home. From facials and manicures to full beauty packages, every service is delivered with care, hygiene, and a personal touch.
              </p>
              
              <p className="text-xl font-semibold text-gray-800">
                At Glow Services, we don't just provide beauty services – we create moments of relaxation, confidence, and glow for every woman. ✨
              </p>
            </div>

            {/* Trust Indicators */}
            <div className={`grid md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-400 ${isVisible.whoWeAre ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Certified Professionals</h3>
                <p className="text-gray-600">Skilled and trained beauticians</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Products</h3>
                <p className="text-gray-600">High-quality, safe products</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Touch</h3>
                <p className="text-gray-600">Care, hygiene, and attention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={el => sectionRefs.current.cta = el}
        className="py-24 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-4xl lg:text-5xl font-bold text-white mb-8 transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Ready to Experience the Glow?
            </h2>
            
            <p className={`text-xl text-white/90 mb-12 transition-all duration-1000 delay-200 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Join thousands of women who have discovered the convenience and luxury of professional beauty services at home.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-1000 delay-400 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                to="/services"
                className="group bg-white hover:bg-gray-50 text-pink-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Your Service</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/contact"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white/30 px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
