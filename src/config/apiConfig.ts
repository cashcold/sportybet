import { Capacitor } from '@capacitor/core';

/**
 * Resolves the API Base URL based on runtime environment:
 * - Native Android / iOS (Capacitor): routes to live Vercel backend URL (or VITE_API_URL).
 * - Web Browser / Local Dev: routes to relative '/api'.
 */
export function getApiBaseUrl(): string {
  // 1. Explicit environment variable during build (e.g. VITE_API_URL=https://your-app.vercel.app)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '') + '/api';
  }

  // 2. Local storage override for debugging or dynamic configuration
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('sportybet_backend_url');
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.replace(/\/+$/, '') + '/api';
    }
  }

  // 3. Native Capacitor Android/iOS detection
  const isNative = Capacitor.isNativePlatform() ||
    (typeof window !== 'undefined' && (
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:' ||
      (window.location.hostname === 'localhost' && window.location.port === '' && !import.meta.env.DEV)
    ));

  if (isNative) {
    // Fallback to the live Vercel URL
    return 'https://sportybet.vercel.app/api';
  }

  // 4. Default for web browsers (uses same-origin proxy or relative /api)
  return '/api';
}

/**
 * Resolves any endpoint path to full URL respecting the configured API base.
 * @example resolveApiUrl('/api/football/status') -> 'https://sportybet.vercel.app/api/football/status' (in APK) or '/api/football/status' (in web)
 */
export function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/api') ? path.slice(4) : path;
  const pathWithSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${base}${pathWithSlash}`;
}
