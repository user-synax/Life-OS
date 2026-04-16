import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFocusStore = create(
  persist(
    (set, get) => ({
      timeLeft: 25 * 60,
      isActive: false,
      mode: 'focus', // 'focus' or 'break'
      isMuted: false,
      isFullscreen: false,
      dailySessions: 0,
      dailyFocusTime: 0,
      showFloatingTimer: false,
      lastTick: null,

      toggleTimer: () => {
        const isActive = !get().isActive;
        set({ 
          isActive,
          lastTick: isActive ? Date.now() : null
        });
      },

      resetTimer: () => {
        const mode = get().mode;
        set({
          isActive: false,
          timeLeft: mode === 'focus' ? 25 * 60 : 5 * 60,
          lastTick: null,
        });
      },

      setMode: (mode) => {
        set({
          mode,
          isActive: false,
          timeLeft: mode === 'focus' ? 25 * 60 : 5 * 60,
          lastTick: null,
        });
      },

      toggleMute: () => set({ isMuted: !get().isMuted }),

      toggleFullscreen: () => set({ isFullscreen: !get().isFullscreen }),

      setTimeLeft: (time) => set({ timeLeft: time }),

      incrementDailySessions: () => set({ dailySessions: get().dailySessions + 1 }),

      addFocusTime: (minutes) => set({ dailyFocusTime: get().dailyFocusTime + minutes }),

      setShowFloatingTimer: (show) => set({ showFloatingTimer: show }),

      syncTimer: () => {
        const { isActive, timeLeft, lastTick } = get();
        if (isActive && lastTick) {
          const elapsed = Math.floor((Date.now() - lastTick) / 1000);
          if (elapsed > 0) {
            const newTimeLeft = Math.max(0, timeLeft - elapsed);
            set({ 
              timeLeft: newTimeLeft,
              lastTick: Date.now()
            });
            return newTimeLeft;
          }
        }
        return timeLeft;
      },
    }),
    {
      name: 'focus-storage',
      partialize: (state) => ({
        timeLeft: state.timeLeft,
        isActive: state.isActive,
        mode: state.mode,
        dailySessions: state.dailySessions,
        dailyFocusTime: state.dailyFocusTime,
        lastTick: state.lastTick,
      }),
    }
  )
);

export default useFocusStore;
