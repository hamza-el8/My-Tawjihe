import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  nom: string;
  email: string;
  role: 'eleve' | 'parent' | 'professeur' | 'admin';
  niveau?: string;
  filiere?: string;
  eleveId?: number;
}

interface Note {
  id: number;
  matiere: string;
  valeur: number;
  coefficient: number;
  periode: string;
  type: string;
}

interface Notification {
  id: number;
  contenu: string;
  type: string;
  lu: boolean;
  createdAt: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Exercice {
  id: number;
  matiere: string;
  niveau: string;
  difficulte: string;
  contenu: string;
  correction: string;
}

interface Concours {
  id: number;
  nom: string;
  datw: string;
  seuil: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api';

const apiFetch = async (path: string, opts: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts.headers as Record<string, string>),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: '◈',
  notes: '📊',
  exercices: '📝',
  roadmap: '🧭',
  chatbot: '🤖',
  concours: '🏆',
  annales: '📚',
  notifications: '🔔',
  prof: '👨‍🏫',
  eleves: '👥',
  admin: '⚙️',
  logout: '→',
  send: '↑',
  plus: '+',
  close: '×',
  check: '✓',
  star: '★',
  menu: '☰',
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const elevMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'notes', label: 'Mes Notes', icon: icons.notes },
  { id: 'exercices', label: 'Exercices', icon: icons.exercices },
  { id: 'roadmap', label: 'Roadmap IA', icon: icons.roadmap },
  { id: 'chatbot', label: 'Assistant IA', icon: icons.chatbot },
  { id: 'concours', label: 'Concours', icon: icons.concours },
  { id: 'annales', label: 'Annales', icon: icons.annales },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications },
];
const profMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'eleves', label: 'Élèves en difficulté', icon: icons.eleves },
  { id: 'exercices', label: 'Créer exercice', icon: icons.exercices },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications },
];
const adminMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'users', label: 'Utilisateurs', icon: icons.eleves },
  { id: 'concours', label: 'Concours', icon: icons.concours },
  { id: 'notifications', label: 'Envoyer notif', icon: icons.notifications },
];
const parentMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'suivi', label: 'Suivi de mon élève', icon: icons.notes },
];

function Sidebar({
  user, active, setActive, onLogout, mobile, onClose,
}: {
  user: User; active: string; setActive: (s: string) => void;
  onLogout: () => void; mobile?: boolean; onClose?: () => void;
}) {
  const menu =
    user.role === 'eleve' ? elevMenu
    : user.role === 'professeur' ? profMenu
    : user.role === 'admin' ? adminMenu
    : parentMenu;

  const roleColors: Record<string, string> = {
    eleve: 'from-violet-600 to-purple-700',
    professeur: 'from-blue-600 to-indigo-700',
    admin: 'from-rose-600 to-pink-700',
    parent: 'from-emerald-600 to-teal-700',
  };
  const roleLabels: Record<string, string> = {
    eleve: 'Étudiant', professeur: 'Professeur', admin: 'Administrateur', parent: 'Parent',
  };

  return (
    <div className={`flex flex-col h-full bg-gray-950 text-white ${mobile ? '' : ''}`}
      style={{ width: mobile ? '100%' : '260px', minHeight: '100vh' }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className="font-black text-lg">
              My<span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tawjeh</span>
            </span>
          </div>
          {mobile && onClose && (
            <button onClick={onClose} className="text-white/50 hover:text-white text-xl">{icons.close}</button>
          )}
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4">
        <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center font-black text-white text-sm flex-shrink-0`}>
            {user.nom.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">{user.nom}</div>
            <div className="text-xs text-white/40 font-medium">{roleLabels[user.role]}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
              active === item.id
                ? 'text-white shadow-lg'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            style={active === item.id ? {
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.15))',
              border: '1px solid rgba(139,92,246,0.3)',
            } : {}}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
            {active === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          <span className="text-base">{icons.logout}</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title, subtitle, onMenuClick, notifCount }: {
  title: string; subtitle?: string; onMenuClick: () => void; notifCount?: number;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
          {icons.menu}
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {notifCount !== undefined && notifCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100">
          <span className="text-sm">{icons.notifications}</span>
          <span className="text-xs font-bold text-violet-700">{notifCount} non lue{notifCount > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function NotesPage({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });

  useEffect(() => {
    apiFetch(`/eleves/${user.id}/notes`).then(setNotes).finally(() => setLoading(false));
  }, [user.id]);

  const moyenneGenerale = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(2)
    : '—';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const note = await apiFetch('/notes', {
      method: 'POST',
      body: JSON.stringify({ ...form, valeur: parseFloat(form.valeur), coefficient: parseFloat(form.coefficient), eleveId: user.id }),
    });
    setNotes([note, ...notes]);
    setShowForm(false);
    setForm({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });
  };

  const deleteNote = async (id: number) => {
    await apiFetch(`/notes/${id}`, { method: 'DELETE' });
    setNotes(notes.filter((n) => n.id !== id));
  };

  const colorVal = (v: number) =>
    v >= 14 ? 'text-emerald-600 bg-emerald-50' : v >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Mes Notes</h2>
          <p className="text-sm text-gray-400">Moyenne générale : <span className="font-bold text-violet-700">{moyenneGenerale}</span></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
        >
          <span>{icons.plus}</span> Ajouter une note
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Nouvelle note</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input required placeholder="Matière" value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input required type="number" min="0" max="20" step="0.25" placeholder="Note /20" value={form.valeur} onChange={(e) => setForm({ ...form, valeur: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input type="number" min="1" max="5" step="0.5" placeholder="Coefficient" value={form.coefficient} onChange={(e) => setForm({ ...form, coefficient: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <select value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>S1</option><option>S2</option><option>Annuel</option>
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>Contrôle</option><option>Devoir</option><option>Examen</option><option>TP</option>
            </select>
            <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 font-medium">Aucune note enregistrée</p>
          <p className="text-sm text-gray-300 mt-1">Commencez par ajouter votre première note</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Coeff.</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Période</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">{note.matiere}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${colorVal(note.valeur)}`}>
                      {note.valeur}/20
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{note.coefficient}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{note.periode}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">{note.type}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => deleteNote(note.id)} className="text-gray-300 hover:text-rose-500 transition-colors text-lg">{icons.close}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CHATBOT PAGE ─────────────────────────────────────────────────────────────
function ChatbotPage({ user }: { user: User }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Bonjour ${user.nom} ! 👋 Je suis Mowajih AI, votre assistant d'orientation académique. Comment puis-je vous aider aujourd'hui ?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await apiFetch('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: msg, eleveId: user.id }),
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Désolé, une erreur s'est produite. Vérifiez votre connexion." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold ${
              msg.role === 'assistant'
                ? 'text-white'
                : 'bg-gray-200 text-gray-600'
            }`} style={msg.role === 'assistant' ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
              {msg.role === 'assistant' ? '🤖' : user.nom.charAt(0)}
            </div>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'text-white rounded-tr-sm'
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
            }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🤖</div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Posez votre question à Mowajih AI..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none bg-gray-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
          >
            {icons.send}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user }: { user: User }) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    apiFetch(`/roadmap/${user.id}`)
      .then((r) => { if (r?.parcours) setRoadmap(JSON.parse(r.parcours)); })
      .finally(() => setFetching(false));
  }, [user.id]);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ eleveId: user.id }),
      });
      if (data.result) setRoadmap(data.result);
    } catch (e: any) {
      alert('Erreur lors de la génération : ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6 text-center text-gray-400 py-20">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Roadmap Professionnel IA</h2>
          <p className="text-sm text-gray-400">Généré selon votre profil et vos notes</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
        >
          {loading ? '⏳ Génération...' : '🧭 Générer un roadmap'}
        </button>
      </div>

      {!roadmap ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🧭</div>
          <p className="text-gray-500 font-medium text-lg">Aucun roadmap généré</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Cliquez sur "Générer" pour obtenir votre roadmap personnalisé par IA</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Métier */}
          <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🎯</div>
              <div>
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">Métier recommandé</div>
                <div className="text-xl font-black text-gray-900">{roadmap.metier}</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{roadmap.description}</p>
          </div>

          {/* Étapes */}
          {roadmap.etapes?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Étapes du parcours</h3>
              <div className="space-y-3">
                {roadmap.etapes.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{i + 1}</div>
                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matières clés + Conseils */}
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.matieresCles?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Matières clés</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.matieresCles.map((m: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {roadmap.conseils && (
              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">💡 Conseils</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{roadmap.conseils}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXERCICES PAGE ───────────────────────────────────────────────────────────
function ExercicesPage({ user }: { user: User }) {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [selected, setSelected] = useState<Exercice | null>(null);
  const [score, setScore] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/exercices').then(setExercices).finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!selected || !score) return;
    await apiFetch(`/exercices/${selected.id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score: parseFloat(score), eleveId: user.id }),
    });
    setSubmitted(true);
  };

  const diffColor = (d: string) =>
    d === 'Facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : d === 'Moyen' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Exercices</h2>

      {selected ? (
        <div>
          <button onClick={() => { setSelected(null); setSubmitted(false); setScore(''); }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            ← Retour aux exercices
          </button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(selected.difficulte)}`}>{selected.difficulte}</span>
              <span className="text-sm text-gray-400">{selected.matiere} · {selected.niveau}</span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 p-4 rounded-xl bg-gray-50">{selected.contenu}</div>

            {!submitted ? (
              <div className="flex items-center gap-3">
                <input type="number" min="0" max="20" step="0.5" placeholder="Votre score /20"
                  value={score} onChange={(e) => setScore(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none w-48" />
                <button onClick={submit} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  Soumettre
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4 text-sm">
                  <span>{icons.check}</span> Score soumis !
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-700 uppercase mb-2">Correction</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.correction}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : exercices.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-400 font-medium">Aucun exercice disponible</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {exercices.map((ex) => (
            <button key={ex.id} onClick={() => { setSelected(ex); setSubmitted(false); setScore(''); }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(ex.difficulte)}`}>{ex.difficulte}</span>
                <span className="text-xs text-gray-400">{ex.niveau}</span>
              </div>
              <div className="text-sm font-bold text-gray-800 mb-1">{ex.matiere}</div>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{ex.contenu.substring(0, 100)}...</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CONCOURS PAGE ────────────────────────────────────────────────────────────
function ConcoursPage() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/concours').then(setConcours).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Concours & Bourses</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : concours.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-gray-400 font-medium">Aucun concours disponible</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {concours.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>🏆</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{c.nom}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>📅 {new Date(c.datw).toLocaleDateString('fr-FR')}</span>
                    <span>·</span>
                    <span>Seuil: <strong className="text-violet-700">{c.seuil}/20</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ user }: { user: User }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/notifications/${user.id}`).then(setNotifs).finally(() => setLoading(false));
  }, [user.id]);

  const markRead = async (id: number) => {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, lu: true } : n)));
  };

  const typeIcon: Record<string, string> = { note: '📊', revision: '📝', info: 'ℹ️', success: '✅' };

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Notifications</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-gray-400 font-medium">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <div key={n.id} className={`bg-white rounded-2xl p-4 border transition-all ${n.lu ? 'border-gray-100 opacity-60' : 'border-violet-100 shadow-sm'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${n.lu ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>{n.contenu}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {!n.lu && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-violet-600 font-bold hover:underline flex-shrink-0">Lire</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ELEVE DASHBOARD ──────────────────────────────────────────────────────────
function EleveDashboard({ user, setActive }: { user: User; setActive: (s: string) => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    apiFetch(`/eleves/${user.id}/notes`).then(setNotes).catch(() => {});
    apiFetch(`/notifications/${user.id}`).then((ns: Notification[]) => setNotifCount(ns.filter((n) => !n.lu).length)).catch(() => {});
  }, [user.id]);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  const quick = [
    { id: 'notes', icon: icons.notes, label: 'Mes notes', desc: 'Ajouter ou consulter' },
    { id: 'roadmap', icon: icons.roadmap, label: 'Roadmap IA', desc: 'Générer mon parcours' },
    { id: 'chatbot', icon: icons.chatbot, label: 'Assistant IA', desc: 'Poser une question' },
    { id: 'exercices', icon: icons.exercices, label: 'Exercices', desc: "S'entraîner" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#a78bfa,transparent)' }} />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium mb-1">Bonjour 👋</p>
          <h2 className="text-2xl font-black mb-1">{user.nom}</h2>
          <p className="text-white/60 text-sm">{user.filiere || 'Filière non définie'} · {user.niveau || ''}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📊" label="Moyenne générale" value={moyenne} color="bg-violet-50 text-violet-600" />
        <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="🔔" label="Notifications" value={notifCount} color="bg-amber-50 text-amber-600" />
        <StatCard icon="🧭" label="Mon profil" value={user.filiere || '—'} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quick.map((q) => (
            <button key={q.id} onClick={() => setActive(q.id)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
              <span className="text-2xl block mb-2">{q.icon}</span>
              <div className="text-sm font-bold text-gray-800">{q.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent notes */}
      {notes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dernières notes</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {notes.slice(0, 4).map((note, i) => (
              <div key={note.id} className={`flex items-center justify-between px-5 py-3.5 ${i < notes.slice(0, 4).length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-800">{note.matiere}</span>
                <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${note.valeur >= 14 ? 'text-emerald-600 bg-emerald-50' : note.valeur >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                  {note.valeur}/20
                </span>
              </div>
            ))}
            <button onClick={() => setActive('notes')} className="w-full text-center py-3 text-xs text-violet-600 font-bold hover:bg-violet-50 transition-colors">
              Voir toutes les notes →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROF DASHBOARD ───────────────────────────────────────────────────────────
function ProfDashboard({ user }: { user: User }) {
  const [eleves, setEleves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/prof/eleves-faibles').then(setEleves).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Tableau de bord</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Professeur · {user.email}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Élèves en difficulté</h3>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Chargement...</div>
        ) : eleves.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Tous les élèves sont en bonne progression</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {eleves.map((e, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < eleves.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">{e.email}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600">{e.moyenne ? `${e.moyenne}/20` : 'En difficulté'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user }: { user: User }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/users').then(setUsers).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#4c0519,#be123c,#e11d48)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Administration</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Administrateur plateforme</p>
      </div>

      <StatCard icon="👥" label="Utilisateurs enregistrés" value={users.length} color="bg-rose-50 text-rose-600" />

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Tous les utilisateurs</h3>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Chargement...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Nom</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{u.nom}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 capitalize">{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const eleveId = user.eleveId;

  useEffect(() => {
    if (eleveId) {
      apiFetch(`/eleves/${eleveId}/notes`).then(setNotes).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [eleveId]);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#064e3b,#059669,#10b981)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Espace Parent</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Suivi de votre élève</p>
      </div>

      {!eleveId ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">👨‍👩‍👧</div>
          <p className="text-gray-500 font-medium">Aucun élève associé à ce compte</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon="📊" label="Moyenne générale" value={moyenne} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Notes de votre élève</h3>
            {loading ? (
              <div className="text-center py-10 text-gray-400">Chargement...</div>
            ) : notes.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">Aucune note disponible</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {notes.map((note, i) => (
                  <div key={note.id} className={`flex items-center justify-between px-5 py-4 ${i < notes.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{note.matiere}</div>
                      <div className="text-xs text-gray-400">{note.periode} · {note.type}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${note.valeur >= 14 ? 'text-emerald-600 bg-emerald-50' : note.valeur >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                      {note.valeur}/20
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      window.location.href = '/';
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    if (u.role === 'eleve') {
      apiFetch(`/notifications/${u.id}`)
        .then((ns: Notification[]) => setNotifCount(ns.filter((n) => !n.lu).length))
        .catch(() => {});
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    dashboard: { title: 'Tableau de bord', subtitle: `Bienvenue, ${user.nom}` },
    notes: { title: 'Mes Notes', subtitle: 'Gérez vos résultats scolaires' },
    exercices: { title: 'Exercices', subtitle: "Entraînez-vous et progressez" },
    roadmap: { title: 'Roadmap Professionnel', subtitle: 'Votre parcours personnalisé par IA' },
    chatbot: { title: 'Assistant Mowajih IA', subtitle: 'Posez vos questions' },
    concours: { title: 'Concours & Bourses', subtitle: 'Opportunités disponibles' },
    annales: { title: 'Annales', subtitle: 'Examens et sujets passés' },
    notifications: { title: 'Notifications', subtitle: 'Vos alertes et messages' },
    eleves: { title: 'Élèves en difficulté', subtitle: 'Suivi pédagogique' },
    users: { title: 'Gestion des utilisateurs', subtitle: 'Administration plateforme' },
    suivi: { title: 'Suivi de mon élève', subtitle: 'Résultats et progression' },
  };

  const renderPage = () => {
    if (user.role === 'eleve') {
      switch (active) {
        case 'dashboard': return <EleveDashboard user={user} setActive={setActive} />;
        case 'notes': return <NotesPage user={user} />;
        case 'exercices': return <ExercicesPage user={user} />;
        case 'roadmap': return <RoadmapPage user={user} />;
        case 'chatbot': return <ChatbotPage user={user} />;
        case 'concours': return <ConcoursPage />;
        case 'annales': return <ConcoursPage />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'professeur') {
      switch (active) {
        case 'dashboard': return <ProfDashboard user={user} />;
        case 'eleves': return <ProfDashboard user={user} />;
        case 'exercices': return <ExercicesPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'admin') {
      switch (active) {
        case 'dashboard': return <AdminDashboard user={user} />;
        case 'users': return <AdminDashboard user={user} />;
        case 'concours': return <ConcoursPage />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'parent') {
      return <ParentDashboard user={user} />;
    }
    return <div className="p-6 text-gray-400">Page en construction...</div>;
  };

  const current = pageTitles[active] || { title: active };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '260px' }}>
        <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 h-full">
            <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={notifCount}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
