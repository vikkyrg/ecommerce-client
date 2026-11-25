import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredApiUrl) {
  throw new Error('VITE_API_URL is required. Set it to the backend origin.');
}

let parsedApiUrl;
try {
  parsedApiUrl = new URL(configuredApiUrl);
} catch {
  throw new Error('VITE_API_URL must be a valid HTTP or HTTPS backend URL.');
}
if (!['http:', 'https:'].includes(parsedApiUrl.protocol)) {
  throw new Error('VITE_API_URL must use HTTP or HTTPS.');
}
if (parsedApiUrl.pathname !== '/' || parsedApiUrl.search || parsedApiUrl.hash) {
  throw new Error('VITE_API_URL must be the backend origin without an API path or query string.');
}
if (import.meta.env.PROD &&
  (parsedApiUrl.hostname === 'localhost' ||
    parsedApiUrl.hostname === '127.0.0.1' ||
    parsedApiUrl.hostname.includes('your-backend-domain'))) {
  throw new Error('Production VITE_API_URL must be a deployed backend origin, not localhost or a placeholder.');
}

export const API_ORIGIN = parsedApiUrl.origin;
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const resolveImageUrl = imageUrl => {
  if (typeof imageUrl !== 'string') return imageUrl;
  if (imageUrl.startsWith('/api/images/')) return `${API_ORIGIN}${imageUrl}`;

  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const url = new URL(imageUrl);
      if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
        url.pathname.startsWith('/api/images/')) {
        return `${API_ORIGIN}${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return imageUrl;
    }
  }

  return imageUrl;
};

const normalizeImageUrls = value => {
  if (typeof value === 'string') return resolveImageUrl(value);
  if (Array.isArray(value)) return value.map(normalizeImageUrls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, normalizeImageUrls(child)])
    );
  }
  return value;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = typeof localStorage !== 'undefined'
    ? localStorage.getItem('ns_stone_token')
    : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => {
    response.data = normalizeImageUrls(response.data);
    return response;
  },
  error => {
    const responseBody = error.response?.data;
    const message = typeof responseBody === 'string'
      ? responseBody.trim().slice(0, 200)
      : responseBody?.message;
    if (message) error.message = message;
    else if (error.response) error.message = `API request failed (HTTP ${error.response.status}).`;
    else if (error.code === 'ECONNABORTED') error.message = 'The API request timed out.';
    else error.message = 'Unable to reach the API server. Check VITE_API_URL and backend availability.';
    return Promise.reject(error);
  }
);

export default api;
