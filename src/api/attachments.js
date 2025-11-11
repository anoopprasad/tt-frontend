import apiClient from './client'

export const attachmentsApi = {
  delete: async (id) => {
    const response = await apiClient.delete(`/attachments/${id}`)
    return response.data
  },
}
