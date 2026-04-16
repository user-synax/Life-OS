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
        <div className="w-full min-h-screen bg-background">
            <div className="border-b border-[#2e2e2e] px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
                            Calendar
                        </h1>
                        <p className="text-[#898989] mt-1 text-[1rem] font-medium">Schedule and manage your events.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="bg-[#0f0f0f] p-1 rounded-[9999px] border border-[#2e2e2e] flex items-center gap-1">
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
                                        "h-9 rounded-[9999px] text-[12px] font-medium px-4",
                                        view === v.id ? "bg-[#3ecf8e] text-[#0a0a0a]" : "text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]"
                                    )}
                                    onClick={() => setView(v.id)}
                                >
                                    <v.icon size={14} className="mr-2" />
                                    {v.label}
                                </Button>
                            ))}
                        </div>
                        <Button
                            size="default"
                            className="flex-1 sm:flex-none bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] px-8 font-medium h-11 gap-2 transition-all"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add Event</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] overflow-hidden flex flex-col min-h-[600px]">
                    <CardHeader className="p-5 sm:p-6 border-b border-[#2e2e2e] bg-[#171717]/30 flex flex-row items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <h2 className="text-[1.25rem] font-medium tracking-tight text-[#fafafa]">
                                {view === "day" 
                                    ? format(currentDate, "MMMM d, yyyy")
                                    : format(currentDate, "MMMM yyyy")}
                            </h2>
                            <span className="text-[12px] font-medium text-[#3ecf8e]/60 uppercase tracking-wider mt-1">
                                {view} View Active
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-[9999px] border border-[#2e2e2e] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717] transition-colors"
                                onClick={() => navigate("prev")}
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 rounded-[9999px] border border-[#2e2e2e] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717] font-medium uppercase tracking-wider text-[12px] px-4 transition-colors"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-[9999px] border border-[#2e2e2e] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717] transition-colors"
                                onClick={() => navigate("next")}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="grid grid-cols-7 border-b border-[#2e2e2e] bg-[#171717]/30">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="p-4 text-center">
                                    <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">
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
                                            "relative p-3 sm:p-4 border-r border-b border-[#2e2e2e]/30 transition-all cursor-pointer min-h-[120px] group",
                                            !isCurrentMonth && view === "month" && "bg-[#171717]/20 opacity-40",
                                            isSelected && "bg-[#3ecf8e]/5",
                                            "hover:bg-[#171717]/30"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className={cn(
                                                    "text-[14px] font-medium h-8 w-8 flex items-center justify-center rounded-[9999px] transition-all",
                                                    isToday
                                                        ? "bg-[#3ecf8e] text-[#0a0a0a]"
                                                        : "text-[#fafafa]/60",
                                                    isSelected && !isToday && "border border-[#3ecf8e]/30 text-[#3ecf8e] bg-[#3ecf8e]/5"
                                                )}
                                            >
                                                {format(day, "d")}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="h-2 w-2 rounded-full bg-[#3ecf8e]/40 group-hover:bg-[#3ecf8e] transition-colors" />
                                            )}
                                        </div>

                                        <div className="space-y-1.5 max-h-[70px] overflow-hidden">
                                            {dayEvents.slice(0, 2).map((event, eIdx) => (
                                                <div 
                                                    key={event._id}
                                                    className="text-[12px] font-medium uppercase tracking-tight bg-[#3ecf8e]/5 text-[#3ecf8e]/80 px-2 py-1 rounded-[9999px] border border-[#3ecf8e]/20 truncate"
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-[12px] font-medium uppercase tracking-wider text-[#898989]/40 pl-1">
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
                    <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] overflow-hidden flex flex-col h-[600px]">
                        <CardHeader className="p-5 border-b border-[#2e2e2e] bg-[#171717]/30 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#3ecf8e]/60">
                                    Daily Briefing
                                </CardTitle>
                                <p className="text-[1.5rem] font-medium uppercase tracking-tight mt-1 text-[#fafafa]">
                                    {format(selectedDate, "MMM d")}
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-[9999px] border border-[#2e2e2e] text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5"
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
                                            <CalendarIcon size={48} className="mb-4" />
                                            <p className="text-[14px] font-medium uppercase tracking-[0.2em]">No Events Found</p>
                                        </div>
                                    ) : (
                                        selectedDateEvents.map((event) => (
                                            <div 
                                                key={event._id}
                                                className="group relative pl-4 border-l-2 border-[#3ecf8e]/30 bg-[#171717]/50 p-4 rounded-[8px] transition-all hover:bg-[#171717] border border-transparent hover:border-[#2e2e2e]"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-[14px] font-medium uppercase tracking-tight group-hover:text-[#3ecf8e] transition-colors text-[#fafafa]">
                                                        {event.title}
                                                    </h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={
                                                            <button className="h-8 w-8 flex items-center justify-center rounded-[9999px] text-[#898989]/20 hover:text-[#fafafa] hover:bg-[#171717] transition-colors outline-none">
                                                                <MoreVertical size={14} />
                                                            </button>
                                                        } />
                                                        <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-[#2e2e2e] p-1 rounded-[8px] min-w-40">
                                                            <DropdownMenuItem 
                                                                className="text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] rounded-[6px] text-[14px] font-medium p-2.5 cursor-pointer"
                                                                onSelect={() => handleDeleteEvent(event._id)}
                                                            >
                                                                <Trash2 size={14} className="mr-2" />
                                                                Delete Event
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-3">
                                                    <div className="flex items-center gap-2 text-[#898989]/40">
                                                        <Clock size={14} />
                                                        <span className="text-[12px] font-medium uppercase tracking-wider">
                                                            {event.startTime || "All Day"}
                                                        </span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-2 text-[#898989]/40">
                                                            <MapPin size={14} />
                                                            <span className="text-[12px] font-medium uppercase tracking-wider truncate">
                                                                {event.location}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {event.description && (
                                                    <p className="mt-3 text-[12px] text-[#898989]/50 leading-relaxed font-medium">
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

                    <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] p-5">
                        <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] mb-4 flex items-center gap-2">
                            <Search size={14} />
                            Search Registry
                        </h3>
                        <div className="relative group">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]/20 group-focus-within:text-[#3ecf8e] transition-colors"
                                size={16}
                            />
                            <Input
                                placeholder="Find events..."
                                className="pl-10 bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-11 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </Card>
                </aside>
                </div>
            </div>

            {/* Add Event Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-full sm:max-w-lg bg-[#0f0f0f] border-[#2e2e2e] p-0 overflow-hidden rounded-[8px] transition-all duration-500">
                    <DialogHeader className="p-6 sm:p-8 border-b border-[#2e2e2e] bg-[#3ecf8e]/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-[9999px] bg-[#3ecf8e]/10 flex items-center justify-center text-[#3ecf8e] shrink-0">
                                <Plus size={24} />
                            </div>
                            <div>
                                <DialogTitle className="text-[1.5rem] font-normal tracking-tight text-[#fafafa]/90 leading-tight">Add Registry Entry</DialogTitle>
                                <p className="text-[12px] font-medium text-[#3ecf8e]/40 uppercase tracking-wider mt-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                                    {format(selectedDate, "MMMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddEvent}>
                        <div className="p-6 sm:p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Entry Title</label>
                                <Input 
                                    autoFocus
                                    placeholder="Operation Name..." 
                                    className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Timestamp</label>
                                    <Input 
                                        type="time"
                                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Location Alias</label>
                                    <Input 
                                        placeholder="Sector..." 
                                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Mission Details</label>
                                <textarea 
                                    placeholder="Protocol notes..." 
                                    className="w-full bg-[#171717]/50 border border-[#2e2e2e] rounded-[6px] p-4 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all outline-none min-h-[120px] resize-none"
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="p-6 sm:p-8 bg-[#0f0f0f] border-t border-[#2e2e2e] flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button 
                                type="button"
                                variant="ghost" 
                                onClick={() => setIsAddModalOpen(false)} 
                                className="w-full sm:flex-1 h-12 rounded-[6px] text-[14px] font-medium text-[#898989]/30 hover:text-[#fafafa] transition-all border border-transparent hover:border-[#2e2e2e]/50"
                            >
                                Abort
                            </Button>
                            <Button 
                                type="submit"
                                className="w-full sm:flex-1 h-12 bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] text-[14px] font-medium transition-all"
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
