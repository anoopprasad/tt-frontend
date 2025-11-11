import axios from 'axios'
import { toCamelCase, toSnakeCase } from '../utils/caseConverter'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
})

// Store access token in memory (not localStorage)
let accessToken = null
let refreshTokenPromise = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const clearAccessToken = () => {
  accessToken = null
}

// Request interceptor: Add auth token and convert request data to snake_case
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Convert request data from camelCase to snake_case
    if (config.data) {
      config.data = toSnakeCase(config.data)
    }

    // Convert query params from camelCase to snake_case
    if (config.params) {
      const convertedParams = {}
      for (const [key, value] of Object.entries(config.params)) {
        convertedParams[toSnakeCase(key)] = value
      }
      config.params = convertedParams
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle 401 errors and convert response to camelCase
apiClient.interceptors.response.use(
  (response) => {
    // Convert response data from snake_case to camelCase
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
      if (!refreshTokenPromise) {
        refreshTokenPromise = apiClient
          .post('/auth/refresh')
          .then((response) => {
            const newToken = response.data?.data?.accessToken || response.data?.data?.access_token
            if (newToken) {
              setAccessToken(newToken)
            }
            refreshTokenPromise = null
            return newToken
          })
          .catch((refreshError) => {
            refreshTokenPromise = null
            clearAccessToken()
            // Redirect to login if refresh fails
            window.location.href = '/login'
            return Promise.reject(refreshError)
          })
      }

      try {
        const newToken = await refreshTokenPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        
        // Convert request data again before retry
        if (originalRequest.data) {
          originalRequest.data = toSnakeCase(JSON.parse(originalRequest.data))
        }
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    // Convert error response to camelCase
    if (error.response?.data) {
      error.response.data = toCamelCase(error.response.data)
    }

    return Promise.reject(error)
  }
)

export default apiClient
