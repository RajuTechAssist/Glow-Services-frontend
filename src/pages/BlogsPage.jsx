import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import config from "../config";
import HeroSection from "../components/blog/HeroSection";
import PostCard from "../components/blog/PostCard";
import Sidebar from "../components/blog/Sidebar";

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
      const response = await fetch(`${BACKEND_URL}/api/blogs/published`);

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

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const listBlogs = featuredBlog ? filteredBlogs.filter(b => b._id !== featuredBlog._id) : filteredBlogs;

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <HeroSection post={featuredBlog} isLoading={loading} />

            {/* Categories - Horizontal Scroll */}
            <div className="mb-10 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                    {categories.map(category => (
                        <button 
                            key={category} 
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                selectedCategory === category 
                                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 transform scale-105' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {category === 'all' ? 'All Posts' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        // Loading placeholders
                        [1, 2, 3].map((n) => (
                            <div key={n} className="w-full h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
                        ))
                    ) : listBlogs.length > 0 ? (
                        listBlogs.map((post) => (
                            <PostCard key={post._id || post.id} post={post} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching your criteria.</p>
                            <button 
                                onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                                className="mt-4 text-pink-500 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Sidebar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        popularPosts={blogs.slice(0, 3)} // Just using first 3 as popular for now
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default BlogsPage;
