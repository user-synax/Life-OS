'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MoreVertical,
  Search
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(null);
  const [today, setToday] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now);
    setToday(now);
    setSelectedDate(now);
  }, []);

  useEffect(() => {
    if (currentMonth && calendarRef.current) {
      gsap.fromTo(
        calendarRef.current.querySelectorAll('.calendar-day'),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: { each: 0.01, from: 'center' }, ease: 'power2.out' }
      );
    }
  }, [currentMonth]);

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

  if (!currentMonth || !calendarData) {
    return <div className="h-full w-full animate-pulse bg-sidebar/20 rounded-3xl" />;
  }

  const { monthStart, days } = calendarData;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your upcoming events.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 font-bold uppercase tracking-widest h-10 gap-2">
              <Plus size={20} />
              <span>Add Event</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
         <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
            <CardHeader className="p-8 border-b border-border/50 bg-sidebar/20 flex flex-row items-center justify-between space-y-0">
               <div className="flex flex-col">
                  <h2 className="text-2xl font-black tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-[0.3em] mt-1">Global Schedule</span>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-card" onClick={prevMonth}>
                     <ChevronLeft size={20} />
                  </Button>
                  <Button variant="outline" className="h-10 rounded-xl border-border bg-card font-bold uppercase tracking-widest text-[10px]" onClick={() => setCurrentMonth(new Date())}>
                     Today
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-card" onClick={nextMonth}>
                     <ChevronRight size={20} />
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-7 border-b border-border/50 bg-sidebar/10">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                     <div key={day} className="p-4 text-center">
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">{day.slice(0, 3)}</span>
                     </div>
                  ))}
               </div>
               <div ref={calendarRef} className="grid grid-cols-7 auto-rows-[120px]">
                  {days.map((day, idx) => {
                     const isCurrentMonth = isSameMonth(day, monthStart);
                     const isToday = today && isSameDay(day, today);
                     const isSelected = selectedDate && isSameDay(day, selectedDate);
                     
                     return (
                        <div 
                           key={day.toString()}
                           onClick={() => setSelectedDate(day)}
                           className={cn(
                              "calendar-day relative p-4 border-r border-b border-border/30 cursor-pointer transition-all duration-300 group",
                              !isCurrentMonth && "bg-sidebar/5 opacity-30",
                              isSelected && "bg-primary/[0.03]",
                              "hover:bg-primary/[0.05]"
                           )}
                        >
                           <div className="flex items-center justify-between">
                              <span className={cn(
                                 "text-sm font-black h-8 w-8 flex items-center justify-center rounded-xl transition-all",
                                 isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-foreground group-hover:text-primary",
                                 isSelected && !isToday && "ring-2 ring-primary/50"
                              )}>
                                 {format(day, 'd')}
                              </span>
                           </div>
                           
                           <div className="mt-2 space-y-1">
                              {/* Mock events */}
                              {idx % 7 === 2 && isCurrentMonth && (
                                 <div className="text-[8px] font-bold uppercase tracking-tighter bg-primary/10 text-primary p-1 rounded-md border border-primary/20 truncate">
                                    Product Launch
                                 </div>
                              )}
                              {idx % 10 === 0 && isCurrentMonth && (
                                 <div className="text-[8px] font-bold uppercase tracking-tighter bg-orange-500/10 text-orange-500 p-1 rounded-md border border-orange-500/20 truncate">
                                    Team Dinner
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </CardContent>
         </Card>

         <aside className="space-y-6">
            <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
               <CardHeader className="p-6 border-b border-border/50 bg-sidebar/20">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50">Events for {format(selectedDate || new Date(), 'MMM d')}</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                     <div className="p-6 space-y-4">
                        <div className="group relative pl-4 border-l-4 border-primary bg-sidebar/30 p-4 rounded-2xl transition-all hover:bg-sidebar/50">
                           <h4 className="text-sm font-black tracking-tight">Strategy Sync</h4>
                           <div className="flex items-center gap-3 mt-2 text-muted-foreground/60">
                              <div className="flex items-center gap-1">
                                 <Clock size={12} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">10:00 AM</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <MapPin size={12} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Zoom</span>
                              </div>
                           </div>
                        </div>
                        <div className="group relative pl-4 border-l-4 border-orange-500 bg-sidebar/30 p-4 rounded-2xl transition-all hover:bg-sidebar/50">
                           <h4 className="text-sm font-black tracking-tight">Design Review</h4>
                           <div className="flex items-center gap-3 mt-2 text-muted-foreground/60">
                              <div className="flex items-center gap-1">
                                 <Clock size={12} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">02:30 PM</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <MapPin size={12} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Studio B</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-20">
                           <CalendarIcon size={40} className="mb-4" />
                           <p className="text-xs font-bold uppercase tracking-widest">No more events</p>
                        </div>
                     </div>
                  </ScrollArea>
               </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-3xl p-6 shadow-xl shadow-primary/5">
               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-4">Quick Search</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input placeholder="Find events..." className="pl-10 bg-sidebar/50 border-border rounded-xl h-11" />
               </div>
            </Card>
         </aside>
      </div>
    </div>
  );
}
