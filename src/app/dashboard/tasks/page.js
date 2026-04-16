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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">Tasks</h1>
          <p className="text-[#898989] mt-1 text-[0.88rem] font-normal leading-[1.56] opacity-60">Manage and organize your daily goals.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/10 p-1 rounded-[4px] border border-border/50">
          <Button 
            variant={filter === 'all' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={cn(
               "h-8 rounded-[2px] text-[9px] font-black uppercase tracking-widest px-3",
               filter === 'all' ? "bg-primary/10 text-primary shadow-none" : "text-muted-foreground/40"
            )}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={cn(
               "h-8 rounded-[2px] text-[9px] font-black uppercase tracking-widest px-3",
               filter === 'pending' ? "bg-primary/10 text-primary shadow-none" : "text-muted-foreground/40"
            )}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'completed' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={cn(
               "h-8 rounded-[2px] text-[9px] font-black uppercase tracking-widest px-3",
               filter === 'completed' ? "bg-primary/10 text-primary shadow-none" : "text-muted-foreground/40"
            )}
            onClick={() => setFilter('completed')}
          >
            Done
          </Button>
        </div>
      </div>

      <Card className="bg-card border-[#2e2e2e] rounded-[8px] overflow-hidden">
        <CardHeader className="p-0 border-b border-[#2e2e2e] bg-[#0f0f0f]">
           <form onSubmit={handleAddTask} className="flex items-center gap-3 p-4">
              <div className="relative flex-1 group">
                 <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3ecf8e]/40 group-focus-within:text-[#3ecf8e] transition-colors" size={18} />
                 <Input 
                    placeholder="ENTER NEW TASK IDENTIFIER..." 
                    className="pl-12 h-12 bg-[#0f0f0f] border-[#2e2e2e] rounded-[6px] text-[0.88rem] font-medium placeholder:text-[#898989]/10 focus:bg-[#171717] transition-all"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                 />
              </div>
              <Button type="submit" size="default" className="bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] px-8 font-medium h-12 transition-all">
                 Initialize
              </Button>
           </form>
        </CardHeader>
        <CardContent className="p-0">
           <div className="p-4 border-b border-[#2e2e2e] bg-[#0f0f0f] flex items-center justify-between">
              <div className="relative w-full max-w-xs group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#898989]/20 group-focus-within:text-[#3ecf8e] transition-colors" size={14} />
                 <Input 
                    placeholder="FILTER REGISTRY..." 
                    className="pl-10 h-10 bg-[#0f0f0f] border-[#2e2e2e] rounded-[6px] text-[0.88rem] font-medium placeholder:text-[#898989]/10 focus:bg-[#171717] transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-2 px-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e]/40 animate-pulse" />
                 <span className="code-label text-[#898989]/30">Live Filter Active</span>
              </div>
           </div>
           
           <ScrollArea className="h-[calc(100vh-400px)] sm:h-[500px]">
              <div className="divide-y divide-[#2e2e2e]">
                 {loading && tasks.length === 0 ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                         <div className="h-5 w-5 rounded-full bg-[#2e2e2e]" />
                         <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-[#2e2e2e] rounded" />
                         </div>
                      </div>
                    ))
                 ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-[#898989]/30">
                       <List size={40} className="mb-2 opacity-10" />
                       <p className="text-sm font-medium">No tasks found.</p>
                    </div>
                 ) : (
                    filteredTasks.map((task) => (
                      <div 
                        key={task._id} 
                        className={cn(
                          "group flex items-center justify-between p-4 hover:bg-[#0f0f0f] transition-all duration-200 cursor-pointer border-l-2 border-transparent",
                          task.completed && "opacity-60",
                          task.priority === 'high' && !task.completed && "border-l-[#ef4444]/50 bg-[#ef4444]/5",
                          task.priority === 'medium' && !task.completed && "border-l-[#f59e0b]/50 bg-[#f59e0b]/5",
                          task.priority === 'low' && !task.completed && "border-l-[#3b82f6]/50 bg-[#3b82f6]/5"
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
                                 className="text-[#3ecf8e] transition-transform cursor-pointer shrink-0 hover:scale-110 active:scale-95"
                               >
                                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-[#898989]/30 hover:text-[#3ecf8e] transition-colors" />}
                               </div>
                               <div className="flex flex-col gap-1 min-w-0">
                               <span className={cn(
                                  "text-sm font-medium tracking-tight truncate",
                                  task.completed && "line-through text-[#898989]/50"
                               )}>
                                  {task.title}
                               </span>
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={cn("text-[0.75rem] uppercase font-medium tracking-wide px-1.5 py-0 rounded-[2px] border-transparent", getPriorityColor(task.priority))}>
                                     {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                     <span className="text-[0.75rem] text-[#898989]/50 flex items-center gap-1 font-medium tracking-wide">
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
                               className="h-8 w-8 text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5 rounded-[6px]"
                               onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(task);
                               }}
                            >
                               <Edit3 size={16} />
                            </Button>
                            <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-[#898989]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded-[6px]"
                               onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDeleteModal(task);
                               }}
                            >
                               <Trash2 size={16} />
                            </Button>
                            <div onClick={(e) => e.stopPropagation()}>
                               <DropdownMenu>
                                  <DropdownMenuTrigger render={
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-[#898989]/40 hover:text-[#fafafa] rounded-[6px]">
                                        <MoreVertical size={16} />
                                     </Button>
                                  } />
                                  <DropdownMenuContent align="end" className="bg-card border-[#2e2e2e] p-1 min-w-32 rounded-[8px]">
                                     <DropdownMenuItem 
                                        className="rounded-[6px] text-[0.88rem] font-medium p-2.5 cursor-pointer focus:bg-[#3ecf8e]/10 focus:text-[#3ecf8e]"
                                        onSelect={() => handleOpenEditModal(task)}
                                     >
                                        <Edit3 size={12} className="mr-2" />
                                        Edit Task
                                     </DropdownMenuItem>
                                     <DropdownMenuItem 
                                        className="text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] rounded-[6px] text-[0.88rem] font-medium p-2.5 cursor-pointer"
                                        onSelect={() => handleOpenDeleteModal(task)}
                                     >
                                        <Trash2 size={12} className="mr-2" />
                                        Delete Task
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
        <DialogContent className="max-w-full sm:max-w-2xl lg:max-w-3xl bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-muted/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Edit3 size={24} />
               </div>
               <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-foreground/90 leading-tight">Edit Task</DialogTitle>
                  <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                     Updating System Entry
                  </p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <Label htmlFor="edit-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Task Identification</Label>
                 <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.25em] bg-primary/5 px-2 py-0.5 rounded-[2px] border border-primary/10">Mandatory</span>
              </div>
              <div className="relative group">
                 <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={16} />
                 <Input
                   id="edit-title"
                   value={editTitle}
                   onChange={(e) => setEditTitle(e.target.value)}
                   className="bg-muted/10 border-border/50 focus:bg-muted/20 h-14 text-sm font-black uppercase tracking-widest pl-12 rounded-[4px] transition-all placeholder:text-muted-foreground/10"
                   placeholder="ENTER TASK NAME..."
                 />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
                   <Flag size={12} className="opacity-30" />
                   Priority Protocol
                </Label>
                <div className="flex gap-1.5 p-1.5 bg-muted/10 rounded-[4px] border border-border/50">
                  {['low', 'medium', 'high'].map((p) => (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 h-10 rounded-[2px] text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500",
                        editPriority === p 
                          ? p === 'high' ? "bg-red-500 text-white shadow-xl shadow-red-500/20" :
                            p === 'medium' ? "bg-yellow-500 text-white shadow-xl shadow-yellow-500/20" :
                            "bg-blue-500 text-white shadow-xl shadow-blue-500/20"
                          : "text-muted-foreground/20 hover:text-foreground hover:bg-muted/20"
                      )}
                      onClick={() => setEditPriority(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="edit-due-date" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
                   <CalendarIcon size={12} className="opacity-30" />
                   Timeline Schedule
                </Label>
                <div className="relative group">
                   <Input
                     id="edit-due-date"
                     type="date"
                     value={editDueDate}
                     onChange={(e) => setEditDueDate(e.target.value)}
                     className="bg-muted/10 border-border/50 focus:bg-muted/20 h-12 text-[11px] font-black uppercase tracking-[0.2em] rounded-[4px] transition-all px-4"
                   />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-muted/5 border-t border-border/30 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsEditModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all border border-transparent hover:border-border/50"
            >
              Cancel
            </Button>
            <Button 
               size="sm" 
               onClick={handleSaveEdit} 
               className="w-full sm:flex-[2] h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Execute Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-full sm:max-w-lg bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-destructive/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[4px] bg-destructive/10 flex items-center justify-center text-destructive shadow-sm shrink-0">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-destructive/90 leading-tight">Delete Task?</DialogTitle>
                  <p className="text-[10px] font-black text-destructive/30 uppercase tracking-[0.25em] mt-1.5">Critical System Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8">
            <p className="text-xs sm:text-sm font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
              Are you sure you want to delete <span className="font-black text-foreground underline decoration-destructive/30 underline-offset-4 decoration-2">&ldquo;{activeTask?.title}&rdquo;</span>? This will permanently remove all associated data from the system registry.
            </p>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-muted/5 border-t border-border/30 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsDeleteModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all border border-transparent hover:border-border/50"
            >
              Abort
            </Button>
            <Button 
               variant="destructive"
               size="sm" 
               onClick={handleConfirmDelete} 
               className="w-full sm:flex-1 h-12 bg-destructive text-white hover:bg-destructive/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-destructive/20 transition-all active:scale-[0.98]"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
