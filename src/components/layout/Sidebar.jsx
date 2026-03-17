'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User,
  CheckSquare, 
  StickyNote, 
  Calendar, 
  Activity, 
  Bookmark, 
  Timer, 
  Settings, 
  Menu,
  X,
  LogOut,
  Search,
  Command as CommandIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
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
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border bg-muted/5">
          <div className="flex items-center gap-3 font-bold text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
               <div className="h-3 w-3 rounded-full border-2 border-primary-foreground/30" />
            </div>
            <span className="text-lg tracking-tight uppercase">Life OS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-muted-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        <div className="px-4 pt-6 pb-2">
          <button 
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
                metaKey: true
              });
              window.dispatchEvent(event);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2 rounded-md bg-muted/50 border border-border hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Search...</span>
            </div>
            <div className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border border-border">
               <CommandIcon size={10} className="text-muted-foreground" />
               <span className="text-[10px] font-medium text-muted-foreground">K</span>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )} 
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <Button 
            onClick={logout}
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
