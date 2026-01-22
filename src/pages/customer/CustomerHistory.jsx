import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Package, Star } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import config from '../../config';

const CustomerHistory = () => {
  const { customerUser } = useCustomerAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerUser?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.API_BASE_URL}/customers/${customerUser.id}/history`);
        if (!res.ok) throw new Error('Unable to load history');
        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerUser]);

  if (!customerUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Please sign in to view your history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-3xl">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 p-4">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking & Order History</h1>
          <p className="text-gray-600 dark:text-gray-400">Review all your past services and purchases</p>
        </div>

        <div className="space-y-6">
          {history.map(entry => {
            const items = entry.items || (entry.service ? [entry.service] : []);
            const rating = entry.rating;
            return (
            <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{entry.id}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>{entry.date ? new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : '—'}</span>
                  {entry.time && <span className="text-xs text-gray-500">{entry.time}</span>}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-1 text-pink-500" />
                    Items
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    Total
                  </h4>
                  <p className="text-gray-900 dark:text-white font-bold">₹{(entry.total || 0).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    Rating
                  </h4>
                  {rating ? (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">Not rated</p>
                  )}
                </div>
              </div>
            </div>
          );})}
          {history.length === 0 && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              No history found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
