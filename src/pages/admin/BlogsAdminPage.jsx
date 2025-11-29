import config from "../../config";
import ApiService from "../../services/api";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  TrendingUp,
  Users,
  MessageCircle,
  Share2,
  Sparkles,
  Heart,
} from "lucide-react";

const BlogsAdminPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    publishedBlogs: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categories = [
    "all",
    "Skincare",
    "Makeup",
    "Hair Care",
    "Treatments",
    "Wellness",
    "Product Reviews",
  ];

  const statuses = ["all", "PUBLISHED", "DRAFT", "SCHEDULED", "ARCHIVED"];

  const BACKEND_URL = config.BASE_URL;

  // JWT Authentication Helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Authentication error. Please log in again.");
      navigate("/admin/login");
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch blogs from backend API
  const fetchBlogs = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/blogs`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        alert("Session expired. Please log in again.");
        navigate("/admin/login");
      } else {
        console.error("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blog statistics
  const fetchBlogStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/blogs/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats on error
      setStats({
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        publishedBlogs: 0,
      });
    }
  };

  // Load blogs and stats on component mount
  useEffect(() => {
    fetchBlogs();
    fetchBlogStats();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.excerpt &&
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || blog.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      SCHEDULED: "bg-blue-100 text-blue-800",
      ARCHIVED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        alert("Blog deleted successfully!");
        fetchBlogs(); // Refresh the list
        fetchBlogStats(); // Update stats
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        alert("Session expired. Please log in again.");
        navigate("/admin/login");
      } else {
        alert("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog post");
    }
  };

  const BlogStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 text-sm">Total Posts</p>
            <p className="text-2xl font-bold">{stats.totalBlogs}</p>
          </div>
          <div className="w-8 h-8 text-pink-200">
            <Calendar />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Views</p>
            <p className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </p>
          </div>
          <div className="w-8 h-8 text-blue-200">
            <Eye />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Total Likes</p>
            <p className="text-2xl font-bold">{stats.totalLikes}</p>
          </div>
          <div className="w-8 h-8 text-purple-200">
            <Heart />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Published</p>
            <p className="text-2xl font-bold">{stats.publishedBlogs}</p>
          </div>
          <div className="w-8 h-8 text-green-200">
            <TrendingUp />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-pink-500" />
            Beauty Blog Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your beauty content and engage with your audience
          </p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      <BlogStats />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Statuses" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
              selectedCategory !== "all" ||
              selectedStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first beauty blog post"}
            </p>
            <Link
              to="/admin/blogs/create"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {blog.featured && (
                          <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {blog.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {blog.excerpt || "No excerpt available"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            by {blog.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {blog.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {blog.likes || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/blogs/edit/${blog.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsAdminPage;
