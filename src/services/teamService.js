import apiClient from './api'

export const teamService = {
  async getTeams() {
    const response = await apiClient.get('/teams')
    return response.data
  },

  async getTeam(id) {
    const response = await apiClient.get(`/teams/${id}`)
    return response.data
  },

  async createTeam(data) {
    const response = await apiClient.post('/teams', data)
    return response.data
  },

  async updateTeam(id, data) {
    const response = await apiClient.put(`/teams/${id}`, data)
    return response.data
  },

  async deleteTeam(id) {
    const response = await apiClient.delete(`/teams/${id}`)
    return response.data
  },
}
