'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
           // Mock data for demo if no API key
           setTimeout(() => {
             setWeather({
               temp: 22,
               condition: 'Sunny',
               location: 'San Francisco',
               humidity: 45,
               wind: 12
             });
             setLoading(false);
           }, 1000);
           return;
        }
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          location: data.name,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather');
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Location access denied');
          setLoading(false);
          // Fallback to a default location or mock data
          fetchWeather(37.7749, -122.4194);
        }
      );
    } else {
      // Defer state update to avoid synchronous setState in effect
      Promise.resolve().then(() => setError('Geolocation not supported'));
      Promise.resolve().then(() => setLoading(false));
    }
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="text-yellow-400" size={32} />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="text-gray-400" size={32} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="text-blue-400" size={32} />;
      default:
        return <Sun className="text-yellow-400" size={32} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Detecting Location...</span>
      </div>
    );
  }

  if (error && !weather) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs text-center p-4">
           <MapPin size={24} className="mb-2 opacity-20" />
           <p>{error}</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-full justify-between p-1">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tighter">{weather.temp}°C</span>
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
             <MapPin size={10} />
             {weather.location}
          </span>
        </div>
        <div className="p-2 bg-sidebar rounded-2xl border border-border/50">
           {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
         <div className="flex flex-col p-2 bg-sidebar/50 rounded-xl border border-border/30">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-1">Humidity</span>
            <span className="text-sm font-semibold">{weather.humidity}%</span>
         </div>
         <div className="flex flex-col p-2 bg-sidebar/50 rounded-xl border border-border/30">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-1">Wind</span>
            <span className="text-sm font-semibold">{weather.wind} km/h</span>
         </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
         <span className="text-[10px] uppercase font-bold tracking-widest text-primary/50 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
            {weather.condition}
         </span>
      </div>
    </div>
  );
}
