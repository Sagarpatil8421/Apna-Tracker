/**
 * Central API Configuration
 * Safely handles both development (relative URLs) and production (deployed backend URL)
 */

// Detect production environment
const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD
  ? import.meta.env.PROD
  : process.env.NODE_ENV === 'production';

// Base URL for API requests
// In production: use deployed backend URL from environment variable
// In development: use relative URL (proxied via Vite to localhost:5000)
export const BASE_URL = isProd
  ? import.meta.env.VITE_API_URL || 'https://api.apna-tracker.onrender.com'
  : '';

/**
 * Default fetch options with credentials for cookie-based auth
 */
export const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Construct full API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/topics')
 * @returns {string} Full URL with base
 */
export const getApiUrl = (endpoint) => {
  // If endpoint is already absolute, use as-is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  return `${BASE_URL}${endpoint}`;
};

/**
 * Merge fetch options with default credentials
 * @param {object} options - Custom fetch options
 * @returns {object} Merged options
 */
export const mergeFetchOptions = (options = {}) => ({
  ...DEFAULT_FETCH_OPTIONS,
  ...options,
  headers: {
    ...DEFAULT_FETCH_OPTIONS.headers,
    ...options.headers,
  },
});
