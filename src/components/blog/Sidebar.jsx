import React, { useState } from 'react';
import { Search, Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';

const Sidebar = ({ searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, popularPosts }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            await ApiService.subscribeToNewsletter(email);
            setStatus('success');
            setMessage('Thanks for joining!');
            setEmail('');
            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to subscribe. Try again.');
        }
    };

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
                    
                    {status === 'success' ? (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl flex flex-col items-center animate-fade-in">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm">
                                <Check className="w-5 h-5" />
                            </div>
                            <p className="font-medium">You're on the list!</p>
                            <p className="text-xs opacity-80 mt-1">Check your inbox for a welcome gift.</p>
                        </div>
                    ) : (
                        <form className="space-y-3" onSubmit={handleSubscribe}>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address" 
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 px-4 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none dark:text-white disabled:opacity-60"
                            />
                            <button 
                                type="submit" 
                                disabled={status === 'loading'}
                                className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : 'Subscribe Now'}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-500 text-xs flex items-center justify-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {message}
                                </p>
                            )}
                        </form>
                    )}
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
