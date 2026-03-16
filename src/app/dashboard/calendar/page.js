"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    MoreVertical,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(null);
    const [today, setToday] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const now = new Date();
        // Move initialization to useState initializers to avoid synchronous setState in effect
        // Removed synchronous setState; now initialized via useState initializer
        // Initialize selectedDate via useState initializer instead
    }, []);

    const calendarData = useMemo(() => {
        if (!currentMonth) return null;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return {
            monthStart,
            days: eachDayOfInterval({ start: startDate, end: endDate }),
        };
    }, [currentMonth]);

    if (!currentMonth || !calendarData) {
        return (
            <div className="h-full w-full animate-pulse bg-muted/20 rounded-[4px]" />
        );
    }

    const { monthStart, days } = calendarData;

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Calendar
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Schedule and manage your events.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-4 font-bold uppercase tracking-wider h-9 gap-2 text-[10px]"
                        onClick={() =>
                            router.push("/dashboard/calendar/add-event")
                        }
                    >
                        <Plus size={16} />
                        <span>Add Event</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <Card className="bg-card border-border rounded-[4px] overflow-hidden shadow-sm">
                    <CardHeader className="p-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold tracking-tight">
                                {format(currentMonth, "MMMM yyyy")}
                            </h2>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                                Schedule
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-[4px] border-border bg-background"
                                onClick={prevMonth}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-[4px] border-border bg-background font-bold uppercase tracking-wider text-[9px] px-3"
                                onClick={() => setCurrentMonth(new Date())}
                            >
                                Today
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-[4px] border-border bg-background"
                                onClick={nextMonth}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-7 border-b border-border bg-muted/10">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div key={day} className="p-3 text-center">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                                        {day}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-[100px]">
                            {days.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(
                                    day,
                                    monthStart,
                                );
                                const isToday = today && isSameDay(day, today);
                                const isSelected =
                                    selectedDate &&
                                    isSameDay(day, selectedDate);

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "relative p-2 border-r border-b border-border transition-colors cursor-pointer",
                                            !isCurrentMonth &&
                                                "bg-muted/5 opacity-30",
                                            isSelected && "bg-primary/5",
                                            "hover:bg-muted/10",
                                        )}
                                    >
                                        <div className="flex items-center justify-start">
                                            <span
                                                className={cn(
                                                    "text-xs font-bold h-6 w-6 flex items-center justify-center rounded-[4px]",
                                                    isToday
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-foreground",
                                                    isSelected &&
                                                        !isToday &&
                                                        "border border-primary text-primary",
                                                )}
                                            >
                                                {format(day, "d")}
                                            </span>
                                        </div>

                                        <div className="mt-1 space-y-1 overflow-hidden">
                                            {idx % 7 === 2 &&
                                                isCurrentMonth && (
                                                    <div className="text-[8px] font-bold uppercase tracking-tight bg-primary/10 text-primary px-1 py-0.5 rounded-[2px] border border-primary/20 truncate">
                                                        Launch
                                                    </div>
                                                )}
                                            {idx % 10 === 0 &&
                                                isCurrentMonth && (
                                                    <div className="text-[8px] font-bold uppercase tracking-tight bg-orange-500/10 text-orange-500 px-1 py-0.5 rounded-[2px] border border-orange-500/20 truncate">
                                                        Dinner
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
                    <Card className="bg-card border-border rounded-[4px] overflow-hidden shadow-sm">
                        <CardHeader className="p-4 border-b border-border bg-muted/20">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                Events •{" "}
                                {format(selectedDate || new Date(), "MMM d")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px]">
                                <div className="p-4 space-y-3">
                                    <div className="group relative pl-3 border-l-2 border-primary bg-muted/10 p-3 rounded-[4px] transition-colors hover:bg-muted/20">
                                        <h4 className="text-xs font-bold tracking-tight">
                                            Strategy Sync
                                        </h4>
                                        <div className="flex flex-col gap-1 mt-2 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={10} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                                    10:00 AM
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={10} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                                    Zoom
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group relative pl-3 border-l-2 border-orange-500 bg-muted/10 p-3 rounded-[4px] transition-colors hover:bg-muted/20">
                                        <h4 className="text-xs font-bold tracking-tight">
                                            Design Review
                                        </h4>
                                        <div className="flex flex-col gap-1 mt-2 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={10} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                                    02:30 PM
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={10} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                                    Studio B
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-8 text-center opacity-20">
                                        <CalendarIcon
                                            size={32}
                                            className="mb-2"
                                        />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">
                                            End of events
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border rounded-[4px] p-4 shadow-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">
                            Quick Search
                        </h3>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={14}
                            />
                            <Input
                                placeholder="Find events..."
                                className="pl-9 bg-muted/30 border-border rounded-[4px] h-9 text-xs"
                            />
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
