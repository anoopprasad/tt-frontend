import apiClient from './client'

export const reportsApi = {
  generate: async (filters = {}) => {
    const response = await apiClient.get('/reports', { params: filters })
    return response.data
  },
}
