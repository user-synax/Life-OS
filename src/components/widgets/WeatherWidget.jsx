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
          <span className="text-3xl font-bold tracking-tighter">{weather.temp}°</span>
          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider mt-1">
             <MapPin size={10} />
             {weather.location}
          </span>
        </div>
        <div className="p-2 bg-muted/50 rounded-[4px] border border-border">
           {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
         <div className="flex flex-col p-2 bg-muted/30 rounded-[4px] border border-border">
            <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mb-1">Humidity</span>
            <span className="text-xs font-bold">{weather.humidity}%</span>
         </div>
         <div className="flex flex-col p-2 bg-muted/30 rounded-[4px] border border-border">
            <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mb-1">Wind</span>
            <span className="text-xs font-bold">{weather.wind} km/h</span>
         </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-center">
         <span className="text-[9px] uppercase font-bold tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-[2px] border border-primary/10">
            {weather.condition}
         </span>
      </div>
    </div>
  );
}
