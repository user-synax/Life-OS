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
      <form onSubmit={handleAddHabit} className="flex items-center gap-2 mb-3">
        <Input
          placeholder="New habit..."
          className="bg-muted/30 border-border h-8 text-xs rounded-[4px] focus:ring-1 focus:ring-primary"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-8 w-8 bg-primary text-primary-foreground rounded-[4px]">
          <Plus size={14} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-2">
        {loading && habits.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted/50 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground/40 italic text-xs">
             No habits.
          </div>
        ) : (
          <div className="space-y-1.5">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-[4px] border border-border bg-muted/10 transition-colors",
                  isCompletedToday(habit._id) && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button 
                    onClick={() => toggleHabit(habit._id, new Date())}
                    className="text-primary shrink-0"
                  >
                    {isCompletedToday(habit._id) ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-muted-foreground/30 hover:text-primary/50 transition-colors" />}
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate tracking-tight">{habit.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-medium">
                          <Flame size={10} className="text-orange-500" />
                          {habit.streak || 0}d streak
                       </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-8 bg-muted rounded-full overflow-hidden shrink-0 ml-2">
                   <div className="h-full bg-primary" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
