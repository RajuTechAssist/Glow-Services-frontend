import config from '../../config';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2, Mail, Sparkles, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useTheme } from '../../context/ThemeContext';

const CustomerLogin = () => {
  const { customerLogin } = useCustomerAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (f, v) => {
    setForm(prev => ({ ...prev, [f]: v }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${config.BASE_URL}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        customerLogin(data);
        navigate('/customer/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300 relative">
      
      {/* Navigation & Theme Toggle */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
              aria-label="Toggle theme"
          >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
      </div>

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="flex w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 transition-colors duration-300">
        
        {/* Left Side - Image/Banner */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-500 to-purple-600 p-12 flex-col justify-between text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412947132-28c53b36db07')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-pink-100 text-lg leading-relaxed">
                Log in to book your favorite beauty services, track your appointments, and get exclusive rewards.
              </p>
           </div>
           <div className="relative z-10 text-sm text-pink-200">
              &copy; 2024 Glow Services. All rights reserved.
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="text-center md:text-left mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In to Glow</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your details to proceed</p>
            </div>

            {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-head-shake">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                    </div>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full pb-4 pt-4 mb-4 mt-4 pl-16 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                    <Link to="/forgot-password" className="text-xs font-medium text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => handleChange('password', e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pb-4 pt-4 mb-4 mt-4 pl-16 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                        ) : (
                        <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing In...
                    </>
                ) : 'Sign In'}
            </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account yet?{' '}
                    <Link to="/customer/register" className="font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-all">
                    Create Account
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
