import React from 'react';
import { X, Calendar, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingChoiceModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChoice = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            What would you like to book?
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Choose an option to continue
          </p>

          <div className="grid gap-4">
            <button
              onClick={() => handleChoice('/services')}
              className="flex items-center p-4 bg-pink-50 dark:bg-gray-700/50 border-2 border-pink-100 dark:border-gray-600 rounded-xl hover:border-pink-500 dark:hover:border-pink-500 hover:bg-pink-100 dark:hover:bg-gray-700 transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-gray-600 rounded-full text-pink-600 dark:text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book a Service</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Schedule appointments with our experts</p>
              </div>
            </button>

            <button
              onClick={() => handleChoice('/products')}
              className="flex items-center p-4 bg-purple-50 dark:bg-gray-700/50 border-2 border-purple-100 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-gray-600 rounded-full text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buy Products</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shop our exclusive beauty products</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingChoiceModal;
