'use client';

import { useState, useEffect } from 'react';
import { Plus, Flame, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useHabitStore from '@/store/useHabitStore';
import { format, startOfDay } from 'date-fns';

export default function HabitWidget() {
  const [newHabitName, setNewHabitName] = useState('');
  const { habits, logs, loading, fetchHabits, addHabit, toggleHabit, removeHabit } = useHabitStore();

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
      <form onSubmit={handleAddHabit} className="flex items-center gap-2 mb-4 px-1">
        <Input
          placeholder="New habit..."
          className="bg-sidebar/50 border-border h-9 text-sm focus:ring-primary"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-9 w-9 bg-primary text-primary-foreground">
          <Plus size={16} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-3">
        {loading && habits.length === 0 ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-sidebar/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 italic text-sm">
             Build new habits.
          </div>
        ) : (
          <div className="space-y-2 py-1">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-sidebar/30 group hover:border-primary/30 transition-all duration-300",
                  isCompletedToday(habit._id) && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => toggleHabit(habit._id, new Date())}
                    className="cursor-pointer text-primary hover:scale-110 transition-transform"
                  >
                    {isCompletedToday(habit._id) ? <CheckCircle2 size={22} /> : <Circle size={22} className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{habit.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Flame size={10} className="text-orange-500" />
                          {habit.streak || 0} day streak
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                   {/* Add a small spark chart or weekly tracker here later */}
                   <div className="h-1 w-12 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '60%' }} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
