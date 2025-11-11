import { create } from 'zustand'

const useTimerStore = create((set, get) => ({
  runningTimer: null,
  elapsedSeconds: 0,
  intervalId: null,

  startTimer: (timerData) => {
    const startTime = new Date(timerData.startTime || new Date())
    set({
      runningTimer: {
        ...timerData,
        startTime,
        id: timerData.id,
      },
      elapsedSeconds: 0,
    })

    // Update elapsed time every second
    const intervalId = setInterval(() => {
      const { runningTimer } = get()
      if (runningTimer) {
        const now = new Date()
        const elapsed = Math.floor((now - new Date(runningTimer.startTime)) / 1000)
        set({ elapsedSeconds: elapsed })
      }
    }, 1000)

    set({ intervalId })
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

  updateElapsedTime: (seconds) => {
    set({ elapsedSeconds: seconds })
  },

  formatTime: (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  },
}))

export default useTimerStore
