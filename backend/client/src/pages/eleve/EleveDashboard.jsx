import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

const cards = [
  { icon: '📊', label: 'Mes Notes', path: '/eleve/notes', color: 'from-blue-500 to-blue-600' },
  { icon: '📝', label: 'Exercices', path: '/eleve/exercices', color: 'from-purple-500 to-purple-600' },
  { icon: '🗺️', label: 'Roadmap IA', path: '/eleve/roadmap', color: 'from-yellow-500 to-yellow-600' },
  { icon: '🤖', label: 'Chatbot IA', path: '/eleve/chatbot', color: 'from-green-500 to-green-600' },
  { icon: '🏆', label: 'Concours', path: '/eleve/concours', color: 'from-red-500 to-red-600' },
  { icon: '📚', label: 'Annales', path: '/eleve/annales', color: 'from-indigo-500 to-indigo-600' },
];

export default function EleveDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800">Bonjour, {user?.nom} 👋</h2>
        <p className="text-gray-500 mt-1">{user?.niveau} — {user?.filiere}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(c => (
          <button key={c.path} onClick={() => navigate(c.path)}
            className={`card p-6 bg-gradient-to-br ${c.color} text-white hover:scale-105 transition-transform text-left`}>
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="font-bold text-lg">{c.label}</h3>
          </button>
        ))}
      </div>
    </Layout>
  );
}
