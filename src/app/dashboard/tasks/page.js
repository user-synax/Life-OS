'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, List, MoreVertical, Trash2, CheckCircle2, Circle, Clock, Edit3, AlertTriangle, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import useTaskStore from '@/store/useTaskStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TasksPage() {
  const { tasks, loading, fetchTasks, addTask, toggleTask, removeTask, updateTask } = useTaskStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Edit and Delete Modal State
  const [activeTask, setActiveTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await addTask({ title: newTaskTitle, priority: 'medium' });
      setNewTaskTitle('');
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleOpenEditModal = (task) => {
    setActiveTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    try {
      await updateTask(activeTask._id, {
        title: editTitle,
        priority: editPriority,
        dueDate: editDueDate || null
      });
      setIsEditModalOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleOpenDeleteModal = (task) => {
    setActiveTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeTask(activeTask._id);
      setIsDeleteModalOpen(false);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
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
                          "group flex items-center justify-between p-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer border-l-2 border-transparent",
                          task.completed && "opacity-60",
                          task.priority === 'high' && !task.completed && "border-l-red-500/50 bg-red-500/5",
                          task.priority === 'medium' && !task.completed && "border-l-yellow-500/50 bg-yellow-500/5",
                          task.priority === 'low' && !task.completed && "border-l-blue-500/50 bg-blue-500/5"
                        )}
                        onClick={() => handleOpenEditModal(task)}
                      >
                         <div className="flex items-center gap-4 flex-1 min-w-0">
                               <div 
                                 role="button"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTask(task._id);
                                 }}
                                 className="text-primary transition-transform cursor-pointer shrink-0 hover:scale-110 active:scale-95"
                               >
                                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-muted-foreground/30 hover:text-primary transition-colors" />}
                               </div>
                               <div className="flex flex-col gap-1 min-w-0">
                               <span className={cn(
                                  "text-sm font-black tracking-tight uppercase truncate",
                                  task.completed && "line-through text-muted-foreground/50"
                               )}>
                                  {task.title}
                               </span>
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={cn("text-[8px] uppercase font-black tracking-widest px-1.5 py-0 rounded-[2px] border-transparent shadow-none", getPriorityColor(task.priority))}>
                                     {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                     <span className="text-[9px] text-muted-foreground/50 flex items-center gap-1 font-black uppercase tracking-widest">
                                        <Clock size={10} className="opacity-30" />
                                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                     </span>
                                  )}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-[4px]"
                               onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(task);
                               }}
                            >
                               <Edit3 size={16} />
                            </Button>
                            <div onClick={(e) => e.stopPropagation()}>
                               <DropdownMenu>
                                  <DropdownMenuTrigger render={
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-foreground rounded-[4px]">
                                        <MoreVertical size={16} />
                                     </Button>
                                  } />
                                  <DropdownMenuContent align="end" className="bg-card border-border p-1 min-w-32 rounded-[4px] shadow-sm">
                                     <DropdownMenuItem 
                                        className="rounded-[4px] text-xs font-medium p-2 cursor-pointer"
                                        onSelect={() => handleOpenEditModal(task)}
                                     >
                                        <Edit3 size={14} className="mr-2" />
                                        Edit
                                     </DropdownMenuItem>
                                     <DropdownMenuItem 
                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[4px] text-xs font-medium p-2 cursor-pointer"
                                        onSelect={() => handleOpenDeleteModal(task)}
                                     >
                                        <Trash2 size={14} className="mr-2" />
                                        Delete
                                     </DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            </div>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl">
          <DialogHeader className="p-6 border-b border-border/50 bg-muted/5">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary">
                  <Edit3 size={20} />
               </div>
               <div>
                  <DialogTitle className="text-lg font-black uppercase tracking-[0.15em] text-foreground/90">Edit Task</DialogTitle>
                  <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest mt-1 flex items-center gap-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                     Updating Entry
                  </p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                 <Label htmlFor="edit-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Task Name</Label>
                 <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-[2px]">Required</span>
              </div>
              <div className="relative group">
                 <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={14} />
                 <Input
                   id="edit-title"
                   value={editTitle}
                   onChange={(e) => setEditTitle(e.target.value)}
                   className="bg-muted/10 border-border/50 focus:bg-muted/20 h-11 text-xs font-bold pl-10 rounded-[4px] transition-all placeholder:text-muted-foreground/20"
                   placeholder="Enter task name..."
                 />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
                   <Flag size={10} />
                   Priority
                </Label>
                <div className="flex gap-1 p-1 bg-muted/10 rounded-[4px] border border-border/50">
                  {['low', 'medium', 'high'].map((p) => (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 h-8 rounded-[2px] text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                        editPriority === p 
                          ? p === 'high' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" :
                            p === 'medium' ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" :
                            "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "text-muted-foreground/40 hover:text-foreground hover:bg-muted/20"
                      )}
                      onClick={() => setEditPriority(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="edit-due-date" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
                   <CalendarIcon size={10} />
                   Due Date
                </Label>
                <div className="relative group">
                   <Input
                     id="edit-due-date"
                     type="date"
                     value={editDueDate}
                     onChange={(e) => setEditDueDate(e.target.value)}
                     className="bg-muted/10 border-border/50 focus:bg-muted/20 h-10 text-[10px] font-bold rounded-[4px] transition-all"
                   />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/5 border-t border-border/30 flex-row gap-3">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsEditModalOpen(false)} 
               className="flex-1 h-10 rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-all"
            >
              Cancel
            </Button>
            <Button 
               size="sm" 
               onClick={handleSaveEdit} 
               className="flex-[2] h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl">
          <DialogHeader className="p-6 border-b border-border/50 bg-destructive/5">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-[4px] bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertTriangle size={20} />
               </div>
               <div>
                  <DialogTitle className="text-lg font-black uppercase tracking-[0.15em] text-destructive/90">Delete Task?</DialogTitle>
                  <p className="text-[10px] font-black text-destructive/30 uppercase tracking-widest mt-1">Irreversible Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed">
              Are you sure you want to delete <span className="font-black text-foreground uppercase tracking-tight">&ldquo;{activeTask?.title}&rdquo;</span>? This will permanently remove all associated data.
            </p>
          </div>

          <DialogFooter className="p-6 bg-muted/5 border-t border-border/30 flex-row gap-3">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsDeleteModalOpen(false)} 
               className="flex-1 h-10 rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-all"
            >
              No, keep it
            </Button>
            <Button 
               variant="destructive"
               size="sm" 
               onClick={handleConfirmDelete} 
               className="flex-1 h-10 bg-destructive text-white hover:bg-destructive/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-destructive/20 transition-all"
            >
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
