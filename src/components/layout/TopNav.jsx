'use client';

import { useState } from 'react';
import { Bell, Search, Plus, User } from 'lucide-react';
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

export default function TopNav() {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background px-6">
      <div className="flex w-1/3 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="search"
            placeholder="Search notes, tasks, bookmarks..."
            className="pl-10 bg-sidebar border-border focus:ring-primary h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden gap-2 md:flex border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300">
          <Plus size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Add Widget</span>
        </Button>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("relative text-muted-foreground hover:text-foreground transition-all duration-300", showNotifications && "text-primary")}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
            )}
          </Button>
          <NotificationPanel open={showNotifications} setOpen={setShowNotifications} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-transparent hover:bg-muted transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {user?.name?.charAt(0) || <User size={14} />}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="focus:bg-primary focus:text-primary-foreground">Profile</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-primary focus:text-primary-foreground">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
