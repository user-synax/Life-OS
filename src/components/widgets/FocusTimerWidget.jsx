'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FocusTimerWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

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
      setIsActive(false);
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setMode(nextMode);
      toast.success(mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Back to work.');
      // You could play a sound here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="flex flex-col h-full items-center justify-between p-2">
      <div className="flex gap-2 p-1 bg-sidebar rounded-full border border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full px-4 h-7 text-[10px] uppercase font-bold tracking-widest transition-all",
            mode === 'focus' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setMode('focus')}
        >
          Focus
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full px-4 h-7 text-[10px] uppercase font-bold tracking-widest transition-all",
            mode === 'break' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setMode('break')}
        >
          Break
        </Button>
      </div>

      <div className="relative flex items-center justify-center py-6">
         <svg className="w-32 h-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-border/30"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * (100 - progress)) / 100}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
         </svg>
         <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold tracking-tighter tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">
               {mode === 'focus' ? <Brain size={12} className="inline mr-1" /> : <Coffee size={12} className="inline mr-1" />}
               {mode}
            </span>
         </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border hover:bg-sidebar transition-colors"
          onClick={resetTimer}
        >
          <RotateCcw size={18} className="text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
            isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          )}
          onClick={toggleTimer}
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </Button>
        <div className="w-10" /> {/* Spacer */}
      </div>
    </div>
  );
}
