import config from '../../config';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, Shield, CheckCircle, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminLogin = () => {
    const { adminLogin } = useAdminAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enhanced Validation
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }

        if (!formData.password.trim()) {
            setError('Password is required');
            return;
        }

        if (formData.password.length < 5) {
           setError('Password must be at least 5 characters');
           return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${config.API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setSuccess('Access Granted. Redirecting to Secure Dashboard...');

                // Store token separately as context handles user object
                localStorage.setItem('adminToken', data.token);
                
                // Update Context State
                adminLogin(data);

                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 1500);
            } else {
                setError(data.message || 'Invalid credentials. Access denied.');
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setError('Secure connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative flex items-center justify-center p-4">
            
            {/* Top Navigation Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm font-medium text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Home
                </Link>

                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-900/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700/50 p-8 md:p-10 relative overflow-hidden group transition-all duration-300">
                    
                    {/* Top Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 group-hover:scale-105 transition-transform duration-300">
                            <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Secure Access Protocol</p>
                    </div>

                    {/* Messages */}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 animate-fade-in-down">
                            <div className="p-1 bg-emerald-500/20 rounded-full">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-emerald-300 text-sm font-medium">{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 animate-shake">
                            <div className="p-1 bg-red-500/20 rounded-full">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            </div>
                            <span className="text-red-300 text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                                Username
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/input:text-purple-500 dark:group-focus-within/input:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="w-full pl-14 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/input:text-purple-500 dark:group-focus-within/input:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full pl-14 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-4 rounded-xl font-bold text-white shadow-lg 
                                flex items-center justify-center space-x-2
                                transition-all duration-300 transform
                                ${loading 
                                    ? 'bg-gray-700 cursor-not-allowed opacity-70' 
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying Access...</span>
                                </>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <Shield className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-xs">
                            Restricted Area. Authorized Personnel Only.
                            <br />
                            IP Address Logged for Security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
