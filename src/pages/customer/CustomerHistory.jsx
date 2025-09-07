import React, { useState } from 'react';
import { Clock, Calendar, Package, Star } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const CustomerHistory = () => {
  const { customerUser } = useCustomerAuth();
  const [history] = useState([
    {
      id: 'HIS-001',
      date: '2025-09-01',
      items: ['Facial Treatment', 'Hair Styling'],
      total: 1800,
      rating: 5
    },
    {
      id: 'HIS-002',
      date: '2025-08-28',
      items: ['Professional Manicure'],
      total: 500,
      rating: 4
    },
    {
      id: 'HIS-003',
      date: '2025-08-15',
      items: ['Deep Cleansing Treatment'],
      total: 2000,
      rating: null
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking & Order History</h1>
          <p className="text-gray-600">Review all your past services and purchases</p>
        </div>

        <div className="space-y-6">
          {history.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">{entry.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-1 text-pink-500" />
                    Items
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {entry.items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    Total
                  </h4>
                  <p className="text-gray-900 font-bold">₹{entry.total}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    Rating
                  </h4>
                  {entry.rating ? (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < entry.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Not rated</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
