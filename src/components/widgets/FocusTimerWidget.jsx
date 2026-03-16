'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import useTaskStore from '@/store/useTaskStore';

export default function FocusTimerWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const tasks = useTaskStore((state) => state.tasks);
  const completedToday = tasks.filter(t => t.completed).length;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => setIsActive(false));
      const nextMode = mode === 'focus' ? 'break' : 'focus';
queueMicrotask(() => setMode(nextMode));
      toast.success(mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Back to work.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    queueMicrotask(() => resetTimer());
  }, [mode, resetTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex flex-col h-full items-center justify-between">
      <div className="flex gap-1 p-1 bg-muted/50 rounded-[4px] border border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-[2px] px-3 h-6 text-[9px] uppercase font-bold tracking-wider transition-colors",
            mode === 'focus' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setMode('focus')}
        >
          Focus
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-[2px] px-3 h-6 text-[9px] uppercase font-bold tracking-wider transition-colors",
            mode === 'break' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setMode('break')}
        >
          Break
        </Button>
      </div>

      <div className="relative flex items-center justify-center py-4">
         <svg className="w-28 h-28 -rotate-90 transform">
            <circle
              cx="56"
              cy="56"
              r="52"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-border/30"
            />
            <circle
              cx="56"
              cy="56"
              r="52"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={327}
              strokeDashoffset={327 - (327 * progress) / 100}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
         </svg>
         <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold tracking-tighter tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider flex items-center gap-1 mt-1">
               {mode === 'focus' ? <Brain size={10} /> : <Coffee size={10} />}
               {mode}
            </span>
         </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-[4px] border-border hover:bg-muted transition-colors"
          onClick={resetTimer}
        >
          <RotateCcw size={14} className="text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          className={cn(
            "h-10 w-10 rounded-[4px] transition-colors",
            isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={toggleTimer}
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </Button>
        <div className="flex items-center justify-center h-8 w-8 bg-muted/30 rounded-[4px] border border-border">
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold leading-none">{completedToday}</span>
              <CheckCircle2 size={8} className="text-primary mt-0.5" />
           </div>
        </div>
      </div>
    </div>
  );
}
