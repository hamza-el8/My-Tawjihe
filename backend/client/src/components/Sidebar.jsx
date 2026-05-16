import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const menus = {
  eleve: [
    { path: '/eleve', label: '🏠 Accueil' },
    { path: '/eleve/notes', label: '📊 Mes Notes' },
    { path: '/eleve/exercices', label: '📝 Exercices' },
    { path: '/eleve/roadmap', label: '🗺️ Roadmap IA' },
    { path: '/eleve/chatbot', label: '🤖 Chatbot IA' },
    { path: '/eleve/concours', label: '🏆 Concours' },
    { path: '/eleve/annales', label: '📚 Annales' },
    { path: '/eleve/notifications', label: '🔔 Notifications' },
  ],
  parent: [
    { path: '/parent', label: '🏠 Accueil' },
    { path: '/parent/notes', label: '📊 Notes Enfant' },
  ],
  professeur: [
    { path: '/prof', label: '🏠 Accueil' },
    { path: '/prof/eleves-faibles', label: '⚠️ Élèves en difficulté' },
    { path: '/prof/exercices', label: '📝 Mes Exercices' },
  ],
  admin: [
    { path: '/admin', label: '🏠 Accueil' },
    { path: '/admin/users', label: '👥 Utilisateurs' },
    { path: '/admin/exercices', label: '📝 Exercices' },
    { path: '/admin/concours', label: '🏆 Concours' },
    { path: '/admin/notifications', label: '🔔 Notifications' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = menus[user?.role] || [];

  return (
    <aside className="sidebar w-64 min-h-screen flex flex-col text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-black gold">Mowajih AI</h1>
        <p className="text-xs text-white/50 mt-1">Orientation Intelligente</p>
      </div>
      <div className="p-4 border-b border-white/10">
        <p className="text-sm font-semibold">{user?.nom}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 capitalize">{user?.role}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(l => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
              pathname === l.path ? 'bg-yellow-500/20 text-yellow-300 font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-sm text-white/50 hover:text-white py-2">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
