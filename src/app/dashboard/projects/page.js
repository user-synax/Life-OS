'use client';

import ProjectManagement from '@/components/dashboard/ProjectManagement';

export default function ProjectsPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-6">
        <h1 className="text-2xl font-normal text-[#fafafa]">Project Management</h1>
        <p className="text-[#898989] mt-1">Organize and track your projects with powerful management tools</p>
      </div>
      
      <div className="p-6">
        <ProjectManagement />
      </div>
    </div>
  );
}
