import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { fetchTorunWeather, getDefaultWeatherData } from './services/weatherService.js';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  // Zainicjalizuj stanem domyślnym lub z pamięci podręcznej bez migotania
  const [weather, setWeather] = useState(() => {
    try {
      const cached = localStorage.getItem('mojtorun_weather_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data) return parsed.data;
      }
    } catch {}
    return getDefaultWeatherData();
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (force = false) => {
    if (force) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await fetchTorunWeather(force);
      setWeather(data);
    } catch (err) {
      console.error('Weather load error:', err);
      setError('Nie udało się pobrać aktualnych danych');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Pobierz dane przy montowaniu komponentu
  useEffect(() => {
    loadWeather(false);

    // Auto-odświeżanie co 10 minut
    const interval = setInterval(() => {
      loadWeather(true);
    }, 10 * 60 * 1000);

    // Odśwież po powrocie do karty przeglądarki jeśli dane mogą być nieaktualne
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadWeather(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadWeather]);

  const refresh = useCallback(() => {
    return loadWeather(true);
  }, [loadWeather]);

  const value = useMemo(
    () => ({
      weather,
      loading,
      isRefreshing,
      error,
      refresh,
    }),
    [weather, loading, isRefreshing, error, refresh]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return ctx;
}
