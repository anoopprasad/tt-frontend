import { create } from 'zustand';

export const useTimerStore = create((set) => ({
  runningEntry: null,
  elapsedSeconds: 0,
  
  startTimer: (entry) => set({ runningEntry: entry, elapsedSeconds: 0 }),
  
  stopTimer: () => set({ runningEntry: null, elapsedSeconds: 0 }),
  
  updateElapsed: () => set((state) => ({
    elapsedSeconds: state.runningEntry 
      ? Math.floor((Date.now() - new Date(state.runningEntry.startTime).getTime()) / 1000)
      : 0
  })),
  
  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
}));
