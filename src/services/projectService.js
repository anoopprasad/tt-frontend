import apiClient from './api'

export const projectService = {
  async getProjects() {
    const response = await apiClient.get('/projects')
    return response.data
  },

  async getProject(id) {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },

  async createProject(data) {
    const response = await apiClient.post('/projects', data)
    return response.data
  },

  async updateProject(id, data) {
    const response = await apiClient.put(`/projects/${id}`, data)
    return response.data
  },

  async deleteProject(id) {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data
  },
}
