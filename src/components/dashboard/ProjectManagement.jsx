'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Calendar, Clock, Target, Users, Settings, Plus, Edit, Trash2, BarChart3, Timer, CheckSquare, Link, FileText, Award } from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import useTaskStore from '@/store/useTaskStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProjectManagement() {
  const {
    projects,
    currentProject,
    templates,
    projectsLoading,
    templatesLoading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    setActiveTab,
    activeTab,
    setShowCreateProject,
    setShowCreateTemplate,
    showCreateProject
  } = useProjectStore();

  const { tasks, fetchTasks, createTask } = useTaskStore();

  // Move useState to the top level to fix hooks order
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'work',
    priority: 'medium',
    status: 'planning',
    tags: '',
    estimatedHours: 40,
    dueDate: '',
    templateId: null
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusColor = (status) => {
    const colors = {
      planning: '#898989',
      active: '#3ecf8e',
      on_hold: '#f59e0b',
      completed: '#22c55e',
      archived: '#6b7280'
    };
    return colors[status] || '#898989';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#898989',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    };
    return colors[priority] || '#898989';
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: '#3ecf8e',
      personal: '#8b5cf6',
      learning: '#06b6d4',
      hobby: '#f59e0b',
      business: '#ef4444',
      creative: '#a855f7',
      other: '#898989'
    };
    return colors[category] || '#898989';
  };

  const formatHours = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours * 10) / 10}h`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderProjectCard = (project) => {
    const progress = project.progress || 0;
    const progressColor = progress >= 80 ? '#22c55e' : progress >= 50 ? '#f59e0b' : '#ef4444';

    return (
      <Card 
        className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] cursor-pointer hover:border-[#3ecf8e] transition-colors"
        onClick={() => setCurrentProject(project)}
        style={{ borderLeft: `4px solid ${project.color || '#3ecf8e'}` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: getCategoryColor(project.category) }}
            >
              {project.category?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#fafafa] mb-1">{project.name}</h4>
              <p className="text-sm text-[#898989] line-clamp-2">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-[4px] ${getStatusColor(project.status)}`}>
              {project.status?.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-xs text-[#898989]">
              {getPriorityColor(project.priority)}
              {project.priority?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#898989]">Progress</span>
            <span className="text-[#fafafa]">{progress}%</span>
          </div>
          <div className="w-full bg-[#2e2e2e] rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: progressColor }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Calendar size={14} className="text-[#898989]" />
              <span className="text-[#898989]">
                {project.startDate ? formatDate(project.startDate) : 'Not set'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Target size={14} className="text-[#898989]" />
              <span className="text-[#898989]">
                {project.dueDate ? formatDate(project.dueDate) : 'Not set'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Clock size={14} className="text-[#898989]" />
              <span className="text-[#898989]">
                {formatHours(project.estimatedHours)} estimated
              </span>
            </div>
            <div className="flex items-center gap-4">
              <BarChart3 size={14} className="text-[#898989]" />
              <span className="text-[#898989]">
                {formatHours(project.actualHours)} actual
              </span>
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-[#363636] text-[#898989] rounded-[4px]">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-[#363636] text-[#898989] rounded-[4px]">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {project.milestones && project.milestones.length > 0 && (
            <div className="mt-3">
              <div className="text-sm text-[#898989] mb-2">Milestones</div>
              <div className="space-y-2">
                {project.milestones.slice(0, 2).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        milestone.status === 'completed' ? 'bg-[#22c55e]' : 'bg-[#898989]'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="text-sm text-[#fafafa]">{milestone.name}</div>
                      <div className="text-xs text-[#898989]">
                        {milestone.dueDate ? formatDate(milestone.dueDate) : 'No due date'}
                      </div>
                    </div>
                  </div>
                ))}
                {project.milestones.length > 2 && (
                  <div className="text-xs text-[#898989] text-center">
                    +{project.milestones.length - 2} more milestones
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderCreateProjectModal = () => {
    const handleCreateProject = async (e) => {
      e.preventDefault();
      try {
        const project = await createProject({
          ...newProject,
          dueDate: newProject.dueDate ? new Date(newProject.dueDate) : null,
          startDate: newProject.startDate ? new Date(newProject.startDate) : null
        });
        
        setNewProject({
          name: '',
          description: '',
          category: 'work',
          priority: 'medium',
          status: 'planning',
          tags: '',
          estimatedHours: 40,
          dueDate: '',
          templateId: null
        });
        
        setShowCreateProject(false);
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    };

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${!showCreateProject ? 'pointer-events-none opacity-0' : ''}`}>
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] max-w-md w-full mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#fafafa]">Create New Project</h3>
            <Button
              onClick={() => setShowCreateProject(false)}
              variant="ghost"
              size="sm"
              className="text-[#898989] hover:text-[#fafafa]"
            >
              ×
            </Button>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="learning">Learning</option>
                  <option value="hobby">Hobby</option>
                  <option value="business">Business</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] resize-none"
                placeholder="Describe your project..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Tags (comma separated)</label>
              <Input
                value={newProject.tags}
                onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                className="w-full"
                placeholder="web, frontend, javascript..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Priority</label>
                <select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                  className="w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => {
    if (!currentProject) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          <div className="text-center">
            <FolderPlus size={32} className="mx-auto text-[#898989] mb-2" />
            <p className="text-sm">Select a project to view details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-[#fafafa]">{currentProject.name}</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateProject(true)}
              className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
            >
              <Plus size={16} className="mr-1" />
              New Project
            </Button>
            <Button
              onClick={() => setActiveTab('templates')}
              className={`border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px] ${
                activeTab === 'templates' ? 'bg-[#363636]' : ''
              }`}
            >
              <FileText size={16} className="mr-1" />
              Templates
            </Button>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-[#171717] border border-[#2e2e2e] rounded-[8px]">
              <h3 className="text-lg font-medium text-[#fafafa] mb-4">Project Overview</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#898989]">Description</label>
                  <p className="text-[#fafafa] mt-1">{currentProject.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#898989]">Status</label>
                    <p className="text-[#fafafa] mt-1 capitalize">{currentProject.status?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#898989]">Priority</label>
                    <p className="text-[#fafafa] mt-1 capitalize">{currentProject.priority}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#898989]">Start Date</label>
                    <p className="text-[#fafafa] mt-1">
                      {currentProject.startDate ? formatDate(currentProject.startDate) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[#898989]">Due Date</label>
                    <p className="text-[#fafafa] mt-1">
                      {currentProject.dueDate ? formatDate(currentProject.dueDate) : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#898989]">Estimated Hours</label>
                    <p className="text-[#fafafa] mt-1">{formatHours(currentProject.estimatedHours)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#898989]">Actual Hours</label>
                    <p className="text-[#fafafa] mt-1">{formatHours(currentProject.actualHours)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-[#171717] border border-[#2e2e2e] rounded-[8px]">
              <h3 className="text-lg font-medium text-[#fafafa] mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#898989]">Completion</span>
                    <span className="text-sm text-[#fafafa]">{currentProject.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-[#2e2e2e] rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${currentProject.progress || 0}%`, 
                        backgroundColor: (currentProject.progress || 0) >= 80 ? '#22c55e' : (currentProject.progress || 0) >= 50 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-[#898989]">
                  <p>Time remaining: {formatHours((currentProject.estimatedHours || 0) - (currentProject.actualHours || 0))}</p>
                  <p>Efficiency: {currentProject.estimatedHours > 0 ? Math.round((currentProject.estimatedHours / (currentProject.actualHours || 1)) * 100) : 0}%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#fafafa]">Project Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateProject(true)}
            className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
          >
            <Plus size={16} className="mr-1" />
            New Project
          </Button>
          <Button
            onClick={() => setActiveTab('templates')}
            className={`border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px] ${
              activeTab === 'templates' ? 'bg-[#363636]' : ''
            }`}
          >
            <FileText size={16} className="mr-1" />
            Templates
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#2e2e2e]">
        {[
          { id: 'projects', label: 'Projects', icon: <FolderPlus size={16} /> },
          { id: 'templates', label: 'Templates', icon: <FileText size={16} /> },
          { id: 'current', label: 'Current', icon: <BarChart3 size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-[#898989] hover:text-[#fafafa]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap mb-4">
              <select
                value={useProjectStore.getState().projectFilters.status}
                onChange={(e) => useProjectStore.getState().setProjectFilters({ status: e.target.value })}
                className="px-3 py-2 bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={useProjectStore.getState().projectFilters.category}
                onChange={(e) => useProjectStore.getState().setProjectFilters({ category: e.target.value })}
                className="px-3 py-2 bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
              >
                <option value="all">All Categories</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="learning">Learning</option>
                <option value="hobby">Hobby</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
                <option value="other">Other</option>
              </select>

              <select
                value={useProjectStore.getState().projectFilters.priority}
                onChange={(e) => useProjectStore.getState().setProjectFilters({ priority: e.target.value })}
                className="px-3 py-2 bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Projects Grid */}
            {projectsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderPlus size={48} className="mx-auto text-[#898989] mb-4" />
                <h3 className="text-lg font-medium text-[#fafafa] mb-2">No Projects Yet</h3>
                <p className="text-[#898989]">Create your first project to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(renderProjectCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Templates Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#fafafa]">Project Templates</h3>
              <Button
                onClick={() => setShowCreateTemplate(true)}
                className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
              >
                <Plus size={16} className="mr-1" />
                Create Template
              </Button>
            </div>

            {/* Templates Grid */}
            {templatesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-[#898989] mb-4" />
                <h3 className="text-lg font-medium text-[#fafafa] mb-2">No Templates Yet</h3>
                <p className="text-[#898989]">Create your first template to save time!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template._id} className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                          style={{ backgroundColor: getCategoryColor(template.category) }}
                        >
                          {template.category?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-[#fafafa]">{template.name}</h4>
                          <p className="text-sm text-[#898989] line-clamp-2">{template.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#898989]">
                          Used {template.usageCount} times
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-[#898989]">
                      {template.estimatedHours}h estimated ? {template.checklist.length} items
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'current' && (
          <div className="space-y-4">
            {renderProjectDetails()}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {useProjectStore.getState().showCreateProject && renderCreateProjectModal()}
      {/* Create Template Modal would go here */}
    </div>
  );
}
