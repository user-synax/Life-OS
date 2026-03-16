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
import AnalyticsWidget from './AnalyticsWidget';
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
      case 'analytics':
        return <AnalyticsWidget />;
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
        'group relative flex flex-col overflow-hidden bg-card border-border/50 rounded-[4px] shadow-sm h-full hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5',
        getWidgetSizeClass(widget.size)
      )}
    >
      <CardHeader className="p-4 py-2.5 flex flex-row items-center justify-between space-y-0 border-b border-border/30 bg-muted/5">
        <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2 group-hover:text-primary/60 transition-colors">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
          {widget.widgetType}
        </CardTitle>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/30 hover:text-primary hover:bg-primary/5 rounded-[2px] transition-colors">
            <Settings2 size={12} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-4 flex-1 overflow-hidden flex flex-col bg-card/50">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}
