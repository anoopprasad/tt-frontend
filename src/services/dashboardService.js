import api from '../utils/api'

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary')
    return response.data
  },
}
