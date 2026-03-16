'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  CheckSquare, 
  StickyNote, 
  Timer, 
  Bookmark,
  Calendar,
  Command as CommandIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { icon: CheckSquare, label: 'Create Task', shortcut: 'T', action: () => console.log('Create Task') },
    { icon: StickyNote, label: 'New Note', shortcut: 'N', action: () => console.log('New Note') },
    { icon: Timer, label: 'Start Focus Timer', shortcut: 'F', action: () => console.log('Start Timer') },
    { icon: Bookmark, label: 'Add Bookmark', shortcut: 'B', action: () => console.log('Add Bookmark') },
    { icon: Calendar, label: 'Add Event', shortcut: 'E', action: () => console.log('Add Event') },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-background/80"
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-[4px] border border-border bg-card shadow-lg"
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground mr-3" />
          <Input
            autoFocus
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-base rounded-none h-auto p-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-[2px] border border-border">
             <CommandIcon size={10} className="text-muted-foreground" />
             <span className="text-[10px] font-bold text-muted-foreground">K</span>
          </div>
        </div>

        <div className="p-2">
           <div className="px-3 py-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Suggestions</span>
           </div>
           <div className="space-y-0.5">
              {actions.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[2px] hover:bg-muted transition-colors group text-left"
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary/60 border border-border px-1.5 py-0.5 rounded-[2px] uppercase">
                    {item.shortcut}
                  </span>
                </button>
              ))}
           </div>
        </div>

        <div className="border-t border-border p-2.5 bg-muted/30 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border bg-card text-[9px] font-bold text-muted-foreground uppercase">↑↓</kbd>
                 <span className="text-[10px] text-muted-foreground font-medium tracking-tight">Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border bg-card text-[9px] font-bold text-muted-foreground uppercase">Enter</kbd>
                 <span className="text-[10px] text-muted-foreground font-medium tracking-tight">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border bg-card text-[9px] font-bold text-muted-foreground uppercase">ESC</kbd>
              <span className="text-[10px] text-muted-foreground font-medium tracking-tight">Close</span>
           </div>
        </div>
      </div>
    </div>
  );
}
