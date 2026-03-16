import { create } from 'zustand';
import axios from 'axios';

const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,

  fetchNotes: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/notes');
      set({ notes: data.notes, loading: false });
    } catch (error) {
      console.error('Fetch notes error:', error);
      set({ loading: false });
    }
  },

  addNote: async (note) => {
    try {
      const { data } = await axios.post('/api/notes', note);
      set({ notes: [data.note, ...get().notes] });
    } catch (error) {
      console.error('Add note error:', error);
    }
  },

  updateNote: async (id, updates) => {
    set({
      notes: get().notes.map((n) =>
        n._id === id ? { ...n, ...updates } : n
      ),
    });

    try {
      await axios.patch(`/api/notes/${id}`, updates);
    } catch (error) {
      console.error('Update note error:', error);
    }
  },

  removeNote: async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      set({ notes: get().notes.filter((n) => n._id !== id) });
    } catch (error) {
      console.error('Remove note error:', error);
    }
  },
}));

export default useNoteStore;
