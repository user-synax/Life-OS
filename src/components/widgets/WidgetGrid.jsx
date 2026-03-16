'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import WidgetCard from './WidgetCard';
import useWidgetStore from '@/store/useWidgetStore';

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function WidgetGrid() {
  const { widgets, loading, fetchWidgets, reorderWidgets } = useWidgetStore();
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((w) => w._id === active.id);
      const newIndex = widgets.findIndex((w) => w._id === over.id);
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  if (loading && widgets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[200px] bg-sidebar animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
        <SortableContext items={widgets.map((w) => w._id)} strategy={rectSortingStrategy}>
          {widgets.map((widget) => (
            <WidgetCard key={widget._id} widget={widget} />
          ))}
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
          <WidgetCard 
            widget={widgets.find((w) => w._id === activeId)} 
            isDragging 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
