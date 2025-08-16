import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import authAxios from '../services/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          setLoading(false);
          setIsInitialized(true);
        }
      } else {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      const userResponse = await authAxios.get(`${process.env.REACT_APP_API_URL}/me`);
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const changePassword = async (old_password, new_password) => {
    try {
      await authAxios.post(`${process.env.REACT_APP_API_URL}/change-password`, {
        old_password,
        new_password,
      });
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, loading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
