import api from '../utils/api'

export const projectService = {
  async getProjects() {
    const response = await api.get('/projects')
    return response.data
  },

  async getProject(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  async createProject(data) {
    const response = await api.post('/projects', data)
    return response.data
  },

  async updateProject(id, data) {
    const response = await api.put(`/projects/${id}`, data)
    return response.data
  },

  async deleteProject(id) {
    return api.delete(`/projects/${id}`)
  },
}
