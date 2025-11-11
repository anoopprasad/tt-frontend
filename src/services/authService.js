import api from '../utils/api'
import { setAccessToken, clearAccessToken } from '../utils/api'

export const authService = {
  async signup(email, password) {
    const response = await api.post('/auth/signup', { email, password })
    const token = response.data?.data?.accessToken || response.data?.accessToken
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const token = response.data?.data?.accessToken || response.data?.accessToken
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  async logout() {
    try {
      await api.delete('/auth/logout')
    } finally {
      clearAccessToken()
    }
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    const token = response.data?.data?.accessToken || response.data?.accessToken
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  async requestPasswordReset(email) {
    return api.post('/auth/password/reset', { email })
  },

  async completePasswordReset(token, password) {
    return api.put('/auth/password/reset', { token, password })
  },
}
