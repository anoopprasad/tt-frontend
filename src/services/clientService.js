import apiClient from './api'

export const clientService = {
  async getClients() {
    const response = await apiClient.get('/clients')
    return response.data
  },

  async getClient(id) {
    const response = await apiClient.get(`/clients/${id}`)
    return response.data
  },

  async createClient(data) {
    const response = await apiClient.post('/clients', data)
    return response.data
  },

  async updateClient(id, data) {
    const response = await apiClient.put(`/clients/${id}`, data)
    return response.data
  },

  async deleteClient(id) {
    const response = await apiClient.delete(`/clients/${id}`)
    return response.data
  },
}
