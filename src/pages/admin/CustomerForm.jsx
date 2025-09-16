import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: 'OTHER',
    status: 'ACTIVE',
    preferredServiceLocation: '',
    specialInstructions: ''
  });

  useEffect(() => {
    if (isEdit) fetchCustomer();
  }, [isEdit]);

  const fetchCustomer = async () => {
    setLoading(true);
    const res = await fetch(`https://glow-services.onrender.com/api/admin/customers/${id}`);
    const data = await res.json();
    setForm(data);
    setLoading(false);
  };

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = isEdit 
      ? `https://glow-services.onrender.com/api/admin/customers/${id}`
      : 'https://glow-services.onrender.com/api/admin/customers';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSaving(false);
    navigate('/admin/customers');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/admin/customers')} className="p-2 hover:bg-gray-200 rounded">
          <ArrowLeft className="h-5 w-5"/>
        </button>
        <h1 className="text-2xl font-bold ml-4">{isEdit ? 'Edit' : 'Create'} Customer</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input type="text" value={form.fullName} onChange={e=>handleChange('fullName',e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e=>handleChange('email',e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input type="tel" value={form.phone} onChange={e=>handleChange('phone',e.target.value)}
              required className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={e=>handleChange('dateOfBirth',e.target.value)}
              className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select value={form.gender} onChange={e=>handleChange('gender',e.target.value)}
              className="w-full p-2 border rounded">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={e=>handleChange('status',e.target.value)}
              className="w-full p-2 border rounded">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea value={form.address} onChange={e=>handleChange('address',e.target.value)}
            rows={2} className="w-full p-2 border rounded"/>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input type="text" value={form.city} onChange={e=>handleChange('city',e.target.value)}
              className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input type="text" value={form.state} onChange={e=>handleChange('state',e.target.value)}
              className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input type="text" value={form.pincode} onChange={e=>handleChange('pincode',e.target.value)}
              className="w-full p-2 border rounded"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Service Location</label>
          <input type="text" value={form.preferredServiceLocation} onChange={e=>handleChange('preferredServiceLocation',e.target.value)}
            placeholder="e.g. Home, Salon" className="w-full p-2 border rounded"/>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Instructions</label>
          <textarea value={form.specialInstructions} onChange={e=>handleChange('specialInstructions',e.target.value)}
            rows={2} className="w-full p-2 border rounded"/>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={()=>navigate('/admin/customers')} className="px-6 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded">
            {saving ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
