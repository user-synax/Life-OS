'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useTaskStore from '@/store/useTaskStore';
import { format } from 'date-fns';

export default function TaskWidget() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { tasks, loading, fetchTasks, addTask, toggleTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle });
    setNewTaskTitle('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-500/20';
      case 'medium': return 'text-yellow-500 border-yellow-500/20';
      case 'low': return 'text-blue-500 border-blue-500/20';
      default: return 'text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={12} />
          <Input
            placeholder="Add task..."
            className="bg-muted/30 border-none h-9 text-[11px] pl-8 rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
        </div>
      </form>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        {loading && tasks.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 bg-muted/10 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/10 py-10">
             <div className="p-4 rounded-full bg-muted/5 border border-dashed border-border/50">
                <Plus size={24} className="opacity-20" />
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.3em]">Registry Empty</p>
          </div>
        ) : (
          <div className="space-y-1.5 pb-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-[4px] bg-[#171717]/50 hover:bg-[#2e2e2e]/50 transition-all duration-300 border border-[#2e2e2e]/30 hover:border-[#3ecf8e]/30",
                  task.completed && "opacity-40 grayscale"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button 
                    onClick={() => toggleTask(task._id)}
                    className={cn(
                      "shrink-0 transition-all duration-300 transform active:scale-90",
                      task.completed ? "text-primary" : "text-muted-foreground/20 hover:text-primary/40"
                    )}
                  >
                    {task.completed ? <CheckCircle2 size={20} className="drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]" /> : <Circle size={20} />}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-[16px] font-medium truncate tracking-tight text-foreground/80 transition-all",
                      task.completed && "line-through opacity-50"
                    )}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-[8px] text-muted-foreground/40 flex items-center gap-1.5 mt-1 font-black uppercase tracking-widest">
                        <Clock size={10} className="opacity-50" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[2px] shrink-0 ml-3 border-transparent bg-[#0f0f0f]/50", getPriorityColor(task.priority))}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
