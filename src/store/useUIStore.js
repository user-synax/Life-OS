import { create } from 'zustand';

const useUIStore = create((set) => ({
  isCommandPaletteOpen: false,
  isWidgetSelectorOpen: false,
  
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setWidgetSelectorOpen: (open) => set({ isWidgetSelectorOpen: open }),
  
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  toggleWidgetSelector: () => set((state) => ({ isWidgetSelectorOpen: !state.isWidgetSelectorOpen })),
}));

export default useUIStore;
