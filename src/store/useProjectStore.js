import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useProjectStore = create(
  persist(
    (set, get) => ({
      // Projects
      projects: [],
      projectsLoading: false,
      projectsPagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      },
      projectFilters: {
        status: 'all',
        category: 'all',
        priority: 'all',
        tags: '',
        search: '',
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      },

      // Current Project
      currentProject: null,
      currentProjectLoading: false,

      // Templates
      templates: [],
      templatesLoading: false,
      templatesPagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      },
      templateFilters: {
        category: 'all',
        search: '',
        sortBy: 'usageCount',
        sortOrder: 'desc'
      },

      // UI State
      showCreateProject: false,
      showCreateTemplate: false,
      activeTab: 'projects', // projects, templates, current

      // Actions
      fetchProjects: async (filters = {}) => {
        set({ projectsLoading: true });
        try {
          const params = new URLSearchParams();
          
          if (filters.status && filters.status !== 'all') params.append('status', filters.status);
          if (filters.category && filters.category !== 'all') params.append('category', filters.category);
          if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
          if (filters.tags) params.append('tags', filters.tags);
          if (filters.search) params.append('search', filters.search);
          params.append('page', filters.page || get().projectsPagination.page);
          params.append('limit', filters.limit || get().projectsPagination.limit);
          params.append('sortBy', filters.sortBy || get().projectFilters.sortBy);
          params.append('sortOrder', filters.sortOrder || get().projectFilters.sortOrder);

          const response = await axios.get(`/api/projects?${params}`);
          
          set({ 
            projects: response.data.projects,
            projectsPagination: response.data.pagination,
            projectFilters: { ...get().projectFilters, ...filters },
            projectsLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch projects:', error);
          set({ projectsLoading: false });
        }
      },

      createProject: async (projectData) => {
        try {
          const response = await axios.post('/api/projects', projectData);
          
          // Refresh projects list
          get().fetchProjects();
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to create project:', error);
          throw error;
        }
      },

      updateProject: async (projectId, updates) => {
        try {
          const response = await axios.patch('/api/projects', { id: projectId, ...updates });
          
          // Refresh projects list
          get().fetchProjects();
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to update project:', error);
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          await axios.delete(`/api/projects/${projectId}`);
          
          // Refresh projects list
          get().fetchProjects();
          
          // Clear current project if it was the deleted one
          if (get().currentProject?._id === projectId) {
            set({ currentProject: null });
          }
        } catch (error) {
          console.error('Failed to delete project:', error);
          throw error;
        }
      },

      fetchProject: async (projectId) => {
        set({ currentProjectLoading: true });
        try {
          const response = await axios.get(`/api/projects/${projectId}`);
          set({ 
            currentProject: response.data.project,
            currentProjectLoading: false 
          });
          return response.data.project;
        } catch (error) {
          console.error('Failed to fetch project:', error);
          set({ currentProjectLoading: false });
          throw error;
        }
      },

      fetchTemplates: async (filters = {}) => {
        set({ templatesLoading: true });
        try {
          const params = new URLSearchParams();
          
          if (filters.category && filters.category !== 'all') params.append('category', filters.category);
          if (filters.search) params.append('search', filters.search);
          params.append('page', filters.page || get().templatesPagination.page);
          params.append('limit', filters.limit || get().templatesPagination.limit);
          params.append('sortBy', filters.sortBy || get().templateFilters.sortBy);
          params.append('sortOrder', filters.sortOrder || get().templateFilters.sortOrder);

          const response = await axios.get(`/api/projects/templates?${params}`);
          
          set({ 
            templates: response.data.templates,
            templatesPagination: response.data.pagination,
            templateFilters: { ...get().templateFilters, ...filters },
            templatesLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch templates:', error);
          set({ templatesLoading: false });
        }
      },

      createTemplate: async (templateData) => {
        try {
          const response = await axios.post('/api/projects/templates', templateData);
          
          // Refresh templates list
          get().fetchTemplates();
          
          return response.data.template;
        } catch (error) {
          console.error('Failed to create template:', error);
          throw error;
        }
      },

      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      setProjectFilters: (filters) => {
        set({ projectFilters: { ...get().projectFilters, ...filters } });
      },

      setTemplateFilters: (filters) => {
        set({ templateFilters: { ...get().templateFilters, ...filters } });
      },

      setShowCreateProject: (show) => {
        set({ showCreateProject: show });
      },

      setShowCreateTemplate: (show) => {
        set({ showCreateTemplate: show });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      // Task linking methods
      linkTaskToProject: async (projectId, taskId) => {
        try {
          const response = await axios.patch('/api/projects', { 
            id: projectId, 
            $push: { linkedTasks: taskId }
          });
          
          // Refresh project
          get().fetchProject(projectId);
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to link task to project:', error);
          throw error;
        }
      },

      unlinkTaskFromProject: async (projectId, taskId) => {
        try {
          const response = await axios.patch('/api/projects', { 
            id: projectId, 
            $pull: { linkedTasks: taskId }
          });
          
          // Refresh project
          get().fetchProject(projectId);
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to unlink task from project:', error);
          throw error;
        }
      },

      // Milestone methods
      addMilestone: async (projectId, milestoneData) => {
        try {
          const response = await axios.patch('/api/projects', { 
            id: projectId, 
            $push: { 
              milestones: {
                ...milestoneData,
                created: new Date()
              }
            }
          });
          
          // Refresh project
          get().fetchProject(projectId);
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to add milestone:', error);
          throw error;
        }
      },

      updateMilestone: async (projectId, milestoneIndex, updates) => {
        try {
          const response = await axios.patch('/api/projects', { 
            id: projectId, 
            [`milestones.${milestoneIndex}`]: updates
          });
          
          // Refresh project
          get().fetchProject(projectId);
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to update milestone:', error);
          throw error;
        }
      },

      completeMilestone: async (projectId, milestoneIndex) => {
        try {
          const response = await axios.patch('/api/projects', { 
            id: projectId, 
            [`milestones.${milestoneIndex}.status`]: 'completed',
            [`milestones.${milestoneIndex}.completedAt`]: new Date()
          });
          
          // Refresh project
          get().fetchProject(projectId);
          
          return response.data.project;
        } catch (error) {
          console.error('Failed to complete milestone:', error);
          throw error;
        }
      },

      // Time tracking methods
      startProjectTimer: (projectId) => {
        const startTime = new Date();
        set({ 
          currentProject: get().currentProject ? {
            ...get().currentProject,
            startTime,
            isTracking: true
          } : null
        });
      },

      stopProjectTimer: async (projectId, additionalData = {}) => {
        const { currentProject } = get();
        if (!currentProject || !currentProject.startTime) return null;

        const endTime = new Date();
        const duration = Math.floor((endTime - currentProject.startTime) / 1000 / 60); // in minutes

        const updatedProject = await get().updateProject(projectId, {
          actualHours: (currentProject.actualHours || 0) + duration,
          endTime,
          isTracking: false
        });

        return updatedProject;
      },

      // Initial data fetch
      initializeProjects: async () => {
        await Promise.all([
          get().fetchProjects(),
          get().fetchTemplates()
        ]);
      }
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        projectFilters: state.projectFilters,
        templateFilters: state.templateFilters,
        activeTab: state.activeTab
      })
    }
  )
);

export default useProjectStore;
