// Zustand store for timer state

import { create } from 'zustand';
import type { TimeEntry } from '../types';

interface TimerState {
  runningEntry: TimeEntry | null;
  startTime: Date | null;
  elapsedSeconds: number;
  setRunningEntry: (entry: TimeEntry | null) => void;
  setStartTime: (time: Date | null) => void;
  updateElapsed: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  runningEntry: null,
  startTime: null,
  elapsedSeconds: 0,
  
  setRunningEntry: (entry) => set({ runningEntry: entry }),
  
  setStartTime: (time) => set({ startTime: time }),
  
  updateElapsed: () => {
    set((state) => {
      if (!state.startTime) return state;
      const elapsed = Math.floor((Date.now() - state.startTime.getTime()) / 1000);
      return { elapsedSeconds: elapsed };
    });
  },
  
  reset: () => set({
    runningEntry: null,
    startTime: null,
    elapsedSeconds: 0,
  }),
}));

// Start interval to update elapsed time
if (typeof window !== 'undefined') {
  setInterval(() => {
    const state = useTimerStore.getState();
    if (state.startTime) {
      state.updateElapsed();
    }
  }, 1000);
}
