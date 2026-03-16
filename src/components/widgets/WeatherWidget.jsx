'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-4xl font-black tracking-tighter text-foreground/90">{weather.temp}°</span>
          <span className="text-[10px] font-black text-muted-foreground/60 flex items-center gap-1 uppercase tracking-widest mt-1">
             <MapPin size={10} className="text-primary/50" />
             {weather.location}
          </span>
        </div>
        <div className="p-2.5 bg-muted/20 rounded-[4px] border border-border/50 transition-colors group-hover:border-primary/20">
           {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
         <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-colors">
            <span className="text-[7px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest">Humidity</span>
            <span className="text-[11px] font-bold text-foreground/80">{weather.humidity}%</span>
         </div>
         <div className="flex flex-col p-2 bg-muted/10 rounded-[4px] border border-transparent hover:border-border/50 transition-colors">
            <span className="text-[7px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest">Wind</span>
            <span className="text-[11px] font-bold text-foreground/80">{weather.wind} <span className="text-[8px] font-medium opacity-50">km/h</span></span>
         </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-center">
         <span className="text-[8px] uppercase font-black tracking-[0.2em] text-primary/80 bg-primary/5 px-3 py-1 rounded-[2px] border border-primary/10">
            {weather.condition}
         </span>
      </div>
    </div>
  );
}
