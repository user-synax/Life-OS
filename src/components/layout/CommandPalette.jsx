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
        className="absolute inset-0 bg-background/40 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-[4px] border border-border/50 bg-card shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center border-b border-border/50 px-6 py-4 bg-muted/5">
          <Search size={16} className="text-muted-foreground/30 mr-4" />
          <input
            autoFocus
            placeholder="Search commands..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-[0.2em] h-auto p-0 placeholder:text-muted-foreground/20 text-foreground/80 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-1 rounded-[2px] border border-border/50">
             <CommandIcon size={10} className="text-muted-foreground/40" />
             <span className="text-[9px] font-black text-muted-foreground/40">K</span>
          </div>
        </div>

        <div className="p-3">
           <div className="px-3 py-2 mb-1">
              <span className="text-[8px] uppercase font-black tracking-[0.3em] text-muted-foreground/20">Quick Actions</span>
           </div>
           <div className="space-y-0.5">
              {actions.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-[4px] hover:bg-primary/5 transition-all duration-200 group text-left border border-transparent hover:border-primary/10"
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-1.5 rounded-[4px] bg-muted/10 group-hover:bg-primary/10 transition-colors">
                      <item.icon size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                  </div>
                  <span className="text-[8px] font-black text-muted-foreground/20 group-hover:text-primary/40 border border-border/30 group-hover:border-primary/20 px-2 py-0.5 rounded-[2px] uppercase tracking-widest">
                    {item.shortcut}
                  </span>
                </button>
              ))}
           </div>
        </div>

        <div className="border-t border-border/30 p-3 bg-muted/5 flex items-center justify-between">
           <div className="flex items-center gap-6 pl-2">
              <div className="flex items-center gap-2">
                 <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border/50 bg-card text-[8px] font-black text-muted-foreground/30 uppercase">↑↓</kbd>
                 <span className="text-[8px] text-muted-foreground/30 font-black uppercase tracking-widest">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                 <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border/50 bg-card text-[8px] font-black text-muted-foreground/30 uppercase">Enter</kbd>
                 <span className="text-[8px] text-muted-foreground/30 font-black uppercase tracking-widest">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-2 pr-2">
              <kbd className="px-1.5 py-0.5 rounded-[2px] border border-border/50 bg-card text-[8px] font-black text-muted-foreground/30 uppercase">ESC</kbd>
              <span className="text-[8px] text-muted-foreground/30 font-black uppercase tracking-widest">Close</span>
           </div>
        </div>
      </div>
    </div>
  );
}
