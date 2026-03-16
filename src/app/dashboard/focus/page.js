'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Timer, 
  Settings2, 
  Zap,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [isMuted, setIsMuted] = useState(false);

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
      // Defer state update to next tick to avoid cascading renders
      setTimeout(() => setIsActive(false), 0);
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setTimeout(() => setMode(nextMode), 0);
      toast.success(mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Back to work.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    // Defer state update to next tick to avoid cascading renders
    setTimeout(() => resetTimer(), 0);
  }, [mode, resetTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Focus Timer</h1>
          <p className="text-muted-foreground mt-1 text-sm">Deep work sessions for maximum productivity.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-[4px] border border-border">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px]" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px]">
              <Settings2 size={16} />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
         <Card className="bg-card border-border rounded-[4px] shadow-sm flex flex-col items-center justify-center p-8 min-h-[500px] relative overflow-hidden">
            <div className="absolute top-6 flex gap-2 p-1 bg-muted/50 rounded-[4px] border border-border">
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     "rounded-[2px] px-6 h-8 text-[10px] font-bold uppercase tracking-wider transition-colors",
                     mode === 'focus' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMode('focus')}
               >
                  Deep Focus
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     "rounded-[2px] px-6 h-8 text-[10px] font-bold uppercase tracking-wider transition-colors",
                     mode === 'break' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMode('break')}
               >
                  Short Break
               </Button>
            </div>

            <div className="relative flex items-center justify-center">
               <svg className="w-64 h-64 -rotate-90 transform">
                  <circle
                     cx="128"
                     cy="128"
                     r="120"
                     stroke="currentColor"
                     strokeWidth="4"
                     fill="transparent"
                     className="text-border/20"
                  />
                  <circle
                     cx="128"
                     cy="128"
                     r="120"
                     stroke="currentColor"
                     strokeWidth="4"
                     fill="transparent"
                     strokeDasharray={754}
                     strokeDashoffset={754 * (1 - progress)}
                     className="text-primary transition-all duration-1000 ease-linear"
                     strokeLinecap="round"
                  />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-bold tracking-tighter tabular-nums">
                     {formatTime(timeLeft)}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-[2px] border border-border mt-2">
                     {mode === 'focus' ? <Brain size={12} className="text-primary" /> : <Coffee size={12} className="text-primary" />}
                     <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {mode === 'focus' ? 'Focus Mode' : 'Break Mode'}
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
               <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-[4px] border-border hover:bg-muted transition-colors"
                  onClick={resetTimer}
               >
                  <RotateCcw size={18} className="text-muted-foreground" />
               </Button>
               <Button
                  size="icon"
                  className={cn(
                     "h-16 w-16 rounded-[4px] transition-colors",
                     isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={toggleTimer}
               >
                  {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-[4px] border-border hover:bg-muted transition-colors"
               >
                  <Maximize2 size={18} className="text-muted-foreground" />
               </Button>
            </div>
         </Card>

         <aside className="space-y-6">
            <Card className="bg-card border-border rounded-[4px] p-4 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">Daily Stats</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-[4px] bg-primary/10 flex items-center justify-center">
                           <Zap size={16} className="text-primary" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Sessions</span>
                           <span className="text-lg font-bold">12</span>
                        </div>
                     </div>
                     <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-bold text-[10px]">+2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-[4px] bg-orange-500/10 flex items-center justify-center">
                           <Timer size={16} className="text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Focus Time</span>
                           <span className="text-lg font-bold">5.4h</span>
                        </div>
                     </div>
                     <Badge variant="outline" className="border-orange-500/20 text-orange-500 bg-orange-500/5 font-bold text-[10px]">Top 5%</Badge>
                  </div>
               </div>
            </Card>

            <Card className="bg-card border-border rounded-[4px] p-4 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">Up Next</h3>
               <div className="space-y-2">
                  {[
                     { label: 'Design Review', time: '25m' },
                     { label: 'API Docs', time: '50m' },
                     { label: 'Sync', time: '15m' },
                  ].map((goal) => (
                     <div key={goal.label} className="flex items-center justify-between p-2 bg-muted/30 rounded-[4px] border border-border group hover:border-primary/50 transition-colors">
                        <span className="text-xs font-bold truncate pr-2">{goal.label}</span>
                        <span className="text-[9px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded-[2px] border border-primary/10">{goal.time}</span>
                     </div>
                  ))}
               </div>
            </Card>
         </aside>
      </div>
    </div>
  );
}
