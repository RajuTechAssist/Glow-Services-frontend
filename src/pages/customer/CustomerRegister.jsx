import config from "../../config";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  Edit2
} from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useTheme } from "../../context/ThemeContext";

const CustomerRegister = () => {
  const { customerLogin } = useCustomerAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const handleEditEmail = () => {
    setOtpVerified(false);
    setOtpSent(false);
    setOtp("");
    setError("");
  };

  // OTP Logic
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.email) {
        setError("Please enter your email address first.");
        return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${config.BASE_URL}/api/customers/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", identifier: form.email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setOtpSent(true);
        setError(""); // Clear any previous errors
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (e) {
      console.error(e);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
        setError("Please enter the OTP.");
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${config.BASE_URL}/api/customers/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.email, otp }),
      });
      const data = await res.json();
      if (data.status === "verified") {
        setOtpVerified(true);
        setOtpSent(false);
        setError("");
      } else {
        setError("Invalid or expired OTP.");
      }
    } catch (e) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpVerified) {
      setError("Please verify your email address to continue.");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${config.BASE_URL}/api/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        customerLogin(data);
        navigate("/customer/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error occurred.");
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
        <div className="absolute top-20 right-20 w-80 h-80 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Panel: Graphic & Info */}
        <div className="w-full md:w-2/5 p-8 md:p-12 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdd403348')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                    <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Join Glow Services</h2>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-pink-50">
                        <CheckCircle className="w-5 h-5" />
                        <span>Exclusive member discounts</span>
                    </li>
                    <li className="flex items-center gap-3 text-pink-50">
                        <CheckCircle className="w-5 h-5" />
                        <span>Track appointments easily</span>
                    </li>
                    <li className="flex items-center gap-3 text-pink-50">
                        <CheckCircle className="w-5 h-5" />
                        <span>Manage your beauty profile</span>
                    </li>
                </ul>
            </div>

            <div className="relative z-10 mt-12 md:mt-0">
                <p className="text-sm text-pink-100/80">Already a member?</p>
                <Link to="/customer/login" className="inline-flex items-center gap-2 font-bold hover:underline mt-1">
                    Sign in here <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Account</h3>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-pulse">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        required
                        placeholder="Full Name"
                        className="w-full pb-4 pt-4 mb-4 mt-4 pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none"
                    />
                </div>

                {/* Email & OTP Section */}
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="relative group/field flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                disabled={otpVerified}
                                required
                                placeholder="Email Address"
                                className={`w-full pb-4 pt-4 mb-4 mt-4 pl-12 pr-12 py-3.5 border rounded-xl outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 ${otpVerified ? 'bg-green-50/50 border-green-200 text-green-700 dark:bg-green-900/10 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:text-white'}`}
                            />
                            <div className="absolute right-3 top-3.5">
                                {otpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleEditEmail}
                                        className="text-gray-400 pb-4 pt-4 mb-4 mt-4 hover:text-pink-500 dark:text-gray-500 dark:hover:text-pink-400 transition-colors"
                                        title="Edit Email"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {!otpVerified && (
                            <button 
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || otpSent}
                                className="px-5 py-3.5 pb-4 pt-4 mb-4 mt-4 pl-4 pr-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50 whitespace-nowrap transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[100px]"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : otpSent ? 'Resend' : 'Get OTP'}
                            </button>
                        )}
                    </div>

                    {/* OTP Input */}
                    {otpSent && !otpVerified && (
                         <div className="animate-fade-in-down p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl space-y-3">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Enter the OTP sent to your email</p>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="flex-1 pb-4 pt-4 mb-4 mt-4 p-3 border border-blue-200 dark:border-blue-700 rounded-lg text-center font-mono tracking-widest text-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleVerifyOtp}
                                    className="px-6 pb-4 pt-4 mb-4 mt-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    Verify
                                </button>
                            </div>
                         </div>
                    )}
                </div>

                {/* Phone */}
                <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                    </div>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                        placeholder="Phone Number"
                        className="w-full pb-4 pt-4 mb-4 mt-4 pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none"
                    />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group/field">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                            placeholder="Password"
                            className="w-full pb-4 pt-4 mb-4 mt-4 pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none"
                        />
                    </div>
                    <div className="relative group/field">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <ShieldCheck className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-pink-500 transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            required
                            placeholder="Confirm Password"
                            className="w-full pb-4 pt-4 mb-4 mt-4 pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !otpVerified}
                        className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                            loading || !otpVerified
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                         Create Account
                    </button>
                    {!otpVerified && form.email && (
                        <p className="text-center text-xs text-red-500 mt-2">
                            * Verify Email OTP to enable registration
                        </p>
                    )}
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
