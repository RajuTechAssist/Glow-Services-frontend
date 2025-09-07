import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start
    const checkAdminAuth = () => {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
      const userData = localStorage.getItem('adminUser');
      
      if (isLoggedIn === 'true' && userData) {
        setIsAdminLoggedIn(true);
        setAdminUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  const adminLogin = (userData) => {
    setIsAdminLoggedIn(true);
    setAdminUser(userData);
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
  };

  const value = {
    isAdminLoggedIn,
    adminUser,
    adminLogin,
    adminLogout,
    loading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
