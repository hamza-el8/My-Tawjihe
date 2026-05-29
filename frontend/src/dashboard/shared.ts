// ─── Shared types, API helper, icons ─────────────────────────────────────────

export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'eleve' | 'parent' | 'professeur' | 'admin';
  niveau?: string;
  filiere?: string;
  ville?: string;
  specialite?: string;
  eleveId?: number;
}

export interface Note {
  id: number;
  matiere: string;
  valeur: number;
  coefficient: number;
  periode: string;
  type: string;
  eleveId: number;
  createdAt: string;
}

export interface Exercice {
  id: number;
  matiere: string;
  niveau: string;
  difficulte: string;
  contenu: string;
  correction: string;
  professeurId: number;
}

export interface Concours {
  id: number;
  nom: string;
  dateConcours?: string;
  seuil: number;
  lien?: string;
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Notification {
  id: number;
  contenu: string;
  type: string;
  lu: boolean;
  eleveId: number;
  createdAt: string;
}

// ─── API_URL from env (falls back to localhost for dev) ───────────────────────
const API: string = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:5000/api';

export const apiFetch = async (path: string, opts: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts.headers as Record<string, string>),
    },
  });

  // Token expired or invalid — redirect to login
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Session expirée');
  }

  if (!res.ok) {
    const text = await res.text();
    try { throw new Error(JSON.parse(text).message || text); }
    catch { throw new Error(text); }
  }
  return res.json();
};

export const icons = {
  dashboard: '◈', notes: '📊', exercices: '📝', roadmap: '🧭',
  chatbot: '🤖', concours: '🏆', annales: '📚', notifications: '🔔',
  prof: '👨‍🏫', eleves: '👥', admin: '⚙️', logout: '→',
  send: '↑', plus: '+', close: '×', check: '✓', star: '★', menu: '☰',
};

export const diffColor = (d: string) =>
  d === 'facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : d === 'difficile' ? 'bg-rose-50 text-rose-700 border-rose-200'
  : 'bg-amber-50 text-amber-700 border-amber-200';
