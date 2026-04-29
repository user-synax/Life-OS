'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useWidgetStore from '@/store/useWidgetStore';
import TaskWidget from './TaskWidget';
import NotesWidget from './NotesWidget';
import HabitWidget from './HabitWidget';
import WeatherWidget from './WeatherWidget';
import FocusTimerWidget from './FocusTimerWidget';
import BookmarkWidget from './BookmarkWidget';
import CalendarWidget from './CalendarWidget';
import QuoteWidget from './QuoteWidget';
import QuickLinksWidget from './QuickLinksWidget';

export default function WidgetCard({ widget }) {
  const { removeWidget } = useWidgetStore();

  const getWidgetSizeClass = (size) => {
    const { w, h } = size || { w: 1, h: 1 };
    let classes = '';
    
    // Width classes
    if (w === 2) classes += ' sm:col-span-2';
    if (w === 3) classes += ' lg:col-span-3';
    if (w === 4) classes += ' xl:col-span-4';
    
    // Height classes
    if (h === 2) classes += ' row-span-2';
    if (h === 3) classes += ' row-span-3';
    
    return classes;
  };

  const renderWidgetContent = () => {
    switch (widget.widgetType) {
      case 'tasks':
        return <TaskWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'habits':
        return <HabitWidget />;
      case 'weather':
        return <WeatherWidget />;
      case 'focus':
        return <FocusTimerWidget />;
      case 'bookmarks':
        return <BookmarkWidget />;
      case 'calendar':
        return <CalendarWidget />;
      case 'quote':
        return <QuoteWidget />;
      case 'quicklinks':
        return <QuickLinksWidget />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
              {widget.widgetType}
            </div>
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        'group relative flex flex-col overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl h-full transition-all duration-500 hover:border-primary/40 hover:shadow-primary/5 hover:-translate-y-1',
        getWidgetSizeClass(widget.size)
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b border-white/5 bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-3">
           <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:animate-pulse transition-all duration-500" />
           <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-foreground transition-colors duration-500">
             {widget.widgetType}
           </CardTitle>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
            <Settings2 size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" onClick={() => removeWidget(widget._id)}>
            <X size={14} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-1 overflow-auto relative z-10 scrollbar-hide">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}
