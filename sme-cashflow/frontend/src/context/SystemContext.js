import React, { createContext, useState, useContext } from 'react';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within SystemProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [systemType, setSystemType] = useState('blockchain'); // 'traditional' or 'blockchain'
  const [currentUser, setCurrentUser] = useState(null);

  const toggleSystem = () => {
    setSystemType(prev => prev === 'blockchain' ? 'traditional' : 'blockchain');
  };

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    systemType,
    setSystemType,
    toggleSystem,
    currentUser,
    login,
    logout,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};