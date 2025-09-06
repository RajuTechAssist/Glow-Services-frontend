import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Tag,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
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

  const toggleLike = (postId) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Skincare Tips for Glowing Summer Skin",
      excerpt: "Discover the secrets to maintaining radiant, healthy skin during the hottest months of the year with expert-approved techniques and products.",
      author: "Dr. Sarah Mitchell",
      authorRole: "Dermatologist",
      publishDate: "August 25, 2025",
      readTime: "5 min read",
      category: "Skincare",
      tags: ["Summer Care", "Glowing Skin", "Expert Tips"],
      image: "/images/blog/summer-skincare.jpg",
      gradient: "from-orange-400 to-pink-500",
      views: 2847,
      likes: 234,
      featured: true
    },
    {
      id: 2,
      title: "The Complete Guide to At-Home Hair Treatments",
      excerpt: "Transform your hair care routine with professional-grade treatments you can do from home. Learn the techniques used by top stylists.",
      author: "Maria Rodriguez",
      authorRole: "Hair Stylist",
      publishDate: "August 20, 2025",
      readTime: "7 min read",
      category: "Hair Care",
      tags: ["DIY", "Hair Treatments", "Professional Tips"],
      image: "/images/blog/hair-treatments.jpg",
      gradient: "from-purple-400 to-indigo-500",
      views: 1956,
      likes: 189,
      featured: false
    },
    {
      id: 3,
      title: "Bridal Beauty Timeline: Your 6-Month Preparation Guide",
      excerpt: "Plan your perfect wedding day look with our comprehensive timeline. From skincare prep to the final touches on your big day.",
      author: "Amanda Chen",
      authorRole: "Bridal Specialist",
      publishDate: "August 18, 2025",
      readTime: "8 min read",
      category: "Bridal",
      tags: ["Wedding", "Bridal Beauty", "Planning"],
      image: "/images/blog/bridal-guide.jpg",
      gradient: "from-rose-400 to-pink-500",
      views: 3421,
      likes: 312,
      featured: true
    },
    {
      id: 4,
      title: "Seasonal Color Analysis: Finding Your Perfect Palette",
      excerpt: "Discover which colors enhance your natural beauty and learn how to incorporate them into your makeup and wardrobe choices.",
      author: "Jessica Park",
      authorRole: "Color Consultant",
      publishDate: "August 15, 2025",
      readTime: "6 min read",
      category: "Makeup",
      tags: ["Color Theory", "Personal Style", "Makeup Tips"],
      image: "/images/blog/color-analysis.jpg",
      gradient: "from-emerald-400 to-teal-500",
      views: 1678,
      likes: 145,
      featured: false
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 text-blue-200 animate-bounce" style={{ animationDelay: '0s' }}>
          <BookOpen className="h-8 w-8" />
        </div>
        <div className="absolute top-40 right-1/3 text-indigo-200 animate-bounce" style={{ animationDelay: '1s' }}>
          <User className="h-6 w-6" />
        </div>
        <div className="absolute bottom-40 left-1/6 text-slate-300 animate-bounce" style={{ animationDelay: '2s' }}>
          <Tag className="h-7 w-7" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-100 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span className="text-blue-600 font-medium tracking-wide uppercase text-sm">
              Beauty Insights
            </span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Latest from Our
            <span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Beauty Blog
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Stay updated with the latest beauty trends, expert tips, and professional advice from 
            our team of certified beauty specialists and industry experts.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group ${isVisible ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'} ${post.featured ? 'lg:col-span-1' : ''}`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Blog Image */}
              <div className={`h-64 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(post.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group z-10"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors duration-300 ${
                      likedPosts.has(post.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-white group-hover:text-red-300'
                    }`} 
                  />
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>

                {/* Placeholder Icon */}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-8">
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  <Link to={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author & Read More */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{post.author}</div>
                      <div className="text-gray-600 text-xs">{post.authorRole}</div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Discover More Beauty Insights
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Explore our complete collection of beauty guides, expert tutorials, product reviews, 
                and industry insights to elevate your beauty routine.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <Link
                  to="/blog"
                  className="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>View All Posts</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <button className="bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>Subscribe to Newsletter</span>
                </button>
              </div>

              {/* Blog Stats */}
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>50+ Articles</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Weekly Updates</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Expert Writers</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
