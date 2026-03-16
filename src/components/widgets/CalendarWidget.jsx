'use client';

import { useState, useEffect } from 'react';
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm font-bold tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={prevMonth}>
            <ChevronLeft size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={nextMonth}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-[10px] font-bold text-muted-foreground/50 text-center mb-1">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const isToday = today && isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] transition-all duration-300 relative group cursor-pointer",
                !isCurrentMonth && "text-muted-foreground/20",
                isToday ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "hover:bg-sidebar/50 text-foreground/80",
              )}
            >
              {format(day, 'd')}
              {/* Event indicators */}
              {isToday && <div className="absolute bottom-1 h-1 w-1 bg-primary-foreground rounded-full" />}
              {idx % 7 === 3 && isCurrentMonth && !isToday && <div className="absolute bottom-1 h-1 w-1 bg-primary/40 rounded-full" />}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
         <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Upcoming Events</span>
            <span className="text-primary hover:underline cursor-pointer">View All</span>
         </div>
         <div className="mt-2 flex items-center gap-2 p-2 bg-sidebar/30 rounded-lg border border-border/20">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-medium truncate">Product Team Sync</span>
            <span className="text-[10px] text-muted-foreground/50 ml-auto">2:00 PM</span>
         </div>
      </div>
    </div>
  );
}
