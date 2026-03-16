import { create } from 'zustand';
import axios from 'axios';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/tasks');
      set({ tasks: data.tasks, loading: false });
    } catch (error) {
      console.error('Fetch tasks error:', error);
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const { data } = await axios.post('/api/tasks', task);
      set({ tasks: [data.task, ...get().tasks] });
      return data.task;
    } catch (error) {
      console.error('Add task error:', error);
      throw error;
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t._id === id);
    if (!task) return;
    
    const newCompleted = !task.completed;
    set({
      tasks: get().tasks.map((t) =>
        t._id === id ? { ...t, completed: newCompleted } : t
      ),
    });

    try {
      await axios.patch(`/api/tasks/${id}`, { completed: newCompleted });
    } catch (error) {
      console.error('Toggle task error:', error);
      throw error;
    }
  },

  removeTask: async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      set({ tasks: get().tasks.filter((t) => t._id !== id) });
    } catch (error) {
      console.error('Remove task error:', error);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const oldTasks = get().tasks;
    set({
      tasks: get().tasks.map((t) =>
        t._id === id ? { ...t, ...updates } : t
      ),
    });

    try {
      await axios.patch(`/api/tasks/${id}`, updates);
    } catch (error) {
      console.error('Update task error:', error);
      set({ tasks: oldTasks });
      throw error;
    }
  },
}));

export default useTaskStore;
