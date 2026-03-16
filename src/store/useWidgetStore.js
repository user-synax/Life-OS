import { create } from 'zustand';
import axios from 'axios';

const useWidgetStore = create((set, get) => ({
  widgets: [],
  loading: false,

  fetchWidgets: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/widgets');
      set({ widgets: data.widgets, loading: false });
    } catch (error) {
      console.error('Fetch widgets error:', error);
      set({ loading: false });
    }
  },

  updateWidgetPosition: async (id, position) => {
    const widgets = get().widgets.map(w => 
      w._id === id ? { ...w, position } : w
    );
    set({ widgets });
    try {
      await axios.patch(`/api/widgets/${id}`, { position });
    } catch (error) {
      console.error('Update widget error:', error);
    }
  },

  reorderWidgets: async (newWidgets) => {
    set({ widgets: newWidgets });
    // In a real app, you'd save the order to the database
  },

  addWidget: async (type) => {
    try {
      const { data } = await axios.post('/api/widgets', { widgetType: type });
      set({ widgets: [...get().widgets, data.widget] });
    } catch (error) {
      console.error('Add widget error:', error);
    }
  },

  removeWidget: async (id) => {
    try {
      await axios.delete(`/api/widgets/${id}`);
      set({ widgets: get().widgets.filter(w => w._id !== id) });
    } catch (error) {
      console.error('Remove widget error:', error);
    }
  },
}));

export default useWidgetStore;
