"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import TaskWidget from "@/components/widgets/TaskWidget";
import NotesWidget from "@/components/widgets/NotesWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import HabitWidget from "@/components/widgets/HabitWidget";
import BookmarkWidget from "@/components/widgets/BookmarkWidget";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Minimal Header with Greeting */}
            <div className="border-b border-[#2e2e2e] px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
                            Hello, <span className="text-[#3ecf8e]">{user?.name?.split(" ")[0] || "Operator"}</span>
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[#898989]">
                            <span className="text-[1rem] font-medium">{formatDate(currentTime)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-[1.25rem] font-medium font-mono">{formatTime(currentTime)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-[minmax(400px,1fr)]">
                    <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6 h-full min-h-[400px]">
                        <TaskWidget />
                    </Card>
                    <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6 h-full min-h-[400px]">
                        <NotesWidget />
                    </Card>
                    <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6 h-full min-h-[400px]">
                        <CalendarWidget />
                    </Card>
                    <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6 h-full min-h-[400px]">
                        <HabitWidget />
                    </Card>
                    <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6 h-full min-h-[400px]">
                        <BookmarkWidget />
                    </Card>
                </div>
            </div>
        </div>
    );
}