import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  User,
  Building,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Sparkles
} from 'lucide-react';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual form submission API
      // await submitContactForm(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceType: ''
      });
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      info: "+91 98765 43210",
      subInfo: "Available 24/7",
      gradient: "from-green-500 to-emerald-500",
      action: "tel:+919876543210"
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "hello@glowservices.com",
      subInfo: "We reply within 2 hours",
      gradient: "from-blue-500 to-cyan-500",
      action: "mailto:hello@glowservices.com"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Multiple Locations",
      subInfo: "Serving 15+ cities nationwide",
      gradient: "from-purple-500 to-pink-500",
      action: "/locations"
    },
    {
      icon: Calendar,
      title: "Book Online",
      info: "Easy Scheduling",
      subInfo: "Available slots 7 days a week",
      gradient: "from-orange-500 to-red-500",
      action: "/services"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 6:00 PM" }
  ];

  const socialLinks = [
    { icon: Instagram, platform: "Instagram", followers: "15K", url: "#", color: "from-pink-500 to-rose-500" },
    { icon: Facebook, platform: "Facebook", followers: "8K", url: "#", color: "from-blue-500 to-indigo-500" },
    { icon: Twitter, platform: "Twitter", followers: "5K", url: "#", color: "from-cyan-400 to-blue-500" },
    { icon: Youtube, platform: "YouTube", followers: "12K", url: "#", color: "from-red-500 to-pink-500" }
  ];

  const serviceTypes = [
    "General Inquiry",
    "Service Booking",
    "Product Order",
    "Partnership",
    "Media & Press",
    "Technical Support",
    "Feedback & Suggestions"
  ];

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Thank You! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We've received your message and will get back to you within 2 hours. 
              Our team is excited to help you with your beauty needs!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium tracking-wide uppercase text-sm">
              Get in Touch
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Ready to Start Your
            <span className="block bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Beauty Journey?
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Have questions about our services? Ready to book your first appointment? 
            Our friendly team is here to help you achieve your beauty goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Contact Form - 2/3 width */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className={`block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className={`block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  {/* Service Type */}
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                        disabled={isLoading}
                      >
                        <option value="">Select inquiry type</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your message"
                    className={`block w-full px-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    disabled={isLoading}
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your requirements..."
                    className={`block w-full px-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    disabled={isLoading}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                  {errors.submit && <p className="mt-2 text-sm text-red-600 text-center">{errors.submit}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar - 1/3 width */}
          <div className={`lg:col-span-1 space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            
            {/* Contact Methods */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="group">
                      <a 
                        href={info.action.startsWith('/') ? info.action : info.action}
                        className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group-hover:-translate-y-1"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                          <p className="text-gray-800 font-medium">{info.info}</p>
                          <p className="text-gray-500 text-sm">{info.subInfo}</p>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className="text-gray-900 font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-emerald-50 rounded-2xl">
                <p className="text-emerald-700 text-sm font-medium text-center">
                  ✨ Emergency services available 24/7 for existing clients
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Follow Us</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gradient-to-r ${social.color} p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <div className="text-left">
                          <div className="text-sm font-semibold">{social.platform}</div>
                          <div className="text-xs opacity-90">{social.followers} followers</div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
