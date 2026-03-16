'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Check, 
  LayoutGrid, 
  ListTodo, 
  Calendar, 
  Timer, 
  Cloud, 
  BookMarked, 
  BarChart3, 
  Quote, 
  Link2, 
  NotebookPen, 
  Target,
  Search,
  Trash2,
  Settings2,
  Info
} from 'lucide-react';
import useWidgetStore from '@/store/useWidgetStore';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AVAILABLE_WIDGETS = [
  { id: 'tasks', name: 'Tasks', icon: ListTodo, description: 'Manage your daily tasks and to-dos.', category: 'Productivity' },
  { id: 'habits', name: 'Habits', icon: Target, description: 'Track your daily habits and streaks.', category: 'Health' },
  { id: 'notes', name: 'Notes', icon: NotebookPen, description: 'Quickly jot down your thoughts.', category: 'Productivity' },
  { id: 'focus', name: 'Focus Timer', icon: Timer, description: 'Stay productive with a pomodoro timer.', category: 'Productivity' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'View your upcoming events.', category: 'Organization' },
  { id: 'weather', name: 'Weather', icon: Cloud, description: 'Check the current weather conditions.', category: 'Utility' },
  { id: 'bookmarks', name: 'Bookmarks', icon: BookMarked, description: 'Save your favorite web links.', category: 'Organization' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Track your productivity stats.', category: 'Productivity' },
  { id: 'quote', name: 'Daily Quote', icon: Quote, description: 'Get a dose of daily inspiration.', category: 'Utility' },
  { id: 'quicklinks', name: 'Quick Links', icon: Link2, description: 'Access your most used links.', category: 'Organization' },
];

const CATEGORIES = ['All', 'Productivity', 'Organization', 'Health', 'Utility'];

export default function WidgetSelector() {
  const { isWidgetSelectorOpen, setWidgetSelectorOpen } = useUIStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { widgets, addWidget, removeWidget } = useWidgetStore();

  useEffect(() => {
    if (isWidgetSelectorOpen) {
      queueMicrotask(() => setSearch(''));
      queueMicrotask(() => setActiveCategory('All'));
    }
  }, [isWidgetSelectorOpen]);

  const handleAddWidget = async (type) => {
    try {
      await addWidget(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} widget deployed`);
    } catch (error) {
      toast.error('Failed to deploy widget');
    }
  };

  const handleRemoveWidget = async (type) => {
    const widget = widgets.find(w => w.widgetType === type);
    if (widget) {
      try {
        await removeWidget(widget._id);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} widget terminated`);
      } catch (error) {
        toast.error('Failed to terminate widget');
      }
    }
  };

  const isWidgetActive = (type) => {
    return widgets.some(w => w.widgetType === type);
  };

  const filteredWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter(widget => {
      const matchesSearch = widget.name.toLowerCase().includes(search.toLowerCase()) || 
                           widget.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || widget.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <Dialog open={isWidgetSelectorOpen} onOpenChange={setWidgetSelectorOpen}>
      <DialogContent className="max-w-full sm:max-w-3xl lg:max-w-5xl bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
        <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-muted/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                <LayoutGrid size={24} />
             </div>
             <div>
                <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-foreground/90 leading-tight">Widget Selector</DialogTitle>
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                   Add widgets to your dashboard
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2 pr-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest mb-0.5">Active Widgets</span>
                <span className="text-xs font-black text-primary uppercase tracking-widest">{widgets.length} / {AVAILABLE_WIDGETS.length}</span>
             </div>
          </div>
        </DialogHeader>
        
        <div className="p-0 flex flex-col lg:flex-row min-h-[500px]">
           {/* Sidebar Filter */}
           <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/5 p-6 space-y-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Widget Search</label>
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={14} />
                    <Input 
                       placeholder="Find Widget..." 
                       className="pl-9 bg-muted/10 border-border/50 rounded-[4px] h-10 text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/10 focus:bg-muted/20 transition-all"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Widget Categories</label>
                 <div className="space-y-1">
                    {CATEGORIES.map(cat => (
                       <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                             "w-full flex items-center justify-between px-4 py-2.5 rounded-[4px] transition-all duration-200 group text-left border border-transparent",
                             activeCategory === cat 
                                ? "bg-primary/10 border-primary/20 text-primary font-black shadow-lg shadow-primary/5" 
                                : "text-muted-foreground/40 hover:bg-muted/30 hover:text-foreground"
                          )}
                       >
                          <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
                          {activeCategory === cat && <div className="h-1 w-1 rounded-full bg-primary" />}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="pt-10 space-y-4 opacity-40 group hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-3">
                    <Info size={14} className="text-primary/60" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Registry Policy</span>
                 </div>
                 <p className="text-[8px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                    Deploying a module will integrate it into your primary dashboard grid for real-time monitoring.
                 </p>
              </div>
           </aside>

           {/* Grid Area */}
           <div className="flex-1 p-6 sm:p-8 bg-card/50">
              <ScrollArea className="h-[60vh] lg:h-[450px] pr-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredWidgets.length > 0 ? (
                       filteredWidgets.map((widget) => {
                          const active = isWidgetActive(widget.id);
                          return (
                             <div 
                                key={widget.id}
                                className={cn(
                                   "flex flex-col p-5 rounded-[4px] border transition-all duration-500 group relative",
                                   active 
                                      ? "border-primary/30 bg-primary/[0.03] shadow-lg shadow-primary/5" 
                                      : "border-border/50 bg-muted/10 hover:border-primary/20 hover:bg-muted/20"
                                )}
                             >
                                <div className="flex items-center gap-4 mb-4">
                                   <div className={cn(
                                      "p-3 rounded-[4px] shrink-0 transition-all duration-500",
                                      active ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30" : "bg-muted/20 text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/5"
                                   )}>
                                      <widget.icon size={20} />
                                   </div>
                                   <div className="min-w-0">
                                      <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground/90 truncate">{widget.name}</h3>
                                      <span className="text-[7px] font-black text-primary/40 uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-[2px] border border-primary/10">
                                         {widget.category}
                                      </span>
                                   </div>
                                </div>
                                
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-6 leading-relaxed line-clamp-2">
                                   {widget.description}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-auto">
                                   <Button 
                                      variant={active ? "outline" : "default"}
                                      size="sm"
                                      className={cn(
                                         "flex-1 h-10 text-[9px] font-black uppercase tracking-[0.2em] rounded-[4px] gap-2 transition-all duration-500 shadow-sm",
                                         active 
                                            ? "border-primary/20 text-primary/40 bg-transparent hover:bg-primary/5 cursor-default opacity-50" 
                                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]"
                                      )}
                                      onClick={() => !active && handleAddWidget(widget.id)}
                                      disabled={active}
                                   >
                                      {active ? (
                                         <>
                                            <Check size={12} className="text-primary/40" />
                                            <span>Active Protocol</span>
                                         </>
                                      ) : (
                                         <>
                                            <Plus size={14} />
                                            <span>Deploy Module</span>
                                         </>
                                      )}
                                   </Button>
                                   {active && (
                                      <Button
                                         variant="ghost"
                                         size="icon"
                                         className="h-10 w-10 rounded-[4px] border border-border/50 text-muted-foreground/20 hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-300"
                                         onClick={() => handleRemoveWidget(widget.id)}
                                      >
                                         <Trash2 size={16} />
                                      </Button>
                                   )}
                                </div>
                             </div>
                          );
                       })
                    ) : (
                       <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-10">
                          <Settings2 size={40} className="mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching modules in registry</p>
                       </div>
                    )}
                 </div>
              </ScrollArea>
           </div>
        </div>

        <DialogFooter className="p-6 bg-muted/5 border-t border-border/30 flex items-center justify-between">
           <div className="flex items-center gap-2 opacity-30">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Registry Terminal Active</span>
           </div>
           <Button 
              variant="ghost" 
              onClick={() => setWidgetSelectorOpen(false)}
              className="h-10 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all border border-transparent hover:border-border/50 px-8"
           >
              Close Terminal
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
