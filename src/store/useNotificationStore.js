import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  socket: null,

  initSocket: (userId) => {
    if (get().socket) return;
    
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', userId);
    });

    socket.on('notification', (notification) => {
      set({ 
        notifications: [notification, ...get().notifications],
        unreadCount: get().unreadCount + 1
      });
    });

    set({ socket });
  },

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/notifications');
      set({ 
        notifications: data.notifications, 
        unreadCount: data.notifications.filter(n => !n.isRead).length,
        loading: false 
      });
    } catch (error) {
      console.error('Fetch notifications error:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true });
      set({
        notifications: get().notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1)
      });
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  },

  clearAll: async () => {
    try {
      await axios.delete('/api/notifications');
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  },
}));

export default useNotificationStore;
