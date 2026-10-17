/** @type {import('tailwindcss').Config} */
const rem = (px) => `${px / 16}rem`;
const sc = (px) => `calc(${rem(px)} * var(--font-scale, 1))`;
const fs = (px, lh, extra = {}) => [sc(px), lh ? { lineHeight: sc(lh), ...extra } : { ...extra }];

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Modern Monochromatic Slate/Zinc Palette (Light Mode) ── */
        "primary": "#0f172a",
        "primary-container": "#0f172a",
        "on-primary": "#ffffff",
        "on-primary-container": "#f8fafc",
        "primary-fixed": "#f1f5f9",
        "primary-fixed-dim": "#e2e8f0",
        "on-primary-fixed": "#0f172a",
        "on-primary-fixed-variant": "#334155",

        "surface": "#ffffff",
        "background": "#f8fafc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8fafc",
        "surface-container": "#f1f5f9",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        "surface-bright": "#ffffff",
        "surface-dim": "#f1f5f9",
        "surface-variant": "#f1f5f9",
        "surface-tint": "#0f172a",

        "on-surface": "#0f172a",
        "on-background": "#0f172a",
        "on-surface-variant": "#475569",

        "secondary": "#64748b",
        "on-secondary": "#ffffff",
        "secondary-container": "#f1f5f9",
        "on-secondary-container": "#1e293b",
        "secondary-fixed": "#e2e8f0",
        "secondary-fixed-dim": "#cbd5e1",
        "on-secondary-fixed": "#0f172a",
        "on-secondary-fixed-variant": "#334155",

        "tertiary": "#059669",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#059669",
        "on-tertiary-container": "#065f46",
        "tertiary-fixed": "#d1fae5",
        "tertiary-fixed-dim": "#a7f3d0",
        "on-tertiary-fixed": "#064e3b",
        "on-tertiary-fixed-variant": "#065f46",

        "error": "#ef4444",
        "on-error": "#ffffff",
        "error-container": "#fef2f2",
        "on-error-container": "#991b1b",

        "outline": "#cbd5e1",
        "outline-variant": "#e2e8f0",

        "inverse-surface": "#0f172a",
        "inverse-on-surface": "#f8fafc",
        "inverse-primary": "#f8fafc",
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.625rem",
        "xl": "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "margin": "1.25rem",
        "margin-desktop": "3rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "gutter": "1rem",
        "gutter-desktop": "1.5rem",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "title-md": ["Inter", "sans-serif"],
        "title-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"]
      },
      fontSize: {
        /* every size follows the user's font-size preference (--font-scale) */
        ...Object.fromEntries(Array.from({ length: 41 }, (_, i) => [`fs-${i + 8}`, sc(i + 8)])),
        "xs": fs(12, 16),
        "sm": fs(14, 20),
        "base": fs(16, 24),
        "lg": fs(18, 28),
        "xl": fs(20, 28),
        "2xl": fs(24, 32),
        "3xl": fs(30, 36),
        "4xl": fs(36, 40),
        "label-sm": fs(11, 14, { letterSpacing: "0.02em", fontWeight: "600" }),
        "label-md": fs(12, 16, { letterSpacing: "0.01em", fontWeight: "500" }),
        "label-lg": fs(14, 20, { fontWeight: "500" }),
        "body-sm": fs(13, 18, { fontWeight: "400" }),
        "body-md": fs(14, 21, { fontWeight: "400" }),
        "body-lg": fs(16, 24, { fontWeight: "400" }),
        "title-md": fs(15, 21, { fontWeight: "600" }),
        "title-lg": fs(17, 23, { fontWeight: "600" }),
        "headline-sm": fs(19, 25, { fontWeight: "600" }),
        "headline-md": fs(22, 28, { letterSpacing: "-0.01em", fontWeight: "700" }),
        "headline-lg": fs(30, 38, { letterSpacing: "-0.015em", fontWeight: "700" }),
        "headline-lg-mobile": fs(24, 32, { letterSpacing: "-0.015em", fontWeight: "700" }),
        "display-lg": fs(38, 46, { letterSpacing: "-0.02em", fontWeight: "700" }),
        "display-lg-mobile": fs(28, 36, { letterSpacing: "-0.02em", fontWeight: "700" })
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'desktop': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 10px 24px -3px rgba(15, 23, 42, 0.07)',
        'elevated': '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        slideInLeft: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
