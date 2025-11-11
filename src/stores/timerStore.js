import { create } from 'zustand'

/**
 * Global timer store using Zustand
 * Manages the running timer state visible across all pages
 */
export const useTimerStore = create((set, get) => ({
  // Timer state
  isRunning: false,
  startTime: null,
  description: '',
  projectId: null,
  timeEntryId: null,
  elapsedSeconds: 0,

  // Start a new timer
  startTimer: (description, projectId, timeEntryId, startTime) => {
    set({
      isRunning: true,
      startTime: startTime || new Date(),
      description: description || '',
      projectId: projectId || null,
      timeEntryId: timeEntryId || null,
      elapsedSeconds: 0,
    })
  },

  // Stop the timer
  stopTimer: () => {
    set({
      isRunning: false,
      startTime: null,
      description: '',
      projectId: null,
      timeEntryId: null,
      elapsedSeconds: 0,
    })
  },

  // Update elapsed time (called every second)
  updateElapsed: () => {
    const { isRunning, startTime } = get()
    if (isRunning && startTime) {
      const now = new Date()
      const elapsed = Math.floor((now - new Date(startTime)) / 1000)
      set({ elapsedSeconds: elapsed })
    }
  },

  // Update timer description
  updateDescription: (description) => {
    set({ description })
  },

  // Update timer project
  updateProject: (projectId) => {
    set({ projectId })
  },
}))
