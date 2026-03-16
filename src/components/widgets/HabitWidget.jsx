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

      <ScrollArea className="flex-1 -mr-2 pr-2">
        {loading && habits.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/20 italic text-[10px] uppercase font-bold tracking-widest">
             <Plus size={16} className="opacity-10" />
             No habits.
          </div>
        ) : (
          <div className="space-y-1">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-[4px] hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50",
                  isCompletedToday(habit._id) && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => toggleHabit(habit._id, new Date())}
                    className="text-primary shrink-0 transition-transform hover:scale-110 active:scale-95"
                  >
                    {isCompletedToday(habit._id) ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-muted-foreground/30 hover:text-primary/50 transition-colors" />}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold truncate tracking-tight text-foreground/90">{habit.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[8px] text-muted-foreground/60 flex items-center gap-1 font-black uppercase tracking-widest">
                          <Flame size={10} className={cn("transition-colors", habit.streak > 0 ? "text-orange-500" : "text-muted-foreground/30")} />
                          {habit.streak || 0}d
                       </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-10 bg-muted/50 rounded-full overflow-hidden shrink-0 ml-2">
                   <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }} 
                   />
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
