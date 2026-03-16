'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, CheckCircle, Zap } from 'lucide-react';
import useTaskStore from '@/store/useTaskStore';
import useHabitStore from '@/store/useHabitStore';
import { format, subDays, startOfDay, isSameDay, eachDayOfInterval } from 'date-fns';

export default function AnalyticsWidget() {
  const [mounted, setMounted] = useState(false);
  const { tasks, fetchTasks } = useTaskStore();
  const { habits, logs, fetchHabits } = useHabitStore();
  
  useEffect(() => {
    // Intentionally removed: setMounted(true);
    fetchTasks();
    fetchHabits();
  }, [fetchTasks, fetchHabits]);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const activeHabitsCount = habits.length;

  const chartData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map(day => {
      const dayStart = startOfDay(day);
      
      // Count tasks completed on this day
      const tasksOnDay = tasks.filter(t => 
        t.completed && t.completedAt && isSameDay(new Date(t.completedAt), dayStart)
      ).length;

      // Count habits completed on this day
      const habitsOnDay = logs.filter(l => 
        l.completed && isSameDay(new Date(l.date), dayStart)
      ).length;

      return {
        name: format(day, 'EEE'),
        tasks: tasksOnDay,
        habits: habitsOnDay,
        fullDate: format(day, 'MMM d'),
      };
    });
  }, [tasks, logs]);

  // Calculate Productivity Score (Simplified)
  const productivityScore = useMemo(() => {
    if (habits.length === 0 && tasks.length === 0) return 0;
    const totalPossibleHabits = habits.length * 7;
    const totalCompletedHabits = logs.filter(l => l.completed && new Date(l.date) > subDays(new Date(), 7)).length;
    const totalCompletedTasks = tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt) > subDays(new Date(), 7)).length;
    
    const habitScore = totalPossibleHabits > 0 ? (totalCompletedHabits / totalPossibleHabits) * 50 : 0;
    const taskScore = tasks.length > 0 ? (totalCompletedTasks / Math.max(tasks.length, 5)) * 50 : 0;
    
    return Math.min(Math.round(habitScore + taskScore), 100);
  }, [tasks, habits, logs]);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center opacity-0">
        <div className="h-full w-full bg-muted/5 animate-pulse rounded-[4px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-all group">
          <span className="text-[7px] uppercase font-black text-muted-foreground/20 mb-1 tracking-[0.2em] group-hover:text-primary/40 transition-colors">Total Tasks</span>
          <div className="flex items-center gap-1.5">
             <CheckCircle size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
             <span className="text-[11px] font-black text-foreground/70">{completedTasksCount}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-all group">
          <span className="text-[7px] uppercase font-black text-muted-foreground/20 mb-1 tracking-[0.2em] group-hover:text-orange-500/40 transition-colors">Active Habits</span>
          <div className="flex items-center gap-1.5">
             <Zap size={10} className="text-orange-500/40 group-hover:text-orange-500 transition-colors" />
             <span className="text-[11px] font-black text-foreground/70">{activeHabitsCount}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-all group">
          <span className="text-[7px] uppercase font-black text-muted-foreground/20 mb-1 tracking-[0.2em] group-hover:text-primary/40 transition-colors">System Yield</span>
          <div className="flex items-center gap-1.5">
             <TrendingUp size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
             <span className="text-[11px] font-black text-foreground/70">{productivityScore}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full mt-2 min-h-[140px] relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground)/0.3)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground)/0.3)', fontSize: 8, fontWeight: 900 }} 
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border)/0.5)', 
                  borderRadius: '4px', 
                  fontSize: '9px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="tasks" radius={[2, 2, 0, 0]} barSize={8}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-tasks-${index}`} fill="hsl(var(--primary))" fillOpacity={0.8} />
                ))}
              </Bar>
              <Bar dataKey="habits" radius={[2, 2, 0, 0]} barSize={8}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-habits-${index}`} fill="rgb(249, 115, 22)" fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
