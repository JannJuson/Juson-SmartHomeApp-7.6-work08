/**
 * App-wide configuration.
 *
 * Set EXPO_PUBLIC_API_URL (see .env.example) to talk to your backend.
 * When it is empty the app runs on built-in demo data.
 */
const rawUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

/** Backend base URL without a trailing slash, e.g. http://192.168.1.20:3000/api */
export const API_BASE_URL = rawUrl.trim().replace(/\/+$/, '');

/** True when no backend is configured, or when EXPO_PUBLIC_USE_MOCK=true. */
export const USE_MOCK =
    API_BASE_URL === '' || process.env.EXPO_PUBLIC_USE_MOCK === 'true';

/** How long a request may take before it is treated as failed. */
export const REQUEST_TIMEOUT_MS = 8000;

/** How often live sensor readings refresh while the gateway is connected. */
export const SENSOR_POLL_INTERVAL_MS = 15000;
