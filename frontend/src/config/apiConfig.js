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
 * Get Bearer token from localStorage
 * @returns {string|null} JWT token or null if not available
 */
const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

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
 * Merge fetch options with default credentials and Authorization header
 * @param {object} options - Custom fetch options
 * @returns {object} Merged options with Bearer token if available
 */
export const mergeFetchOptions = (options = {}) => {
  const token = getToken();
  const headers = {
    ...DEFAULT_FETCH_OPTIONS.headers,
    ...options.headers,
  };

  // Add Authorization header if token is available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
    headers,
  };
};
