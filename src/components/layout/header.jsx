import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, User, ShoppingBag } from 'lucide-react';
import ApiService from '../../services/api';
import styles from './Header.module.css';
import { useCart } from '../../context/CartContext';
import CartDropdown from '../../components/CartDropdown';

import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import ProductsApi from '../../services/ProductsApiService';



const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
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

  // Fetch real services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await ApiService.getAllServices();
        // Take first 6 services for dropdown
        setServices(allServices.slice(0, 6));
      } catch (error) {
        console.error('Error fetching services for header:', error);
        // Fallback to empty array if API fails
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  // Fetch products for dropdown
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


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
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

  // ✅ UPDATED: Product categories with proper routing
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>G</div>
            <span className={styles.logoText}>Glow Services</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/about" className={styles.navLink}>About</Link>

            {/* Services Dropdown */}
            <div className={styles.dropdown} ref={servicesRef}>
              <button
                onClick={() => toggleDropdown('services')}
                className={styles.dropdownButton}
              >
                Services
                <ChevronDown className={`${styles.chevron} ${openDropdown === 'services' ? styles.chevronOpen : ''}`} />
              </button>

              <div className={`${styles.dropdownMenu} ${openDropdown === 'services' ? styles.dropdownMenuOpen : ''}`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">OUR SERVICES</h3>
                </div>

                {services.length > 0 ? (
                  <div className="py-2">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.slug}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-xs text-gray-400 capitalize">{service.category}</span>
                        </div>
                      </Link>
                    ))}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/services"
                        className="block px-4 py-3 text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200"
                        onClick={() => setOpenDropdown(null)}
                      >
                        View All Services →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-gray-500 text-sm">Loading services...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Dropdown */}
            <div className={styles.dropdown} ref={productsRef}>
              <button
                onClick={() => toggleDropdown('products')}
                className={styles.dropdownButton}
              >
                Products
                <ChevronDown className={`${styles.chevron} ${openDropdown === 'products' ? styles.chevronOpen : ''}`} />
              </button>

              <div className={`${styles.dropdownMenu} ${openDropdown === 'products' ? styles.dropdownMenuOpen : ''}`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">PRODUCT CATEGORIES</h3>
                </div>

                <div className="py-2">
                  {productCategories.map((category) => (
                    <div key={category.slug} className="px-4 py-2">
                      <Link
                        to={`/products?category=${category.slug}`}
                        className="block font-medium text-gray-900 hover:text-pink-600 transition-colors duration-200 mb-2"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {category.icon} {category.name}
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={`/products?category=${category.slug}&search=${sub.name}`}
                            className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/products"
                      className="block px-4 py-3 text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              </div>
            </div>


            <Link to="/blog" className={styles.navLink}>Blog</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          {/* Right Section */}
          <div className={styles.rightSection}>
            {/* Shopping Cart */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                className={styles.cartButton}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className={styles.cartBadge}>{getTotalItems()}</span>
              </button>

              <CartDropdown
                isOpen={showCartDropdown}
                onClose={() => setShowCartDropdown(false)}
              />
            </div>

            {/* Authentication Section */}
            <div className={styles.authSection}>
              {/* Authentication Section */}
              <div className={styles.authSection}>
                {isCustomerLoggedIn ? (
                  <button
                    onClick={() => navigate('/customer/dashboard')}
                    className={styles.loginLink}
                  >
                    Hi, {customerUser.fullName.split(' ')[0]}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/customer/login')}
                      className={styles.loginLink}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/customer/register')}
                      className={styles.loginLink}
                    >
                      Register
                    </button>
                  </>
                )}
              </div>

              <Link to="/book" className={styles.bookButton}>
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.mobileMenuButton}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>

            {/* Mobile Services Menu */}
            {services.length > 0 && (
              <div className="border-b border-gray-200 pb-3 mb-3">
                <div className="px-4 py-2">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Services</h4>
                </div>
                {services.slice(0, 4).map((service) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.slug}`}
                    className={styles.mobileNavLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
                <Link
                  to="/services"
                  className={`${styles.mobileNavLink} text-pink-600 font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View All Services →
                </Link>
              </div>
            )}

            {/* Mobile Products Menu */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <div className="px-4 py-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Products</h4>
              </div>
              {productCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/products/${category.slug}`}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/products"
                className={`${styles.mobileNavLink} text-pink-600 font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                View All Products →
              </Link>
            </div>

            <Link to="/blog" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link to="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>

            <div className={styles.mobileDivider}>
              <Link to="/login" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4 mr-2 inline" />
                Login
              </Link>
              <Link to="/book" className={styles.mobileBookButton} onClick={() => setIsMobileMenuOpen(false)}>
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
