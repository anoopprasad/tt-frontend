import apiClient from './client'

export const timeEntriesApi = {
  list: async (filters = {}) => {
    const response = await apiClient.get('/time_entries', { params: filters })
    return response.data
  },

  get: async (id) => {
    const response = await apiClient.get(`/time_entries/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await apiClient.post('/time_entries', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/time_entries/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/time_entries/${id}`)
    return response.data
  },

  stop: async (id) => {
    const response = await apiClient.post(`/time_entries/${id}/stop`)
    return response.data
  },

  uploadAttachments: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    const response = await apiClient.post(`/time_entries/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
