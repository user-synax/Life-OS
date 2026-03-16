'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, List, MoreVertical, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTaskStore from '@/store/useTaskStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const { tasks, loading, fetchTasks, addTask, toggleTask, removeTask } = useTaskStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle, priority: 'medium' });
    setNewTaskTitle('');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'completed' ? task.completed : 
      !task.completed;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and organize your daily goals.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-[4px] border border-border">
          <Button 
            variant={filter === 'all' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 rounded-[4px] text-[10px] font-bold uppercase tracking-wider px-3"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 rounded-[4px] text-[10px] font-bold uppercase tracking-wider px-3"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'completed' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 rounded-[4px] text-[10px] font-bold uppercase tracking-wider px-3"
            onClick={() => setFilter('completed')}
          >
            Done
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border rounded-[4px] overflow-hidden">
        <CardHeader className="p-4 border-b border-border bg-muted/20">
           <form onSubmit={handleAddTask} className="flex items-center gap-3">
              <div className="relative flex-1">
                 <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                 <Input 
                    placeholder="Add a new task..." 
                    className="pl-10 h-10 bg-transparent border-none focus:ring-0 text-base placeholder:text-muted-foreground/50"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                 />
              </div>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-4 font-bold uppercase tracking-wider h-8 text-[10px]">
                 Add
              </Button>
           </form>
        </CardHeader>
        <CardContent className="p-0">
           <div className="p-3 border-b border-border bg-muted/10">
              <div className="relative w-full max-w-xs">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <Input 
                    placeholder="Search tasks..." 
                    className="pl-9 h-8 bg-background border-border rounded-[4px] text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
           </div>
           
           <ScrollArea className="h-[500px]">
              <div className="divide-y divide-border">
                 {loading && tasks.length === 0 ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                         <div className="h-5 w-5 rounded-full bg-muted" />
                         <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-muted rounded" />
                         </div>
                      </div>
                    ))
                 ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/30">
                       <List size={40} className="mb-2 opacity-10" />
                       <p className="text-sm font-medium">No tasks found.</p>
                    </div>
                 ) : (
                    filteredTasks.map((task) => (
                      <div 
                        key={task._id} 
                        className={cn(
                          "group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors",
                          task.completed && "opacity-60"
                        )}
                      >
                         <div className="flex items-center gap-4 flex-1">
                            <button 
                              onClick={() => toggleTask(task._id)}
                              className="text-primary transition-transform"
                            >
                               {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>
                            <div className="flex flex-col gap-1">
                               <span className={cn(
                                  "text-sm font-bold tracking-tight",
                                  task.completed && "line-through text-muted-foreground"
                               )}>
                                  {task.title}
                               </span>
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={cn("text-[9px] uppercase font-bold tracking-wider px-1.5 py-0 rounded-[2px]", getPriorityColor(task.priority))}>
                                     {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                     <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                        <Clock size={10} />
                                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                     </span>
                                  )}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-[4px]">
                                     <MoreVertical size={16} />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="bg-card border-border p-1 min-w-32 rounded-[4px] shadow-sm">
                                  <DropdownMenuItem className="rounded-[4px] text-xs font-medium p-2">Edit</DropdownMenuItem>
                                  <DropdownMenuItem 
                                     className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[4px] text-xs font-medium p-2"
                                     onClick={() => removeTask(task._id)}
                                  >
                                     <Trash2 size={14} className="mr-2" />
                                     Delete
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
