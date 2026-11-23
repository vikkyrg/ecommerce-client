import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUserApi, registerUserApi, updateProfileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ns_stone_token');
      const storedUser = localStorage.getItem('ns_stone_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to parse stored auth:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUserApi(email, password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('ns_stone_token', data.token);
      localStorage.setItem('ns_stone_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const data = await registerUserApi(name, email, phone, password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('ns_stone_token', data.token);
      localStorage.setItem('ns_stone_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ns_stone_token');
    localStorage.removeItem('ns_stone_user');
  };

  const updateProfile = async updatedData => {
    try {
      const data = await updateProfileApi(updatedData);
      setUser(data);
      localStorage.setItem('ns_stone_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
