const STORAGE_KEY = 'branchsense_api_url';

function getStoredBaseUrl() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function getApiBaseUrl() {
  const stored = getStoredBaseUrl();
  if (stored) return stored;

  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://branchsense-api.onrender.com/api';
}

export function setApiBaseUrl(url) {
  if (typeof window === 'undefined') return;
  const normalized = url.trim().replace(/\/$/, '');
  window.localStorage.setItem(STORAGE_KEY, normalized);
}

export function clearApiBaseUrl() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function request(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const rawText = await res.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { message: rawText };
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed: ${res.status}`);
  }
  return data;
}

async function checkHealth() {
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getApiBaseUrl,
  setApiBaseUrl,
  clearApiBaseUrl,
  checkHealth,

  registerStudent: (payload) =>
    request('/student/register', { method: 'POST', body: JSON.stringify(payload) }),

  submitScores: (student_id, scores) =>
    request('/scores/submit', {
      method: 'POST',
      body: JSON.stringify({ student_id, scores }),
    }),

  getRecommendation: (student_id) => request(`/recommend/${student_id}`),

  getHistory: (student_id) => request(`/student/${student_id}/history`),

  getBranches: () => request('/branches'),
};
