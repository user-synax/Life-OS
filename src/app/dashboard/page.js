'use client';

import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetGrid from '@/components/widgets/WidgetGrid';
import useWidgetStore from '@/store/useWidgetStore';

export default function DashboardPage() {
  const { addWidget } = useWidgetStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back to your Life OS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-border hover:bg-muted rounded-[4px] h-9"
            onClick={() => addWidget('tasks')}
          >
            <Plus size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Add Widget</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-[4px] h-9 w-9">
            <Settings2 size={18} />
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <WidgetGrid />
      </div>
    </div>
  );
}
