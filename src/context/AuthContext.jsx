import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { authService } from '../services/api';
import config from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Function to clear auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(config.STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  // Function to set auth data
  const setAuthData = useCallback((newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(config.STORAGE_KEYS.TOKEN, newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  // Validate token with backend
  const validateToken = useCallback(async (storedToken) => {
    try {
      const response = await authService.validateToken();
      if (response.data) {
        // Token is valid, update user data
        setAuthData(storedToken, response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Token is invalid or expired
      clearAuthData();
      return false;
    }
  }, [setAuthData, clearAuthData]);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      setAuthError(null);
      
      try {
        const storedToken = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(config.STORAGE_KEYS.USER);
        
        console.log('Initializing auth - Token exists:', !!storedToken);
        console.log('Initializing auth - User exists:', !!storedUser);
        
        if (storedToken && storedUser) {
          // Set initial state from localStorage
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validate token with backend
          const isValid = await validateToken(storedToken);
          
          if (!isValid) {
            console.log('Token validation failed, clearing session');
            clearAuthData();
          } else {
            console.log('Token validation successful, session restored');
          }
        } else {
          console.log('No stored credentials found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError(error.message);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateToken, clearAuthData]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting login...');
      const response = await authService.login(credentials);
      const { token: newToken, ...userData } = response.data;
      
      console.log('Login successful, storing credentials');
      setAuthData(newToken, userData);
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed';
      setAuthError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting registration...');
      const response = await authService.register(userData);
      const { token: newToken, ...userInfo } = response.data;
      
      console.log('Registration successful, storing credentials');
      setAuthData(newToken, userInfo);
      
      return { success: true, data: userInfo };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setAuthError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const logout = useCallback(() => {
    console.log('Logging out, clearing session');
    clearAuthData();
  }, [clearAuthData]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    authError,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  }), [user, token, loading, authError, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};