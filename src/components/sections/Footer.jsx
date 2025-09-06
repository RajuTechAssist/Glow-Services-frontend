import React, { useState, useEffect } from 'react';
import { 
  ArrowUp,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Star,
  Shield,
  Award,
  Users,
  Send,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    // You can add actual newsletter logic here
  };

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Facial Treatments", url: "/services/facials" },
        { name: "Hair Services", url: "/services/hair" },
        { name: "Nail Care", url: "/services/nails" },
        { name: "Body Treatments", url: "/services/body" },
        { name: "Bridal Packages", url: "/services/bridal" },
        { name: "Men's Services", url: "/services/men" }
      ]
    },
    {
      title: "Products",
      links: [
        { name: "Skincare", url: "/products/skincare" },
        { name: "Makeup", url: "/products/makeup" },
        { name: "Hair Care", url: "/products/hair-care" },
        { name: "Body Care", url: "/products/body-care" },
        { name: "Tools & Accessories", url: "/products/tools" },
        { name: "Gift Cards", url: "/products/gift-cards" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Our Story", url: "/about/story" },
        { name: "Careers", url: "/careers" },
        { name: "Press & Media", url: "/press" },
        { name: "Partner With Us", url: "/partners" },
        { name: "Locations", url: "/locations" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Contact Us", url: "/contact" },
        { name: "Track Your Order", url: "/track-order" },
        { name: "Returns & Refunds", url: "/returns" },
        { name: "Booking Policy", url: "/booking-policy" },
        { name: "FAQ", url: "/faq" }
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: Instagram, 
      url: "https://instagram.com/glowservices", 
      name: "Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: Facebook, 
      url: "https://facebook.com/glowservices", 
      name: "Facebook",
      color: "hover:text-blue-500"
    },
    { 
      icon: Twitter, 
      url: "https://twitter.com/glowservices", 
      name: "Twitter",
      color: "hover:text-cyan-500"
    },
    { 
      icon: Youtube, 
      url: "https://youtube.com/glowservices", 
      name: "YouTube",
      color: "hover:text-red-500"
    },
    { 
      icon: Linkedin, 
      url: "https://linkedin.com/company/glowservices", 
      name: "LinkedIn",
      color: "hover:text-indigo-500"
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "SSL encrypted transactions"
    },
    {
      icon: Award,
      title: "Certified Professionals",
      description: "Licensed & insured experts"
    },
    {
      icon: Users,
      title: "2847+ Happy Clients",
      description: "5-star rated service"
    },
    {
      icon: Star,
      title: "98.5% Satisfaction",
      description: "Money-back guarantee"
    }
  ];

  const legalLinks = [
    { name: "Privacy Policy", url: "/privacy" },
    { name: "Terms of Service", url: "/terms" },
    { name: "Cookie Policy", url: "/cookies" },
    { name: "Accessibility", url: "/accessibility" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            
            {/* Company Info - 2 columns */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="flex items-center mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="ml-3 text-2xl font-bold">Glow Services</span>
              </Link>

              {/* Company Description */}
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Professional beauty services delivered to your doorstep. We bring luxury, 
                convenience, and exceptional results right to your home.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                  <Phone className="h-5 w-5 text-pink-500" />
                  <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                  <Mail className="h-5 w-5 text-pink-500" />
                  <a href="mailto:hello@glowservices.com" className="hover:underline">hello@glowservices.com</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <span>Serving 15+ cities nationwide</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock className="h-5 w-5 text-pink-500" />
                  <span>Available 7 days a week</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <Send className="h-5 w-5 text-pink-500" />
                  <span>Stay Updated</span>
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Get beauty tips and exclusive offers
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Navigation Links - 4 columns */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-6 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.url}
                        className="text-gray-300 hover:text-pink-400 transition-colors duration-200 flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {trustIndicators.map((indicator, index) => {
                const IconComponent = indicator.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-pink-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{indicator.title}</h4>
                    <p className="text-gray-400 text-sm">{indicator.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 font-medium">Follow Us:</span>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-200 hover:scale-110`}
                        aria-label={social.name}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Made with Love */}
              <div className="flex items-center space-x-2 text-gray-400">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
                <span>for beautiful people</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-gray-700 bg-black/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm">
              
              {/* Copyright */}
              <div className="text-gray-400">
                © {new Date().getFullYear()} Glow Services. All rights reserved.
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center space-x-6">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.url}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Version/Location */}
              <div className="text-gray-500 text-xs">
                India • v2.0.1
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* Custom styles for enhanced shadows */}
      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
