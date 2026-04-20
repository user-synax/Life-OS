'use client';

import KnowledgeComponent from '@/components/dashboard/KnowledgeComponent';

export default function KnowledgePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-6">
        <h1 className="text-2xl font-normal text-[#fafafa]">Knowledge Base</h1>
        <p className="text-[#898989] mt-1">Your personal wiki and knowledge repository</p>
      </div>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <KnowledgeComponent />
        </div>
      </div>
    </div>
  );
}
