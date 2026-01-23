import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, User, ShoppingBag, ChevronRight, Home, Info, Phone, BookOpen, Sun, Moon } from 'lucide-react';
import ApiService from '../../services/api';
import styles from './Header.module.css';
import { useCart } from '../../context/CartContext';
import CartDropdown from '../../components/CartDropdown';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useTheme } from '../../context/ThemeContext';
import ProductsApi from '../../services/ProductsApiService';
import BookingChoiceModal from '../BookingChoiceModal';
import LotusIcon from '../icons/LotusIcon';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // For desktop hover/click
  const [isBookingChoiceOpen, setIsBookingChoiceOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // NEW: State for mobile accordion menus
  const [mobileExpanded, setMobileExpanded] = useState({
    services: false,
    products: false
  });

  const [services, setServices] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const { getTotalItems } = useCart();
  const cartRef = useRef(null);
  const { isCustomerLoggedIn, customerUser } = useCustomerAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Refs for dropdown management
  const servicesRef = useRef(null);
  const productsRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await ApiService.getAllServices();
        setServices(allServices.slice(0, 6));
      } catch (error) {
        console.error('Error fetching services for header:', error);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredProducts = await ProductsApi.getFeaturedProducts();
        setProducts(featuredProducts.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products for header:', error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target) &&
        productsRef.current && !productsRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // NEW: Toggle function for mobile accordions
  const toggleMobileSection = (section) => {
    setMobileExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const productCategories = [
    {
      name: 'Skincare',
      slug: 'skincare',
      icon: '🧴',
      subcategories: [
        { name: 'Cleansers', slug: 'cleansers' },
        { name: 'Serums', slug: 'serums' },
        { name: 'Moisturizers', slug: 'moisturizers' },
        { name: 'Sunscreen', slug: 'sunscreen' }
      ]
    },
    {
      name: 'Makeup',
      slug: 'makeup',
      icon: '💄',
      subcategories: [
        { name: 'Foundation', slug: 'foundation' },
        { name: 'Eye Makeup', slug: 'eye-makeup' },
        { name: 'Lips', slug: 'lips' },
        { name: 'Tools', slug: 'makeup-tools' }
      ]
    },
    {
      name: 'Hair Care',
      slug: 'haircare',
      icon: '💇',
      subcategories: [
        { name: 'Shampoo', slug: 'shampoo' },
        { name: 'Conditioner', slug: 'conditioner' },
        { name: 'Treatments', slug: 'treatments' },
        { name: 'Styling', slug: 'styling' }
      ]
    }
  ];


  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <LotusIcon size={44} />
            </div>
            <span className={styles.logoText}>Glow Services</span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/about" className={styles.navLink}>About</Link>

            {/* Desktop Services Dropdown */}
            <div className={styles.dropdown} ref={servicesRef}>
              <button onClick={() => toggleDropdown('services')} className={styles.dropdownButton}>
                Services
                <ChevronDown className={`${styles.chevron} ${openDropdown === 'services' ? styles.chevronOpen : ''}`} />
              </button>
              <div className={`${styles.dropdownMenu} ${openDropdown === 'services' ? styles.dropdownMenuOpen : ''}`}>
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Our Services</h3>
                </div>
                {services.length > 0 ? (
                  <div className="py-2">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.name}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <Link
                        to="/services"
                        className="block px-4 py-2 text-sm text-pink-600 dark:text-pink-400 font-semibold hover:bg-pink-50 dark:hover:bg-gray-700"
                        onClick={() => setOpenDropdown(null)}
                      >
                        View All Services →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center"><p className="text-gray-500 text-sm">Loading...</p></div>
                )}
              </div>
            </div>

            {/* Desktop Products Dropdown */}
            <div className={styles.dropdown} ref={productsRef}>
              <button onClick={() => toggleDropdown('products')} className={styles.dropdownButton}>
                Products
                <ChevronDown className={`${styles.chevron} ${openDropdown === 'products' ? styles.chevronOpen : ''}`} />
              </button>
              <div className={`${styles.dropdownMenu} ${openDropdown === 'products' ? styles.dropdownMenuOpen : ''}`}>
                {/* ... (Existing Desktop Product Menu Logic) ... */}
                 <div className="py-2">
                  {productCategories.map((category) => (
                    <Link 
                      key={category.slug}
                      to={`/products?category=${category.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 hover:text-pink-600 dark:hover:text-pink-400"
                      onClick={() => setOpenDropdown(null)}
                    >
                       <span className="mr-2">{category.icon}</span> {category.name}
                    </Link>
                  ))}
                   <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <Link
                        to="/products"
                        className="block px-4 py-2 text-sm text-pink-600 dark:text-pink-400 font-semibold hover:bg-pink-50 dark:hover:bg-gray-700"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Shop All Products →
                      </Link>
                    </div>
                 </div>
              </div>
            </div>

            <Link to="/blog" className={styles.navLink}>Blog</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          {/* Right Section (Cart & Mobile Toggle) */}
          <div className={styles.rightSection}>
            <div className="relative" ref={cartRef}>
              <button onClick={() => setShowCartDropdown(!showCartDropdown)} className={styles.cartButton}>
                <ShoppingBag className="h-5 w-5" />
                <span className={styles.cartBadge}>{getTotalItems()}</span>
              </button>
              <CartDropdown isOpen={showCartDropdown} onClose={() => setShowCartDropdown(false)} />
            </div>

            {/* Desktop Auth & Book */}
            <div className={styles.authSection}>
              {isCustomerLoggedIn ? (
                <button onClick={() => navigate('/customer/dashboard')} className={styles.loginLink}>
                  Hi, {customerUser.fullName.split(' ')[0]}
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/customer/login')} className={styles.loginLink}>Login</button>
                  <button onClick={() => navigate('/customer/register')} className={styles.loginLink}>Register</button>
                </>
              )}
              <button 
                onClick={() => setIsBookingChoiceOpen(true)} 
                className={styles.bookButton}
              >
                Book Now
              </button>
            </div>

             {/* Theme Toggle Button */}
             <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuButton}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-xl border-t border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col p-4 space-y-1">
              
              {/* Standard Links */}
              <Link to="/" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-400" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link to="/about" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Info className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-400" />
                <span className="font-medium">About</span>
              </Link>

              {/* Collapsible Services Section */}
              <div>
                <button 
                  onClick={() => toggleMobileSection('services')}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-3 flex items-center justify-center text-xl">✨</span>
                    <span className="font-medium">Services</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileExpanded.services ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Collapsible Content */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded.services ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl mx-2 mt-1 mb-2 py-2">
                    {services.slice(0, 5).map(service => (
                      <Link 
                        key={service.id} 
                        to={`/services/${service.slug}`}
                        className="flex items-center px-6 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ChevronRight className="w-3 h-3 mr-2 text-pink-400" />
                        {service.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2 px-6">
                      <Link to="/services" className="text-sm font-semibold text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Products Section */}
              <div>
                <button 
                  onClick={() => toggleMobileSection('products')}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-3 flex items-center justify-center text-xl">🛍️</span>
                    <span className="font-medium">Products</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileExpanded.products ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded.products ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl mx-2 mt-1 mb-2 py-2">
                    {productCategories.map(cat => (
                      <Link 
                        key={cat.slug} 
                        to={`/products?category=${cat.slug}`}
                        className="flex items-center px-6 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="mr-2 text-xs">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                     <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2 px-6">
                      <Link to="/products" className="text-sm font-semibold text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>
                        Shop All Products →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Links */}
              <Link to="/blog" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <BookOpen className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-400" />
                <span className="font-medium">Blog</span>
              </Link>
              
              <Link to="/contact" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Phone className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-400" />
                <span className="font-medium">Contact</span>
              </Link>

              {/* Mobile Auth & CTA */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 px-4 pb-4 space-y-3">
                {isCustomerLoggedIn ? (
                  <div className="flex items-center p-3 bg-pink-50 dark:bg-gray-800 rounded-xl border border-pink-100 dark:border-gray-600">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {customerUser?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customerUser?.fullName}</p>
                      <Link to="/customer/dashboard" className="text-xs text-pink-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { navigate('/customer/login'); setIsMobileMenuOpen(false); }}
                      className="w-full py-2.5 text-gray-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { navigate('/customer/register'); setIsMobileMenuOpen(false); }}
                      className="w-full py-2.5 text-pink-600 font-medium bg-pink-50 dark:bg-gray-800 rounded-lg hover:bg-pink-100 dark:hover:bg-gray-700"
                    >
                      Register
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={() => { setIsBookingChoiceOpen(true); setIsMobileMenuOpen(false); }}
                  className="block w-full py-3 text-center text-white font-bold bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  Book Appointment Now
                </button>

                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full py-3 flex items-center justify-center gap-2 font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
      <BookingChoiceModal isOpen={isBookingChoiceOpen} onClose={() => setIsBookingChoiceOpen(false)} />
    </header>
  );
};

export default Header;