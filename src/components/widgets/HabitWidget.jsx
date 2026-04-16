'use client';

import { useState, useEffect } from 'react';
import { Plus, Flame, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useHabitStore from '@/store/useHabitStore';
import { startOfDay } from 'date-fns';

export default function HabitWidget() {
  const [newHabitName, setNewHabitName] = useState('');
  const { habits, logs, loading, fetchHabits, addHabit, toggleHabit } = useHabitStore();

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    await addHabit(newHabitName);
    setNewHabitName('');
  };

  const isCompletedToday = (habitId) => {
    const today = startOfDay(new Date()).toISOString();
    const log = logs.find(
      (l) => l.habitId === habitId && startOfDay(new Date(l.date)).toISOString() === today
    );
    return log?.completed || false;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddHabit} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={12} />
          <Input
            placeholder="Add habit..."
            className="bg-muted/30 border-none h-9 text-[11px] pl-8 rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
        </div>
      </form>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        {loading && habits.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-muted/10 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/10 py-10">
             <div className="p-4 rounded-full bg-muted/5 border border-dashed border-border/50">
                <Flame size={24} className="opacity-20" />
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Rituals Found</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-[4px] bg-[#171717]/50 hover:bg-[#2e2e2e]/50 transition-all duration-300 border border-[#2e2e2e]/30 hover:border-[#3ecf8e]/30 group",
                  isCompletedToday(habit._id) && "bg-[#3ecf8e]/5 border-[#3ecf8e]/10"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button 
                    onClick={() => toggleHabit(habit._id, new Date())}
                    className="shrink-0 transition-all duration-300 transform active:scale-90"
                  >
                    {isCompletedToday(habit._id) ? (
                      <CheckCircle2 size={22} className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                    ) : (
                      <Circle size={22} className="text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
                    )}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[16px] font-medium truncate tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{habit.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#0f0f0f]/50 border border-[#2e2e2e]/30">
                          <Flame size={11} className={cn("transition-colors", habit.streak > 0 ? "text-orange-500 animate-pulse" : "text-muted-foreground/20")} />
                          <span className="text-[14px] font-medium uppercase tracking-widest text-orange-500/80">
                             {habit.streak || 0} Day Streak
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                   <div className="h-1 w-12 bg-[#171717]/50 rounded-full overflow-hidden">
                      <div 
                       className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(var(--primary),0.6)]" 
                       style={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }} 
                      />
                   </div>
                   <span className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground/30">Progress</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
