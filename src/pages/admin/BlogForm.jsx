import config from '../../config';
import ApiService from "../../services/api";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Eye,
  Upload,
  Image,
  Tag,
  Calendar,
  Sparkles,
  Users,
  TrendingUp,
  Star,
  Heart,
  X,
} from "lucide-react";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "DRAFT",
    author: "",
    featuredImage: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    publishDate: "",
    featured: false,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const BACKEND_URL = config.BASE_URL;

  // JWT Authentication Helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Authentication error. Please log in again.');
      navigate('/admin/login');
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const beautyCategories = [
    "Skincare",
    "Makeup",
    "Hair Care",
    "Nail Care",
    "Treatments",
    "Wellness",
    "Product Reviews",
    "Tutorials",
    "Seasonal Tips",
    "Expert Advice",
  ];

  const beautyTagSuggestions = [
    "skincare",
    "makeup",
    "tutorial",
    "tips",
    "routine",
    "products",
    "summer",
    "winter",
    "monsoon",
    "bridal",
    "natural",
    "organic",
    "anti-aging",
    "acne",
    "sensitive-skin",
    "oily-skin",
    "dry-skin",
    "hair-care",
    "styling",
    "color",
    "treatments",
    "spa",
    "facial",
    "moisturizer",
    "serum",
    "cleanser",
    "sunscreen",
    "foundation",
    "lipstick",
    "eyeshadow",
    "mascara",
    "nail-polish",
    "pedicure",
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchBlogData();
    }
  }, [isEditMode, id]);

  const fetchBlogData = async () => {
    try {
      setFetchingBlog(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/blogs/${id}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || '',
          status: data.status || 'DRAFT',
          author: data.author || '',
          featuredImage: data.featuredImage || '',
          tags: data.tags || [],
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          publishDate: data.publishDate ? data.publishDate.split('T')[0] : '',
          featured: data.featured || false,
        });
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert('Failed to load blog post');
        navigate('/admin/blogs');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Error loading blog post');
      navigate('/admin/blogs');
    } finally {
      setFetchingBlog(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.toLowerCase()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async (status) => {
    setLoading(true);

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      // Prepare blog data
      const blogData = {
        ...formData,
        status: status || formData.status,
      };

      // Convert publishDate to ISO format if present
      if (blogData.publishDate) {
        blogData.publishDate = new Date(blogData.publishDate).toISOString();
      }

      const url = isEditMode 
        ? `${BACKEND_URL}/api/admin/blogs/${id}` 
        : `${BACKEND_URL}/api/admin/blogs`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        const savedBlog = await response.json();
        alert(`Blog post ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/admin/blogs');
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await ApiService.uploadFile(file);
      setFormData(prev => ({ ...prev, featuredImage: url }));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
      alert("Please enter a Blog Title first so AI knows what to write about!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await ApiService.generateBlogContent(formData.title);
      setFormData((prev) => ({
        ...prev,
        content: response.content,
      }));
      alert("✨ Content generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate content: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (fetchingBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <span className="ml-4 text-gray-600">Loading blog post...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-pink-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave("DRAFT")}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-medium disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("PUBLISHED")}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 text-pink-600 mr-2" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter an engaging title for your beauty blog post..."
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Write a compelling excerpt that summarizes your blog post..."
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      This will appear in blog listings and search results
                      (150-160 characters recommended)
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Author name..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="w-5 h-5 text-pink-600 mr-2" />
                    Blog Content
                  </h2>

                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !formData.title}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Writing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Auto-Write with AI</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  {/* Content Area */}
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="20"
                    className="w-full px-4 py-4 border-0 focus:ring-0 resize-none dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Write your beauty blog content here... 

# Use Markdown for formatting
## Headings, **bold text**, *italic text*
- Bullet points
- Step-by-step instructions

Share your beauty expertise, tips, and insights!"
                    required
                  />
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    💡 <strong>Beauty Blog Tips:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Use clear headings to organize your content</li>
                    <li>Include step-by-step instructions for tutorials</li>
                    <li>Add product recommendations with honest reviews</li>
                    <li>Share personal experiences and expert tips</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-pink-600 mr-2" />
                  Publish Settings
                </h3>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {beautyCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">
                      Featured Post
                    </label>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Image className="w-5 h-5 text-pink-600 mr-2" />
                  Featured Image
                </h3>

                <div className="space-y-4">
                  {formData.featuredImage ? (
                    <div className="relative">
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            featuredImage: "",
                          }))
                        }
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
                          <span className="text-sm text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="featured-image-upload"
                            accept="image/*"
                          />
                          <label
                            htmlFor="featured-image-upload"
                            className="cursor-pointer flex flex-col items-center w-full h-full justify-center"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload featured image
                            </p>
                            <span className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                              Browse files
                            </span>
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Recommended size: 800x400px. JPG, PNG formats supported.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 text-pink-600 mr-2" />
                  Tags
                </h3>

                <div className="space-y-4">
                  {/* Tag Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      placeholder="Add tag..."
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-md text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                        >
                          <span>#{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-pink-600 hover:text-pink-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag Suggestions */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Suggested beauty tags:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {beautyTagSuggestions.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setCurrentTag(tag)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-pink-100 hover:text-pink-700"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-pink-600 mr-2" />
                  SEO Settings
                </h3>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      placeholder="SEO title for search engines..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      60 characters recommended
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      placeholder="Brief description for search engines..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      155 characters recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
