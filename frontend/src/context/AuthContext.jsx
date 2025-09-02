import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email }) => {
    setUser({ email });
    return true;
  };

  const signup = async ({ name, email }) => {
    setUser({ name, email });
    return true;
  };

  const value = useMemo(() => ({ user, login, signup }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};