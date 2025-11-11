import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { setAccessToken, clearAccessToken } from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Try to refresh token on mount
    const initAuth = async () => {
      try {
        const response = await authAPI.refreshToken();
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // No valid refresh token, user needs to login
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed',
      };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await authAPI.signup(email, password, name);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
