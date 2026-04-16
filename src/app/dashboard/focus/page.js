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
import useFocusStore from '@/store/useFocusStore';
import useTaskStore from '@/store/useTaskStore';

export default function FocusPage() {
  const {
    timeLeft,
    isActive,
    mode,
    isMuted,
    isFullscreen,
    dailySessions,
    dailyFocusTime,
    toggleTimer,
    resetTimer,
    setMode,
    toggleMute,
    toggleFullscreen,
    setTimeLeft,
    incrementDailySessions,
    addFocusTime,
    setShowFloatingTimer,
    syncTimer,
  } = useFocusStore();
  
  const { tasks } = useTaskStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleResetTimer = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleMaximize = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toggleFullscreen();
    } else {
      document.exitFullscreen();
      toggleFullscreen();
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      setShowFloatingTimer(true);
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowFloatingTimer(false);
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      if (mode === 'focus') {
        incrementDailySessions();
        addFocusTime(25);
        toast.success('Focus session complete! Time for a break.');
      } else {
        toast.success('Break over! Back to work.');
      }
      setMode(nextMode);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, setTimeLeft, setMode, incrementDailySessions, addFocusTime, setShowFloatingTimer]);

  useEffect(() => {
    handleResetTimer();
  }, [mode, handleResetTimer]);

  // Sync timer when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        syncTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, syncTimer]);

  // Sync timer on mount
  useEffect(() => {
    if (isActive) {
      syncTimer();
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime);
  
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Focus Timer
            </h1>
            <p className="text-[#898989] mt-1 text-[1rem] font-medium">Deep work sessions for maximum productivity.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0f0f0f] p-1 rounded-[9999px] border border-[#2e2e2e]">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[9999px] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]" onClick={toggleMute}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[9999px] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]" onClick={handleSettings}>
                <Settings2 size={16} />
             </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
           <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-8 min-h-[500px] relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-6 flex gap-2 p-1 bg-[#0f0f0f] rounded-[9999px] border border-[#2e2e2e]">
                 <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-[9999px] px-6 h-9 text-[14px] font-medium transition-colors",
                      mode === 'focus' ? "bg-[#3ecf8e] text-[#0a0a0a]" : "text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]"
                    )}
                    onClick={() => handleModeChange('focus')}
                 >
                    Deep Focus
                 </Button>
                 <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-[9999px] px-6 h-9 text-[14px] font-medium transition-colors",
                      mode === 'break' ? "bg-[#3ecf8e] text-[#0a0a0a]" : "text-[#898989] hover:text-[#fafafa] hover:bg-[#171717]"
                    )}
                    onClick={() => handleModeChange('break')}
                 >
                    Short Break
                 </Button>
              </div>

              <div className="relative flex items-center justify-center mt-16">
                 <svg className="w-72 h-72 -rotate-90 transform">
                    <circle
                       cx="144"
                       cy="144"
                       r="136"
                       stroke="currentColor"
                       strokeWidth="4"
                       fill="transparent"
                       className="text-[#2e2e2e]/30"
                    />
                    <circle
                       cx="144"
                       cy="144"
                       r="136"
                       stroke="currentColor"
                       strokeWidth="4"
                       fill="transparent"
                       strokeDasharray={854}
                       strokeDashoffset={854 * (1 - progress)}
                       className="text-[#3ecf8e] transition-all duration-1000 ease-linear"
                       strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-[5rem] font-medium tracking-tighter tabular-nums text-[#fafafa]">
                       {formatTime(timeLeft)}
                    </span>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-[#171717]/50 rounded-[9999px] border border-[#2e2e2e] mt-3">
                       {mode === 'focus' ? <Brain size={14} className="text-[#3ecf8e]" /> : <Coffee size={14} className="text-[#3ecf8e]" />}
                       <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">
                          {mode === 'focus' ? 'Focus Mode' : 'Break Mode'}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="mt-20 flex items-center gap-4">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-[9999px] border border-[#2e2e2e] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717] transition-colors"
                    onClick={handleResetTimer}
                 >
                    <RotateCcw size={20} />
                 </Button>
                 <Button
                    size="icon"
                    className={cn(
                      "h-20 w-20 rounded-[9999px] transition-colors",
                      isActive ? "bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90" : "bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90"
                    )}
                    onClick={toggleTimer}
                 >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </Button>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-[9999px] border border-[#2e2e2e] text-[#898989] hover:text-[#fafafa] hover:bg-[#171717] transition-colors"
                    onClick={handleMaximize}
                 >
                    <Maximize2 size={20} />
                 </Button>
              </div>
           </Card>

           <aside className="space-y-6">
              <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-5">
                 <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] mb-5">Daily Stats</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-[9999px] bg-[#3ecf8e]/10 flex items-center justify-center border border-[#3ecf8e]/20">
                             <Zap size={18} className="text-[#3ecf8e]" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">Sessions</span>
                             <span className="text-[1.5rem] font-medium text-[#fafafa]">{dailySessions}</span>
                          </div>
                       </div>
                       <Badge variant="outline" className="border-[#3ecf8e]/20 text-[#3ecf8e] bg-[#3ecf8e]/5 font-medium text-[12px]">
                         {dailySessions > 0 ? `+${dailySessions}` : '0'}
                       </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-[9999px] bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                             <Timer size={18} className="text-orange-500" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[12px] font-medium uppercase tracking-wider text-[#898989]">Focus Time</span>
                             <span className="text-[1.5rem] font-medium text-[#fafafa]">{dailyFocusTime}m</span>
                          </div>
                       </div>
                       <Badge variant="outline" className="border-orange-500/20 text-orange-500 bg-orange-500/5 font-medium text-[12px]">
                         {dailyFocusTime > 120 ? 'Top 5%' : 'Keep Going'}
                       </Badge>
                    </div>
                 </div>
              </Card>

              <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-5">
                 <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] mb-4">Up Next</h3>
                 <div className="space-y-3">
                    {upcomingTasks.length > 0 ? (
                       upcomingTasks.map((task) => (
                          <div key={task._id} className="flex items-center justify-between p-3 bg-[#171717]/50 rounded-[8px] border border-[#2e2e2e] hover:border-[#3ecf8e]/30 transition-colors">
                             <span className="text-[14px] font-medium truncate pr-2 text-[#fafafa]">{task.title}</span>
                             <span className="text-[12px] font-medium text-[#3ecf8e] bg-[#3ecf8e]/5 px-2 py-1 rounded-[9999px] border border-[#3ecf8e]/20">25m</span>
                          </div>
                       ))
                    ) : (
                       <div className="text-center py-6">
                          <span className="text-[12px] text-[#898989]">No upcoming tasks</span>
                       </div>
                    )}
                 </div>
              </Card>
           </aside>
        </div>
      </div>
    </div>
  );
}
