import React, { createContext, useContext, useState, useEffect } from 'react';

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
      const BASE = import.meta.env.VITE_API_URL || '';
      const API_URL = BASE ? `${BASE.replace(/\/+$/, '')}/api` : '/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid email or password');

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
      const BASE = import.meta.env.VITE_API_URL || '';
      const API_URL = BASE ? `${BASE.replace(/\/+$/, '')}/api` : '/api';
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

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
      const BASE = import.meta.env.VITE_API_URL || '';
      const API_URL = BASE ? `${BASE.replace(/\/+$/, '')}/api` : '/api';
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      const fullUser = { ...user, ...data };
      setUser(fullUser);
      localStorage.setItem('ns_stone_user', JSON.stringify(fullUser));
      return { success: true, user: fullUser };
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
        isAdmin: user?.role === 'admin',
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
