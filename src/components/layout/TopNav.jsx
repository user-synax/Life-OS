"use client";

import { useState } from "react";
import {
    Bell,
    Search,
    Plus,
    User,
    Menu,
    CheckSquare,
    StickyNote,
    Calendar,
    Activity,
    Bookmark,
    Timer,
    LayoutGrid,
    Command as CommandIcon,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/store/useAuthStore";
import useNotificationStore from "@/store/useNotificationStore";
import NotificationPanel from "@/components/notifications/NotificationPanel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";
import { useRouter } from "next/navigation";

export default function TopNav({ onMenuClick }) {
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const unreadCount = useNotificationStore((state) => state.unreadCount);
    const router = useRouter();
    const { setWidgetSelectorOpen, setCommandPaletteOpen, openCreateModal } =
        useUIStore();

    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#2e2e2e] bg-[#171717]/95 backdrop-blur supports-[backdrop-filter]:bg-[#171717]/60 px-4 md:px-8">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9 text-[#898989] hover:bg-[#0f0f0f]"
                    onClick={onMenuClick}
                >
                    <Menu size={20} />
                </Button>

                <div className="relative w-full max-w-md group hidden md:block">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]"
                        size={14}
                    />
                    <input
                        type="search"
                        placeholder="Search... (Cmd+K)"
                        className="w-full pl-9 pr-4 bg-[#0f0f0f] border-none focus:ring-1 focus:ring-[#3ecf8e] h-9 text-sm rounded-md transition-all placeholder:text-[#898989] outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="default"
                                size="default"
                                className="hidden sm:flex gap-2 h-9 rounded-[9999px]"
                            >
                                <Plus size={16} />
                                <span className="text-sm font-medium">New</span>
                            </Button>
                        }
                    />
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => openCreateModal("task")}
                        >
                            <CheckSquare size={14} className="mr-2" />
                            <span>Task</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => openCreateModal("note")}
                        >
                            <StickyNote size={14} className="mr-2" />
                            <span>Note</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => openCreateModal("event")}
                        >
                            <Calendar size={14} className="mr-2" />
                            <span>Event</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-px bg-[#2e2e2e] hidden md:block" />

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 text-[#898989] hover:bg-[#0f0f0f] rounded-md transition-all"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-[#3ecf8e]" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[#0f0f0f] transition-all outline-none">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="bg-[#3ecf8e]/10 text-[#3ecf8e] text-xs font-medium">
                                            {user?.name
                                                ?.substring(0, 2)
                                                .toUpperCase() || "OS"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            }
                        />
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs leading-none text-[#898989]">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() =>
                                    router.push("/dashboard/profile")
                                }
                            >
                                <User size={14} className="mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={logout}
                                className="text-[#ef4444] focus:text-[#ef4444]"
                            >
                                <LogOut size={14} className="mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <NotificationPanel
                open={showNotifications}
                setOpen={setShowNotifications}
            />
        </header>
    );
}
