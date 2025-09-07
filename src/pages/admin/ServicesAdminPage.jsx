import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import { Link } from 'react-router-dom';

const ServicesAdminPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllServices(); // real API
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await fetch(`http://localhost:8081/api/admin/services/${slug}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <Link to="create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        + New Service
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow overflow-hidden rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.slug} className="border-b">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.slug}</td>
                <td className="p-2">{s.category}</td>
                <td className="p-2">₹{s.price}</td>
                <td className="p-2 space-x-2">
                  <Link to={`edit/${s.slug}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(s.slug)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServicesAdminPage;
