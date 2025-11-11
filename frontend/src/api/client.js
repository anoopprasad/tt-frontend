import axios from 'axios';
import { keysToCamel, keysToSnake } from '../utils/caseTransform';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for access token (in memory only)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Transform request data to snake_case
    if (config.data && config.headers['Content-Type'] === 'application/json') {
      config.data = keysToSnake(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Transform response data to camelCase
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.data?.access_token;
        
        if (newToken) {
          setAccessToken(newToken);
          isRefreshing = false;
          onTokenRefreshed(newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        isRefreshing = false;
        clearAccessToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Transform error response to camelCase
    if (error.response?.data) {
      error.response.data = keysToCamel(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
