import apiClient, { setAccessToken, clearAccessToken } from './api'

export const authService = {
  /**
   * Sign up new user
   */
  async signup(email, password, name) {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      name,
    })
    const accessToken = response.data?.data?.accessToken
    if (accessToken) {
      setAccessToken(accessToken)
    }
    return response.data
  },

  /**
   * Login user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    const accessToken = response.data?.data?.accessToken
    if (accessToken) {
      setAccessToken(accessToken)
    }
    return response.data
  },

  /**
   * Refresh access token using HttpOnly cookie
   */
  async refresh() {
    const response = await apiClient.post('/auth/refresh')
    const accessToken = response.data?.data?.accessToken
    if (accessToken) {
      setAccessToken(accessToken)
    }
    return response.data
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.delete('/auth/logout')
    } finally {
      clearAccessToken()
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    const response = await apiClient.post('/auth/password/reset', { email })
    return response.data
  },

  /**
   * Complete password reset
   */
  async resetPassword(token, newPassword) {
    const response = await apiClient.put('/auth/password/reset', {
      token,
      newPassword,
    })
    return response.data
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
