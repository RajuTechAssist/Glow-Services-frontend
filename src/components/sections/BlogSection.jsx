import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Calendar, ArrowRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';

const BlogSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch Featured Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await ApiService.getPublishedBlogs();
        
        // 1. Filter for FEATURED blogs only
        // 2. Sort by newest
        // 3. Take top 3 (to fit the 3-column grid perfectly)
        const featuredBlogs = data
          .filter(blog => blog.featured === true) 
          .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
          .slice(0, 3);

        setBlogs(featuredBlogs);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
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
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-100 mb-6">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-blue-600 font-medium tracking-wide uppercase text-sm">
              Expert Insights
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Latest from Our <span className="text-blue-600">Beauty Blog</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover expert tips, trends, and advice for your daily beauty routine.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm p-8 max-w-lg mx-auto">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-gray-800">No featured posts yet</h3>
            <p className="text-gray-500">Check back soon for beauty updates!</p>
          </div>
        ) : (
          // ✅ CHANGED: Grid cols to 3 for smaller cards
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {blogs.map((post, index) => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.id}
                className={`group block h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 150}ms`, transition: 'all 0.5s ease-out' }}
              >
                <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-2">
                  
                  {/* Image - Reduced height to h-48 for compactness */}
                  <div className="h-32 bg-gray-200 relative overflow-hidden">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content - Reduced padding to p-6 */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.publishDate)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto group-hover:underline">
                      Read Article <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-8 py-3 border border-blue-200 text-base font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;