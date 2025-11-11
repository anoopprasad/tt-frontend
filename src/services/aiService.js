import apiClient from './api'

export const aiService = {
  /**
   * Send chat message to AI
   */
  async sendMessage(message, conversationHistory = []) {
    const response = await apiClient.post('/ai/chat', {
      message,
      conversationHistory,
    })
    return response.data
  },
}
