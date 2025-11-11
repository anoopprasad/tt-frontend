// Authentication Context

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { User, LoginCredentials, SignupData } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = useCallback((token: string | null) => {
    apiClient.setAccessToken(token);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<{ accessToken: string; user: User }>('/auth/login', credentials);
      const { accessToken, user: userData } = response.data;
      
      setAccessToken(accessToken);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Login failed');
    }
  }, [setAccessToken]);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const response = await apiClient.post<{ accessToken: string; user: User }>('/auth/signup', data);
      const { accessToken, user: userData } = response.data;
      
      setAccessToken(accessToken);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Signup failed');
    }
  }, [setAccessToken]);

  const logout = useCallback(async () => {
    try {
      await apiClient.delete('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, [setAccessToken]);

  const refreshUser = useCallback(async () => {
    try {
      // Try to refresh token first
      const response = await apiClient.post<{ accessToken: string; user: User }>('/auth/refresh', {});
      const data = response.data;
      
      // Handle both snake_case and camelCase responses
      const accessToken = (data as any).accessToken || (data as any).access_token;
      const userData = (data as any).user || data;
      
      if (accessToken) {
        setAccessToken(accessToken);
      }
      if (userData && userData.id) {
        setUser(userData);
      }
    } catch (error) {
      // Refresh failed - user is not authenticated
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setAccessToken]);

  // Check authentication status on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
