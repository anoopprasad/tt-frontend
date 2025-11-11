import apiClient from './client';

export const authAPI = {
  signup: async (email, password, name) => {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.delete('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/password/reset', {
      email,
    });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiClient.put('/auth/password/reset', {
      token,
      newPassword,
    });
    return response.data;
  },
};
