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
  Activity
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
import useHabitStore from '@/store/useHabitStore';
import { format, startOfToday, subDays, isSameDay, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function HabitsPage() {
  const { habits, logs, loading, fetchHabits, addHabit, toggleHabit, removeHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');

  const today = startOfToday();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    await addHabit(newHabitName);
    setNewHabitName('');
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
             <div className="grid grid-cols-[1fr_auto] border-b border-border bg-muted/10">
                <div className="p-4">
                   <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Habit</span>
                </div>
                <div className="flex items-center pr-10">
                   {last7Days.map((date) => (
                      <div key={date.toString()} className="w-12 flex flex-col items-center gap-1">
                         <span className="text-[8px] uppercase font-bold text-muted-foreground/40">{format(date, 'EEE')}</span>
                         <span className={cn(
                            "text-[10px] font-bold",
                            isSameDay(date, today) ? "text-primary" : "text-muted-foreground/60"
                         )}>{format(date, 'd')}</span>
                      </div>
                   ))}
                </div>
             </div>

             <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border">
                   {loading && habits.length === 0 ? (
                      [1, 2, 3, 4].map(i => (
                         <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                            <div className="h-4 w-40 bg-muted rounded-[4px]" />
                            <div className="flex gap-2">
                               {[1, 2, 3, 4, 5, 6, 7].map(j => (
                                  <div key={j} className="h-8 w-8 rounded-[4px] bg-muted" />
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
                        <div key={habit._id} className="group flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex flex-col min-w-0">
                                 <span className="text-sm font-bold tracking-tight truncate group-hover:text-primary transition-colors">{habit.name}</span>
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-orange-500/10 px-1.5 py-0.5 rounded-[2px] border border-orange-500/20">
                                       <Flame size={10} className="text-orange-500" />
                                       <span className="text-[8px] font-bold text-orange-500 uppercase tracking-wider">{habit.streak || 0} Streak</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/20">
                                       <TrendingUp size={10} className="text-primary" />
                                       <span className="text-[8px] font-bold text-primary uppercase tracking-wider">85% Score</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center pr-2">
                              <div className="flex items-center mr-6">
                                 {last7Days.map((date) => {
                                    const completed = isCompletedOnDate(habit._id, date);
                                    const isTodayDate = isSameDay(date, today);
                                    return (
                                       <button
                                          key={date.toString()}
                                          onClick={() => toggleHabit(habit._id, date)}
                                          className={cn(
                                             "w-12 flex items-center justify-center",
                                             !isTodayDate && "opacity-60 hover:opacity-100"
                                          )}
                                       >
                                          {completed ? (
                                             <div className="h-8 w-8 rounded-[4px] bg-primary text-primary-foreground flex items-center justify-center">
                                                <CheckCircle2 size={16} />
                                             </div>
                                          ) : (
                                             <div className={cn(
                                                "h-8 w-8 rounded-[4px] border border-border flex items-center justify-center transition-colors hover:border-primary/50",
                                                isTodayDate ? "bg-primary/5 border-primary/20 text-primary/40" : "bg-muted/30 text-muted-foreground/20"
                                             )}>
                                                <Circle size={16} />
                                             </div>
                                          )}
                                       </button>
                                    );
                                 })}
                              </div>
                              <DropdownMenu>
                                 <DropdownMenuTrigger render={
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreVertical size={16} />
                                    </Button>
                                 } />
                                 <DropdownMenuContent align="end" className="bg-card border-border p-1 rounded-[4px] shadow-sm">
                                    <DropdownMenuItem className="rounded-[4px] text-xs font-bold uppercase tracking-wider p-2">Edit</DropdownMenuItem>
                                    <DropdownMenuItem 
                                       className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[4px] text-xs font-bold uppercase tracking-wider p-2"
                                       onClick={() => removeHabit(habit._id)}
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
    </div>
  );
}
