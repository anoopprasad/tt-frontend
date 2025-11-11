import apiClient from './client'
import { setAccessToken, clearAccessToken } from './client'

export const authApi = {
  signup: async (email, password) => {
    const response = await apiClient.post('/auth/signup', { email, password })
    const token = response.data?.data?.accessToken || response.data?.data?.access_token
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    const token = response.data?.data?.accessToken || response.data?.data?.access_token
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  logout: async () => {
    try {
      await apiClient.delete('/auth/logout')
    } finally {
      clearAccessToken()
    }
  },

  refresh: async () => {
    const response = await apiClient.post('/auth/refresh')
    const token = response.data?.data?.accessToken || response.data?.data?.access_token
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/password/reset', { email })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await apiClient.put('/auth/password/reset', { token, password })
    return response.data
  },
}
