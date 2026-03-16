import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post('/api/auth/login', { email, password });
      set({ user: data.user, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed', loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  register: async (name, email, password) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      set({ user: data.user, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Registration failed', loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));

export default useAuthStore;
