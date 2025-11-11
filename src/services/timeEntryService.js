import api from './api'

export const timeEntryService = {
  async getTimeEntries(params = {}) {
    const response = await api.get('/time_entries', { params })
    return response.data
  },

  async getTimeEntry(id) {
    const response = await api.get(`/time_entries/${id}`)
    return response.data
  },

  async createTimeEntry(data) {
    const response = await api.post('/time_entries', data)
    return response.data
  },

  async updateTimeEntry(id, data) {
    const response = await api.put(`/time_entries/${id}`, data)
    return response.data
  },

  async deleteTimeEntry(id) {
    const response = await api.delete(`/time_entries/${id}`)
    return response.data
  },

  async stopTimer(id) {
    const response = await api.post(`/time_entries/${id}/stop`)
    return response.data
  },

  async uploadAttachments(timeEntryId, files) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files[]', file)
    })
    const response = await api.post(`/time_entries/${timeEntryId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deleteAttachment(attachmentId) {
    const response = await api.delete(`/attachments/${attachmentId}`)
    return response.data
  },
}
