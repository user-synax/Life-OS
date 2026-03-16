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
        <span className="text-xs font-bold tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground rounded-[4px]" onClick={prevMonth}>
            <ChevronLeft size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground rounded-[4px]" onClick={nextMonth}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-[10px] font-bold text-muted-foreground/40 text-center mb-1">
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
                "aspect-square flex flex-col items-center justify-center rounded-[4px] text-[10px] relative group cursor-pointer border border-transparent transition-colors",
                !isCurrentMonth && "text-muted-foreground/20",
                isToday ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted/50 text-foreground/80",
              )}
            >
              {format(day, 'd')}
              {isToday && <div className="absolute bottom-1 h-0.5 w-0.5 bg-primary-foreground rounded-full" />}
              {idx % 7 === 3 && isCurrentMonth && !isToday && <div className="absolute bottom-1 h-0.5 w-0.5 bg-primary/40 rounded-full" />}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
         <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Next Event</span>
            <span className="text-primary hover:underline cursor-pointer">View</span>
         </div>
         <div className="mt-2 flex items-center gap-2 p-2 bg-muted/20 rounded-[4px] border border-border">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold truncate tracking-tight">Strategy Sync</span>
            <span className="text-[9px] text-muted-foreground/50 ml-auto">10:00 AM</span>
         </div>
      </div>
    </div>
  );
}
