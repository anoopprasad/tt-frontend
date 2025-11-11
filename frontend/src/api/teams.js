import apiClient from './client';

export const teamsAPI = {
  list: async () => {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/teams', data);
    return response.data;
  },

  get: async (id) => {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/teams/${id}`);
    return response.data;
  },
};
