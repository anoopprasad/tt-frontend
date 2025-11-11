import axios from 'axios'
import { toCamelCase, toSnakeCase } from '../utils/caseTransform'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
})

// Store access token in memory
let accessToken = null
let refreshPromise = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
}

// Request interceptor: Add auth token and transform request data
api.interceptors.request.use(
  (config) => {
    // Add access token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Transform request data from camelCase to snake_case
    if (config.data && typeof config.data === 'object') {
      config.data = toSnakeCase(config.data)
    }

    // Transform query params
    if (config.params && typeof config.params === 'object') {
      config.params = toSnakeCase(config.params)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle token refresh and transform response data
api.interceptors.response.use(
  (response) => {
    // Transform response data from snake_case to camelCase
    if (response.data) {
      response.data = toCamelCase(response.data)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Prevent multiple simultaneous refresh calls
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }

      try {
        const newToken = await refreshPromise
        refreshPromise = null

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        const response = await api(originalRequest)
        return response
      } catch (refreshError) {
        refreshPromise = null
        // Refresh failed - redirect to login
        clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Transform error response
    if (error.response?.data) {
      error.response.data = toCamelCase(error.response.data)
    }

    return Promise.reject(error)
  }
)

// Refresh access token
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    const newToken = response.data.data?.accessToken || response.data.data?.access_token
    if (newToken) {
      setAccessToken(newToken)
      return newToken
    }
    throw new Error('No token in refresh response')
  } catch (error) {
    clearAccessToken()
    throw error
  }
}

export default api
