import api from '../utils/api'

export const aiService = {
  async sendChatMessage(message) {
    const response = await api.post('/ai/chat', { message })
    return response.data
  },
}
