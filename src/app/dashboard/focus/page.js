'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Timer, 
  Settings2, 
  BarChart3, 
  Trophy, 
  Zap,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import gsap from 'gsap';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

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
      if (!isMuted) {
         // Play sound logic would go here
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, isMuted]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  useEffect(() => {
     if (progressRef.current) {
        const total = mode === 'focus' ? 25 * 60 : 5 * 60;
        const progress = ((total - timeLeft) / total);
        gsap.to(progressRef.current, {
           strokeDashoffset: 377 * (1 - progress),
           duration: 1,
           ease: 'linear'
        });
     }
  }, [timeLeft, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Focus Timer</h1>
          <p className="text-muted-foreground mt-1">Deep work sessions designed for maximum productivity.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-2xl">
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </Button>
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
              <Settings2 size={20} />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
         <Card className="bg-card border-border rounded-[40px] overflow-hidden shadow-2xl shadow-primary/5 flex flex-col items-center justify-center p-12 min-h-[600px] relative">
            <div className="absolute top-8 flex gap-3 p-1.5 bg-sidebar rounded-2xl border border-border/50">
               <Button
                  variant="ghost"
                  className={cn(
                     "rounded-xl px-8 h-10 text-xs font-black uppercase tracking-[0.2em] transition-all",
                     mode === 'focus' ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMode('focus')}
               >
                  Deep Focus
               </Button>
               <Button
                  variant="ghost"
                  className={cn(
                     "rounded-xl px-8 h-10 text-xs font-black uppercase tracking-[0.2em] transition-all",
                     mode === 'break' ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMode('break')}
               >
                  Short Break
               </Button>
            </div>

            <div className="relative flex items-center justify-center">
               <svg className="w-80 h-80 -rotate-90 transform">
                  <circle
                     cx="160"
                     cy="160"
                     r="150"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     className="text-border/20"
                  />
                  <circle
                     ref={progressRef}
                     cx="160"
                     cy="160"
                     r="150"
                     stroke="currentColor"
                     strokeWidth="8"
                     fill="transparent"
                     strokeDasharray={942}
                     strokeDashoffset={942}
                     className="text-primary"
                     strokeLinecap="round"
                  />
               </svg>
               <div className="absolute flex flex-col items-center gap-2">
                  <span className="text-8xl font-black tracking-tighter tabular-nums">
                     {formatTime(timeLeft)}
                  </span>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-sidebar rounded-full border border-border/50">
                     {mode === 'focus' ? <Brain size={16} className="text-primary" /> : <Coffee size={16} className="text-primary" />}
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {mode === 'focus' ? 'Session Active' : 'Resting'}
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
               <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-[24px] border-border hover:bg-sidebar transition-all hover:scale-105 active:scale-95"
                  onClick={resetTimer}
               >
                  <RotateCcw size={24} className="text-muted-foreground" />
               </Button>
               <Button
                  size="icon"
                  className={cn(
                     "h-24 w-24 rounded-[32px] shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95",
                     isActive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                  )}
                  onClick={toggleTimer}
               >
                  {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-[24px] border-border hover:bg-sidebar transition-all hover:scale-105 active:scale-95"
               >
                  <Maximize2 size={24} className="text-muted-foreground" />
               </Button>
            </div>
         </Card>

         <aside className="space-y-6">
            <Card className="bg-card border-border rounded-3xl p-6 shadow-xl shadow-primary/5">
               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-6">Today&apos;s Progress</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                           <Zap size={20} className="text-primary" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Total Sessions</span>
                           <span className="text-xl font-black">12</span>
                        </div>
                     </div>
                     <Badge className="bg-primary/20 text-primary border-none font-black">+2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                           <Timer size={20} className="text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Focus Hours</span>
                           <span className="text-xl font-black">5.4h</span>
                        </div>
                     </div>
                     <Badge className="bg-orange-500/20 text-orange-500 border-none font-black">Top 5%</Badge>
                  </div>
               </div>
            </Card>

            <Card className="bg-card border-border rounded-3xl p-6 shadow-xl shadow-primary/5">
               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-4">Upcoming Goals</h3>
               <div className="space-y-3">
                  {[
                     { label: 'UI Design Review', time: '25m' },
                     { label: 'API Documentation', time: '50m' },
                     { label: 'Weekly Sync', time: '15m' },
                  ].map((goal) => (
                     <div key={goal.label} className="flex items-center justify-between p-3 bg-sidebar/30 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                        <span className="text-xs font-bold truncate pr-2">{goal.label}</span>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{goal.time}</span>
                     </div>
                  ))}
               </div>
            </Card>
         </aside>
      </div>
    </div>
  );
}
