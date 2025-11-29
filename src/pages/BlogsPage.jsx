import config from "../config";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Tag,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const BACKEND_URL = config.BASE_URL;

  // Fetch published blogs
  useEffect(() => {
    fetchPublishedBlogs();
    fetchCategories();
  }, []);

  const fetchPublishedBlogs = async () => {
    try {
      setLoading(true);
      // PUBLIC endpoint - NO auth required
      const response = await fetch(`${BACKEND_URL}/api/blogs`);

      if (response.ok) {
        const data = await response.json();
        console.log("Blogs fetched:", data);
        setBlogs(data);
      } else {
        console.error("Failed to fetch blogs. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/blogs/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(["all", ...data]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.excerpt &&
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const FeaturedBlog = () => {
    const featured = blogs.find((b) => b.featured);
    if (!featured) return null;

    return (
      <div className="mb-16">
        <div className="relative overflow-hidden rounded-2xl group">
          <img
            src={featured.featuredImage || "/api/placeholder/1200/400"}
            alt={featured.title}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-pink-500 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
              <span className="text-sm opacity-75">{featured.category}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{featured.title}</h1>
            <p className="text-lg opacity-90 mb-4">{featured.excerpt}</p>
            <Link
              to={`/blog/${featured.slug}`}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-lg transition-colors"
            >
              Read More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <span className="text-pink-100">BEAUTY INSIGHTS</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Beauty Blog</h1>
          <p className="text-pink-100 text-lg max-w-2xl">
            Expert tips, product reviews, and skincare routines from our beauty
            professionals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Blog */}
        <FeaturedBlog />

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600 w-5 h-5" />
              <select
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden h-56 bg-gray-200">
                  <img
                    src={blog.featuredImage || "/api/placeholder/400/300"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {blog.featured && (
                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {blog.likes || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {blog.author}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(blog.publishDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
