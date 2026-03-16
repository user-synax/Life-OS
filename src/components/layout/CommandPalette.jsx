'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  CheckSquare, 
  StickyNote, 
  Timer, 
  Bookmark,
  Calendar,
  Command as CommandIcon,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const paletteRef = useRef(null);
  const overlayRef = useRef(null);

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

  useEffect(() => {
    if (open) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(paletteRef.current, { scale: 0.95, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [open]);

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
        ref={overlayRef}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      <div 
        ref={paletteRef}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground mr-3" />
          <Input
            autoFocus
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-sidebar px-1.5 py-0.5 rounded border border-border">
             <CommandIcon size={10} className="text-muted-foreground" />
             <span className="text-[10px] font-bold text-muted-foreground">K</span>
          </div>
        </div>

        <div className="p-2">
           <div className="px-3 py-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Suggestions</span>
           </div>
           <div className="space-y-1">
              {actions.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group text-left"
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/30 group-hover:text-primary/50 border border-border/50 group-hover:border-primary/20 px-1.5 py-0.5 rounded uppercase">
                    {item.shortcut}
                  </span>
                </button>
              ))}
           </div>
        </div>

        <div className="border-t border-border p-3 bg-sidebar/50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">↑↓</kbd>
                 <span className="text-[10px] text-muted-foreground">Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">Enter</kbd>
                 <span className="text-[10px] text-muted-foreground">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">ESC</kbd>
              <span className="text-[10px] text-muted-foreground">Close</span>
           </div>
        </div>
      </div>
    </div>
  );
}
