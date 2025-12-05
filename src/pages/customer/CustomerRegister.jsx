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
} from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const CustomerRegister = () => {
  const { customerLogin } = useCustomerAuth();
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

  const handleChange = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  // New function to request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault(); // ✅ Prevent any default form submission
    
    if (!form.email) return alert("Please enter email first");
    
    setLoading(true);
    try {
      const res = await fetch(`${config.BASE_URL}/api/customers/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", identifier: form.email }),
      });
      
      const data = await res.json(); // Try to parse error message
      
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Server Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // New function to verify OTP
  const handleVerifyOtp = async () => {
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
      } else {
        alert("Invalid OTP");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your email first");
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
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                placeholder="Your full name"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              placeholder="1234567890"
              className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
              placeholder="••••••••"
              className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Email Input with Verify Button */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled={otpVerified}
                  placeholder="you@example.com"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  {loading ? "Sending..." : otpSent ? "Resend" : "Verify"}
                </button>
              )}
            </div>
            {otpVerified && (
              <span className="text-green-600 text-xs flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
          </div>

          {/* OTP Input (Visible only if sent and not verified) */}
          {otpSent && !otpVerified && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="block text-sm font-medium mb-1">
                Enter OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="123456"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Confirm
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Check your email inbox/spam folder.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/customer/login" className="text-pink-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
