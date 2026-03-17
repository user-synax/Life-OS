"use client";

import { useEffect } from "react";
import {
    Plus,
    LayoutGrid,
    Activity,
    StickyNote,
    BarChart3,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import useUIStore from "@/store/useUIStore";
import useWidgetStore from "@/store/useWidgetStore";
import WidgetCard from "@/components/widgets/WidgetCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { setWidgetSelectorOpen } = useUIStore();
    const { widgets, loading, fetchWidgets } = useWidgetStore();

    useEffect(() => {
        fetchWidgets();
    }, [fetchWidgets]);

    const categorizedWidgets = {
        important: widgets.filter((w) =>
            ["analytics", "tasks", "habits", "calendar"].includes(w.widgetType),
        ),
        secondary: widgets.filter((w) =>
            ["focus", "weather", "notes"].includes(w.widgetType),
        ),
        utilities: widgets.filter((w) =>
            ["bookmarks", "quote", "quicklinks"].includes(w.widgetType),
        ),
    };

    if (loading && widgets.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[280px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background relative overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            {/* Welcome Section */}
            <div className="bg-card/30 backdrop-blur-sm border-b border-white/10 px-8 py-6 relative z-10">
                <div className="w-full flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">
                                System Online
                            </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            Welcome,{" "}
                            <span className="text-primary">
                                {user?.name?.split(" ")[0] || "Operator"}
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-background/50 border border-white/10 shadow-xl backdrop-blur-md group hover:border-primary/30 transition-all duration-500">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Activity size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">
                                    Performance
                                </p>
                                <p className="text-sm font-black tracking-tight">
                                    99.9%{" "}
                                    <span className="text-[10px] text-emerald-500 ml-1">
                                        ↑
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-background/50 border border-white/10 shadow-xl backdrop-blur-md group hover:border-blue-500/30 transition-all duration-500">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <Zap size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">
                                    Connectivity
                                </p>
                                <p className="text-sm font-black tracking-tight">
                                    Active{" "}
                                    <span className="text-[10px] text-blue-500 ml-1">
                                        ●
                                    </span>
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="rounded-xl h-12 px-6 gap-3 border-white/10 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-xl backdrop-blur-md text-[11px] font-black uppercase tracking-widest group"
                            onClick={() => setWidgetSelectorOpen(true)}
                        >
                            <LayoutGrid
                                size={16}
                                className="text-primary group-hover:rotate-90 transition-transform duration-500"
                            />
                            <span>Customize OS</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-12 relative z-10">
                {/* Important Group */}
                {categorizedWidgets.important.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                                <BarChart3 size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight uppercase">
                                    Core Operations
                                </h2>
                                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
                                    Primary System Modules
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[300px] grid-flow-dense">
                            {categorizedWidgets.important.map((widget) => (
                                <WidgetCard key={widget._id} widget={widget} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Secondary Group */}
                {categorizedWidgets.secondary.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                <Activity size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight uppercase">
                                    Support Systems
                                </h2>
                                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
                                    Auxiliary Functions
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[300px] grid-flow-dense">
                            {categorizedWidgets.secondary.map((widget) => (
                                <WidgetCard key={widget._id} widget={widget} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Utilities Group */}
                {categorizedWidgets.utilities.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/10">
                                <StickyNote
                                    size={20}
                                    className="text-orange-500"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight uppercase">
                                    Registry Utils
                                </h2>
                                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
                                    General Utility Modules
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[300px] grid-flow-dense">
                            {categorizedWidgets.utilities.map((widget) => (
                                <WidgetCard key={widget._id} widget={widget} />
                            ))}
                        </div>
                    </section>
                )}

                {widgets.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-card/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
                        <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-2xl shadow-primary/5">
                            <LayoutGrid
                                size={40}
                                className="text-primary opacity-40 animate-pulse"
                            />
                        </div>
                        <div className="max-w-md space-y-3">
                            <h2 className="text-2xl font-black uppercase tracking-tight">
                                Workstation Empty
                            </h2>
                            <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em] opacity-60">
                                Initialize your terminal by adding modules from
                                the registry.
                            </p>
                        </div>
                        <Button
                            className="rounded-xl h-12 px-8 gap-3 shadow-2xl shadow-primary/20 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 transition-all"
                            onClick={() => setWidgetSelectorOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Deploy Modules</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}