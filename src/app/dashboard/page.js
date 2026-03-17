'use client';

import { useEffect } from 'react';
import { Plus, LayoutGrid, Activity, StickyNote, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import useUIStore from '@/store/useUIStore';
import useWidgetStore from '@/store/useWidgetStore';
import WidgetCard from '@/components/widgets/WidgetCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { setWidgetSelectorOpen } = useUIStore();
  const { widgets, loading, fetchWidgets } = useWidgetStore();

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const categorizedWidgets = {
    important: widgets.filter(w => ['analytics', 'tasks', 'habits', 'calendar'].includes(w.widgetType)),
    secondary: widgets.filter(w => ['focus', 'weather', 'notes'].includes(w.widgetType)),
    utilities: widgets.filter(w => ['bookmarks', 'quote', 'quicklinks'].includes(w.widgetType))
  };

  if (loading && widgets.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[280px] rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Operator'}</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-70">
            System Status: <span className="text-emerald-500 font-bold">Optimal</span> • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Uptime</p>
              <p className="text-sm font-bold">99.9%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Sync</p>
              <p className="text-sm font-bold">Active</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="rounded-xl h-12 px-6 gap-2 border-border/50 hover:bg-accent transition-all shadow-sm ml-auto"
            onClick={() => setWidgetSelectorOpen(true)}
          >
            <LayoutGrid size={16} className="text-primary" />
            <span className="text-sm font-semibold">Registry Config</span>
          </Button>
        </div>
      </div>

      {/* Important Group */}
      {categorizedWidgets.important.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Core Operations</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">High Priority Registry</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] grid-flow-dense">
            {categorizedWidgets.important.map((widget) => (
              <WidgetCard key={widget._id} widget={widget} />
            ))}
          </div>
        </section>
      )}

      {/* Secondary Group */}
      {categorizedWidgets.secondary.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Activity size={18} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Support Systems</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">Medium Priority Registry</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] grid-flow-dense">
            {categorizedWidgets.secondary.map((widget) => (
              <WidgetCard key={widget._id} widget={widget} />
            ))}
          </div>
        </section>
      )}

      {/* Utilities Group */}
      {categorizedWidgets.utilities.length > 0 && (
        <section className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <StickyNote size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Auxiliary Modules</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">Utility Registry</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] grid-flow-dense">
            {categorizedWidgets.utilities.map((widget) => (
              <WidgetCard key={widget._id} widget={widget} />
            ))}
          </div>
        </section>
      )}

      {widgets.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/30 rounded-3xl border-2 border-dashed border-border/50">
          <div className="p-4 rounded-full bg-primary/10">
            <LayoutGrid size={48} className="text-primary opacity-40" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-bold">Your Dashboard is Empty</h2>
            <p className="text-muted-foreground text-sm">Initialize your workstation by adding modules from the registry to monitor your progress.</p>
          </div>
          <Button 
            className="rounded-xl h-11 px-8 gap-2 shadow-lg shadow-primary/20"
            onClick={() => setWidgetSelectorOpen(true)}
          >
            <Plus size={18} />
            <span>Open Module Registry</span>
          </Button>
        </div>
      )}
    </div>
  );
}
