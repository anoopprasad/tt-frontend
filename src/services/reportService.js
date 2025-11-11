import api from './api'

export const reportService = {
  async getReports(params = {}) {
    const response = await api.get('/reports', { params })
    return response.data
  },
}
