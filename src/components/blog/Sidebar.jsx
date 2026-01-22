import React from 'react';
import { Search, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, popularPosts }) => {
    return (
        <aside className="space-y-8">
            {/* Search Widget */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Search</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search articles..." 
                        className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-pink-500/10 to-transparent dark:from-pink-500/20 dark:to-gray-800 p-8 rounded-2xl border border-pink-500/20 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-pink-500">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Join the Glow Club</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Get weekly beauty tips and exclusive offers delivered to your inbox.</p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 px-4 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none dark:text-white"
                        />
                        <button type="submit" className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30">
                            Subscribe Now
                        </button>
                    </form>
                </div>
            </div>

             {/* Popular Posts Widget - Optional based on data availability */}
             {popularPosts && popularPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white border-l-4 border-pink-500 pl-3">Popular Posts</h3>
                    <div className="space-y-6">
                        {popularPosts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.id} className="flex gap-4 group">
                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                                    <img src={post.featuredImage || "/api/placeholder/100/100"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-pink-500 line-clamp-2 mb-1">{post.title}</h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
             )}
        </aside>
    );
};

export default Sidebar;
