'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import CommandPalette from '@/components/layout/CommandPalette';
import WidgetSelector from '@/components/widgets/WidgetSelector';
import CreateModal from '@/components/modals/CreateModal';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { user, fetchUser, loading } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Dashboard Layout: Checking cookies on load:', document.cookie);
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // Fallback: if no user from API, check localStorage
    if (!loading && !user) {
      const isAuth = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('user');
      console.log('Dashboard Layout: No user from API, checking localStorage:', { isAuth, hasStoredUser: !!storedUser });
      if (isAuth === 'true' && storedUser) {
        // Restore user from localStorage
        console.log('Dashboard Layout: Restoring user from localStorage');
        useAuthStore.setState({ user: JSON.parse(storedUser), loading: false });
      } else {
        console.log('Dashboard Layout: No auth found, redirecting to login');
        router.push('/login');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin border-t-2 border-primary rounded-full" />
          <p className="text-sm text-muted-foreground">Loading Life OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col lg:pl-64" id="main-content">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
      <CommandPalette />
      <WidgetSelector />
      <CreateModal />
    </div>
  );
}
