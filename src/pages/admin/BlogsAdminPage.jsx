import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Eye, Edit, Trash2, Star, Calendar,
  TrendingUp, Users, MessageCircle, Share2, Sparkles, Heart
} from 'lucide-react';

const BlogsAdminPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample blog data - replace with API calls
  const sampleBlogs = [
    {
      id: 1,
      title: "10 Summer Skincare Tips for Glowing Skin",
      excerpt: "Discover essential summer skincare routines that will keep your skin healthy and radiant during the hot months.",
      category: "Skincare",
      status: "published",
      author: "Dr. Priya Sharma",
      publishDate: "2024-09-15",
      views: 1245,
      likes: 89,
      comments: 23,
      featured: true,
      image: "/api/placeholder/300/200",
      tags: ["summer", "skincare", "tips", "glowing-skin"]
    },
    {
      id: 2,
      title: "Perfect Bridal Makeup Look: Step-by-Step Tutorial",
      excerpt: "Create the perfect bridal makeup look with this comprehensive tutorial featuring long-lasting products.",
      category: "Makeup",
      status: "published",
      author: "Makeup Artist Anjali",
      publishDate: "2024-09-12",
      views: 2156,
      likes: 156,
      comments: 45,
      featured: false,
      image: "/api/placeholder/300/200",
      tags: ["bridal", "makeup", "tutorial", "wedding"]
    },
    {
      id: 3,
      title: "Hair Care Routine for Monsoon Season",
      excerpt: "Protect your hair from humidity and rain with these effective monsoon hair care tips and products.",
      category: "Hair Care",
      status: "draft",
      author: "Hair Specialist Rahul",
      publishDate: "2024-09-18",
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      image: "/api/placeholder/300/200",
      tags: ["monsoon", "hair-care", "humidity", "protection"]
    },
    {
      id: 4,
      title: "Anti-Aging Facial Treatments: What Really Works",
      excerpt: "An in-depth look at the most effective anti-aging treatments available at our spa.",
      category: "Treatments",
      status: "published",
      author: "Dr. Kavitha Reddy",
      publishDate: "2024-09-10",
      views: 3421,
      likes: 234,
      comments: 67,
      featured: true,
      image: "/api/placeholder/300/200",
      tags: ["anti-aging", "facial", "treatments", "spa"]
    },
    {
      id: 5,
      title: "Wellness Wednesday: Self-Care Rituals for Busy Women",
      excerpt: "Simple yet effective self-care routines that fit into your busy schedule.",
      category: "Wellness",
      status: "scheduled",
      author: "Wellness Coach Sneha",
      publishDate: "2024-09-20",
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      image: "/api/placeholder/300/200",
      tags: ["wellness", "self-care", "busy-women", "rituals"]
    }
  ];

  const categories = [
    "all", "Skincare", "Makeup", "Hair Care", "Treatments", "Wellness", "Product Reviews"
  ];

  const statuses = [
    "all", "published", "draft", "scheduled", "archived"
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(sampleBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || blog.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800', 
      scheduled: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const BlogStats = () => {
    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    const totalComments = blogs.reduce((sum, blog) => sum + blog.comments, 0);
    const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Posts</p>
              <p className="text-2xl font-bold">{blogs.length}</p>
            </div>
            <Star className="w-8 h-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Likes</p>
              <p className="text-2xl font-bold">{totalLikes}</p>
            </div>
            <Heart className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Published</p>
              <p className="text-2xl font-bold">{publishedBlogs}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="w-8 h-8 text-pink-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Beauty Blog Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your beauty content and engage with your audience</p>
            </div>
          </div>
          <Link
            to="/admin/blogs/create"
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Post</span>
          </Link>
        </div>
      </div>

      {/* Blog Statistics */}
      <BlogStats />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full lg:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
              ? "Try adjusting your search or filters"
              : "Get started by creating your first beauty blog post"}
          </p>
          <Link
            to="/admin/blogs/create"
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* Blog Image */}
              <div className="relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                {blog.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Featured</span>
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(blog.status)}`}>
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-lg mr-2">
                    {blog.category}
                  </span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 cursor-pointer">
                  {blog.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>By {blog.author}</span>
                </div>

                {/* Blog Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{blog.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blog.comments}</span>
                    </div>
                  </div>
                  <Share2 className="w-4 h-4 cursor-pointer hover:text-pink-600" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">+{blog.tags.length - 3} more</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/blogs/edit/${blog.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>

                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsAdminPage;
