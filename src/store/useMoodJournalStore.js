import { create } from 'zustand';
import axios from 'axios';

const useMoodJournalStore = create((set, get) => ({
  entries: [],
  loading: false,
  selectedEntry: null,

  fetchEntries: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/mood-journal');
      set({ entries: data.entries, loading: false });
    } catch (error) {
      console.error('Fetch mood journal entries error:', error);
      set({ loading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      set({ loading: true });
      const { data } = await axios.post('/api/mood-journal', entry);
      set({ entries: [data.entry, ...get().entries], loading: false });
      return data.entry;
    } catch (error) {
      console.error('Add mood journal entry error:', error);
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
      const { data } = await axios.patch(`/api/mood-journal/${id}`, updates);
      set({
        entries: get().entries.map((e) => (e._id === id ? data.entry : e)),
      });
      return data.entry;
    } catch (error) {
      console.error('Update mood journal entry error:', error);
      set({ entries: oldEntries });
      throw error;
    }
  },

  removeEntry: async (id) => {
    try {
      await axios.delete(`/api/mood-journal/${id}`);
      set({ entries: get().entries.filter((e) => e._id !== id) });
    } catch (error) {
      console.error('Remove mood journal entry error:', error);
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

export default useMoodJournalStore;
