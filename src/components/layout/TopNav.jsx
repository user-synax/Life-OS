'use client';

import { useState } from 'react';
import { Bell, Search, Plus, User, Menu, CheckSquare, StickyNote, Calendar, Activity, Bookmark, Timer, LayoutGrid, Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuthStore from '@/store/useAuthStore';
import useNotificationStore from '@/store/useNotificationStore';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import useUIStore from '@/store/useUIStore';
import { useRouter } from 'next/navigation';

export default function TopNav({ onMenuClick }) {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const router = useRouter();
  const { setWidgetSelectorOpen, setCommandPaletteOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-muted-foreground/50 hover:bg-muted/50"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>

        <div className="relative w-full max-w-md group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={14} />
          <input
            type="search"
            placeholder="Search... (Cmd+K)"
            className="w-full pl-10 bg-muted/20 border-none focus:bg-muted/40 h-9 text-[11px] font-black uppercase tracking-widest rounded-[4px] transition-all placeholder:text-muted-foreground/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[4px] h-9 px-4 transition-all border border-transparent hover:border-primary/20 outline-none">
              <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Operation</span>
            </Button>
          } />
          <DropdownMenuContent className="w-56 bg-card border-border/50 rounded-[4px] shadow-2xl p-1 animate-in slide-in-from-top-2 duration-300" align="end">
            <DropdownMenuLabel className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Registry Actions</DropdownMenuLabel>
            <div className="p-1 space-y-0.5">
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/tasks')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <CheckSquare size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Initialize Task</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">T</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/notes')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <StickyNote size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Capture Note</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">N</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/calendar')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <Calendar size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Schedule Event</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">E</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/habits')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <Activity size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Deploy Habit</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">H</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/bookmarks')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <Bookmark size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Archive Link</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">B</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-border/50 my-1" />
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => setWidgetSelectorOpen(true)}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <LayoutGrid size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Manage Modules</span>
                     </div>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => setCommandPaletteOpen(true)}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <CommandIcon size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Registry Search</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">⌘ K</span>
                  </div>
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-border/50 my-1" />
               <DropdownMenuItem 
                  className="rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary group"
                  onSelect={() => router.push('/dashboard/focus')}
               >
                  <div className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-3">
                        <Timer size={14} className="opacity-40 group-focus:opacity-100 transition-opacity" />
                        <span>Focus Protocol</span>
                     </div>
                     <span className="text-[8px] opacity-20 group-focus:opacity-40 font-black">F</span>
                  </div>
               </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
               "h-9 w-9 rounded-[4px] text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all", 
               showNotifications && "text-primary bg-primary/10"
            )}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Button>
          <NotificationPanel open={showNotifications} setOpen={setShowNotifications} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-1 pl-3 rounded-[4px] hover:bg-muted/50 transition-all outline-none group cursor-pointer border border-transparent hover:border-border/50">
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block text-foreground/80">{user?.name || 'User'}</span>
            <Avatar className="h-8 w-8 rounded-[4px] border border-border/50">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                {user?.name?.charAt(0) || <User size={12} />}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border/50 rounded-[4px] shadow-xl p-1" align="end">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">{user?.name || 'User'}</p>
                <p className="text-[9px] font-bold tracking-tight leading-none text-muted-foreground/60">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="p-1 space-y-1">
               <DropdownMenuItem 
                  className="rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
                  onSelect={() => router.push('/dashboard/settings')}
               >
                  Profile Settings
               </DropdownMenuItem>
               <DropdownMenuItem 
                  className="rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onSelect={logout}
               >
                  Sign Out
               </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
