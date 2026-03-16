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
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-colors">
          <span className="text-[7px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest">Tasks</span>
          <div className="flex items-center gap-1.5">
             <CheckCircle size={10} className="text-primary/60" />
             <span className="text-[11px] font-black text-foreground/80">{completedTasks}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-colors">
          <span className="text-[7px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest">Habits</span>
          <div className="flex items-center gap-1.5">
             <Zap size={10} className="text-orange-500/60" />
             <span className="text-[11px] font-black text-foreground/80">{activeHabits}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-colors">
          <span className="text-[7px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest">Score</span>
          <div className="flex items-center gap-1.5">
             <TrendingUp size={10} className="text-primary/60" />
             <span className="text-[11px] font-black text-foreground/80">85%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] w-full mt-2 relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground)/0.4)', fontSize: 8, fontWeight: 900 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground)/0.4)', fontSize: 8, fontWeight: 900 }} 
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border)/0.5)', 
                  borderRadius: '4px', 
                  fontSize: '8px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              />
              <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="habits" fill="hsl(var(--primary)/0.2)" radius={[2, 2, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
