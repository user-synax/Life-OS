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
    <div className="flex flex-col h-full items-center justify-between py-1">
      <div className="flex gap-1 p-1 bg-muted/20 rounded-[4px] border border-border/50 transition-colors group-hover:border-primary/10">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-[2px] px-4 h-7 text-[8px] uppercase font-black tracking-[0.2em] transition-all duration-300",
            mode === 'focus' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground/50 hover:text-primary hover:bg-primary/5"
          )}
          onClick={() => setMode('focus')}
        >
          Focus
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-[2px] px-4 h-7 text-[8px] uppercase font-black tracking-[0.2em] transition-all duration-300",
            mode === 'break' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground/50 hover:text-primary hover:bg-primary/5"
          )}
          onClick={() => setMode('break')}
        >
          Break
        </Button>
      </div>

      <div className="relative flex items-center justify-center py-2">
         <svg className="w-24 h-24 -rotate-90 transform">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-muted/10"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progress) / 100}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
         </svg>
         <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black tracking-tighter tabular-nums text-foreground/90">
              {formatTime(timeLeft)}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
               <span className="text-[7px] uppercase font-black text-primary tracking-[0.15em]">
                  {mode}
               </span>
            </div>
         </div>
      </div>

      <div className="flex items-center gap-3 w-full px-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-[4px] text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-colors"
          onClick={resetTimer}
        >
          <RotateCcw size={12} />
        </Button>
        <Button
          size="sm"
          className={cn(
            "flex-1 h-9 rounded-[4px] font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300",
            isActive ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          )}
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <div className="flex items-center justify-center h-8 w-8 bg-muted/10 rounded-[4px] border border-transparent">
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-primary leading-none">{completedToday}</span>
              <CheckCircle2 size={8} className="text-primary/50 mt-1" />
           </div>
        </div>
      </div>
    </div>
  );
}
