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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[220px] grid-flow-dense pb-10">
      {widgets.map((widget) => (
        <WidgetCard key={widget._id} widget={widget} />
      ))}
    </div>
  );
}
