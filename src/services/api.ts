// API client with automatic token refresh and case transformation

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { snakeToCamel, camelToSnake } from '../utils/transform';
import type { ApiResponse, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for HttpOnly cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add auth token and transform to snake_case
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        
        // Transform request data to snake_case
        if (config.data) {
          config.data = camelToSnake(config.data);
        }
        
        // Transform query params to snake_case
        if (config.params) {
          config.params = camelToSnake(config.params);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 errors and transform to camelCase
    this.client.interceptors.response.use(
      (response) => {
        // Transform response data from snake_case to camelCase
        if (response.data) {
          response.data = snakeToCamel(response.data);
        }
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.setAccessToken(newToken);
            
            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear token and redirect to login
            this.setAccessToken(null);
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Create new refresh promise
    this.refreshPromise = (async () => {
      try {
        const response = await axios.post<ApiResponse<{ access_token: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const token = snakeToCamel<{ accessToken: string }>(response.data.data).accessToken;
        return token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // For file uploads
  async postFormData<T>(url: string, formData: FormData, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
