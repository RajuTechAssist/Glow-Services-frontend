import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";
import { ThemeProvider } from "./context/ThemeContext";

// User components
import Header from "./components/layout/header";
import HeroSection from "./components/sections/HeroSection";
import WhyChooseSection from "./components/sections/WhyChooseSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import ServicesSection from "./components/sections/ServicesSection";
import ProductsSection from "./components/sections/ProductsSection";
import AboutSection from "./components/sections/AboutSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import CallToActionSection from "./components/sections/CallToActionSection";
import NewsletterSection from "./components/sections/NewsletterSection";
import BlogSection from "./components/sections/BlogSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";
import { CartProvider } from "./context/CartContext";

// Lazy-loaded routes (deferred)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ServicesAdminPage = lazy(() => import("./pages/admin/ServicesAdminPage"));
const ServiceForm = lazy(() => import("./pages/admin/ServiceForm"));
const ProductsAdminPage = lazy(() => import("./pages/admin/ProductsAdminPage"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const CustomersAdminPage = lazy(() => import("./pages/admin/CustomersAdminPage"));
const CustomerForm = lazy(() => import("./pages/admin/CustomerForm"));
const CategoriesAdminPage = lazy(() => import("./pages/admin/CategoriesAdminPage"));
const CategoryForm = lazy(() => import("./pages/admin/CategoryForm"));
const BlogsAdminPage = lazy(() => import("./pages/admin/BlogsAdminPage"));
const BlogForm = lazy(() => import("./pages/admin/BlogForm"));
const BookingsAdminPage = lazy(() => import('./pages/admin/BookingsAdminPage'));

const CustomerLogin = lazy(() => import("./pages/customer/CustomerLogin"));
const CustomerRegister = lazy(() => import("./pages/customer/CustomerRegister"));
const CustomerLayout = lazy(() => import("./pages/customer/CustomerLayout"));
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));
const CustomerOrders = lazy(() => import("./pages/customer/CustomerOrders"));
const CustomerRewards = lazy(() => import("./pages/customer/CustomerRewards"));
const CustomerHistory = lazy(() => import("./pages/customer/CustomerHistory"));

const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

// KeepAlive Component to ping backend
import KeepAlive from "./components/KeepAlive";

import WhatsAppButton from "./components/WhatsAppButton";

import { initAnalytics, trackPageView } from "./utils/analytics";
import StructuredData from "./components/Seo/StructuredData";

// Home Page Component
const Home = () => (
  <div className="min-h-screen">
    <HeroSection />
    <WhyChooseSection />
    <HowItWorksSection />
    <ServicesSection />
    <ProductsSection />
    <AboutSection />
    <TestimonialsSection />
    <CallToActionSection />
    <NewsletterSection />
    <BlogSection />
    <ContactSection />

    {/* We'll add more sections here */}
  </div>
);

const Products = () => (
  <div className="pt-20 p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Beauty Products</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Shop our curated collection of premium beauty products.
    </p>
  </div>
);

const Blog = () => (
  <div className="pt-20 p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Beauty Blog</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Tips, trends, and insights from beauty experts.
    </p>
  </div>
);

const Contact = () => (
  <div className="pt-20 p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Get in touch with our team.
    </p>
  </div>
);

const AnalyticsListener = () => {
  const location = useLocation();
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      initAnalytics(gaId);
    }
  }, []);

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      trackPageView(gaId, `${location.pathname}${location.search}`);
    }
  }, [location]);

  return null;
};

function App() {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://glow-service.studio';
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Glow Services",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "sameAs": []
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": siteUrl,
      "name": "Glow Services",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Glow Services",
      "url": siteUrl,
      "image": `${siteUrl}/logo.png`,
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "areaServed": "IN",
      "makesOffer": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    }
  ];

  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <Router>
              <StructuredData data={structuredData} />
              <AnalyticsListener />
              <div className="App">
              <main>
                <KeepAlive />

                <WhatsAppButton />
                <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                          <Header />
                          <HeroSection />
                          <WhyChooseSection />
                          <HowItWorksSection />
                          <ServicesSection />
                          <ProductsSection />
                          <AboutSection />
                          <TestimonialsSection />
                          <CallToActionSection />
                          <NewsletterSection />
                          <BlogSection />
                          <ContactSection />
                          <Footer />
                          {/* We'll add more sections here */}
                        </div>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <AboutPage />
                          <Footer />
                        </div>
                      }
                    />
                    <Route
                      path="/services"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <ServicesPage />
                          <Footer />
                        </div>
                      }
                    />
                    <Route
                      path="/services/:slug"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <ServiceDetailPage />
                          <Footer />
                        </div>
                      }
                    />
                    {/* ===== PRODUCTS ROUTES ===== */}
                    <Route
                      path="/products"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <ProductsPage />
                          <Footer />
                        </div>
                      }
                    />

                    <Route
                      path="/products/:slug"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <ProductDetailPage />
                          <Footer />
                        </div>
                      }
                    />

                    <Route
                      path="/blog"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <BlogsPage />
                          <Footer />
                        </div>
                      }
                    />

                    <Route
                      path="/blog/:slug"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <BlogDetailPage />
                          <Footer />
                        </div>
                      }
                    />

                    <Route
                      path="/contact"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <ContactSection />
                          <Footer />
                        </div>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <div className="min-h-screen bg-white">
                          <Header />
                          <CheckoutPage />
                          <Footer />
                        </div>
                      }
                    />

                    {/* Admin Login (Public) */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedAdminRoute>
                          <AdminLayout />
                        </ProtectedAdminRoute>
                      }
                    >
                      <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                      />
                      <Route path="dashboard" element={<AdminDashboard />} />

                      {/* Services */}
                      <Route path="services" element={<ServicesAdminPage />} />
                      <Route path="services/create" element={<ServiceForm />} />
                      <Route path="services/edit/:id" element={<ServiceForm />} />

                      {/* Products */}
                      <Route path="products" element={<ProductsAdminPage />} />
                      <Route path="products/create" element={<ProductForm />} />
                      <Route path="products/edit/:id" element={<ProductForm />} />

                      {/* Customers */}
                      <Route path="customers" element={<CustomersAdminPage />} />
                      <Route path="customers/create" element={<CustomerForm />} />
                      <Route
                        path="customers/edit/:id"
                        element={<CustomerForm />}
                      />

                      {/* Categories */}
                      <Route
                        path="categories"
                        element={<CategoriesAdminPage />}
                      />
                      <Route
                        path="categories/create"
                        element={<CategoryForm />}
                      />
                      <Route
                        path="categories/edit/:id"
                        element={<CategoryForm />}
                      />

                      {/* Blog Management */}
                      <Route path="blogs" element={<BlogsAdminPage />} />
                      <Route path="blogs/create" element={<BlogForm />} />
                      <Route path="blogs/edit/:id" element={<BlogForm />} />

                      <Route path="/admin/bookings" element={<BookingsAdminPage />} />
                    </Route>

                    {/* CUSTOMER AUTH ROUTES - Public */}
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route
                      path="/customer/register"
                      element={<CustomerRegister />}
                    />
                    {/* PROTECTED CUSTOMER ROUTES */}
                    <Route
                      path="/customer"
                      element={
                        <ProtectedCustomerRoute>
                          <CustomerLayout />
                        </ProtectedCustomerRoute>
                      }
                    >
                      <Route
                        index
                        element={<Navigate to="/customer/dashboard" replace />}
                      />
                      <Route path="dashboard" element={<CustomerDashboard />} />
                      <Route path="profile" element={<CustomerProfile />} />
                      <Route path="orders" element={<CustomerOrders />} />
                      <Route path="rewards" element={<CustomerRewards />} />
                      <Route path="history" element={<CustomerHistory />} />
                    </Route>

                    {/* Redirect any unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
        </CartProvider>
      </CustomerAuthProvider>
    </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default App;
