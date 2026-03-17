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
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9 text-muted-foreground hover:bg-accent"
                    onClick={onMenuClick}
                >
                    <Menu size={20} />
                </Button>

                <div className="relative w-full max-w-md group hidden md:block">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={14}
                    />
                    <input
                        type="search"
                        placeholder="Search... (Cmd+K)"
                        className="w-full pl-9 pr-4 bg-muted border-none focus:ring-1 focus:ring-ring h-9 text-sm rounded-md transition-all placeholder:text-muted-foreground outline-none"
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
                                variant="outline"
                                size="sm"
                                className="hidden sm:flex gap-2 h-9 px-4 rounded-md"
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

                <div className="h-4 w-px bg-border hidden md:block" />

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 text-muted-foreground hover:bg-accent rounded-md transition-all"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-all outline-none">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
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
                                    <p className="text-xs leading-none text-muted-foreground">
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
                                className="text-destructive focus:text-destructive"
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
