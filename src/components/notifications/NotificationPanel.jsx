'use client';

import { useEffect } from 'react';
import { Bell, X, Check, Trash2, Calendar, CheckSquare, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useNotificationStore from '@/store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPanel({ open, setOpen }) {
  const { notifications, unreadCount, fetchNotifications, markAsRead, clearAll } = useNotificationStore();

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'task': return <CheckSquare className="text-primary" size={16} />;
      case 'event': return <Calendar className="text-blue-500" size={16} />;
      case 'habit': return <Zap className="text-yellow-500" size={16} />;
      default: return <AlertCircle className="text-muted-foreground" size={16} />;
    }
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-widest">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={clearAll}>
              <Trash2 size={14} />
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              <X size={14} />
           </Button>
        </div>
      </div>

      <ScrollArea className="h-80">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
             <Bell size={32} className="text-muted-foreground/20 mb-2" />
             <p className="text-xs text-muted-foreground italic">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors hover:bg-sidebar/50",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                <div className="mt-1 p-2 rounded-lg bg-sidebar border border-border/50">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("text-xs font-medium", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-muted-foreground/50">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                     </span>
                     {!notification.isRead && (
                       <button 
                         onClick={() => markAsRead(notification._id)}
                         className="text-[10px] font-bold text-primary hover:underline"
                       >
                         Mark read
                       </button>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="border-t border-border p-2">
         <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary">
            View All Notifications
         </Button>
      </div>
    </div>
  );
}
