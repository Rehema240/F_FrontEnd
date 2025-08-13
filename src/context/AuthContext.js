import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Setup axios interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Starting Request', JSON.stringify(config, null, 2));
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem('accessToken', response.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/me`);
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const changePassword = async (old_password, new_password) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/change-password`, {
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
