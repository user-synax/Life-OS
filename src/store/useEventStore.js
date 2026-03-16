import { create } from 'zustand';
import axios from 'axios';

const useEventStore = create((set, get) => ({
  events: [],
  loading: false,

  fetchEvents: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/events');
      set({ events: data.events, loading: false });
    } catch (error) {
      console.error('Fetch events error:', error);
      set({ loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const { data } = await axios.post('/api/events', event);
      set({ events: [...get().events, data.event] });
      return data.event;
    } catch (error) {
      console.error('Add event error:', error);
      throw error;
    }
  },

  updateEvent: async (id, updates) => {
    const oldEvents = get().events;
    set({
      events: get().events.map((e) =>
        e._id === id ? { ...e, ...updates } : e
      ),
    });

    try {
      const { data } = await axios.patch(`/api/events/${id}`, updates);
      set({
        events: get().events.map((e) => (e._id === id ? data.event : e)),
      });
      return data.event;
    } catch (error) {
      console.error('Update event error:', error);
      set({ events: oldEvents });
      throw error;
    }
  },

  removeEvent: async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      set({
        events: get().events.filter((e) => e._id !== id),
      });
    } catch (error) {
      console.error('Remove event error:', error);
      throw error;
    }
  },
}));

export default useEventStore;
