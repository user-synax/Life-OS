'use client';

import { useState } from 'react';
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
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';

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

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/50 bg-muted/5">
          <div className="flex items-center gap-3 font-black text-primary">
            <div className="h-8 w-8 rounded-[4px] bg-primary flex items-center justify-center shadow-sm">
               <div className="h-3 w-3 rounded-full border-2 border-primary-foreground/30" />
            </div>
            <span className="text-lg tracking-[0.1em] uppercase font-black">Life OS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-muted-foreground/50"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-[4px] px-4 py-2.5 transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground font-black shadow-sm'
                    : 'text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon size={16} className={cn("transition-colors", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && (
                   <div className="absolute right-3 h-1 w-1 rounded-full bg-primary-foreground/40" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 bg-muted/5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-[4px] h-10 px-4 transition-colors"
            onClick={logout}
          >
            <LogOut size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
