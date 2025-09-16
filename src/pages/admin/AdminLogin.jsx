import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, Shield, CheckCircle, Loader } from 'lucide-react';

const AdminLogin = () => {
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

    const fillDemoCredentials = () => {
        setFormData({ username: 'admin', password: 'admin123' });
        setError('');
        setSuccess('Demo credentials filled!');
        setTimeout(() => setSuccess(''), 2000);
    };

    // ✅ CRITICAL: This function MUST prevent default form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ THIS IS CRUCIAL - Prevents GET request

        // Validation
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }

        if (!formData.password.trim()) {
            setError('Password is required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('Making POST request to login endpoint...');

            const response = await fetch('https://glow-services.onrender.com/api/admin/login', {
                method: 'POST', // ✅ Explicitly POST
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            console.log('Response status:', response.status);

            let data = null;
            try {
                data = await response.json();
                console.log('Response data:', data);
            } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                throw new Error('Invalid response format from server');
            }

            if (response.ok) {
                setSuccess('Login successful! Redirecting...');

                // Store admin info
                localStorage.setItem('adminUser', JSON.stringify(data));
                localStorage.setItem('isAdminLoggedIn', 'true');

                // Redirect after short delay
                setTimeout(() => {
                    navigate('/admin/services');
                }, 1000);
            } else {
                const errorMessage = data?.message || `Server error: ${response.status}`;
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check if the server is running on port 8081.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-100% h-[150vh] bg-gray-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Glow Services</h1>
                        <p className="text-purple-200 text-lg">Admin Dashboard</p>
                        <p className="text-purple-300 text-sm mt-2">
                            Manage your beauty services, products, and customers from one powerful dashboard.
                        </p>
                    </div>

                    {/* Welcome Back */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
                        <p className="text-purple-200">Sign in to your admin account</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-300 text-sm">{success}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-300 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Demo Account Info */}
                    <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-300 text-sm font-medium">Demo Account Available</p>
                                <p className="text-blue-200 text-xs mt-1">Use the credentials below to test the admin panel</p>
                            </div>
                            <button
                                type="button"
                                onClick={fillDemoCredentials}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                                disabled={loading}
                            >
                                Auto Fill
                            </button>
                        </div>
                        <div className="mt-2 space-y-1">
                            <p className="text-blue-200 text-xs"><strong>Username:</strong> admin</p>
                            <p className="text-blue-200 text-xs"><strong>Password:</strong> admin123</p>
                        </div>
                    </div>

                    {/* ✅ CRITICAL: Form with onSubmit handler */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-purple-300" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                    placeholder="Enter your username"
                                    disabled={loading}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-purple-300" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-purple-300 hover:text-white transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-purple-300 hover:text-white transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ✅ Submit Button - type="submit" is important */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-purple-300 text-sm">
                            © 2024 Glow Services. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;