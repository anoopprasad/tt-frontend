import api from '../utils/api'

export const teamService = {
  async getTeams() {
    const response = await api.get('/teams')
    return response.data
  },

  async getTeam(id) {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },

  async createTeam(data) {
    const response = await api.post('/teams', data)
    return response.data
  },

  async updateTeam(id, data) {
    const response = await api.put(`/teams/${id}`, data)
    return response.data
  },

  async deleteTeam(id) {
    return api.delete(`/teams/${id}`)
  },
}
