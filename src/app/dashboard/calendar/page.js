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
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    startOfDay,
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
    LayoutGrid,
    List as ListIcon,
    Trash2,
    CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useEventStore from "@/store/useEventStore";
import { toast } from "sonner";

export default function CalendarPage() {
    const { events, loading, fetchEvents, addEvent, removeEvent } = useEventStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, day
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Form state
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newTime, setNewTime] = useState("10:00");
    const [newLocation, setNewLocation] = useState("");

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const calendarData = useMemo(() => {
        if (view === "month") {
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart);
            const endDate = endOfWeek(monthEnd);
            return {
                start: monthStart,
                days: eachDayOfInterval({ start: startDate, end: endDate }),
            };
        } else if (view === "week") {
            const weekStart = startOfWeek(currentDate);
            const weekEnd = endOfWeek(weekStart);
            return {
                start: weekStart,
                days: eachDayOfInterval({ start: weekStart, end: weekEnd }),
            };
        } else {
            return {
                start: currentDate,
                days: [currentDate],
            };
        }
    }, [currentDate, view]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [events, search]);

    const selectedDateEvents = useMemo(() => {
        return events.filter(event => isSameDay(new Date(event.date), selectedDate));
    }, [events, selectedDate]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await addEvent({
                title: newTitle,
                description: newDesc,
                date: selectedDate,
                startTime: newTime,
                location: newLocation,
            });
            setIsAddModalOpen(false);
            setNewTitle("");
            setNewDesc("");
            setNewLocation("");
            toast.success("Event added successfully");
        } catch (error) {
            toast.error("Failed to add event");
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await removeEvent(id);
            toast.success("Event deleted");
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    const navigate = (direction) => {
        if (view === "month") {
            setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        } else if (view === "week") {
            setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
        } else {
            setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1));
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                        Calendar
                    </h1>
                    <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-widest opacity-50">
                        Schedule and manage your events.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="bg-muted/10 p-1 rounded-[4px] border border-border/50 flex items-center gap-1">
                        {[
                            { id: "month", icon: LayoutGrid, label: "Month" },
                            { id: "week", icon: ListIcon, label: "Week" },
                            { id: "day", icon: CalendarDays, label: "Day" },
                        ].map((v) => (
                            <Button
                                key={v.id}
                                variant={view === v.id ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-8 rounded-[2px] text-[9px] font-black uppercase tracking-widest px-3",
                                    view === v.id ? "bg-primary/10 text-primary" : "text-muted-foreground/40"
                                )}
                                onClick={() => setView(v.id)}
                            >
                                <v.icon size={12} className="mr-2" />
                                {v.label}
                            </Button>
                        ))}
                    </div>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-6 font-black uppercase tracking-[0.2em] h-10 sm:h-9 gap-2 text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={16} />
                        <span>Add Event</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <Card className="bg-card border-border/50 rounded-[4px] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
                    <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/5 flex flex-row items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                                {view === "day" 
                                    ? format(currentDate, "MMMM d, yyyy")
                                    : format(currentDate, "MMMM yyyy")}
                            </h2>
                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] mt-0.5">
                                {view} View Active
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-[4px] border-border/50 bg-background/50 hover:bg-muted/10 transition-colors"
                                onClick={() => navigate("prev")}
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-[4px] border-border/50 bg-background/50 font-black uppercase tracking-[0.2em] text-[10px] px-4 hover:bg-muted/10 transition-colors"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-[4px] border-border/50 bg-background/50 hover:bg-muted/10 transition-colors"
                                onClick={() => navigate("next")}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="grid grid-cols-7 border-b border-border/30 bg-muted/5">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="p-3 sm:p-4 text-center">
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                                        {day}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={cn(
                            "grid grid-cols-7 flex-1",
                            view === "month" ? "auto-rows-fr" : "auto-rows-fr"
                        )}>
                            {calendarData.days.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, calendarData.start);
                                const isToday = isSameDay(day, new Date());
                                const isSelected = isSameDay(day, selectedDate);
                                const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "relative p-2 sm:p-3 border-r border-b border-border/20 transition-all cursor-pointer min-h-[100px] group",
                                            !isCurrentMonth && view === "month" && "bg-muted/5 opacity-20",
                                            isSelected && "bg-primary/[0.03]",
                                            "hover:bg-muted/10"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={cn(
                                                    "text-[11px] font-black h-7 w-7 flex items-center justify-center rounded-[4px] transition-all",
                                                    isToday
                                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                        : "text-foreground/60",
                                                    isSelected && !isToday && "border border-primary/30 text-primary bg-primary/5"
                                                )}
                                            >
                                                {format(day, "d")}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                            )}
                                        </div>

                                        <div className="space-y-1 max-h-[60px] overflow-hidden">
                                            {dayEvents.slice(0, 2).map((event, eIdx) => (
                                                <div 
                                                    key={event._id}
                                                    className="text-[8px] font-black uppercase tracking-tight bg-primary/5 text-primary/70 px-2 py-1 rounded-[2px] border border-primary/10 truncate shadow-sm"
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/30 pl-1">
                                                    + {dayEvents.length - 2} More
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
                    <Card className="bg-card border-border/50 rounded-[4px] overflow-hidden shadow-2xl shadow-black/5 flex flex-col h-[600px]">
                        <CardHeader className="p-5 border-b border-border/30 bg-muted/5 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">
                                    Daily Briefing
                                </CardTitle>
                                <p className="text-lg font-black uppercase tracking-tight mt-1">
                                    {format(selectedDate, "MMM d")}
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-[4px] text-muted-foreground/30 hover:text-primary hover:bg-primary/5"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus size={18} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <ScrollArea className="h-full">
                                <div className="p-5 space-y-4">
                                    {selectedDateEvents.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-10">
                                            <CalendarIcon size={40} className="mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Events Found</p>
                                        </div>
                                    ) : (
                                        selectedDateEvents.map((event) => (
                                            <div 
                                                key={event._id}
                                                className="group relative pl-4 border-l-2 border-primary/30 bg-muted/5 p-4 rounded-[4px] transition-all hover:bg-muted/10 border border-transparent hover:border-border/50"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={
                                                            <button className="h-6 w-6 flex items-center justify-center rounded-[2px] text-muted-foreground/20 hover:text-foreground transition-colors outline-none">
                                                                <MoreVertical size={14} />
                                                            </button>
                                                        } />
                                                        <DropdownMenuContent align="end" className="bg-card border-border/50 p-1 rounded-[4px] shadow-xl min-w-32">
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer"
                                                                onSelect={() => handleDeleteEvent(event._id)}
                                                            >
                                                                <Trash2 size={12} className="mr-2" />
                                                                Delete Event
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-3">
                                                    <div className="flex items-center gap-2 text-muted-foreground/40">
                                                        <Clock size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">
                                                            {event.startTime || "All Day"}
                                                        </span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-2 text-muted-foreground/40">
                                                            <MapPin size={12} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest truncate">
                                                                {event.location}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {event.description && (
                                                    <p className="mt-3 text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 rounded-[4px] p-5 shadow-2xl shadow-black/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 mb-4 flex items-center gap-2">
                            <Search size={12} />
                            Search Registry
                        </h3>
                        <div className="relative group">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors"
                                size={14}
                            />
                            <Input
                                placeholder="Find events..."
                                className="pl-9 bg-muted/10 border-border/50 rounded-[4px] h-10 text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/10 focus:bg-muted/20 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </Card>
                </aside>
            </div>

            {/* Add Event Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-full sm:max-w-lg bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
                    <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                                <Plus size={24} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-foreground/90 leading-tight">Add Registry Entry</DialogTitle>
                                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                    {format(selectedDate, "MMMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddEvent}>
                        <div className="p-6 sm:p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Entry Title</label>
                                <Input 
                                    autoFocus
                                    placeholder="Operation Name..." 
                                    className="bg-muted/10 border-border/50 rounded-[4px] h-12 text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/20 focus:bg-muted/20 transition-all"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Timestamp</label>
                                    <Input 
                                        type="time"
                                        className="bg-muted/10 border-border/50 rounded-[4px] h-12 text-[11px] font-black uppercase tracking-widest focus:bg-muted/20 transition-all"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Location Alias</label>
                                    <Input 
                                        placeholder="Sector..." 
                                        className="bg-muted/10 border-border/50 rounded-[4px] h-12 text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/20 focus:bg-muted/20 transition-all"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-1">Mission Details</label>
                                <textarea 
                                    placeholder="Protocol notes..." 
                                    className="w-full bg-muted/10 border border-border/50 rounded-[4px] p-4 text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/20 focus:bg-muted/20 transition-all outline-none min-h-[100px] resize-none"
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="p-6 sm:p-8 bg-muted/5 border-t border-border/30 flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button 
                                type="button"
                                variant="ghost" 
                                onClick={() => setIsAddModalOpen(false)} 
                                className="w-full sm:flex-1 h-12 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all border border-transparent hover:border-border/50"
                            >
                                Abort
                            </Button>
                            <Button 
                                type="submit"
                                className="w-full sm:flex-1 h-12 bg-primary text-white hover:bg-primary/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                Confirm Entry
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
