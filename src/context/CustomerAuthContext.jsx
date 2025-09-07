import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerUser, setCustomerUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if customer is logged in on app start
    const checkCustomerAuth = () => {
      const isLoggedIn = localStorage.getItem('isCustomerLoggedIn');
      const userData = localStorage.getItem('customerUser');
      
      if (isLoggedIn === 'true' && userData) {
        setIsCustomerLoggedIn(true);
        setCustomerUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkCustomerAuth();
  }, []);

  const customerLogin = (userData) => {
    setIsCustomerLoggedIn(true);
    setCustomerUser(userData);
    localStorage.setItem('isCustomerLoggedIn', 'true');
    localStorage.setItem('customerUser', JSON.stringify(userData));
  };

  const customerLogout = () => {
    setIsCustomerLoggedIn(false);
    setCustomerUser(null);
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerUser');
  };

  const value = {
    isCustomerLoggedIn,
    customerUser,
    customerLogin,
    customerLogout,
    loading
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};
