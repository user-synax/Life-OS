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
      return data.bookmark;
    } catch (error) {
      console.error('Add bookmark error:', error);
      throw error;
    }
  },

  updateBookmark: async (id, updates) => {
    const oldBookmarks = get().bookmarks;
    set({
      bookmarks: get().bookmarks.map((b) =>
        b._id === id ? { ...b, ...updates } : b
      ),
    });

    try {
      const { data } = await axios.patch(`/api/bookmarks/${id}`, updates);
      set({
        bookmarks: get().bookmarks.map((b) => (b._id === id ? data.bookmark : b)),
      });
      return data.bookmark;
    } catch (error) {
      console.error('Update bookmark error:', error);
      set({ bookmarks: oldBookmarks });
      throw error;
    }
  },

  removeBookmark: async (id) => {
    try {
      await axios.delete(`/api/bookmarks/${id}`);
      set({ bookmarks: get().bookmarks.filter((b) => b._id !== id) });
    } catch (error) {
      console.error('Remove bookmark error:', error);
      throw error;
    }
  },
}));

export default useBookmarkStore;
