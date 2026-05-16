const API_URL = 'http://localhost:5000/api';

// ─── Core fetch ───────────────────────────────────────────────────────────────
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Backend expects: { role, email, motDePasse }
export async function login(email: string, password: string, role: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, motDePasse: password, role }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ ...data.user, role }));
  return data;
}

// Backend expects: { role, nom, email, motDePasse, niveau?, filiere?, ville?, specialite?, eleveId? }
export async function register(userData: Record<string, any>) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return data;
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
export async function getNotes(eleveId: number) {
  return apiRequest(`/eleves/${eleveId}/notes`);
}

export async function createNote(note: Record<string, any>) {
  return apiRequest('/notes', { method: 'POST', body: JSON.stringify(note) });
}

export async function deleteNote(id: number) {
  return apiRequest(`/notes/${id}`, { method: 'DELETE' });
}

// ─── Exercices ────────────────────────────────────────────────────────────────
export async function getExercices(filters?: { matiere?: string; difficulte?: string; niveau?: string }) {
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return apiRequest(`/exercices${params ? '?' + params : ''}`);
}

export async function submitExercice(id: number, score: number, eleveId: number) {
  return apiRequest(`/exercices/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ score, eleveId }),
  });
}

export async function createExercice(data: Record<string, any>) {
  return apiRequest('/exercices', { method: 'POST', body: JSON.stringify(data) });
}

export async function getResultats(eleveId: number) {
  return apiRequest(`/exercices/resultats/${eleveId}`);
}

// ─── Roadmap & AI ─────────────────────────────────────────────────────────────
export async function getRoadmap(eleveId: number) {
  return apiRequest(`/roadmap/${eleveId}`);
}

export async function generateRoadmap(eleveId: number) {
  return apiRequest('/roadmap/generate', {
    method: 'POST',
    body: JSON.stringify({ eleveId }),
  });
}

export async function sendChatMessage(message: string, eleveId?: number) {
  return apiRequest('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ message, eleveId }),
  });
}

// ─── Concours & Annales ───────────────────────────────────────────────────────
export async function getConcours() {
  return apiRequest('/concours');
}

export async function createConcours(data: Record<string, any>) {
  return apiRequest('/concours', { method: 'POST', body: JSON.stringify(data) });
}

export async function getAnnales(filters?: { matiere?: string; annee?: string }) {
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return apiRequest(`/annales${params ? '?' + params : ''}`);
}

export async function createAnnale(data: Record<string, any>) {
  return apiRequest('/annales', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(eleveId: number) {
  return apiRequest(`/notifications/${eleveId}`);
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
