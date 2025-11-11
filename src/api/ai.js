import apiClient from './client'

export const aiApi = {
  chat: async (message) => {
    const response = await apiClient.post('/ai/chat', { message })
    return response.data
  },
}
