'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  StickyNote, 
  Calendar, 
  Activity, 
  Bookmark, 
  Timer, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import gsap from 'gsap';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: StickyNote, label: 'Notes', href: '/dashboard/notes' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: Activity, label: 'Habits', href: '/dashboard/habits' },
  { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/bookmarks' },
  { icon: Timer, label: 'Focus Timer', href: '/dashboard/focus' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: collapsed ? '80px' : '240px',
        duration: 0.3,
        ease: 'power2.inOut',
      });
      document.documentElement.style.setProperty('--sidebar-width', collapsed ? '80px' : '240px');
    }
  }, [collapsed]);

  return (
    <aside
      ref={sidebarRef}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300"
      style={{ width: '240px' }}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl tracking-tight">Life OS</span>
          </div>
        )}
        {collapsed && (
           <div className="mx-auto h-8 w-8 rounded-lg bg-primary" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive transition-colors",
            collapsed && "px-2"
          )}
          onClick={logout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
