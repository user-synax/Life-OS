'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GripVertical, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useWidgetStore from '@/store/useWidgetStore';

export default function WidgetCard({ widget, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: widget._id });

  const { removeWidget } = useWidgetStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getWidgetSizeClass = (size) => {
    const { w, h } = size || { w: 1, h: 1 };
    let classes = '';
    if (w === 2) classes += ' md:col-span-2';
    if (w === 3) classes += ' lg:col-span-3';
    if (w === 4) classes += ' xl:col-span-4';
    if (h === 2) classes += ' row-span-2';
    return classes;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex flex-col overflow-hidden bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300',
        getWidgetSizeClass(widget.size),
        (isDragging || isSortableDragging) && 'opacity-50 z-50 ring-2 ring-primary border-primary',
      )}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b border-border/30 bg-sidebar/50 backdrop-blur-sm">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-primary transition-colors p-1 rounded hover:bg-sidebar"
          >
            <GripVertical size={14} />
          </div>
          {widget.widgetType}
        </CardTitle>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
            <Settings2 size={12} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeWidget(widget._id)}
          >
            <X size={12} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4 flex-1 overflow-hidden flex items-center justify-center">
        {/* Widget Content will go here */}
        <div className="flex flex-col items-center gap-2 text-center">
           <div className="text-xs font-mono text-muted-foreground/50 italic">
              {widget.widgetType.toUpperCase()}
           </div>
           <div className="text-[10px] text-muted-foreground/30">
              Widget implementation pending
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
