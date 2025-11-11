import apiClient from './api'

export const dashboardService = {
  /**
   * Get dashboard summary statistics
   */
  async getSummary() {
    const response = await apiClient.get('/dashboard/summary')
    return response.data
  },

  /**
   * Get reports with filters
   */
  async getReports(params = {}) {
    const response = await apiClient.get('/reports', { params })
    return response.data
  },
}
