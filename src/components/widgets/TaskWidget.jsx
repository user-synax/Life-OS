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
      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Quick add..."
          className="bg-muted/30 border-border h-8 text-xs rounded-[4px] focus:ring-1 focus:ring-primary"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-8 w-8 bg-primary text-primary-foreground rounded-[4px]">
          <Plus size={14} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-2">
        {loading && tasks.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted/50 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground/40 italic text-xs">
             No tasks.
          </div>
        ) : (
          <div className="space-y-1.5">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-[4px] border border-border bg-muted/10 transition-colors",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button 
                    onClick={() => toggleTask(task._id)}
                    className="text-primary shrink-0"
                  >
                    {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-xs font-bold truncate tracking-tight",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock size={8} />
                        {format(new Date(task.dueDate), 'MMM d, p')}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[8px] uppercase font-bold px-1 py-0 rounded-[2px] shrink-0 ml-2", getPriorityColor(task.priority))}>
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
