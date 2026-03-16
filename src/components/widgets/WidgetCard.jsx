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
        'group relative flex flex-col overflow-hidden bg-card border-border rounded-[4px] shadow-sm h-full hover:border-primary/20 transition-all duration-300',
        getWidgetSizeClass(widget.size)
      )}
    >
      <CardHeader className="p-3 py-2 flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/20">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
          <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
          {widget.widgetType}
        </CardTitle>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/50 hover:text-primary rounded-[2px]">
            <Settings2 size={10} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 flex-1 overflow-hidden flex flex-col">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}
