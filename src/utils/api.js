import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Convert snake_case to camelCase
function toCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase)
  if (obj instanceof Date) return obj

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    acc[camelKey] = toCamelCase(obj[key])
    return acc
  }, {})
}

// Convert camelCase to snake_case
function toSnakeCase(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCase)
  if (obj instanceof Date) return obj
  if (obj instanceof File || obj instanceof FormData) return obj

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    acc[snakeKey] = toSnakeCase(obj[key])
    return acc
  }, {})
}

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
let refreshTokenPromise = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
}

// Request interceptor - add auth token and transform request data
api.interceptors.request.use(
  (config) => {
    // Add access token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Transform request data from camelCase to snake_case
    if (config.data && !(config.data instanceof FormData)) {
      config.data = toSnakeCase(config.data)
    }

    // Transform query params
    if (config.params) {
      config.params = toSnakeCase(config.params)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 errors and transform response data
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
      if (!refreshTokenPromise) {
        refreshTokenPromise = api
          .post('/auth/refresh')
          .then((response) => {
            const newToken = response.data?.data?.access_token || response.data?.accessToken
            if (newToken) {
              setAccessToken(newToken)
              return newToken
            }
            throw new Error('No token in refresh response')
          })
          .catch((refreshError) => {
            clearAccessToken()
            // Redirect to login
            window.location.href = '/login'
            return Promise.reject(refreshError)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      try {
        const newToken = await refreshTokenPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        // Transform request data again before retry
        if (originalRequest.data && !(originalRequest.data instanceof FormData)) {
          originalRequest.data = toSnakeCase(originalRequest.data)
        }
        return api(originalRequest)
      } catch (refreshError) {
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

export default api
