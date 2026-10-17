import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import { PrefsProvider } from './PrefsContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { ToastProvider } from './ToastContext.jsx';
import { WeatherProvider } from './WeatherContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <PrefsProvider>
        <AuthProvider>
          <ToastProvider>
            <WeatherProvider>
              <App />
            </WeatherProvider>
          </ToastProvider>
        </AuthProvider>
      </PrefsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
