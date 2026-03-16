'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Mock data for demo
        setTimeout(() => {
          setWeather({
            temp: 22,
            condition: 'Sunny',
            location: 'San Francisco',
            humidity: 45,
            wind: 12
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch weather');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="text-yellow-500" size={24} />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="text-muted-foreground" size={24} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="text-primary" size={24} />;
      default:
        return <Sun className="text-yellow-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Loader2 className="animate-spin text-primary" size={20} />
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Detecting...</span>
      </div>
    );
  }

  if (error && !weather) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs text-center p-4">
           <MapPin size={20} className="mb-2 opacity-20" />
           <p>{error}</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-full py-2">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
             <span className="text-5xl font-black tracking-tighter text-foreground/90">{weather.temp}°</span>
             <span className="text-xl font-black text-primary/40 uppercase">C</span>
          </div>
          <span className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-2 uppercase tracking-[0.2em] mt-2">
             <MapPin size={12} className="text-primary/40" />
             {weather.location}
          </span>
        </div>
        <div className="p-4 bg-primary/5 rounded-[4px] border border-primary/10 shadow-lg shadow-primary/5">
           {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
         <div className="flex flex-col p-3 bg-muted/5 rounded-[4px] border border-border/50 hover:border-primary/20 transition-all group">
            <span className="text-[8px] uppercase font-black text-muted-foreground/20 mb-2 tracking-[0.2em] group-hover:text-primary/40 transition-colors">Humidity</span>
            <span className="text-[13px] font-black text-foreground/70">{weather.humidity}%</span>
         </div>
         <div className="flex flex-col p-3 bg-muted/5 rounded-[4px] border border-border/50 hover:border-primary/20 transition-all group">
            <span className="text-[8px] uppercase font-black text-muted-foreground/20 mb-2 tracking-[0.2em] group-hover:text-primary/40 transition-colors">Wind Velocity</span>
            <span className="text-[13px] font-black text-foreground/70">{weather.wind} <span className="text-[9px] font-medium opacity-30 tracking-normal uppercase">km/h</span></span>
         </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-6">
         <div className="flex gap-1">
            {[1, 2, 3].map(i => (
               <div key={i} className={cn("h-1 w-3 rounded-full bg-muted/20", i === 1 && "bg-primary/40")} />
            ))}
         </div>
         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-[2px] border border-primary/20 shadow-sm shadow-primary/10">
            {weather.condition}
         </span>
      </div>
    </div>
  );
}
