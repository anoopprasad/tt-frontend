import apiClient from './client'

export const projectsApi = {
  list: async () => {
    const response = await apiClient.get('/projects')
    return response.data
  },

  get: async (id) => {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await apiClient.post('/projects', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data
  },
}
