import { NextResponse } from 'next/server';
import axios from 'axios';
import { log } from '@/lib/logger';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const weatherData = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      location: data.name,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    log.error('Weather API error', error.response?.data || error.message);
    const { error: message, statusCode } = createErrorResponse(error, request);
    return NextResponse.json({ error: message || 'Failed to fetch weather data' }, { status: statusCode });
  }
}
