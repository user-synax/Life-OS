'use client';

import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetGrid from '@/components/widgets/WidgetGrid';
import useWidgetStore from '@/store/useWidgetStore';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function DashboardPage() {
  const { addWidget } = useWidgetStore();
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Good morning, <span className="text-primary">User</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back to your Life OS. Here&apos;s your daily overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl"
            onClick={() => addWidget('tasks')}
          >
            <Plus size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Add Widget</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
            <Settings2 size={18} />
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <WidgetGrid />
      </div>
    </div>
  );
}
