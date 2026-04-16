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
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: StickyNote, label: 'Notes', href: '/dashboard/notes' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: Activity, label: 'Habits', href: '/dashboard/habits' },
  { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/bookmarks' },
  { icon: Timer, label: 'Focus Timer', href: '/dashboard/focus' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#171717]/40 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#2e2e2e] bg-[#171717] text-[#fafafa] transition-all duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#2e2e2e]">
          <div className="flex items-center gap-3 font-medium text-[#333]">
            <div className="h-8 w-8 rounded-lg bg-[#3ecf8e] flex items-center justify-center">
               <div className="h-3 w-3 rounded-full border-2 border-[#0a0a0a]/30" />
            </div>
            <span className="text-[0.88rem] font-medium tracking-tight uppercase">Life OS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-[#898989]"
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
            className="w-full flex items-center justify-between px-4 py-2 rounded-[9999px] bg-[#0f0f0f] border border-[#2e2e2e] hover:bg-[#2e2e2e] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Search size={16} className="text-[#898989] group-hover:text-[#3ecf8e] transition-colors" />
              <span className="text-xs font-medium text-[#898989] group-hover:text-[#fafafa] transition-colors">Search...</span>
            </div>
            <div className="flex items-center gap-1 bg-[#171717] px-1.5 py-0.5 rounded border border-[#2e2e2e]">
               <CommandIcon size={10} className="text-[#898989]" />
               <span className="text-[10px] font-medium text-[#898989]">K</span>
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
                  "group flex items-center gap-3 px-3 py-2 rounded-[9999px] text-[0.88rem] font-medium transition-colors",
                  isActive 
                    ? "bg-[#3ecf8e]/10 text-[#3ecf8e]" 
                    : "text-[#898989] hover:text-[#fafafa] hover:bg-[#0f0f0f]"
                )}
              >
                <Icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#3ecf8e]" : "text-[#898989] group-hover:text-[#3ecf8e]"
                  )} 
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-[#2e2e2e] space-y-2">
          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className={cn(
              "group flex items-center gap-3 px-3 py-2 rounded-[9999px] text-[0.88rem] font-medium transition-colors",
              pathname === '/dashboard/profile'
                ? "bg-[#3ecf8e]/10 text-[#3ecf8e]"
                : "text-[#898989] hover:text-[#fafafa] hover:bg-[#0f0f0f]"
            )}
          >
            <User 
              size={18} 
              className={cn(
                "transition-colors",
                pathname === '/dashboard/profile' ? "text-[#3ecf8e]" : "text-[#898989] group-hover:text-[#3ecf8e]"
              )} 
            />
            <span>Profile</span>
          </Link>
          <Button 
            onClick={logout}
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 py-2 text-[#898989] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
