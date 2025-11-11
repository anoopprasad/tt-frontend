// Zustand store for UI state

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setChatOpen: (open: boolean) => void;
  toggleChat: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  chatOpen: false,
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setChatOpen: (open) => set({ chatOpen: open }),
  
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}));
