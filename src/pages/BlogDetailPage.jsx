import config from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ArrowLeft,
  Tag,
  User,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const BACKEND_URL = config.BASE_URL;

useEffect(() => {
  const fetchBlog = async () => {
    try {
      // PUBLIC endpoint - NO auth required
      const response = await fetch(
        `${BACKEND_URL}/api/blogs/slug/${slug}`
      );
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBlog();
}, [slug]);


  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      
      // Fetch blog post
      const response = await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
        
        // Increment view count
        incrementViewCount();
        
        // Fetch related blogs
        if (data.category) {
          fetchRelatedBlogs(data.category, data.id);
        }
      } else if (response.status === 404) {
        alert('Blog post not found');
        navigate('/blogs');
      } else {
        console.error('Failed to fetch blog post');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Error loading blog post');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const fetchRelatedBlogs = async (category, currentBlogId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/blogs/category/${category}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out current blog and limit to 3
        const filtered = data.filter(b => b.id !== currentBlogId).slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    if (liked) return; // Prevent multiple likes
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setLiked(true);
        setBlog(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareMenu(false);
  };

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h2>
          <Link to="/blogs" className="text-pink-600 hover:text-pink-700">
            ← Back to all blogs
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all blogs
        </button>
      </div>

      {/* Hero Section with Featured Image */}
      {blog.featuredImage && (
        <div className="w-full h-96 relative overflow-hidden mb-8">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{blog.author}</p>
                <p className="text-xs text-gray-500">Beauty Expert</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>

            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-pink-500" />
              <span>{readingTime} min read</span>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-pink-500" />
              <span>{(blog.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Social Share & Like */}
          <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                liked
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              } disabled:opacity-50`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{blog.likes || 0}</span>
            </button>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 rounded-full transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10 min-w-[200px]">
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <ReactMarkdown
              className="markdown-content"
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 my-6" {...props} />
                ),
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-pink-600" {...props} />
                  ) : (
                    <code className="block bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                  ),
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                a: ({node, ...props}) => <a className="text-pink-600 hover:text-pink-700 underline" {...props} />
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 text-pink-500 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/blogs?tag=${tag}`}
                  className="bg-white border border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-700 px-4 py-2 rounded-full text-sm transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-12 border border-pink-100">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">About {blog.author}</h3>
              <p className="text-gray-700 leading-relaxed">
                Beauty expert and skincare enthusiast dedicated to helping you achieve your best skin. 
                Sharing professional tips, product recommendations, and honest reviews to guide your beauty journey.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <img
                    src={relatedBlog.featuredImage || '/api/placeholder/400/200'}
                    alt={relatedBlog.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-xs text-pink-600 font-medium">
                      {relatedBlog.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 mt-2 line-clamp-2 hover:text-pink-600 transition-colors">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
