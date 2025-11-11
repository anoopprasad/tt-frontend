import apiClient from './client'

export const tagsApi = {
  list: async () => {
    const response = await apiClient.get('/tags')
    return response.data
  },

  get: async (id) => {
    const response = await apiClient.get(`/tags/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await apiClient.post('/tags', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tags/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tags/${id}`)
    return response.data
  },
}
