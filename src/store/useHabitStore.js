import { create } from 'zustand';
import axios from 'axios';
import { startOfDay } from 'date-fns';

const useHabitStore = create((set, get) => ({
  habits: [],
  logs: [],
  loading: false,

  fetchHabits: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/habits');
      set({ habits: data.habits, logs: data.logs, loading: false });
    } catch (error) {
      console.error('Fetch habits error:', error);
      set({ loading: false });
    }
  },

  addHabit: async (name) => {
    try {
      const { data } = await axios.post('/api/habits', { name });
      set({ habits: [...get().habits, data.habit] });
    } catch (error) {
      console.error('Add habit error:', error);
    }
  },

  toggleHabit: async (habitId, date) => {
    const today = startOfDay(new Date(date)).toISOString();
    const existingLog = get().logs.find(
      (l) => l.habitId === habitId && startOfDay(new Date(l.date)).toISOString() === today
    );

    const newCompleted = existingLog ? !existingLog.completed : true;

    if (existingLog) {
      set({
        logs: get().logs.map((l) =>
          l._id === existingLog._id ? { ...l, completed: newCompleted } : l
        ),
      });
    } else {
      // Optimistic update
      const tempId = Math.random().toString();
      set({
        logs: [...get().logs, { _id: tempId, habitId, date: today, completed: true }],
      });
    }

    try {
      const { data } = await axios.post(`/api/habits/${habitId}/toggle`, { date: today });
      // Update with real data
      set({
        logs: get().logs.map((l) => (l.habitId === habitId && startOfDay(new Date(l.date)).toISOString() === today ? data.log : l)),
        habits: get().habits.map((h) => (h._id === habitId ? data.habit : h)),
      });
    } catch (error) {
      console.error('Toggle habit error:', error);
      // Revert on error
    }
  },

  removeHabit: async (id) => {
    try {
      await axios.delete(`/api/habits/${id}`);
      set({
        habits: get().habits.filter((h) => h._id !== id),
        logs: get().logs.filter((l) => l.habitId !== id),
      });
    } catch (error) {
      console.error('Remove habit error:', error);
    }
  },
}));

export default useHabitStore;
