import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDropdown = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Your Cart ({items.length})
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/services"
              onClick={onClose}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Browse Services →
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{item.category?.charAt(0).toUpperCase()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                  <p className="text-gray-600 text-xs capitalize">{item.category} • {item.duration}</p>
                  <p className="text-pink-600 font-bold text-sm">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-pink-600">₹{getTotalPrice()}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearCart}
              className="py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              onClick={onClose}
              className="py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
