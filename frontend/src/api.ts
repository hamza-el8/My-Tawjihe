const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── 401 redirect helper ──────────────────────────────────────────────────────
function handleUnauthorized() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Reload so App re-evaluates auth state and shows the landing/login page
  window.location.reload();
}

// ─── Core fetch ───────────────────────────────────────────────────────────────
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Handle expired / invalid token globally
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, motDePasse: password }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register(userData: Record<string, any>) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// ─── Notes ────────────────────────────────────────────────────────────────────
export async function getNotes(eleveId: number, limit = 50, offset = 0) {
  return apiRequest(`/eleves/${eleveId}/notes?limit=${limit}&offset=${offset}`);
}

export async function createNote(note: Record<string, any>) {
  return apiRequest('/notes', { method: 'POST', body: JSON.stringify(note) });
}

export async function deleteNote(id: number) {
  return apiRequest(`/notes/${id}`, { method: 'DELETE' });
}

// ─── Exercices ────────────────────────────────────────────────────────────────
export async function getExercices(filters?: { matiere?: string; difficulte?: string; niveau?: string; limit?: number; offset?: number }) {
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return apiRequest(`/exercices${params ? '?' + params : ''}`);
}

export async function submitExercice(id: number, reponse: string) {
  // eleveId no longer sent — backend uses token
  return apiRequest(`/exercices/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ reponse }),
  });
}

export async function createExercice(data: Record<string, any>) {
  return apiRequest('/exercices', { method: 'POST', body: JSON.stringify(data) });
}

export async function getResultats(eleveId: number, limit = 50, offset = 0) {
  return apiRequest(`/exercices/resultats/${eleveId}?limit=${limit}&offset=${offset}`);
}

// ─── Roadmap & AI ─────────────────────────────────────────────────────────────
export async function getRoadmap(eleveId: number) {
  return apiRequest(`/roadmap/${eleveId}`);
}

export async function generateRoadmap() {
  // eleveId comes from token on the server now
  return apiRequest('/roadmap/generate', { method: 'POST', body: JSON.stringify({}) });
}

// ─── Concours & Annales ───────────────────────────────────────────────────────
export async function getConcours(limit = 50, offset = 0) {
  return apiRequest(`/concours?limit=${limit}&offset=${offset}`);
}

export async function createConcours(data: Record<string, any>) {
  return apiRequest('/concours', { method: 'POST', body: JSON.stringify(data) });
}

export async function getAnnales(filters?: { matiere?: string; annee?: string; limit?: number; offset?: number }) {
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return apiRequest(`/annales${params ? '?' + params : ''}`);
}

export async function createAnnale(data: Record<string, any>) {
  return apiRequest('/annales', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(eleveId: number, limit = 50, offset = 0) {
  return apiRequest(`/notifications/${eleveId}?limit=${limit}&offset=${offset}`);
}

export async function markNotificationRead(id: number) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function createNotification(data: Record<string, any>) {
  return apiRequest('/notifications', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Prof ─────────────────────────────────────────────────────────────────────
export async function getElevesFaibles() {
  return apiRequest('/prof/eleves-faibles');
}

export async function postServiceOffre(data: Record<string, any>) {
  return apiRequest('/prof/services', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export async function getUsers() {
  return apiRequest('/admin/users');
}

export async function deleteUser(role: string, id: number) {
  return apiRequest(`/admin/users/${role}/${id}`, { method: 'DELETE' });
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export async function contactMessage(data: { name: string; email: string; message: string }) {
  return apiRequest('/contact', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Auth extras ──────────────────────────────────────────────────────────────
export async function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function linkStudent(eleveEmail: string) {
  return apiRequest('/auth/link-student', {
    method: 'POST',
    body: JSON.stringify({ eleveEmail }),
  });
}

export async function getLinkedStudent() {
  return apiRequest('/auth/linked-student');
}

export async function saveOnetProfile(data: Record<string, any>) {
  return apiRequest('/onet/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOnetProfile() {
  return apiRequest('/onet/profile');
}

export async function sendChatMessage(
  message: string,
  history: { role: string; content: string }[] = []
) {
  // eleveId comes from token on the server
  return apiRequest('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
}
