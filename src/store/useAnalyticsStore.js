import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      // Overview data
      overview: null,
      overviewLoading: false,
      overviewPeriod: 'week',

      // Study sessions
      sessions: [],
      sessionsLoading: false,
      sessionsPagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      },
      sessionFilters: {
        startDate: null,
        endDate: null,
        sessionType: 'all'
      },

      // Learning streaks
      streak: null,
      streakLoading: false,

      // Skills mastery
      skills: [],
      skillsLoading: false,
      skillsStats: null,
      topSkills: [],
      skillsNeedingAttention: [],
      skillFilters: {
        category: 'all',
        sortBy: 'level'
      },

      // Real-time tracking
      currentSession: null,
      sessionStartTime: null,
      sessionTimer: null,

      // Actions
      fetchOverview: async (period = 'week') => {
        set({ overviewLoading: true, overviewPeriod: period });
        try {
          const response = await axios.get(`/api/analytics/overview?period=${period}`);
          set({ 
            overview: response.data.overview,
            overviewLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch overview:', error);
          set({ overviewLoading: false });
        }
      },

      fetchSessions: async (filters = {}) => {
        set({ sessionsLoading: true });
        try {
          const params = new URLSearchParams();
          
          if (filters.startDate) params.append('startDate', filters.startDate);
          if (filters.endDate) params.append('endDate', filters.endDate);
          if (filters.sessionType && filters.sessionType !== 'all') params.append('sessionType', filters.sessionType);
          params.append('page', filters.page || get().sessionsPagination.page);
          params.append('limit', filters.limit || get().sessionsPagination.limit);

          const response = await axios.get(`/api/analytics/sessions?${params}`);
          
          set({ 
            sessions: response.data.sessions,
            sessionsPagination: response.data.pagination,
            sessionFilters: { ...get().sessionFilters, ...filters },
            sessionsLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch sessions:', error);
          set({ sessionsLoading: false });
        }
      },

      fetchStreak: async () => {
        set({ streakLoading: true });
        try {
          const response = await axios.get('/api/analytics/streaks');
          set({ 
            streak: response.data.streak,
            streakLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch streak:', error);
          set({ streakLoading: false });
        }
      },

      fetchSkills: async (filters = {}) => {
        set({ skillsLoading: true });
        try {
          const params = new URLSearchParams();
          
          if (filters.category && filters.category !== 'all') params.append('category', filters.category);
          if (filters.sortBy) params.append('sortBy', filters.sortBy);
          params.append('limit', filters.limit || 20);

          const response = await axios.get(`/api/analytics/skills?${params}`);
          
          set({ 
            skills: response.data.skills,
            skillsStats: response.data.stats,
            topSkills: response.data.topSkills,
            skillsNeedingAttention: response.data.skillsNeedingAttention,
            skillFilters: { ...get().skillFilters, ...filters },
            skillsLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch skills:', error);
          set({ skillsLoading: false });
        }
      },

      createSession: async (sessionData) => {
        try {
          const response = await axios.post('/api/analytics/sessions', sessionData);
          
          // Refresh sessions and streak data
          get().fetchSessions();
          get().fetchStreak();
          get().fetchOverview(get().overviewPeriod);
          
          return response.data.session;
        } catch (error) {
          console.error('Failed to create session:', error);
          throw error;
        }
      },

      updateStreak: async (updates) => {
        try {
          const response = await axios.patch('/api/analytics/streaks', updates);
          set({ streak: response.data.streak });
        } catch (error) {
          console.error('Failed to update streak:', error);
          throw error;
        }
      },

      createSkill: async (skillData) => {
        try {
          const response = await axios.post('/api/analytics/skills', skillData);
          
          // Refresh skills data
          get().fetchSkills();
          
          return response.data.skill;
        } catch (error) {
          console.error('Failed to create skill:', error);
          throw error;
        }
      },

      updateSkill: async (skillId, updates) => {
        try {
          const response = await axios.patch('/api/analytics/skills', { skillId, ...updates });
          
          // Refresh skills data
          get().fetchSkills();
          
          return response.data.skill;
        } catch (error) {
          console.error('Failed to update skill:', error);
          throw error;
        }
      },

      // Session tracking methods
      startSession: (sessionType = 'knowledge') => {
        const startTime = new Date();
        const sessionData = {
          sessionType,
          startTime,
          articlesStudied: [],
          flashcardsStudied: [],
          breaks: [],
          focusScore: 100
        };

        set({ 
          currentSession: sessionData,
          sessionStartTime: startTime 
        });

        // Start timer
        const timer = setInterval(() => {
          const currentSession = get().currentSession;
          if (currentSession) {
            const now = new Date();
            const duration = Math.floor((now - startTime) / 1000 / 60); // in minutes
            
            // Update focus score based on duration (decreases over time)
            const focusScore = Math.max(50, 100 - Math.floor(duration / 30) * 5);
            
            set({ 
              currentSession: { 
                ...currentSession, 
                duration,
                focusScore 
              }
            });
          }
        }, 60000); // Update every minute

        set({ sessionTimer: timer });
      },

      endSession: async (additionalData = {}) => {
        const { currentSession, sessionStartTime } = get();
        
        if (!currentSession || !sessionStartTime) {
          console.warn('No active session to end');
          return null;
        }

        // Clear timer
        if (get().sessionTimer) {
          clearInterval(get().sessionTimer);
          set({ sessionTimer: null });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime - sessionStartTime) / 1000 / 60);

        const sessionData = {
          ...currentSession,
          endTime,
          duration,
          ...additionalData
        };

        try {
          const createdSession = await get().createSession(sessionData);
          
          // Reset current session
          set({ 
            currentSession: null,
            sessionStartTime: null 
          });

          return createdSession;
        } catch (error) {
          console.error('Failed to save session:', error);
          
          // Still reset current session even if save fails
          set({ 
            currentSession: null,
            sessionStartTime: null 
          });
          
          throw error;
        }
      },

      addArticleToSession: (articleId) => {
        const { currentSession } = get();
        if (currentSession && !currentSession.articlesStudied.includes(articleId)) {
          set({
            currentSession: {
              ...currentSession,
              articlesStudied: [...currentSession.articlesStudied, articleId]
            }
          });
        }
      },

      addFlashcardToSession: (flashcardId, reviewData) => {
        const { currentSession } = get();
        if (currentSession) {
          const existingCardIndex = currentSession.flashcardsStudied.findIndex(
            item => item.flashcardId.toString() === flashcardId.toString()
          );

          if (existingCardIndex >= 0) {
            // Add review to existing card
            const updatedFlashcards = [...currentSession.flashcardsStudied];
            updatedFlashcards[existingCardIndex].reviews.push(reviewData);
            
            set({
              currentSession: {
                ...currentSession,
                flashcardsStudied: updatedFlashcards
              }
            });
          } else {
            // Add new card
            set({
              currentSession: {
                ...currentSession,
                flashcardsStudied: [{
                  flashcardId,
                  reviews: [reviewData]
                }]
              }
            });
          }
        }
      },

      takeBreak: () => {
        const { currentSession } = get();
        if (currentSession) {
          const breakStartTime = new Date();
          
          set({
            currentSession: {
              ...currentSession,
              breaks: [...currentSession.breaks, { startTime: breakStartTime }]
            }
          });
        }
      },

      endBreak: () => {
        const { currentSession } = get();
        if (currentSession && currentSession.breaks.length > 0) {
          const lastBreak = currentSession.breaks[currentSession.breaks.length - 1];
          if (!lastBreak.endTime) {
            const breakEndTime = new Date();
            const breakDuration = Math.floor((breakEndTime - lastBreak.startTime) / 1000 / 60);
            
            const updatedBreaks = [...currentSession.breaks];
            updatedBreaks[updatedBreaks.length - 1] = {
              ...lastBreak,
              endTime: breakEndTime,
              duration: breakDuration
            };
            
            set({
              currentSession: {
                ...currentSession,
                breaks: updatedBreaks
              }
            });
          }
        }
      },

      // Utility methods
      getSessionDuration: () => {
        const { currentSession, sessionStartTime } = get();
        if (!sessionStartTime) return 0;
        return Math.floor((new Date() - sessionStartTime) / 1000 / 60);
      },

      getSessionStats: () => {
        const { currentSession } = get();
        if (!currentSession) return null;
        
        return {
          articlesStudied: currentSession.articlesStudied.length,
          flashcardsStudied: currentSession.flashcardsStudied.length,
          totalReviews: currentSession.flashcardsStudied.reduce(
            (sum, card) => sum + card.reviews.length, 0
          ),
          breaksTaken: currentSession.breaks.filter(b => b.endTime).length,
          totalBreakTime: currentSession.breaks
            .filter(b => b.duration)
            .reduce((sum, b) => sum + b.duration, 0),
          focusScore: currentSession.focusScore
        };
      },

      // Initial data fetch
      initializeAnalytics: async () => {
        await Promise.all([
          get().fetchOverview(),
          get().fetchStreak(),
          get().fetchSkills()
        ]);
      }
    }),
    {
      name: 'analytics-store',
      partialize: (state) => ({
        overviewPeriod: state.overviewPeriod,
        sessionFilters: state.sessionFilters,
        skillFilters: state.skillFilters
      })
    }
  )
);

export default useAnalyticsStore;
