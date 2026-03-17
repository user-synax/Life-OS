import { create } from 'zustand';

const useUIStore = create((set) => ({
  isCommandPaletteOpen: false,
  isWidgetSelectorOpen: false,
  isCreateModalOpen: false,
  createType: null, // 'task', 'note', 'event'
  
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setWidgetSelectorOpen: (open) => set({ isWidgetSelectorOpen: open }),
  
  openCreateModal: (type) => set({ isCreateModalOpen: true, createType: type }),
  closeCreateModal: () => set({ isCreateModalOpen: false, createType: null }),
  
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  toggleWidgetSelector: () => set((state) => ({ isWidgetSelectorOpen: !state.isWidgetSelectorOpen })),
}));

export default useUIStore;
