'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Flame, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Trash2,
  Trophy,
  Zap,
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
import gsap from 'gsap';

export default function HabitsPage() {
  const { habits, logs, loading, fetchHabits, addHabit, toggleHabit, removeHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');
  const containerRef = useRef(null);

  const today = startOfToday();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading]);

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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Habits</h1>
          <p className="text-muted-foreground mt-1">Build consistency and track your daily progress.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-6 px-6 py-3 bg-card border border-border rounded-2xl shadow-xl shadow-primary/5">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">Active</span>
                 <span className="text-xl font-black text-primary">{habits.length}</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">Avg Streak</span>
                 <span className="text-xl font-black text-orange-500">
                    {habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + (h.streak || 0), 0) / habits.length) : 0}
                 </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">Best</span>
                 <span className="text-xl font-black text-lime-500">
                    {Math.max(0, ...habits.map(h => h.streak || 0))}
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
          <CardHeader className="p-8 border-b border-border/50 bg-sidebar/20">
             <form onSubmit={handleAddHabit} className="flex items-center gap-4">
                <div className="relative flex-1">
                   <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
                   <Input 
                      placeholder="What habit do you want to build?" 
                      className="pl-14 h-14 bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-muted-foreground/20"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                   />
                </div>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-8 font-bold uppercase tracking-[0.2em] h-12 shadow-lg shadow-primary/20">
                   Create Habit
                </Button>
             </form>
          </CardHeader>
          <CardContent className="p-0">
             <div className="grid grid-cols-[1fr_auto] border-b border-border/50 bg-sidebar/10">
                <div className="p-6">
                   <span className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground/40">Habit Name</span>
                </div>
                <div className="flex items-center pr-12">
                   {last7Days.map((date) => (
                      <div key={date.toString()} className="w-14 flex flex-col items-center gap-1">
                         <span className="text-[8px] uppercase font-black text-muted-foreground/30">{format(date, 'EEE')}</span>
                         <span className={cn(
                            "text-xs font-black",
                            isSameDay(date, today) ? "text-primary" : "text-muted-foreground/50"
                         )}>{format(date, 'd')}</span>
                      </div>
                   ))}
                </div>
             </div>

             <ScrollArea className="h-[500px]">
                <div ref={containerRef} className="divide-y divide-border/30">
                   {loading && habits.length === 0 ? (
                      [1, 2, 3, 4].map(i => (
                         <div key={i} className="p-8 flex items-center justify-between animate-pulse">
                            <div className="h-6 w-48 bg-sidebar rounded-lg" />
                            <div className="flex gap-4">
                               {[1, 2, 3, 4, 5, 6, 7].map(j => (
                                  <div key={j} className="h-8 w-8 rounded-full bg-sidebar" />
                               ))}
                            </div>
                         </div>
                      ))
                   ) : habits.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground/30">
                         <Trophy size={80} className="mb-6 opacity-5" />
                         <p className="text-2xl font-black italic tracking-tight">No habits tracked yet.</p>
                         <p className="text-sm mt-2 font-medium opacity-50 uppercase tracking-widest">Consistency is the key to success.</p>
                      </div>
                   ) : (
                      habits.map((habit) => (
                        <div key={habit._id} className="group flex items-center justify-between p-8 hover:bg-primary/[0.02] transition-all duration-300">
                           <div className="flex items-center gap-6 flex-1 min-w-0">
                              <div className="flex flex-col min-w-0">
                                 <span className="text-xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">{habit.name}</span>
                                 <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                                       <Flame size={12} className="text-orange-500" />
                                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{habit.streak || 0} DAY STREAK</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                       <TrendingUp size={12} className="text-primary" />
                                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">85% SCORE</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center pr-4">
                              <div className="flex items-center mr-8">
                                 {last7Days.map((date) => {
                                    const completed = isCompletedOnDate(habit._id, date);
                                    const isTodayDate = isSameDay(date, today);
                                    return (
                                       <button
                                          key={date.toString()}
                                          onClick={() => toggleHabit(habit._id, date)}
                                          className={cn(
                                             "w-14 flex items-center justify-center transition-all duration-300 transform hover:scale-110",
                                             !isTodayDate && "opacity-60 hover:opacity-100"
                                          )}
                                       >
                                          {completed ? (
                                             <div className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                                                <CheckCircle2 size={20} strokeWidth={3} />
                                             </div>
                                          ) : (
                                             <div className={cn(
                                                "h-9 w-9 rounded-2xl border-2 flex items-center justify-center transition-colors",
                                                isTodayDate ? "border-primary/40 bg-primary/5 text-primary/40 hover:border-primary" : "border-border bg-sidebar/50 text-muted-foreground/20 hover:border-border-foreground"
                                             )}>
                                                <Circle size={20} strokeWidth={3} />
                                             </div>
                                          )}
                                       </button>
                                    );
                                 })}
                              </div>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreVertical size={20} />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="bg-card border-border p-2 rounded-2xl shadow-2xl min-w-40">
                                    <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary rounded-xl font-bold uppercase tracking-widest text-[10px] p-3">Edit Habit</DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary rounded-xl font-bold uppercase tracking-widest text-[10px] p-3">Reset Streak</DropdownMenuItem>
                                    <DropdownMenuItem 
                                       className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl font-bold uppercase tracking-widest text-[10px] p-3"
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
