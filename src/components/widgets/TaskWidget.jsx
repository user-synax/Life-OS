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

      <ScrollArea className="flex-1 -mr-2 pr-2">
        {loading && tasks.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted/20 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/20 italic text-[10px] uppercase font-bold tracking-widest">
             <Plus size={16} className="opacity-10" />
             No tasks.
          </div>
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-[4px] hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50",
                  task.completed && "opacity-40"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => toggleTask(task._id)}
                    className={cn(
                      "shrink-0 transition-all duration-200",
                      task.completed ? "text-primary" : "text-muted-foreground/30 hover:text-primary/50"
                    )}
                  >
                    {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-[11px] font-bold truncate tracking-tight text-foreground/90",
                      task.completed && "line-through"
                    )}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-[8px] text-muted-foreground/60 flex items-center gap-1 mt-0.5 font-medium uppercase tracking-tighter">
                        <Clock size={8} />
                        {format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[7px] uppercase font-black px-1.5 py-0 rounded-[2px] shrink-0 ml-2 border-transparent", getPriorityColor(task.priority))}>
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
