'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, CheckCircle, Zap } from 'lucide-react';
import useTaskStore from '@/store/useTaskStore';
import useHabitStore from '@/store/useHabitStore';

const data = [
  { name: 'Mon', tasks: 4, habits: 3 },
  { name: 'Tue', tasks: 3, habits: 2 },
  { name: 'Wed', tasks: 6, habits: 4 },
  { name: 'Thu', tasks: 8, habits: 5 },
  { name: 'Fri', tasks: 5, habits: 3 },
  { name: 'Sat', tasks: 2, habits: 1 },
  { name: 'Sun', tasks: 3, habits: 2 },
];

export default function AnalyticsWidget() {
  const tasks = useTaskStore((state) => state.tasks);
  const habits = useHabitStore((state) => state.habits);
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeHabits = habits.length;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col p-2 bg-muted/30 rounded-[4px] border border-border">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mb-1">Tasks</span>
          <div className="flex items-center gap-1">
             <CheckCircle size={10} className="text-primary" />
             <span className="text-xs font-bold">{completedTasks}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/30 rounded-[4px] border border-border">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mb-1">Habits</span>
          <div className="flex items-center gap-1">
             <Zap size={10} className="text-orange-500" />
             <span className="text-xs font-bold">{activeHabits}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/30 rounded-[4px] border border-border">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mb-1">Score</span>
          <div className="flex items-center gap-1">
             <TrendingUp size={10} className="text-primary" />
             <span className="text-xs font-bold">85%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 600 }} 
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))', 
                borderRadius: '4px', 
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            />
            <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} barSize={10} />
            <Bar dataKey="habits" fill="hsl(var(--primary)/0.3)" radius={[2, 2, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
