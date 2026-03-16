'use client';

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
import { TrendingUp, CheckCircle, Clock, Zap } from 'lucide-react';
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
        <div className="flex flex-col p-2 bg-sidebar/50 rounded-xl border border-border/30">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/50 mb-1">Tasks</span>
          <div className="flex items-center gap-1">
             <CheckCircle size={10} className="text-primary" />
             <span className="text-sm font-bold">{completedTasks}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-sidebar/50 rounded-xl border border-border/30">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/50 mb-1">Habits</span>
          <div className="flex items-center gap-1">
             <Zap size={10} className="text-yellow-500" />
             <span className="text-sm font-bold">{activeHabits}</span>
          </div>
        </div>
        <div className="flex flex-col p-2 bg-sidebar/50 rounded-xl border border-border/30">
          <span className="text-[8px] uppercase font-bold text-muted-foreground/50 mb-1">Score</span>
          <div className="flex items-center gap-1">
             <TrendingUp size={10} className="text-lime-500" />
             <span className="text-sm font-bold">85%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#737373', fontSize: 10 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#737373', fontSize: 10 }} 
            />
            <Tooltip 
              cursor={{ fill: '#1a1a1a' }}
              contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626', borderRadius: '8px', fontSize: '10px' }}
            />
            <Bar dataKey="tasks" fill="#A3FF12" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="habits" fill="#262626" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
