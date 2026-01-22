import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';

const PostCard = ({ post }) => {
    const getImageUrl = (post) => {
        const img = post.featuredImage || post.image;
        if (!img) return "https://placehold.co/400x300?text=No+Image";
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${config.BASE_URL}${img}`;
        return `${config.BASE_URL}/${img}`;
    };

    // Dynamic color for tags based on category
    const getTagColor = (cat) => {
        if (!cat) return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
        switch(cat.toLowerCase()) {
            case 'makeup': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
            case 'wellness': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300';
            case 'bridal': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
        }
    };

    return (
        <article className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-auto relative overflow-hidden rounded-xl">
                <img 
                    src={getImageUrl(post)} 
                    onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/400x300?text=Image+Unavailable"}}
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 flex flex-col justify-center py-2 pr-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md uppercase ${getTagColor(post.category)}`}>
                        {post.category || 'General'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">• {new Date(post.publishDate || post.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-pink-500 cursor-pointer transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <img 
                            src={typeof post.author === 'object' ? (post.author?.avatar || "/api/placeholder/32/32") : `https://ui-avatars.com/api/?name=${post.author || 'Admin'}`} 
                            alt={typeof post.author === 'object' ? (post.author?.name || 'Author') : (post.author || 'Admin')} 
                            className="w-8 h-8 rounded-full" 
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeof post.author === 'object' ? (post.author?.name || 'Glow Team') : (post.author || 'Glow Team')}
                        </span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="text-pink-500 font-semibold text-sm hover:underline">Read More</Link>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
