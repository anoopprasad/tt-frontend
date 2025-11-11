import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { setAccessToken, clearAccessToken, getAccessToken } from '../utils/api'

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
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const token = getAccessToken()
      if (token) {
        try {
          // Try to refresh token to verify it's still valid
          await authService.refreshToken()
          // If successful, extract user info from token (or make a user info API call)
          // For now, we'll assume token is valid if refresh succeeds
          setIsAuthenticated(true)
          // In a real app, you'd decode the JWT or fetch user info
          setUser({ email: 'user@example.com' }) // Placeholder
        } catch (error) {
          clearAccessToken()
          setIsAuthenticated(false)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setIsAuthenticated(true)
      // Extract user info from response or decode JWT
      setUser({ email })
      return response
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password) => {
    try {
      const response = await authService.signup(email, password)
      setIsAuthenticated(true)
      setUser({ email })
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearAccessToken()
      setIsAuthenticated(false)
      setUser(null)
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
