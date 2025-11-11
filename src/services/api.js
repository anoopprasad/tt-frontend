import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/caseTransform'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending HttpOnly cookies
})

// Token management (stored in memory only)
let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
}

// Request interceptor: Add auth header and transform to snake_case
apiClient.interceptors.request.use(
  (config) => {
    // Add access token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Transform request data to snake_case
    if (config.data && typeof config.data === 'object') {
      config.data = keysToSnake(config.data)
    }

    // Transform query params to snake_case
    if (config.params && typeof config.params === 'object') {
      config.params = keysToSnake(config.params)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Transform to camelCase and handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Transform response data to camelCase
    if (response.data && typeof response.data === 'object') {
      response.data = keysToCamel(response.data)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = keysToCamel(refreshResponse.data)?.data?.accessToken

        if (newAccessToken) {
          setAccessToken(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Transform error response to camelCase
    if (error.response?.data && typeof error.response.data === 'object') {
      error.response.data = keysToCamel(error.response.data)
    }

    return Promise.reject(error)
  }
)

export default apiClient
