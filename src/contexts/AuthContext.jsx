import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth'
import { setAccessToken, clearAccessToken } from '../api/client'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Try to refresh token on mount
    const initAuth = async () => {
      try {
        const response = await authApi.refresh()
        if (response?.data?.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // Not authenticated, clear state
        clearAccessToken()
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      if (response?.data?.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
      return { success: false, error: 'Invalid response from server' }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed',
      }
    }
  }

  const signup = async (email, password) => {
    try {
      const response = await authApi.signup(email, password)
      if (response?.data?.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
      return { success: false, error: 'Invalid response from server' }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Signup failed',
      }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAccessToken()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
