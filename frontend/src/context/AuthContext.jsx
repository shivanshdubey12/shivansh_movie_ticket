import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user profile on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('imovies_token', newToken);
        setToken(newToken);
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('imovies_token', newToken);
        setToken(newToken);
        setUser(newUser);
        toast.success(`Welcome to IMovies, ${newUser.name}!`);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    setToken(null);
    setUser(null);
    toast.info('You have been logged out.');
  };

  const updateProfile = async (data) => {
    try {
      const res = await API.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
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

export const useAuth = () => useContext(AuthContext);

