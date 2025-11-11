import api from '../utils/api'

export const reportService = {
  async getReports(params = {}) {
    const response = await api.get('/reports', { params })
    return response.data
  },
}
