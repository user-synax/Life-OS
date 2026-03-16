'use client';

import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetGrid from '@/components/widgets/WidgetGrid';
import WidgetSelector from '@/components/widgets/WidgetSelector';
import useWidgetStore from '@/store/useWidgetStore';

export default function DashboardPage() {
  const { addWidget } = useWidgetStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-widest opacity-50">
            Welcome back to your Life OS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WidgetSelector>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-border/50 bg-muted/10 hover:bg-muted/20 hover:border-primary/20 rounded-[4px] h-10 sm:h-9 text-[10px] font-black uppercase tracking-[0.2em] px-6 transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>Manage Widgets</span>
            </Button>
          </WidgetSelector>
        </div>
      </div>

      <div className="mt-6">
        <WidgetGrid />
      </div>
    </div>
  );
}
