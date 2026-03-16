'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, GripVertical, Settings2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [widgets, setWidgets] = useState([
    { id: 'tasks', type: 'Tasks', size: 'medium' },
    { id: 'notes', type: 'Notes', size: 'medium' },
    { id: 'calendar', type: 'Calendar', size: 'large' },
    { id: 'habits', type: 'Habits', size: 'small' },
    { id: 'weather', type: 'Weather', size: 'small' },
    { id: 'focus', type: 'Focus Timer', size: 'small' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Personal Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
            <Plus size={16} />
            <span>Add Widget</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings2 size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
        {widgets.map((widget) => (
          <Card 
            key={widget.id} 
            className={`bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative group overflow-hidden ${
              widget.size === 'medium' ? 'col-span-1 md:col-span-2 row-span-2' : 
              widget.size === 'large' ? 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2' : 
              'col-span-1 row-span-1'
            }`}
          >
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                  <GripVertical size={14} />
                </div>
                {widget.type}
              </CardTitle>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                  <Settings2 size={12} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <X size={12} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 h-full">
               <div className="flex items-center justify-center h-full border-2 border-dashed border-border/50 rounded-lg text-muted-foreground/50 text-xs font-mono">
                  {widget.type} Content
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
