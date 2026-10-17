import React from 'react';
import { Modal, ModalHeader } from './ui.jsx';
import { useWeather } from '../WeatherContext.jsx';

export default function WeatherModal({ isOpen, onClose }) {
  const { weather, isRefreshing, refresh } = useWeather();

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} size="lg" center labelledBy="weather-modal-title">
      <ModalHeader
        id="weather-modal-title"
        title="Pogoda i jakość powietrza"
        icon="thermostat"
        onClose={onClose}
      />

      <div className="flex flex-col space-y-4 text-on-surface">
        {/* ── Hero Weather Card ── */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-surface-container-low border border-outline-variant/60">
          <div className="flex items-center gap-1.5 mb-3 text-xs text-secondary font-medium">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-16 text-primary">location_on</span>
            <span>Toruń • Stare Miasto</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-2xl ${weather.iconBgColor || 'bg-amber-500/10'} flex items-center justify-center shrink-0 shadow-inner`}>
                <span aria-hidden="true" className={`material-symbols-outlined text-fs-36 ${weather.iconColor || 'text-amber-500'}`}>
                  {weather.icon}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
                    {weather.temperature}°C
                  </span>
                  <span className="text-sm font-semibold text-secondary">
                    {weather.conditionText}
                  </span>
                </div>
                <div className="text-xs text-secondary mt-0.5">
                  Odczuwalna: <span className="font-semibold text-on-surface">{weather.apparentTemperature}°C</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-fs-11 text-secondary uppercase font-semibold tracking-wider">
                Stacja meteorologiczna
              </span>
              <span className="text-xs font-semibold text-on-surface mt-0.5 max-w-[180px] leading-tight">
                {weather.stationName}
              </span>
            </div>
          </div>
        </div>

        {/* ── Key Metrics Grid (4 tiles) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Wiatr */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18 text-blue-500">air</span>
              <span>Wiatr</span>
            </div>
            <div className="text-base font-bold text-on-surface">
              {weather.windSpeed} <span className="text-xs font-normal text-secondary">km/h</span>
            </div>
          </div>

          {/* Wilgotność */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18 text-sky-500">water_drop</span>
              <span>Wilgotność</span>
            </div>
            <div className="text-base font-bold text-on-surface">
              {weather.humidity}<span className="text-xs font-normal text-secondary">%</span>
            </div>
          </div>

          {/* Ciśnienie */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18 text-indigo-500">compress</span>
              <span>Ciśnienie</span>
            </div>
            <div className="text-base font-bold text-on-surface">
              {weather.pressure} <span className="text-xs font-normal text-secondary">hPa</span>
            </div>
          </div>

          {/* Opady */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18 text-cyan-500">rainy</span>
              <span>Opady</span>
            </div>
            <div className="text-base font-bold text-on-surface">
              {weather.precipitation} <span className="text-xs font-normal text-secondary">mm</span>
            </div>
          </div>
        </div>

        {/* ── Air Quality Section (AQI) ── */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-20 text-emerald-500">
                eco
              </span>
              <span className="font-bold text-sm text-on-surface">
                Indeks jakości powietrza (AQI)
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md font-semibold text-xs ${weather.aqiBadgeClass}`}>
              AQI {weather.aqi} • {weather.aqiLabel}
            </span>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            {weather.aqiStatusSummary}
          </p>

          {/* Visual scale meter */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary dark:border-[#090d14] shadow-sm -ml-1.5 transition-all duration-300"
                style={{ left: `${Math.min(100, Math.max(5, (weather.aqi / 100) * 100))}%` }}
                title={`AQI: ${weather.aqi}`}
              ></div>
            </div>
            <div className="flex justify-between text-fs-10 text-secondary font-medium">
              <span>Bardzo dobra (0)</span>
              <span>Umiarkowana (50)</span>
              <span>Zła (100+)</span>
            </div>
          </div>

          {/* PM values */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/40 dark:border-white/10 text-xs">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-container">
              <span className="text-secondary">Pył PM2.5:</span>
              <span className="font-semibold text-on-surface">{weather.pm25} µg/m³</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-container">
              <span className="text-secondary">Pył PM10:</span>
              <span className="font-semibold text-on-surface">{weather.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* ── Hourly Forecast (Prognoza godzinowa) ── */}
        {weather.hourly && weather.hourly.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-secondary">
              <span>Prognoza na kolejne godziny</span>
              <span>Toruń</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {weather.hourly.map((h, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-2.5 min-w-[70px] rounded-xl bg-surface-container-low border border-outline-variant/60 shrink-0 text-center space-y-1"
                >
                  <span className="text-fs-11 font-medium text-secondary">{h.time}</span>
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-22 text-amber-500">
                    {h.icon}
                  </span>
                  <span className="text-xs font-bold text-on-surface">{h.temp}°C</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3-Day Forecast (Prognoza na kolejne dni) ── */}
        {weather.daily && weather.daily.length > 0 && (
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-semibold text-secondary">Prognoza 3-dniowa dla Torunia</span>
            <div className="flex flex-col divide-y divide-outline-variant/40 dark:divide-white/10 rounded-xl bg-surface-container-low border border-outline-variant/60 overflow-hidden">
              {weather.daily.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2.5 min-w-[120px]">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-20 text-amber-500">
                      {d.icon}
                    </span>
                    <span className="font-semibold capitalize text-on-surface">{d.day}</span>
                  </div>
                  <span className="text-secondary text-fs-11 truncate px-2">{d.conditionText}</span>
                  <div className="flex items-center gap-2 font-bold shrink-0">
                    <span className="text-on-surface">{d.maxTemp}°</span>
                    <span className="text-secondary font-medium">{d.minTemp}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer: Update Info & Refresh Button ── */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60 dark:border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-secondary">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-16">schedule</span>
            <span>Aktualizacja: {weather.updatedAt || 'teraz'}</span>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <span
              aria-hidden="true"
              className={`material-symbols-outlined text-fs-16 ${isRefreshing ? 'animate-spin' : ''}`}
            >
              refresh
            </span>
            <span>{isRefreshing ? 'Odświeżanie...' : 'Odśwież'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
