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
  subMonths,
  isAfter,
} from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import useEventStore from '@/store/useEventStore';

export default function CalendarWidget() {
  const { events, fetchEvents } = useEventStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return {
      monthStart,
      days: eachDayOfInterval({ start: startDate, end: endDate })
    };
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => isAfter(new Date(e.date), now) || isSameDay(new Date(e.date), now))
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [events]);

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
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          
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
              {dayEvents.length > 0 && !isToday && (
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
            {format(today, 'EEE, MMM d')}
         </span>
      </div>

      <div className="mt-4 pt-3 border-t border-border/10">
         <div className="flex items-center justify-between text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.2em]">
            <span>Next Operation</span>
            <span className="text-primary/40 hover:text-primary cursor-pointer transition-colors">Registry</span>
         </div>
         {nextEvent ? (
            <div className="mt-2 flex items-center gap-3 p-2.5 bg-muted/10 rounded-[4px] border border-border/50 group hover:border-primary/20 transition-all">
               <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black truncate tracking-tight text-foreground/80 uppercase">{nextEvent.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 opacity-40">
                     <MapPin size={8} />
                     <span className="text-[8px] font-black uppercase tracking-widest truncate">{nextEvent.location || "Sector Unknown"}</span>
                  </div>
               </div>
               <span className="text-[9px] font-black text-primary/60 ml-auto tabular-nums">{nextEvent.startTime || "00:00"}</span>
            </div>
         ) : (
            <div className="mt-2 p-2.5 bg-muted/5 rounded-[4px] border border-dashed border-border/50 text-center">
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">No Operations Scheduled</span>
            </div>
         )}
      </div>
    </div>
  );
}
