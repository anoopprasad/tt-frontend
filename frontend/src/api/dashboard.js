import apiClient from './client';

export const dashboardAPI = {
  getSummary: async () => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  },

  getReports: async (filters = {}) => {
    const response = await apiClient.get('/reports', { params: filters });
    return response.data;
  },
};
