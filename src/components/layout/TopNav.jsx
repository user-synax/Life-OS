'use client';

import { useState } from 'react';
import { Bell, Search, Plus, User, Menu } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

export default function TopNav({ onMenuClick }) {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>

        <div className="relative w-full max-w-md group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <Input
            type="search"
            placeholder="Search... (Cmd+K)"
            className="pl-10 bg-muted/50 border-border focus:bg-background h-9 text-sm rounded-[4px] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-border hover:bg-muted rounded-[4px] h-9 px-3">
          <Plus size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">New</span>
        </Button>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
               "h-9 w-9 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors", 
               showNotifications && "text-primary bg-primary/10"
            )}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            )}
          </Button>
          <NotificationPanel open={showNotifications} setOpen={setShowNotifications} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-[4px] hover:bg-muted transition-colors outline-none group cursor-pointer">
            <Avatar className="h-8 w-8 rounded-[4px] border border-border">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {user?.name?.charAt(0) || <User size={14} />}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold hidden sm:inline-block">{user?.name || 'User'}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border rounded-[4px] shadow-md" align="end">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-1">
               <DropdownMenuItem 
                  className="rounded-[4px] text-xs font-bold uppercase tracking-wider p-2 cursor-pointer"
                  onSelect={() => router.push('/dashboard/settings')}
               >
                  Settings
               </DropdownMenuItem>
               <DropdownMenuItem className="rounded-[4px] text-xs font-bold uppercase tracking-wider p-2 cursor-pointer">
                  Billing
               </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-1">
               <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[4px] text-xs font-bold uppercase tracking-wider p-2 cursor-pointer" 
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
