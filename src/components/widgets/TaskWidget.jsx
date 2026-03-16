'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useTaskStore from '@/store/useTaskStore';
import { format } from 'date-fns';

export default function TaskWidget() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { tasks, loading, fetchTasks, addTask, toggleTask, removeTask } = useTaskStore();

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
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4 px-1">
        <Input
          placeholder="Add a new task..."
          className="bg-sidebar/50 border-border h-9 text-sm focus:ring-primary"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-9 w-9 bg-primary text-primary-foreground">
          <Plus size={16} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-3">
        {loading && tasks.length === 0 ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-sidebar/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 italic text-sm">
             No tasks for today.
          </div>
        ) : (
          <div className="space-y-2 py-1">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-sidebar/30 group hover:border-primary/30 transition-all duration-300",
                  task.completed && "opacity-60 grayscale-[0.5]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => toggleTask(task._id)}
                    className="cursor-pointer text-primary hover:scale-110 transition-transform"
                  >
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-sm font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {format(new Date(task.dueDate), 'MMM d, p')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 py-0", getPriorityColor(task.priority))}>
                      {task.priority}
                   </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
