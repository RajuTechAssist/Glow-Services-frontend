import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const ProtectedCustomerRoute = ({ children }) => {
  const { isCustomerLoggedIn, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isCustomerLoggedIn) {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
};

export default ProtectedCustomerRoute;
