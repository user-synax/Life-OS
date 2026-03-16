'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Flame, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  MoreVertical,
  Trash2,
  Trophy,
  Activity,
  Edit3,
  AlertTriangle,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import useHabitStore from '@/store/useHabitStore';
import { format, startOfToday, subDays, isSameDay, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function HabitsPage() {
  const { habits, logs, loading, fetchHabits, addHabit, toggleHabit, removeHabit, updateHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');
  
  // Modal State
  const [activeHabit, setActiveHabit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState('');

  const today = startOfToday();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    try {
      await addHabit(newHabitName);
      setNewHabitName('');
      toast.success('Habit created successfully');
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

  const handleOpenEditModal = (habit) => {
    setActiveHabit(habit);
    setEditName(habit.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      toast.error('Habit name is required');
      return;
    }
    
    try {
      await updateHabit(activeHabit._id, { name: editName });
      setIsEditModalOpen(false);
      toast.success('Habit updated successfully');
    } catch (error) {
      toast.error('Failed to update habit');
    }
  };

  const handleOpenDeleteModal = (habit) => {
    setActiveHabit(habit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeHabit(activeHabit._id);
      setIsDeleteModalOpen(false);
      setActiveHabit(null);
      toast.success('Habit deleted successfully');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const isCompletedOnDate = (habitId, date) => {
    const d = startOfDay(date).toISOString();
    return logs.some(l => l.habitId === habitId && startOfDay(new Date(l.date)).toISOString() === d && l.completed);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Habits</h1>
          <p className="text-muted-foreground mt-1 text-sm">Build consistency and track your progress.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-[4px] shadow-sm">
           <div className="flex flex-col items-center px-3">
              <span className="text-[9px] uppercase font-bold text-muted-foreground/60">Active</span>
              <span className="text-base font-bold text-primary">{habits.length}</span>
           </div>
           <div className="h-6 w-px bg-border" />
           <div className="flex flex-col items-center px-3">
              <span className="text-[9px] uppercase font-bold text-muted-foreground/60">Avg Streak</span>
              <span className="text-base font-bold text-orange-500">
                 {habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + (h.streak || 0), 0) / habits.length) : 0}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-sm rounded-[4px] overflow-hidden">
          <CardHeader className="p-4 border-b border-border bg-muted/20">
             <form onSubmit={handleAddHabit} className="flex items-center gap-3">
                <div className="relative flex-1">
                   <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                   <Input 
                      placeholder="Add a new habit..." 
                      className="pl-10 h-10 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-muted-foreground/30"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                   />
                </div>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-6 font-bold uppercase tracking-wider h-8 text-[10px]">
                   Create
                </Button>
             </form>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-border bg-muted/10">
                <div className="p-4 hidden md:block">
                   <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Habit Protocol</span>
                </div>
                <div className="flex items-center overflow-x-auto custom-scrollbar md:pr-10 py-2 md:py-0">
                   <div className="flex min-w-full md:min-w-0">
                      {last7Days.map((date) => (
                         <div key={date.toString()} className="w-12 shrink-0 flex flex-col items-center gap-1">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground/40">{format(date, 'EEE')}</span>
                            <span className={cn(
                               "text-[10px] font-bold",
                               isSameDay(date, today) ? "text-primary" : "text-muted-foreground/60"
                            )}>{format(date, 'd')}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             <ScrollArea className="h-[60vh] sm:h-[500px]">
                <div className="divide-y divide-border">
                   {loading && habits.length === 0 ? (
                      [1, 2, 3, 4].map(i => (
                         <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between animate-pulse gap-4">
                            <div className="h-4 w-40 bg-muted rounded-[4px]" />
                            <div className="flex gap-2 overflow-hidden">
                               {[1, 2, 3, 4, 5, 6, 7].map(j => (
                                  <div key={j} className="h-8 w-8 rounded-[4px] bg-muted shrink-0" />
                               ))}
                            </div>
                         </div>
                      ))
                   ) : habits.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/20">
                         <Trophy size={48} className="mb-4" />
                         <p className="text-sm font-bold uppercase tracking-widest">No habits tracked yet.</p>
                      </div>
                   ) : (
                      habits.map((habit) => (
                        <div 
                           key={habit._id} 
                           className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-muted/10 transition-colors cursor-pointer border-l-2 border-transparent gap-4 md:gap-0"
                           onClick={() => handleOpenEditModal(habit)}
                        >
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex flex-col min-w-0">
                                 <span className="text-sm font-black tracking-tight truncate group-hover:text-primary transition-colors uppercase">{habit.name}</span>
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-orange-500/10 px-1.5 py-0.5 rounded-[2px] border border-orange-500/20">
                                       <Flame size={10} className="text-orange-500" />
                                       <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">{habit.streak || 0} Streak</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/20">
                                       <TrendingUp size={10} className="text-primary" />
                                       <span className="text-[8px] font-black text-primary uppercase tracking-widest">85% Score</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:pr-2">
                              <div className="flex items-center overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0 md:mr-6" onClick={(e) => e.stopPropagation()}>
                                 {last7Days.map((date) => {
                                    const completed = isCompletedOnDate(habit._id, date);
                                    const isTodayDate = isSameDay(date, today);
                                    return (
                                       <button
                                          key={date.toString()}
                                          onClick={() => toggleHabit(habit._id, date)}
                                          className={cn(
                                             "w-12 shrink-0 flex items-center justify-center transition-transform hover:scale-110 active:scale-95",
                                             !isTodayDate && "opacity-60 hover:opacity-100"
                                          )}
                                       >
                                          {completed ? (
                                             <div className="h-8 w-8 rounded-[4px] bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                                                <CheckCircle2 size={16} />
                                             </div>
                                          ) : (
                                             <div className={cn(
                                                "h-8 w-8 rounded-[4px] border border-border flex items-center justify-center transition-all hover:border-primary/50",
                                                isTodayDate ? "bg-primary/5 border-primary/20 text-primary/40" : "bg-muted/30 text-muted-foreground/20"
                                             )}>
                                                <Circle size={16} />
                                             </div>
                                          )}
                                       </button>
                                    );
                                 })}
                              </div>
                              <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity ml-auto md:ml-0" onClick={(e) => e.stopPropagation()}>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-[4px]"
                                    onClick={() => handleOpenEditModal(habit)}
                                 >
                                    <Edit3 size={16} />
                                 </Button>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-[4px]"
                                    onClick={() => handleOpenDeleteModal(habit)}
                                 >
                                    <Trash2 size={16} />
                                 </Button>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-foreground transition-all rounded-[4px]">
                                          <MoreVertical size={16} />
                                       </Button>
                                    } />
                                    <DropdownMenuContent align="end" className="bg-card border-border/50 p-1 rounded-[4px] shadow-xl min-w-32">
                                       <DropdownMenuItem 
                                          className="rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
                                          onSelect={() => handleOpenEditModal(habit)}
                                       >
                                          <Edit3 size={12} className="mr-2" />
                                          Edit Habit
                                       </DropdownMenuItem>
                                       <DropdownMenuItem 
                                          className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer"
                                          onSelect={() => handleOpenDeleteModal(habit)}
                                       >
                                          <Trash2 size={12} className="mr-2" />
                                          Delete Habit
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
      </div>

      {/* Edit Habit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl lg:max-w-3xl bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-muted/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Target size={24} />
               </div>
               <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-foreground/90 leading-tight">Edit Habit</DialogTitle>
                  <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                     Modifying Habit Protocol
                  </p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Habit Designation</Label>
                 <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.25em] bg-primary/5 px-2 py-0.5 rounded-[2px] border border-primary/10">Mandatory</span>
              </div>
              <div className="relative group">
                 <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" size={16} />
                 <Input
                   id="edit-name"
                   value={editName}
                   onChange={(e) => setEditName(e.target.value)}
                   className="bg-muted/10 border-border/50 focus:bg-muted/20 h-14 text-sm font-black uppercase tracking-widest pl-12 rounded-[4px] transition-all placeholder:text-muted-foreground/10"
                   placeholder="ENTER HABIT NAME..."
                 />
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
              Update Protocol
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
                  <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-destructive/90 leading-tight">Terminate Habit?</DialogTitle>
                  <p className="text-[10px] font-black text-destructive/30 uppercase tracking-[0.25em] mt-1.5">Critical System Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8">
            <p className="text-xs sm:text-sm font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
              Are you sure you want to terminate habit <span className="font-black text-foreground underline decoration-destructive/30 underline-offset-4 decoration-2">&ldquo;{activeHabit?.name}&rdquo;</span>? This will permanently remove all streak data and history.
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
              Confirm Termination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
