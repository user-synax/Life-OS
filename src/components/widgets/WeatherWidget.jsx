"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedLocation = localStorage.getItem("weather_location");
        if (savedLocation) {
            setLocation(savedLocation);
        } else {
            setLoading(false);
            setIsEditing(true);
        }
    }, []);

    useEffect(() => {
        if (!location) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `/api/weather?location=${location}`,
                );
                setWeather(response.data);
            } catch (err) {
                setError("Failed to fetch weather");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        const newLocation = e.target.elements.location.value;
        if (newLocation) {
            setLocation(newLocation);
            localStorage.setItem("weather_location", newLocation);
            setIsEditing(false);
        }
    };

    const getWeatherIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case "clear":
            case "sunny":
                return <Sun className="text-yellow-500" size={24} />;
            case "clouds":
            case "cloudy":
                return <Cloud className="text-muted-foreground" size={24} />;
            case "rain":
            case "drizzle":
                return <CloudRain className="text-primary" size={24} />;
            default:
                return <Sun className="text-yellow-500" size={24} />;
        }
    };

    if (isEditing || (!weather && !loading)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MapPin size={24} className="mb-3 text-primary opacity-50" />
                <h3 className="text-sm font-bold mb-1">Set Your Location</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Provide a location to see the weather.
                </p>
                <form
                    onSubmit={handleLocationSubmit}
                    className="w-full flex gap-2"
                >
                    <input
                        name="location"
                        placeholder="e.g., New York, US"
                        className="flex-1 bg-muted/50 border-border/50 rounded-md h-9 px-3 text-xs focus:ring-1 focus:ring-primary/50 outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 h-9 rounded-md bg-primary text-primary-foreground text-xs font-bold"
                    >
                        Set
                    </button>
                </form>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="animate-spin text-primary" size={20} />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Detecting...
                </span>
            </div>
        );
    }

    if (error && !weather) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs text-center p-4">
                <MapPin size={20} className="mb-2 opacity-20" />
                <p>{error}</p>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-primary text-xs font-bold"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full py-2">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter text-foreground/90">
                            {weather.temp}°
                        </span>
                        <span className="text-xl font-black text-primary/40 uppercase">
                            C
                        </span>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-2 uppercase tracking-[0.2em] mt-2 hover:text-primary transition-colors"
                    >
                        <MapPin size={12} />
                        {weather.location}
                    </button>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 shadow-lg shadow-primary/5">
                    {getWeatherIcon(weather.condition)}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
                <div className="flex flex-col p-3 bg-muted/50 rounded-md border border-border/50 hover:border-primary/20 transition-all group">
                    <span className="text-[8px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest group-hover:text-primary/60 transition-colors">
                        Humidity
                    </span>
                    <span className="text-sm font-bold text-foreground/80">
                        {weather.humidity}%
                    </span>
                </div>
                <div className="flex flex-col p-3 bg-muted/50 rounded-md border border-border/50 hover:border-primary/20 transition-all group">
                    <span className="text-[8px] uppercase font-black text-muted-foreground/40 mb-1 tracking-widest group-hover:text-primary/60 transition-colors">
                        Wind
                    </span>
                    <span className="text-sm font-bold text-foreground/80">
                        {weather.wind}{" "}
                        <span className="text-[9px] font-medium opacity-50 tracking-normal uppercase">
                            km/h
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
