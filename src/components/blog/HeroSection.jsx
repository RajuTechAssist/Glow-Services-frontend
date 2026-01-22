import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import config from '../../config';

const HeroSection = ({ post, isLoading }) => {
    // Helper to resolve image URL
    const getImageUrl = (post) => {
        if (!post) return "https://placehold.co/800x600?text=No+Image";
        const img = post.featuredImage || post.image;
        if (!img) return "https://placehold.co/800x600?text=No+Image";
        
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${config.BASE_URL}${img}`;
        // If it's a relative path without leading slash, assume it needs slash
        return `${config.BASE_URL}/${img}`; 
    };

    if (isLoading) {
        return (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl mb-16"></div>
        );
    }

    if (!post) return null;

    return (
        <section className="mb-16">
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl grid md:grid-cols-2 group">
                <div className="relative h-64 md:h-auto overflow-hidden">
                    <img 
                        src={getImageUrl(post)} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/800x600?text=Image+Unavailable"}}
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 bg-pink-500/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Featured
                    </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" /> 
                        {new Date(post.publishDate || post.createdAt || Date.now()).toLocaleDateString()}
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <Clock className="w-4 h-4" /> 
                        {post.readTime || "5 min read"}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed line-clamp-3">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to={`/blog/${post.slug}`} className="inline-flex items-center justify-center px-8 py-3 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-500/30">
                            Read Article <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        {/* 
                        <div className="flex -space-x-2">
                            <img src={post.author?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Author" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" />
                        </div> 
                        */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
