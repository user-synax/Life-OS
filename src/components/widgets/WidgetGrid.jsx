'use client';

import { useEffect } from 'react';
import WidgetCard from './WidgetCard';
import useWidgetStore from '@/store/useWidgetStore';

export default function WidgetGrid() {
  const { widgets, loading, fetchWidgets } = useWidgetStore();

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  if (loading && widgets.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[200px] bg-muted animate-pulse rounded-[4px]" />
        ))}
      </div>
    );
  }

  // Ensure only unique widget types are rendered to avoid layout issues
  const uniqueWidgets = widgets.reduce((acc, current) => {
    const x = acc.find(item => item.widgetType === current.widgetType);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[220px] grid-flow-dense pb-10">
      {uniqueWidgets.map((widget) => (
        <WidgetCard key={widget._id} widget={widget} />
      ))}
    </div>
  );
}
