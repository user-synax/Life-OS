import { create } from 'zustand';
import axios from 'axios';

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  loading: false,

  fetchBookmarks: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/bookmarks');
      set({ bookmarks: data.bookmarks, loading: false });
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
      set({ loading: false });
    }
  },

  addBookmark: async (bookmark) => {
    try {
      const { data } = await axios.post('/api/bookmarks', bookmark);
      set({ bookmarks: [data.bookmark, ...get().bookmarks] });
    } catch (error) {
      console.error('Add bookmark error:', error);
    }
  },

  removeBookmark: async (id) => {
    try {
      await axios.delete(`/api/bookmarks/${id}`);
      set({ bookmarks: get().bookmarks.filter((b) => b._id !== id) });
    } catch (error) {
      console.error('Remove bookmark error:', error);
    }
  },
}));

export default useBookmarkStore;
