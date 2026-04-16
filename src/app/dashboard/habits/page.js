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
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Habits
            </h1>
            <p className="text-[#898989] mt-1 text-[1rem] font-medium">Build consistency and track your progress.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#0f0f0f] p-2 rounded-[9999px] border border-[#2e2e2e]">
             <div className="flex flex-col items-center px-6 py-2">
                <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">Active</span>
                <span className="text-[1.25rem] font-medium text-[#3ecf8e] uppercase tracking-widest">{habits.length}</span>
             </div>
             <div className="h-8 w-px bg-[#2e2e2e]/50" />
             <div className="flex flex-col items-center px-6 py-2">
                <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">Avg Streak</span>
                <span className="text-[1.25rem] font-medium text-orange-500 uppercase tracking-widest">
                   {habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + (h.streak || 0), 0) / habits.length) : 0}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">

        <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] overflow-hidden">
          <CardHeader className="p-0 border-b border-[#2e2e2e] bg-[#171717]/30">
             <form onSubmit={handleAddHabit} className="flex items-center gap-3 p-5">
                <div className="relative flex-1 group">
                   <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3ecf8e]/40 group-focus-within:text-[#3ecf8e] transition-colors" size={18} />
                   <Input 
                      placeholder="Initialize new habit protocol..." 
                      className="pl-12 h-11 bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                   />
                </div>
                <Button type="submit" size="default" className="bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] px-8 font-medium h-11 gap-2 transition-all">
                   <Plus size={18} />
                   <span>Add Habit</span>
                </Button>
             </form>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-[#2e2e2e] bg-[#171717]/30">
                <div className="p-5 hidden md:block">
                   <span className="text-[14px] font-medium tracking-wider text-[#898989]">Habit Protocol</span>
                </div>
                <div className="flex items-center overflow-x-auto custom-scrollbar md:pr-10 py-3 md:py-0">
                   <div className="flex min-w-full md:min-w-0">
                      {last7Days.map((date) => (
                         <div key={date.toString()} className="w-14 shrink-0 flex flex-col items-center gap-1">
                            <span className="text-[12px] font-medium text-[#898989]/40">{format(date, 'EEE')}</span>
                            <span className={cn(
                               "text-[14px] font-medium",
                               isSameDay(date, today) ? "text-[#3ecf8e]" : "text-[#898989]/60"
                            )}>{format(date, 'd')}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             <ScrollArea className="h-[60vh] sm:h-[500px]">
                <div className="divide-y divide-[#2e2e2e]/30">
                   {loading && habits.length === 0 ? (
                      [1, 2, 3, 4].map(i => (
                         <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between animate-pulse gap-4">
                            <div className="h-4 w-40 bg-[#2e2e2e]/20 rounded-[6px]" />
                            <div className="flex gap-2 overflow-hidden">
                               {[1, 2, 3, 4, 5, 6, 7].map(j => (
                                  <div key={j} className="h-9 w-9 rounded-[9999px] bg-[#2e2e2e]/20 shrink-0" />
                               ))}
                            </div>
                         </div>
                      ))
                   ) : habits.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-[#898989]/20">
                         <Trophy size={48} className="mb-4" />
                         <p className="text-[16px] font-medium uppercase tracking-widest">No habits tracked yet.</p>
                      </div>
                   ) : (
                      habits.map((habit) => (
                        <div 
                           key={habit._id} 
                           className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#171717]/30 transition-colors cursor-pointer border-l-2 border-transparent gap-4 md:gap-0"
                           onClick={() => handleOpenEditModal(habit)}
                        >
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[16px] font-medium tracking-tight truncate group-hover:text-[#3ecf8e] transition-colors">{habit.name}</span>
                                 <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1.5 bg-orange-500/10 px-2 py-0.5 rounded-[9999px] border border-orange-500/20">
                                       <Flame size={12} className="text-orange-500" />
                                       <span className="text-[12px] font-medium text-orange-500 uppercase tracking-wider">{habit.streak || 0} Streak</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-[#3ecf8e]/10 px-2 py-0.5 rounded-[9999px] border border-[#3ecf8e]/20">
                                       <TrendingUp size={12} className="text-[#3ecf8e]" />
                                       <span className="text-[12px] font-medium text-[#3ecf8e] uppercase tracking-wider">85% Score</span>
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
                                             "w-14 shrink-0 flex items-center justify-center transition-transform hover:scale-110 active:scale-95",
                                             !isTodayDate && "opacity-60 hover:opacity-100"
                                          )}
                                       >
                                          {completed ? (
                                             <div className="h-9 w-9 rounded-[9999px] bg-[#3ecf8e] text-[#0a0a0a] flex items-center justify-center">
                                                <CheckCircle2 size={18} />
                                             </div>
                                          ) : (
                                             <div className={cn(
                                                "h-9 w-9 rounded-[9999px] border border-[#2e2e2e] flex items-center justify-center transition-all hover:border-[#3ecf8e]/50",
                                                isTodayDate ? "bg-[#3ecf8e]/5 border-[#3ecf8e]/20 text-[#3ecf8e]/40" : "bg-[#171717]/30 text-[#898989]/20"
                                             )}>
                                                <Circle size={18} />
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
                                    className="h-9 w-9 text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5 rounded-[9999px]"
                                    onClick={() => handleOpenEditModal(habit)}
                                 >
                                    <Edit3 size={16} />
                                 </Button>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-[#898989]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded-[9999px]"
                                    onClick={() => handleOpenDeleteModal(habit)}
                                 >
                                    <Trash2 size={16} />
                                 </Button>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                       <Button variant="ghost" size="icon" className="h-9 w-9 text-[#898989]/40 hover:text-[#fafafa] hover:bg-[#171717] transition-all rounded-[9999px]">
                                          <MoreVertical size={16} />
                                       </Button>
                                    } />
                                    <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-[#2e2e2e] p-1 rounded-[8px] min-w-40">
                                       <DropdownMenuItem 
                                          className="rounded-[6px] text-[14px] font-medium p-2.5 cursor-pointer focus:bg-[#3ecf8e]/10 focus:text-[#3ecf8e]"
                                          onSelect={() => handleOpenEditModal(habit)}
                                       >
                                          <Edit3 size={14} className="mr-2" />
                                          Edit Habit
                                       </DropdownMenuItem>
                                       <DropdownMenuItem 
                                          className="text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] rounded-[6px] text-[14px] font-medium p-2.5 cursor-pointer"
                                          onSelect={() => handleOpenDeleteModal(habit)}
                                       >
                                          <Trash2 size={14} className="mr-2" />
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
        <DialogContent className="max-w-full sm:max-w-2xl lg:max-w-3xl bg-[#0f0f0f] border-[#2e2e2e] p-0 overflow-hidden rounded-[8px] transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-[#2e2e2e] bg-[#3ecf8e]/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[9999px] bg-[#3ecf8e]/10 flex items-center justify-center text-[#3ecf8e] shrink-0">
                  <Target size={24} />
               </div>
               <div>
                  <DialogTitle className="text-[1.5rem] font-normal tracking-tight text-[#fafafa]/90 leading-tight">Edit Habit</DialogTitle>
                  <p className="text-[12px] font-medium text-[#3ecf8e]/40 uppercase tracking-wider mt-1.5 flex items-center gap-2">
                     <span className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                     Modifying Habit Protocol
                  </p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <Label htmlFor="edit-name" className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">Habit Designation</Label>
                 <span className="text-[12px] font-medium text-[#3ecf8e]/40 uppercase tracking-wider bg-[#3ecf8e]/5 px-2 py-0.5 rounded-[9999px] border border-[#3ecf8e]/10">Mandatory</span>
              </div>
              <div className="relative group">
                 <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#898989]/20 group-focus-within:text-[#3ecf8e] transition-colors" size={16} />
                 <Input
                   id="edit-name"
                   value={editName}
                   onChange={(e) => setEditName(e.target.value)}
                   className="bg-[#171717]/50 border-[#2e2e2e] focus:bg-[#171717] h-12 text-[14px] font-medium pl-12 rounded-[6px] transition-all placeholder:text-[#898989]/20 focus:border-[#3ecf8e]"
                   placeholder="Enter habit name..."
                 />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-[#0f0f0f] border-t border-[#2e2e2e] flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsEditModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[6px] text-[14px] font-medium text-[#898989]/30 hover:text-[#fafafa] transition-all border border-transparent hover:border-[#2e2e2e]/50"
            >
              Cancel
            </Button>
            <Button 
               size="sm" 
               onClick={handleSaveEdit} 
               className="w-full sm:flex-[2] h-12 bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] text-[14px] font-medium transition-all"
            >
              Update Protocol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-full sm:max-w-lg bg-[#0f0f0f] border-[#2e2e2e] p-0 overflow-hidden rounded-[8px] transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-[#2e2e2e] bg-[#ef4444]/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[9999px] bg-[#ef4444]/10 flex items-center justify-center text-[#ef4444] shrink-0">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <DialogTitle className="text-[1.5rem] font-normal tracking-tight text-[#ef4444]/90 leading-tight">Terminate Habit?</DialogTitle>
                  <p className="text-[12px] font-medium text-[#ef4444]/30 uppercase tracking-wider mt-1.5">Critical System Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8">
            <p className="text-[14px] font-medium text-[#898989]/60 leading-relaxed uppercase tracking-wider">
              Are you sure you want to terminate habit <span className="font-medium text-[#fafafa] underline decoration-[#ef4444]/30 underline-offset-4 decoration-2">&ldquo;{activeHabit?.name}&rdquo;</span>? This will permanently remove all streak data and history.
            </p>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-[#0f0f0f] border-t border-[#2e2e2e] flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsDeleteModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[6px] text-[14px] font-medium text-[#898989]/30 hover:text-[#fafafa] transition-all border border-transparent hover:border-[#2e2e2e]/50"
            >
              Abort
            </Button>
            <Button 
               variant="destructive"
               size="sm" 
               onClick={handleConfirmDelete} 
               className="w-full sm:flex-1 h-12 bg-[#ef4444] text-[#fafafa] hover:bg-[#ef4444]/90 rounded-[9999px] text-[14px] font-medium transition-all"
            >
              Confirm Termination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
