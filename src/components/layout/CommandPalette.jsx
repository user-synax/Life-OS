'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckSquare, 
  StickyNote, 
  Timer, 
  Bookmark,
  Calendar,
  Command as CommandIcon,
  Activity,
  ArrowRight,
  Hash,
  Globe,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useNoteStore from '@/store/useNoteStore';
import useTaskStore from '@/store/useTaskStore';
import useHabitStore from '@/store/useHabitStore';
import useBookmarkStore from '@/store/useBookmarkStore';
import useEventStore from '@/store/useEventStore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const { notes, fetchNotes } = useNoteStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { habits, fetchHabits } = useHabitStore();
  const { bookmarks, fetchBookmarks } = useBookmarkStore();
  const { events, fetchEvents } = useEventStore();

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
      fetchNotes();
      fetchTasks();
      fetchHabits();
      fetchBookmarks();
      fetchEvents();
      // defer state reset to next tick to avoid cascading renders
      queueMicrotask(() => setSearch(''));
      queueMicrotask(() => setSelectedIndex(0));
    }
  }, [open, fetchNotes, fetchTasks, fetchHabits, fetchBookmarks, fetchEvents]);

  const quickActions = [
    { id: 'new-task', icon: Plus, label: 'Create New Task', shortcut: 'T', action: () => router.push('/dashboard/tasks') },
    { id: 'new-note', icon: Plus, label: 'Capture New Note', shortcut: 'N', action: () => router.push('/dashboard/notes') },
    { id: 'new-event', icon: Plus, label: 'Schedule New Event', shortcut: 'E', action: () => router.push('/dashboard/calendar') },
    { id: 'go-dashboard', icon: ArrowRight, label: 'Go to Dashboard', shortcut: 'D', action: () => router.push('/dashboard') },
  ];

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];

    const query = search.toLowerCase();
    const results = [];

    // Search Notes
    notes.filter(n => n.title.toLowerCase().includes(query) || n.content?.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(n => results.push({ id: `note-${n._id}`, type: 'Note', title: n.title, icon: StickyNote, action: () => router.push('/dashboard/notes') }));

    // Search Tasks
    tasks.filter(t => t.title.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(t => results.push({ id: `task-${t._id}`, type: 'Task', title: t.title, icon: CheckSquare, action: () => router.push('/dashboard/tasks') }));

    // Search Habits
    habits.filter(h => h.name.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(h => results.push({ id: `habit-${h._id}`, type: 'Habit', title: h.name, icon: Activity, action: () => router.push('/dashboard/habits') }));

    // Search Bookmarks
    bookmarks.filter(b => b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(b => results.push({ id: `bookmark-${b._id}`, type: 'Bookmark', title: b.title, icon: Globe, action: () => window.open(b.url, '_blank') }));

    // Search Events
    events.filter(e => e.title.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach(e => results.push({ id: `event-${e._id}`, type: 'Event', title: e.title, icon: Calendar, action: () => router.push('/dashboard/calendar') }));

    return results;
  }, [search, notes, tasks, habits, bookmarks, events, router]);

  const allItems = useMemo(() => {
    return search.trim() ? searchResults : quickActions;
  }, [search, searchResults, quickActions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onKeyDown={handleKeyDown}>
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl transition-all duration-500"
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-[8px] border border-border/50 bg-card/80 shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/10"
      >
        <div className="flex items-center border-b border-border/50 px-6 py-5 bg-muted/5">
          <Search size={18} className="text-primary/40 mr-4" />
          <input
            autoFocus
            placeholder="Type a command or search archives..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] font-black uppercase tracking-[0.2em] h-auto p-0 placeholder:text-muted-foreground/20 text-foreground/90 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-[4px] border border-primary/20">
             <CommandIcon size={10} className="text-primary/60" />
             <span className="text-[10px] font-black text-primary/60">K</span>
          </div>
        </div>

        <ScrollArea className="max-h-[450px]">
          <div className="p-3 space-y-4">
            {search.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <span className="text-[9px] uppercase font-black tracking-[0.3em] text-primary/40">Search Results</span>
                  </div>
                  {searchResults.map((item, idx) => (
                    <button
                      key={item.id}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-[6px] transition-all duration-200 group text-left border border-transparent",
                        selectedIndex === idx ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5" : "hover:bg-muted/30"
                      )}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-[4px] transition-colors",
                          selectedIndex === idx ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground/40"
                        )}>
                          <item.icon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[11px] font-black uppercase tracking-widest transition-colors",
                            selectedIndex === idx ? "text-foreground" : "text-muted-foreground/80"
                          )}>
                            {item.title}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-0.5">
                            {item.type}
                          </span>
                        </div>
                      </div>
                      {selectedIndex === idx && (
                        <ArrowRight size={14} className="text-primary animate-in slide-in-from-left-2 duration-300" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-20">
                  <Hash size={40} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matches found in registry</p>
                </div>
              )
            ) : (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <span className="text-[9px] uppercase font-black tracking-[0.3em] text-muted-foreground/30">System Commands</span>
                </div>
                {quickActions.map((item, idx) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-[6px] transition-all duration-200 group text-left border border-transparent",
                      selectedIndex === idx ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5" : "hover:bg-muted/30"
                    )}
                    onClick={() => {
                      item.action();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-[4px] transition-colors",
                        selectedIndex === idx ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground/40"
                      )}>
                        <item.icon size={16} />
                      </div>
                      <span className={cn(
                        "text-[11px] font-black uppercase tracking-widest transition-colors",
                        selectedIndex === idx ? "text-foreground" : "text-muted-foreground/80"
                      )}>{item.label}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black border px-2 py-1 rounded-[4px] uppercase tracking-widest transition-all",
                      selectedIndex === idx ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground/20 border-border/30"
                    )}>
                      {item.shortcut}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border/30 p-4 bg-muted/5 flex items-center justify-between">
           <div className="flex items-center gap-8 pl-2">
              <div className="flex items-center gap-2.5">
                 <kbd className="px-2 py-1 rounded-[4px] border border-border/50 bg-card/50 text-[9px] font-black text-muted-foreground/40 uppercase shadow-sm">↑↓</kbd>
                 <span className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Navigation</span>
              </div>
              <div className="flex items-center gap-2.5">
                 <kbd className="px-2 py-1 rounded-[4px] border border-border/50 bg-card/50 text-[9px] font-black text-muted-foreground/40 uppercase shadow-sm">Enter</kbd>
                 <span className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Execute</span>
              </div>
           </div>
           <div className="flex items-center gap-2.5 pr-2">
              <kbd className="px-2 py-1 rounded-[4px] border border-border/50 bg-card/50 text-[9px] font-black text-muted-foreground/40 uppercase shadow-sm">ESC</kbd>
              <span className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Abort</span>
           </div>
        </div>
      </div>
    </div>
  );
}
