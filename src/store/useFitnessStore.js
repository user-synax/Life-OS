import { create } from 'zustand';
import axios from 'axios';

const useFitnessStore = create((set, get) => ({
  entries: [],
  loading: false,
  selectedEntry: null,

  fetchEntries: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/fitness');
      set({ entries: data.entries, loading: false });
    } catch (error) {
      console.error('Fetch fitness entries error:', error);
      set({ loading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      set({ loading: true });
      const { data } = await axios.post('/api/fitness', entry);
      set({ entries: [data.entry, ...get().entries], loading: false });
      return data.entry;
    } catch (error) {
      console.error('Add fitness entry error:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateEntry: async (id, updates) => {
    const oldEntries = get().entries;
    set({
      entries: get().entries.map((e) =>
        e._id === id ? { ...e, ...updates } : e
      ),
    });

    try {
      const { data } = await axios.patch(`/api/fitness/${id}`, updates);
      set({
        entries: get().entries.map((e) => (e._id === id ? data.entry : e)),
      });
      return data.entry;
    } catch (error) {
      console.error('Update fitness entry error:', error);
      set({ entries: oldEntries });
      throw error;
    }
  },

  removeEntry: async (id) => {
    try {
      await axios.delete(`/api/fitness/${id}`);
      set({ entries: get().entries.filter((e) => e._id !== id) });
    } catch (error) {
      console.error('Remove fitness entry error:', error);
      throw error;
    }
  },

  setSelectedEntry: (entry) => {
    set({ selectedEntry: entry });
  },

  clearSelectedEntry: () => {
    set({ selectedEntry: null });
  },
}));

export default useFitnessStore;
