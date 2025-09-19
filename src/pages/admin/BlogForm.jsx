import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Eye, Upload, Image, Tag, Calendar, 
  Sparkles, Users, TrendingUp, Star, Heart, X
} from 'lucide-react';

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    author: '',
    featuredImage: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    publishDate: new Date().toISOString().split('T'),
    featured: false
  });

  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);

  const beautyCategories = [
    'Skincare',
    'Makeup', 
    'Hair Care',
    'Nail Care',
    'Treatments',
    'Wellness',
    'Product Reviews',
    'Tutorials',
    'Seasonal Tips',
    'Expert Advice'
  ];

  const beautyTagSuggestions = [
    'skincare', 'makeup', 'tutorial', 'tips', 'routine', 'products',
    'summer', 'winter', 'monsoon', 'bridal', 'natural', 'organic',
    'anti-aging', 'acne', 'sensitive-skin', 'oily-skin', 'dry-skin',
    'hair-care', 'styling', 'color', 'treatments', 'spa', 'facial',
    'moisturizer', 'serum', 'cleanser', 'sunscreen', 'foundation',
    'lipstick', 'eyeshadow', 'mascara', 'nail-polish', 'pedicure'
  ];

  useEffect(() => {
    if (isEditMode) {
      // Simulate loading blog data for editing
      // Replace with actual API call
      const sampleBlog = {
        title: "Summer Skincare Routine for Glowing Skin",
        excerpt: "Discover the perfect summer skincare routine that will keep your skin healthy, hydrated, and glowing during the hot season.",
        content: `# Summer Skincare: Your Complete Guide

The summer season brings its own set of challenges for our skin. From increased sun exposure to humidity and sweat, our skin needs special attention during these months.

## Morning Routine

### 1. Gentle Cleansing
Start your day with a gentle, foam-based cleanser that removes overnight buildup without stripping your skin's natural oils.

### 2. Vitamin C Serum
Apply a vitamin C serum to protect against free radical damage and brighten your complexion.

### 3. Lightweight Moisturizer
Choose a gel-based or lightweight moisturizer that won't feel heavy in the heat.

### 4. Sunscreen (Most Important!)
Never skip sunscreen! Use at least SPF 30 and reapply every 2 hours.

## Evening Routine

### 1. Double Cleansing
Remove sunscreen and makeup with an oil cleanser, followed by your regular cleanser.

### 2. Gentle Exfoliation (2-3 times a week)
Use a gentle chemical exfoliant to remove dead skin cells and prevent clogged pores.

### 3. Hydrating Serum
Apply a hyaluronic acid serum to boost hydration levels.

### 4. Night Moisturizer
Use a slightly richer moisturizer at night to repair and restore your skin.

## Pro Tips for Summer Skincare

- Stay hydrated by drinking plenty of water
- Wear protective clothing and hats when outdoors
- Avoid peak sun hours (10 AM - 4 PM)
- Keep your skincare products in a cool, dry place
- Listen to your skin and adjust your routine as needed

Remember, consistency is key! Stick to your routine for at least 4-6 weeks to see visible results.`,
        category: 'Skincare',
        status: 'published',
        author: 'Dr. Priya Sharma',
        featuredImage: '/api/placeholder/800/400',
        tags: ['summer', 'skincare', 'routine', 'tips', 'sunscreen', 'glowing-skin'],
        metaTitle: 'Summer Skincare Routine for Glowing Skin | Beauty Tips',
        metaDescription: 'Complete summer skincare guide with morning and evening routines, product recommendations, and expert tips for healthy, glowing skin.',
        publishDate: '2024-09-15',
        featured: true
      };
      setFormData(sampleBlog);
    }
  }, [isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (status) => {
    setLoading(true);

    // Simulate API call
    try {
      const blogData = {
        ...formData,
        status,
        updatedAt: new Date().toISOString()
      };

      console.log('Saving blog:', blogData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`Blog post ${status} successfully!`);
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-pink-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-pink-600 mr-2" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter an engaging title for your beauty blog post..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Write a compelling excerpt that summarizes your blog post..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This will appear in blog listings and search results (150-160 characters recommended)
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Author name..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-pink-600 mr-2" />
                  Blog Content
                </h2>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded">B</button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded italic">I</button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded underline">U</button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded">H1</button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded">H2</button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded">H3</button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-200 rounded flex items-center space-x-1">
                      <Image className="w-3 h-3" />
                      <span>Image</span>
                    </button>
                  </div>

                  {/* Content Area */}
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="20"
                    className="w-full px-4 py-4 border-0 focus:ring-0 resize-none"
                    placeholder="Write your beauty blog content here... 

# Use Markdown for formatting
## Headings, **bold text**, *italic text*
- Bullet points
- Step-by-step instructions

Share your beauty expertise, tips, and insights!"
                  />
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  <p>💡 <strong>Beauty Blog Tips:</strong></p>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-pink-600 mr-2" />
                  Publish Settings
                </h3>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Category</option>
                      {beautyCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
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
                    <label className="ml-3 text-sm font-medium text-gray-700">Featured Post</label>
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
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">Upload featured image</p>
                      <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                        Browse files
                      </button>
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
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
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
                      {formData.tags.map(tag => (
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
                    <p className="text-sm text-gray-600 mb-2">Suggested beauty tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {beautyTagSuggestions.slice(0, 12).map(tag => (
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
                    <p className="text-xs text-gray-500 mt-1">60 characters recommended</p>
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
                    <p className="text-xs text-gray-500 mt-1">155 characters recommended</p>
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
