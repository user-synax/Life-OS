'use client';

import { useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useFocusStore from '@/store/useFocusStore';

export default function FloatingTimer() {
  const {
    timeLeft,
    isActive,
    mode,
    showFloatingTimer,
    toggleTimer,
    setShowFloatingTimer,
    syncTimer,
  } = useFocusStore();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setShowFloatingTimer(false);
  };

  // Sync timer on mount and when tab becomes visible
  useEffect(() => {
    if (isActive) {
      syncTimer();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        syncTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, syncTimer]);

  if (!showFloatingTimer) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-[8px] p-4 shadow-lg min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">
            {mode === 'focus' ? 'Focus Timer' : 'Break Timer'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-[9999px] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]"
            onClick={handleClose}
          >
            <X size={14} />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[2rem] font-medium tabular-nums text-[#fafafa]">
            {formatTime(timeLeft)}
          </span>
          <Button
            size="icon"
            className="h-10 w-10 rounded-[9999px] bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90"
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
