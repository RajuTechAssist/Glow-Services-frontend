import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Clock, Calendar, User, ArrowRight, Tag, Eye, Heart, Share2, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api'; // Import API

const BlogSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [blogs, setBlogs] = useState([]); // Store real blogs here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ FETCH REAL BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await ApiService.getPublishedBlogs();
        // Sort by newest first
        const sorted = data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        setBlogs(sorted);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load updates.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
    >
      {/* ... Background elements (same as before) ... */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-100 mb-6">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span className="text-blue-600 font-medium tracking-wide uppercase text-sm">
              Beauty Insights
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Latest from Our <span className="text-blue-600">Beauty Blog</span>
          </h2>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading amazing content...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm p-8">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-gray-800">No posts yet</h3>
            <p className="text-gray-500">Check back soon for beauty tips!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {blogs.slice(0, 4).map((post, index) => (
              <article
                key={post.id}
                className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Blog Image - Using S3 URL */}
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                      <BookOpen className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 text-lg line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author ? post.author.charAt(0) : 'A'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{post.author || 'Glow Team'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;