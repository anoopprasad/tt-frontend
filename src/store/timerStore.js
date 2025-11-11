import { create } from 'zustand'

export const useTimerStore = create((set, get) => ({
  runningTimer: null, // { id, startTime, description, projectId }
  elapsedSeconds: 0,
  intervalId: null,

  startTimer: (timerData) => {
    const startTime = new Date()
    const intervalId = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTime) / 1000)
      set({ elapsedSeconds: elapsed })
    }, 1000)

    set({
      runningTimer: {
        ...timerData,
        startTime,
      },
      elapsedSeconds: 0,
      intervalId,
    })
  },

  stopTimer: () => {
    const { intervalId } = get()
    if (intervalId) {
      clearInterval(intervalId)
    }
    set({
      runningTimer: null,
      elapsedSeconds: 0,
      intervalId: null,
    })
  },

  updateElapsed: () => {
    const { runningTimer } = get()
    if (runningTimer) {
      const elapsed = Math.floor((new Date() - runningTimer.startTime) / 1000)
      set({ elapsedSeconds: elapsed })
    }
  },
}))
