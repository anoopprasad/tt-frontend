import apiClient from './client';

export const clientsAPI = {
  list: async () => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  get: async (id) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },
};
