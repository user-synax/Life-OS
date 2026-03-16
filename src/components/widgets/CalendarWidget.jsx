'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    const now = new Date();
    if (currentMonth === null) {
      queueMicrotask(() => setCurrentMonth(now));
    }
    if (today === null) {
      queueMicrotask(() => setToday(now));
    }
  }, [currentMonth, today]);

  const calendarData = useMemo(() => {
    if (!currentMonth) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return {
      monthStart,
      days: eachDayOfInterval({ start: startDate, end: endDate })
    };
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(prev => prev ? addMonths(prev, 1) : null);
  const prevMonth = () => setCurrentMonth(prev => prev ? subMonths(prev, 1) : null);

  if (!currentMonth || !calendarData) {
    return <div className="h-full w-full animate-pulse bg-muted/20 rounded-[4px]" />;
  }

  const { monthStart, days } = calendarData;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-foreground/80">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <button 
            className="h-6 w-6 flex items-center justify-center text-muted-foreground/30 hover:text-primary hover:bg-primary/5 rounded-[4px] transition-all" 
            onClick={prevMonth}
          >
            <ChevronLeft size={12} />
          </button>
          <button 
            className="h-6 w-6 flex items-center justify-center text-muted-foreground/30 hover:text-primary hover:bg-primary/5 rounded-[4px] transition-all" 
            onClick={nextMonth}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-[8px] font-black text-muted-foreground/20 text-center mb-2 tracking-widest">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const isToday = today && isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-[4px] text-[9px] relative group cursor-pointer border border-transparent transition-all duration-200",
                !isCurrentMonth && "text-muted-foreground/10",
                isToday 
                  ? "bg-primary text-primary-foreground font-black shadow-sm" 
                  : "hover:bg-muted/30 text-foreground/60 hover:text-foreground hover:border-border/50",
              )}
            >
              {format(day, 'd')}
              {isToday && <div className="absolute bottom-1 h-0.5 w-0.5 bg-primary-foreground/40 rounded-full" />}
              {idx % 11 === 0 && isCurrentMonth && !isToday && (
                <div className="absolute top-1 right-1 h-1 w-1 bg-primary/30 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/10 flex items-center justify-between px-1">
         <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
            <span className="text-[7px] uppercase font-black text-muted-foreground/30 tracking-[0.2em]">Live Calendar</span>
         </div>
         <span className="text-[7px] font-black text-primary/40 uppercase tracking-widest">
            {format(today || new Date(), 'EEE, MMM d')}
         </span>
      </div>

      <div className="mt-4 pt-3 border-t border-border/10">
         <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Next Event</span>
            <span className="text-primary hover:underline cursor-pointer">View</span>
         </div>
         <div className="mt-2 flex items-center gap-2 p-2 bg-muted/20 rounded-[4px] border border-border">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold truncate tracking-tight text-foreground/80">Strategy Sync</span>
            <span className="text-[9px] text-muted-foreground/50 ml-auto font-medium">10:00 AM</span>
         </div>
      </div>
    </div>
  );
}
