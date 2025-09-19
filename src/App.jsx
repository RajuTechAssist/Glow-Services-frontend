import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import ProtectedCustomerRoute from './components/ProtectedCustomerRoute';

// User components
import Header from './components/layout/header';
import HeroSection from './components/sections/HeroSection';
import WhyChooseSection from './components/sections/WhyChooseSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import ServicesSection from './components/sections/ServicesSection';
import ProductsSection from './components/sections/ProductsSection';
import AboutSection from './components/sections/AboutSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import CallToActionSection from './components/sections/CallToActionSection';
import NewsletterSection from './components/sections/NewsletterSection';
import BlogSection from './components/sections/BlogSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/sections/Footer';
import { CartProvider } from './context/CartContext';
import CheckoutPage from './pages/CheckoutPage';



// Admin components
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ServicesAdminPage from './pages/admin/ServicesAdminPage';
import ServiceForm from './pages/admin/ServiceForm';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import ProductForm from './pages/admin/ProductForm';
import CustomersAdminPage from './pages/admin/CustomersAdminPage';
import CustomerForm from './pages/admin/CustomerForm';
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage';
import CategoryForm from './pages/admin/CategoryForm';
import BlogsAdminPage from './pages/admin/BlogsAdminPage';
import BlogForm from './pages/admin/BlogForm';


// Customer components
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerRewards from './pages/customer/CustomerRewards';
import CustomerHistory from './pages/customer/CustomerHistory';



// Import the new About Page
import AboutPage from './pages/AboutPage';
// Services
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

// NEW: Products
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

// KeepAlive Component to ping backend
import KeepAlive from './components/KeepAlive';

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
    <p className="text-gray-600 max-w-2xl mx-auto">Shop our curated collection of premium beauty products.</p>
  </div>
);

const Blog = () => (
  <div className="pt-20 p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Beauty Blog</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">Tips, trends, and insights from beauty experts.</p>
  </div>
);

const Contact = () => (
  <div className="pt-20 p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">Get in touch with our team.</p>
  </div>
);

function App() {
  return (
    <AdminAuthProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <main>
                <Routes>
                  <Route path="/" element={
                    <div className="min-h-screen bg-white">
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
                  } />
                  <Route path="/about" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <AboutPage />
                      <Footer />
                    </div>
                  } />
                  <Route path="/services" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <ServicesPage />
                      <Footer />
                    </div>
                  } />
                  <Route path="/services/:slug" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <ServiceDetailPage />
                      <Footer />
                    </div>
                  } />
                  {/* ===== NEW: PRODUCTS ROUTES ===== */}
                  <Route path="/products" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <ProductsPage />
                      <Footer />
                    </div>
                  } />

                  <Route path="/products/:slug" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <ProductDetailPage />
                      <Footer />
                    </div>
                  } />

                  <Route path="/blog" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <BlogSection />
                      <Footer />
                    </div>
                  } />
                  <Route path="/contact" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <ContactSection />
                      <Footer />
                    </div>
                  } />
                  <Route path="/checkout" element={
                    <div className="min-h-screen bg-white">
                      <Header />
                      <CheckoutPage />
                      <Footer />
                    </div>
                  } />

                  {/* Admin Login (Public) */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }>
                    {/* Nested Admin Routes - These will render in <Outlet /> */}
                    <Route index element={<Navigate to="dashboard" replace />} />
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
                    <Route path="customers/edit/:id" element={<CustomerForm />} />

                    {/* Categories */}
                    <Route path="categories" element={<CategoriesAdminPage />} />
                    <Route path="categories/create" element={<CategoryForm />} />
                    <Route path="categories/edit/:id" element={<CategoryForm />} />

                    {/* ✅ NEW: Blog Management */}
                    <Route path="blogs" element={<BlogsAdminPage />} />
                    <Route path="blogs/create" element={<BlogForm />} />
                    <Route path="blogs/edit/:id" element={<BlogForm />} />
                  </Route>

                  {/* CUSTOMER AUTH ROUTES - Public */}
                  <Route path="/customer/login" element={<CustomerLogin />} />
                  <Route path="/customer/register" element={<CustomerRegister />} />
                  {/* PROTECTED CUSTOMER ROUTES */}
                  <Route path="/customer" element={
                    <ProtectedCustomerRoute>
                      <CustomerLayout />
                    </ProtectedCustomerRoute>
                  }>
                    <Route index element={<Navigate to="/customer/dashboard" replace />} />
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="rewards" element={<CustomerRewards />} />
                    <Route path="history" element={<CustomerHistory />} />
                  </Route>
                  
                  {/* Redirect any unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <KeepAlive />
              </main>
            </div>
          </Router>
        </CartProvider>
      </CustomerAuthProvider>
    </AdminAuthProvider>
  );
}

export default App;
