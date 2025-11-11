import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { setAccessToken, clearAccessToken } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Try to refresh token on app load
        const data = await authService.refresh()
        if (data?.data?.user) {
          setUser(data.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // No valid session, that's okay
        console.log('No existing session')
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      if (data?.data?.user) {
        setUser(data.data.user)
        setIsAuthenticated(true)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password, name) => {
    try {
      const data = await authService.signup(email, password, name)
      if (data?.data?.user) {
        setUser(data.data.user)
        setIsAuthenticated(true)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      clearAccessToken()
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
