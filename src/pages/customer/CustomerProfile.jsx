import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3 } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import config from '../../config';

const CustomerProfile = () => {
  const { customerUser } = useCustomerAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'female',
    address: '',
    city: '',
    state: '',
    pincode: '',
    preferences: {
      skinType: 'combination',
      allergies: '',
      preferredTime: 'afternoon',
      specialInstructions: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!customerUser?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.API_BASE_URL}/customers/${customerUser.id}/profile`);
        if (!res.ok) throw new Error('Unable to load profile');
        const data = await res.json();
        setForm(prev => ({
          ...prev,
          ...data,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || 'female',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          preferences: prev.preferences
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [customerUser]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!customerUser?.id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      specialInstructions: form.preferences.specialInstructions
    };

    try {
      const res = await fetch(`${config.API_BASE_URL}/customers/${customerUser.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Unable to update profile');
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        ...data,
        preferences: prev.preferences
      }));
      setIsEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!customerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 p-4">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 p-4">
            {success}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Picture & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center transition-colors duration-200">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-white text-4xl font-bold">
                  {form.fullName?.charAt(0) || '?'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-200">
                    <Camera className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{form.fullName}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{form.email}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Member since Jan 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{form.city}, {form.state}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white">
                <h4 className="font-semibold mb-1">VIP Member</h4>
                <p className="text-sm opacity-90">1,250 Loyalty Points</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Address Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Service Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skin Type</label>
                  <select
                    value={form.preferences.skinType}
                    onChange={(e) => handleChange('preferences.skinType', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  >
                    <option value="oily">Oily</option>
                    <option value="dry">Dry</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Time</label>
                  <select
                    value={form.preferences.preferredTime}
                    onChange={(e) => handleChange('preferences.preferredTime', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  >
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allergies</label>
                  <input
                    type="text"
                    value={form.preferences.allergies}
                    onChange={(e) => handleChange('preferences.allergies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Fragrance, Nuts, etc."
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions</label>
                  <textarea
                    value={form.preferences.specialInstructions}
                    onChange={(e) => handleChange('preferences.specialInstructions', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Any special requests or instructions for our team..."
                    className={`w-full px-4 py-3 border rounded-lg dark:text-white dark:border-gray-600 transition-colors duration-200 ${isEditing ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900/50'}`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
