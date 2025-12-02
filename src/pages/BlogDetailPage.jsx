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
    const fetchBlogData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        // 1. Fetch the Blog Post
        const response = await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}`);
        
        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data);

        // 2. Increment View Count (Fire and forget)
        fetch(`${BACKEND_URL}/api/blogs/slug/${slug}/view`, { method: 'POST' }).catch(console.error);

        // 3. Fetch Related Blogs if category exists
        if (data.category) {
          const relatedResponse = await fetch(`${BACKEND_URL}/api/blogs/category/${data.category}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out current blog and limit to 3
            setRelatedBlogs(relatedData.filter(b => b.id !== data.id).slice(0, 3));
          }
        }

      } catch (error) {
        console.error("Error loading blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug, BACKEND_URL]);

  const handleLike = async () => {
    if (liked || !blog) return;
    
    try {
      setLiked(true); // Optimistic update
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      
      await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}/like`, { method: 'POST' });
    } catch (error) {
      console.error('Error liking blog:', error);
      setLiked(false); // Revert on error
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
    setShowShareMenu(false);
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

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24 pb-12">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600 mt-4">Loading article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24 pb-12">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
          <p className="text-gray-600 mb-8">The blog post you are looking for might have been removed or is temporarily unavailable.</p>
          <Link to="/blog" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all blogs
        </Link>
      </div>

      {/* Hero Section with Featured Image */}
      {blog.featuredImage && (
        <div className="w-full h-[400px] relative overflow-hidden mb-8">
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
            <span className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="bg-yellow-400 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed italic border-l-4 border-pink-300 pl-4">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm border-b border-gray-200 pb-6">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {blog.author ? blog.author.charAt(0) : 'A'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{blog.author}</p>
                <p className="text-xs text-gray-500">Beauty Expert</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>
                {new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-pink-500" />
              <span>{calculateReadingTime(blog.content || '')} min read</span>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-pink-500" />
              <span>{(blog.views || 0).toLocaleString()} views</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {/* SAFEGUARD: We ensure content is a string, preventing crash on null */}
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
              }}
            >
              {blog.content || ''}
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
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Share & Like - Bottom */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all shadow-sm ${
              liked
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-medium">{liked ? 'Liked' : 'Like this post'}</span>
            <span className="ml-2 opacity-80">({blog.likes || 0})</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 rounded-full transition-all shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>

            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-10 min-w-[200px]">
                <button onClick={() => shareOnSocial('facebook')} className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left">
                  <Facebook className="w-4 h-4 text-blue-600 mr-3" /> Facebook
                </button>
                <button onClick={() => shareOnSocial('twitter')} className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left">
                  <Twitter className="w-4 h-4 text-sky-500 mr-3" /> Twitter
                </button>
                <button onClick={() => shareOnSocial('linkedin')} className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left">
                  <Linkedin className="w-4 h-4 text-blue-700 mr-3" /> LinkedIn
                </button>
                <button onClick={copyLink} className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left border-t border-gray-100 mt-1">
                  <Link2 className="w-4 h-4 text-gray-600 mr-3" /> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;