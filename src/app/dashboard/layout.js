'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user, fetchUser, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="text-muted-foreground animate-pulse">Loading Life OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col transition-all duration-300 ml-[240px]" id="main-content">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
      <style jsx global>{`
        #main-content {
          margin-left: var(--sidebar-width, 240px);
        }
      `}</style>
    </div>
  );
}
