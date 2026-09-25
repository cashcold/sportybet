import { Capacitor } from '@capacitor/core';

export const STORAGE_KEY_API_URL = 'sportybet_backend_url';

/**
 * Hardcoded production backend for Android APK builds
 * Ensures APK calls the live Vercel backend with MongoDB rather than capacitor://localhost
 */
export const DEFAULT_PRODUCTION_BACKEND = 'https://sportybet-sand.vercel.app';

/**
 * Checks if running inside native Android/iOS Capacitor shell
 */
export function isNativePlatform(): boolean {
  if (Capacitor.isNativePlatform()) return true;
  if (typeof window !== 'undefined') {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    if (proto === 'capacitor:' || proto === 'ionic:') return true;
    if ((host === 'localhost' || host === '127.0.0.1') && window.location.port === '' && !import.meta.env.DEV) {
      return true;
    }
  }
  return false;
}

/**
 * Normalizes any user-entered base URL to end with '/api' (without trailing slash)
 */
export function normalizeApiUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim().replace(/\/+$/, '');
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  // If user didn't append /api, add it
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

/**
 * Returns the currently active API base URL.
 * Order of precedence:
 * 1. Saved custom URL from localStorage (allows fixing APK without rebuilding)
 * 2. Build-time environment variable VITE_API_URL
 * 3. If running on Web: relative '/api' (routes to current web origin)
 * 4. If running on Native Android/iOS: hardcoded live Vercel production backend
 */
export function getApiBaseUrl(): string {
  // 1. Saved custom URL from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_API_URL);
    if (saved && saved.trim()) {
      return normalizeApiUrl(saved);
    }
  }

  // 2. Build-time environment variable (e.g. VITE_API_URL)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return normalizeApiUrl(envUrl);
  }

  // 3. Web browsers (same-origin relative '/api')
  if (!isNativePlatform()) {
    return '/api';
  }

  // 4. Native Capacitor: check if opened from a remote web origin that isn't localhost
  if (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost')) {
    return normalizeApiUrl(window.location.origin);
  }

  // 5. Native APK default: live Vercel production backend (https://sportybet-sand.vercel.app/api)
  return normalizeApiUrl(DEFAULT_PRODUCTION_BACKEND);
}

/**
 * Sets a custom backend API URL in localStorage
 */
export function setCustomApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const trimmed = (url || '').trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY_API_URL, normalizeApiUrl(trimmed));
    } else {
      localStorage.removeItem(STORAGE_KEY_API_URL);
    }
  }
}

/**
 * Gets saved API URL if any
 */
export function getSavedApiUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY_API_URL) || '';
  }
  return '';
}

/**
 * Clears saved custom API URL from localStorage
 */
export function clearCustomApiUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  }
}

/**
 * Resolves any endpoint path to full URL respecting the configured API base.
 * @example resolveApiUrl('/api/football/status') -> 'https://example.com/api/football/status' or '/api/football/status'
 */
export function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/api') ? path.slice(4) : path;
  const pathWithSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  if (!base || base === '/api') {
    return `/api${pathWithSlash}`;
  }

  return `${base}${pathWithSlash}`;
}

/**
 * Tests connection to a backend API URL
 */
export async function testApiConnection(targetUrl?: string): Promise<{ success: boolean; latencyMs?: number; error?: string; status?: number }> {
  const base = targetUrl ? normalizeApiUrl(targetUrl) : getApiBaseUrl();
  if (!base) {
    return { success: false, error: 'No backend API URL is configured' };
  }

  const testEndpoint = base.startsWith('http') ? base : `${window.location.origin}${base}`;
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(testEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    const latency = Math.round(performance.now() - start);
    if (res.ok || res.status < 500) {
      return { success: true, latencyMs: latency, status: res.status };
    }
    return { success: false, status: res.status, error: `Server responded with HTTP ${res.status}` };
  } catch (err: any) {
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out (7s)' : (err.message || 'Failed to fetch')
    };
  }
}
