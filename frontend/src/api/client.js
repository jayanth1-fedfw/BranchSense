const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://branchsense-api.onrender.com/api');

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
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
