import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const CheckoutPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some services to your cart to continue</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const handleBookService = (service) => {
    const serviceWithQuantity = items.find(item => item.id === service.id);
    setSelectedService({ ...service, quantity: serviceWithQuantity.quantity });
    setShowBookingModal(true);
  };

  const handleBookAll = () => {
    // For simplicity, book the first service (you can modify this logic)
    if (items.length > 0) {
      handleBookService(items[0]);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">Review your selected services and proceed to booking</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Selected Services ({items.length})</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors duration-200">
                    
                    {/* Service Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{item.category?.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    {/* Service Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm capitalize">{item.category} • {item.duration}</p>
                      <p className="text-pink-600 font-bold text-lg">₹{item.price}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Total Price */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleBookService(item)}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Book</span>
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">₹{getTotalPrice()}</span>
                </div>
              </div>
              
              <button
                onClick={handleBookAll}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book All Services</span>
              </button>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/services')}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          service={selectedService}
          quantity={selectedService.quantity}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
