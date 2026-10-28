// AgriVision AI - Reusable API Client for Backend Services

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'agrivision_auth_token';
const USER_KEY = 'agrivision_auth_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  
  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...options.headers };

  // Attach auth token if available and not already set
  const token = authStorage.getToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, set Content-Type to JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned invalid response (${response.status})`);
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Base URL access for static media (e.g. /uploads)
  baseUrl: API_BASE.replace(/\/api$/, ''),

  // System Health
  getHealth: () => request('/health'),

  // Authentication
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => request('/auth/me'),

  // Scans & Inference
  detectDisease: (formData) =>
    request('/scans/detect', {
      method: 'POST',
      body: formData
    }),

  getScanHistory: () => request('/scans/history'),

  getScanById: (scanId) => request(`/scans/${scanId}`),

  deleteScan: (scanId) =>
    request(`/scans/${scanId}`, {
      method: 'DELETE'
    })
};
