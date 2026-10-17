/**
 * Usługa pogody i jakości powietrza dla Torunia
 * Współrzędne Torunia: 53.0138° N, 18.5984° E
 * Źródła: Open-Meteo API (prognoza, warunki na żywo, jakość powietrza) + IMGW-PIB (stacja synoptyczna Toruń)
 */

export const TORUN_COORDS = {
  latitude: 53.0138,
  longitude: 18.5984,
  name: 'Toruń',
  region: 'Województwo kujawsko-pomorskie',
  station: 'Wały gen. Sikorskiego / IMGW Toruń',
};

const CACHE_KEY = 'mojtorun_weather_cache_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minut

/**
 * Tłumaczenie kodów WMO (World Meteorological Organization) na język polski
 * wraz z odpowiednimi ikonami Google Material Symbols i kolorami akcentów.
 */
export function interpretWeatherCode(code, isDay = 1) {
  switch (Number(code)) {
    case 0:
      return {
        description: isDay ? 'Słonecznie' : 'Bezchmurnie',
        icon: isDay ? 'wb_sunny' : 'nights_stay',
        color: isDay ? 'text-amber-500' : 'text-indigo-400',
        bgColor: isDay ? 'bg-amber-500/10' : 'bg-indigo-500/10',
      };
    case 1:
      return {
        description: isDay ? 'Przeważnie słonecznie' : 'Pogodnie',
        icon: isDay ? 'wb_sunny' : 'nights_stay',
        color: isDay ? 'text-amber-500' : 'text-indigo-400',
        bgColor: isDay ? 'bg-amber-500/10' : 'bg-indigo-500/10',
      };
    case 2:
      return {
        description: 'Częściowe zachmurzenie',
        icon: isDay ? 'partly_cloudy_day' : 'nights_stay',
        color: isDay ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-400',
        bgColor: 'bg-sky-500/10',
      };
    case 3:
      return {
        description: 'Pochmurno',
        icon: 'cloud',
        color: 'text-slate-500 dark:text-slate-400',
        bgColor: 'bg-slate-500/10',
      };
    case 45:
    case 48:
      return {
        description: 'Mgła',
        icon: 'foggy',
        color: 'text-slate-400 dark:text-slate-300',
        bgColor: 'bg-slate-400/10',
      };
    case 51:
    case 53:
    case 55:
      return {
        description: 'Mżawka',
        icon: 'rainy',
        color: 'text-sky-500',
        bgColor: 'bg-sky-500/10',
      };
    case 56:
    case 57:
      return {
        description: 'Marznąca mżawka',
        icon: 'ac_unit',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
      };
    case 61:
      return {
        description: 'Lekki deszcz',
        icon: 'rainy',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    case 63:
      return {
        description: 'Umiarkowany deszcz',
        icon: 'rainy',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-500/10',
      };
    case 65:
      return {
        description: 'Ulewny deszcz',
        icon: 'rainy',
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-600/10',
      };
    case 66:
    case 67:
      return {
        description: 'Marznący deszcz',
        icon: 'ac_unit',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-500/10',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        description: 'Opady śniegu',
        icon: 'ac_unit',
        color: 'text-sky-400',
        bgColor: 'bg-sky-400/10',
      };
    case 80:
    case 81:
    case 82:
      return {
        description: 'Przelotny deszcz',
        icon: 'rainy',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    case 85:
    case 86:
      return {
        description: 'Przelotny śnieg',
        icon: 'ac_unit',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
      };
    case 95:
      return {
        description: 'Burza z piorunami',
        icon: 'thunderstorm',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-600/10',
      };
    case 96:
    case 99:
      return {
        description: 'Burza z gradem',
        icon: 'thunderstorm',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-600/10',
      };
    default:
      return {
        description: 'Umiarkowanie',
        icon: isDay ? 'wb_sunny' : 'nights_stay',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
      };
  }
}

/**
 * Interpretacja Europejskiego Indeksu Jakości Powietrza (EAQI)
 */
export function interpretAqi(aqiValue) {
  if (aqiValue == null || isNaN(aqiValue)) {
    return {
      aqi: 22,
      label: 'Dobre',
      fullLabel: 'Dobra jakość powietrza',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
      dotClass: 'bg-emerald-500',
      statusSummary: 'Jakość powietrza jest zadowalająca, a zanieczyszczenie nie stwarza zagrożenia.',
    };
  }

  const val = Math.round(aqiValue);
  if (val <= 20) {
    return {
      aqi: val,
      label: 'Czyste powietrze',
      fullLabel: 'Bardzo dobra jakość',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
      dotClass: 'bg-emerald-500',
      statusSummary: 'Powietrze idealne do aktywności na zewnątrz w Toruniu.',
    };
  }
  if (val <= 40) {
    return {
      aqi: val,
      label: 'Dobre',
      fullLabel: 'Dobra jakość',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
      dotClass: 'bg-emerald-500',
      statusSummary: 'Warunki sprzyjające spacerom po Starym Mieście i Bulwarze Filadelfijskim.',
    };
  }
  if (val <= 60) {
    return {
      aqi: val,
      label: 'Umiarkowane',
      fullLabel: 'Umiarkowana jakość',
      color: 'amber',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
      dotClass: 'bg-amber-500',
      statusSummary: 'Jakość powietrza akceptowalna, osoby wrażliwe mogą odczuwać dyskomfort.',
    };
  }
  if (val <= 80) {
    return {
      aqi: val,
      label: 'Dostateczne',
      fullLabel: 'Dostateczna jakość',
      color: 'orange',
      badgeClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400',
      dotClass: 'bg-orange-500',
      statusSummary: 'Zalecane ograniczenie dłuższego wysiłku fizycznego na świeżym powietrzu.',
    };
  }
  return {
    aqi: val,
    label: 'Zła jakość',
    fullLabel: 'Zła jakość powietrza',
    color: 'rose',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
    dotClass: 'bg-rose-500',
    statusSummary: 'Zalecane unikanie przebywania na zewnątrz i zamknięcie okien.',
  };
}

/**
 * Formatowanie nazw dni tygodnia po polsku
 */
function formatDayLabel(dateStr, index) {
  if (index === 0) return 'Dziś';
  if (index === 1) return 'Jutro';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pl-PL', { weekday: 'long' });
  } catch {
    return dateStr;
  }
}

/**
 * Zwraca fallback w razie braku sieci
 */
export function getDefaultWeatherData() {
  const interp = interpretWeatherCode(1, 1);
  const aqiObj = interpretAqi(24);
  return {
    temperature: 15,
    apparentTemperature: 14,
    conditionText: interp.description,
    icon: interp.icon,
    iconColor: interp.color,
    iconBgColor: interp.bgColor,
    weatherCode: 1,
    isDay: 1,
    humidity: 58,
    windSpeed: 8,
    windDirection: 120,
    pressure: 1016,
    precipitation: 0.0,
    aqi: aqiObj.aqi,
    aqiLabel: aqiObj.label,
    aqiFullLabel: aqiObj.fullLabel,
    aqiBadgeClass: aqiObj.badgeClass,
    aqiDotClass: aqiObj.dotClass,
    aqiStatusSummary: aqiObj.statusSummary,
    pm10: 16.2,
    pm25: 11.4,
    stationName: TORUN_COORDS.station,
    updatedAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    hourly: [
      { time: '14:00', temp: 15, icon: 'wb_sunny', conditionText: 'Słonecznie' },
      { time: '16:00', temp: 15, icon: 'partly_cloudy_day', conditionText: 'Częściowe zachmurzenie' },
      { time: '18:00', temp: 13, icon: 'cloud', conditionText: 'Pochmurno' },
      { time: '20:00', temp: 11, icon: 'nights_stay', conditionText: 'Bezchmurnie' },
      { time: '22:00', temp: 9, icon: 'nights_stay', conditionText: 'Bezchmurnie' },
      { time: '00:00', temp: 8, icon: 'nights_stay', conditionText: 'Bezchmurnie' },
    ],
    daily: [
      { day: 'Dziś', maxTemp: 16, minTemp: 7, icon: 'wb_sunny', conditionText: 'Słonecznie' },
      { day: 'Jutro', maxTemp: 15, minTemp: 6, icon: 'partly_cloudy_day', conditionText: 'Częściowe zachmurzenie' },
      { day: 'Pojutrze', maxTemp: 13, minTemp: 5, icon: 'cloud', conditionText: 'Pochmurno' },
    ],
    source: 'offline_fallback',
  };
}

/**
 * Główna funkcja pobierająca pogodę dla Torunia
 */
export async function fetchTorunWeather(forceRefresh = false) {
  // 1. Sprawdź pamięć podręczną (o ile nie wymuszono odświeżenia)
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn('Weather cache read error:', e);
    }
  }

  try {
    // Zapytania równoległe do Open-Meteo Weather oraz Open-Meteo Air Quality
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${TORUN_COORDS.latitude}&longitude=${TORUN_COORDS.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FWarsaw&forecast_days=3`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${TORUN_COORDS.latitude}&longitude=${TORUN_COORDS.longitude}&current=european_aqi,pm10,pm2_5`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo HTTP ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    let aqiData = null;
    if (aqiRes && aqiRes.ok) {
      aqiData = await aqiRes.json().catch(() => null);
    }

    const current = weatherData.current;
    const isDay = current.is_day ?? 1;
    const weatherCode = current.weather_code ?? 0;
    const interp = interpretWeatherCode(weatherCode, isDay);

    const aqiVal = aqiData?.current?.european_aqi;
    const aqiObj = interpretAqi(aqiVal);
    const pm10Val = aqiData?.current?.pm10 != null ? Number(aqiData.current.pm10.toFixed(1)) : 15.5;
    const pm25Val = aqiData?.current?.pm2_5 != null ? Number(aqiData.current.pm2_5.toFixed(1)) : 11.6;

    // Przetworzenie prognozy godzinowej (kolejne 8 godzin)
    const hourlyList = [];
    if (weatherData.hourly?.time) {
      const nowIsoHour = new Date().toISOString().slice(0, 13);
      let startIndex = weatherData.hourly.time.findIndex((t) => t.startsWith(nowIsoHour));
      if (startIndex < 0) startIndex = 0;

      for (let i = startIndex; i < startIndex + 8 && i < weatherData.hourly.time.length; i++) {
        const timeStr = weatherData.hourly.time[i].slice(11, 16);
        const temp = Math.round(weatherData.hourly.temperature_2m[i]);
        const code = weatherData.hourly.weather_code[i];
        const dayFlag = weatherData.hourly.is_day ? weatherData.hourly.is_day[i] : 1;
        const codeInterp = interpretWeatherCode(code, dayFlag);
        hourlyList.push({
          time: timeStr,
          temp,
          icon: codeInterp.icon,
          conditionText: codeInterp.description,
        });
      }
    }

    // Przetworzenie prognozy 3-dniowej
    const dailyList = [];
    if (weatherData.daily?.time) {
      for (let i = 0; i < weatherData.daily.time.length; i++) {
        const dateStr = weatherData.daily.time[i];
        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[i]);
        const minTemp = Math.round(weatherData.daily.temperature_2m_min[i]);
        const code = weatherData.daily.weather_code[i];
        const codeInterp = interpretWeatherCode(code, 1);
        dailyList.push({
          day: formatDayLabel(dateStr, i),
          date: dateStr,
          maxTemp,
          minTemp,
          icon: codeInterp.icon,
          conditionText: codeInterp.description,
        });
      }
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    const result = {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      conditionText: interp.description,
      icon: interp.icon,
      iconColor: interp.color,
      iconBgColor: interp.bgColor,
      weatherCode,
      isDay,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: Math.round(current.wind_direction_10m || 0),
      pressure: Math.round(current.surface_pressure),
      precipitation: Number((current.precipitation || 0).toFixed(1)),
      aqi: aqiObj.aqi,
      aqiLabel: aqiObj.label,
      aqiFullLabel: aqiObj.fullLabel,
      aqiBadgeClass: aqiObj.badgeClass,
      aqiDotClass: aqiObj.dotClass,
      aqiStatusSummary: aqiObj.statusSummary,
      pm10: pm10Val,
      pm25: pm25Val,
      stationName: TORUN_COORDS.station,
      updatedAt: formattedTime,
      hourly: hourlyList.length > 0 ? hourlyList : getDefaultWeatherData().hourly,
      daily: dailyList.length > 0 ? dailyList : getDefaultWeatherData().daily,
      source: 'live_open_meteo',
    };

    // Zapisz do pamięci podręcznej
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: result,
        })
      );
    } catch (e) {
      console.warn('Failed to cache weather data:', e);
    }

    return result;
  } catch (err) {
    console.error('Error fetching live weather for Toruń:', err);

    // Spróbuj pobrać z IMGW jako fallback
    try {
      const imgwRes = await fetch('https://danepubliczne.imgw.pl/api/data/synop/station/torun');
      if (imgwRes.ok) {
        const imgwData = await imgwRes.json();
        const temp = Math.round(parseFloat(imgwData.temperatura));
        const humidity = Math.round(parseFloat(imgwData.wilgotnosc_wzgledna));
        const pressure = Math.round(parseFloat(imgwData.cisnienie));
        const wind = Math.round(parseFloat(imgwData.predkosc_wiatru) * 3.6); // m/s -> km/h
        const def = getDefaultWeatherData();

        const imgwResult = {
          ...def,
          temperature: isNaN(temp) ? def.temperature : temp,
          humidity: isNaN(humidity) ? def.humidity : humidity,
          pressure: isNaN(pressure) ? def.pressure : pressure,
          windSpeed: isNaN(wind) ? def.windSpeed : wind,
          stationName: 'Stacja IMGW-PIB Toruń',
          source: 'live_imgw_synop',
          updatedAt: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        };
        return imgwResult;
      }
    } catch (imgwErr) {
      console.warn('IMGW fallback also failed:', imgwErr);
    }

    // Jeśli wszystko zawiedzie, użyj starych danych z cache lub wartości domyślnych
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data) return parsed.data;
      }
    } catch {}

    return getDefaultWeatherData();
  }
}
