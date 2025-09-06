import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Import the new About Page
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

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
    <CartProvider>
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
