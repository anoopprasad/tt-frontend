import apiClient from './api'

export const tagService = {
  async getTags() {
    const response = await apiClient.get('/tags')
    return response.data
  },

  async getTag(id) {
    const response = await apiClient.get(`/tags/${id}`)
    return response.data
  },

  async createTag(data) {
    const response = await apiClient.post('/tags', data)
    return response.data
  },

  async updateTag(id, data) {
    const response = await apiClient.put(`/tags/${id}`, data)
    return response.data
  },

  async deleteTag(id) {
    const response = await apiClient.delete(`/tags/${id}`)
    return response.data
  },
}
