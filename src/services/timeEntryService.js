import apiClient from './api'

export const timeEntryService = {
  /**
   * Get all time entries with optional filters
   */
  async getTimeEntries(params = {}) {
    const response = await apiClient.get('/time_entries', { params })
    return response.data
  },

  /**
   * Get single time entry
   */
  async getTimeEntry(id) {
    const response = await apiClient.get(`/time_entries/${id}`)
    return response.data
  },

  /**
   * Create new time entry
   */
  async createTimeEntry(data) {
    const response = await apiClient.post('/time_entries', data)
    return response.data
  },

  /**
   * Update time entry
   */
  async updateTimeEntry(id, data) {
    const response = await apiClient.put(`/time_entries/${id}`, data)
    return response.data
  },

  /**
   * Delete time entry
   */
  async deleteTimeEntry(id) {
    const response = await apiClient.delete(`/time_entries/${id}`)
    return response.data
  },

  /**
   * Stop running timer
   */
  async stopTimer(id) {
    const response = await apiClient.post(`/time_entries/${id}/stop`)
    return response.data
  },

  /**
   * Upload attachment to time entry
   */
  async uploadAttachment(timeEntryId, file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post(
      `/time_entries/${timeEntryId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Delete attachment
   */
  async deleteAttachment(attachmentId) {
    const response = await apiClient.delete(`/attachments/${attachmentId}`)
    return response.data
  },
}
