'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Check, LayoutGrid, ListTodo, Calendar, Timer, Cloud, BookMarked, BarChart3, Quote, Link2, NotebookPen, Target } from 'lucide-react';
import useWidgetStore from '@/store/useWidgetStore';
import { cn } from '@/lib/utils';

const AVAILABLE_WIDGETS = [
  { id: 'tasks', name: 'Tasks', icon: ListTodo, description: 'Manage your daily tasks and to-dos.' },
  { id: 'habits', name: 'Habits', icon: Target, description: 'Track your daily habits and streaks.' },
  { id: 'notes', name: 'Notes', icon: NotebookPen, description: 'Quickly jot down your thoughts.' },
  { id: 'focus', name: 'Focus Timer', icon: Timer, description: 'Stay productive with a pomodoro timer.' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'View your upcoming events.' },
  { id: 'weather', name: 'Weather', icon: Cloud, description: 'Check the current weather conditions.' },
  { id: 'bookmarks', name: 'Bookmarks', icon: BookMarked, description: 'Save your favorite web links.' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Track your productivity stats.' },
  { id: 'quote', name: 'Daily Quote', icon: Quote, description: 'Get a dose of daily inspiration.' },
  { id: 'quicklinks', name: 'Quick Links', icon: Link2, description: 'Access your most used links.' },
];

export default function WidgetSelector({ children }) {
  const [open, setOpen] = useState(false);
  const { widgets, addWidget } = useWidgetStore();

  const handleAddWidget = async (type) => {
    await addWidget(type);
    setOpen(false);
  };

  const isWidgetActive = (type) => {
    return widgets.some(w => w.widgetType === type);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-2xl bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl">
        <DialogHeader className="p-8 border-b border-border/50 bg-muted/5">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <LayoutGrid size={24} />
             </div>
             <div>
                <DialogTitle className="text-xl font-black uppercase tracking-[0.2em] text-foreground/90">Manage Widgets</DialogTitle>
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                   System Customization
                </p>
             </div>
          </div>
        </DialogHeader>
        
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
            {AVAILABLE_WIDGETS.map((widget) => {
              const active = isWidgetActive(widget.id);
              return (
                <div 
                  key={widget.id}
                  className={cn(
                    "flex flex-col p-5 rounded-[4px] border transition-all duration-300 group relative",
                    active 
                      ? "border-primary/30 bg-primary/5 shadow-sm" 
                      : "border-border/50 bg-muted/10 hover:border-primary/20 hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "p-2.5 rounded-[4px] shrink-0 transition-all duration-300",
                      active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                    )}>
                      <widget.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/90">{widget.name}</h3>
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tight mt-0.5 line-clamp-1 italic">{widget.description}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant={active ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "mt-auto h-9 text-[9px] font-black uppercase tracking-[0.2em] rounded-[4px] gap-2 transition-all duration-300",
                      active 
                        ? "border-primary/20 text-primary hover:bg-primary/5 cursor-default" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                    )}
                    onClick={() => !active && handleAddWidget(widget.id)}
                    disabled={active}
                  >
                    {active ? (
                      <>
                        <Check size={12} className="text-primary" />
                        <span className="text-primary">Active</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        Add Widget
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
