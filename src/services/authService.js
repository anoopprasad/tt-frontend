import api, { setAccessToken, clearAccessToken } from './api'

export const authService = {
  async signup(email, password, passwordConfirmation) {
    const response = await api.post('/auth/signup', {
      email,
      password,
      passwordConfirmation,
    })
    const token = response.data.data?.accessToken || response.data.data?.access_token
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    const token = response.data.data?.accessToken || response.data.data?.access_token
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
    const response = await api.post('/auth/refresh', {})
    const token = response.data.data?.accessToken || response.data.data?.access_token
    if (token) {
      setAccessToken(token)
    }
    return response.data
  },

  async requestPasswordReset(email) {
    return api.post('/auth/password/reset', { email })
  },

  async completePasswordReset(token, password, passwordConfirmation) {
    return api.put('/auth/password/reset', {
      token,
      password,
      passwordConfirmation,
    })
  },
}
