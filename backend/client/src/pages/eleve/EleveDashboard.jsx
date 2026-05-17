import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import OnetTest from '../../components/OnetTest';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const cards = [
  { icon: '📊', label: 'Mes Notes',   path: '/eleve/notes',          color: 'from-blue-500 to-blue-600' },
  { icon: '📝', label: 'Exercices',   path: '/eleve/exercices',      color: 'from-purple-500 to-purple-600' },
  { icon: '🗺️', label: 'Roadmap IA', path: '/eleve/roadmap',        color: 'from-yellow-500 to-yellow-600' },
  { icon: '🤖', label: 'Chatbot IA', path: '/eleve/chatbot',         color: 'from-green-500 to-green-600' },
  { icon: '🏆', label: 'Concours',   path: '/eleve/concours',        color: 'from-red-500 to-red-600' },
  { icon: '📚', label: 'Annales',    path: '/eleve/annales',         color: 'from-indigo-500 to-indigo-600' },
];

export default function EleveDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOnetPrompt, setShowOnetPrompt] = useState(false);
  const [showOnetTest, setShowOnetTest] = useState(false);
  const [onetProfile, setOnetProfile] = useState(null);
  const [onetChecked, setOnetChecked] = useState(false);

  useEffect(() => {
    // Check if student has done O*NET
    api.get('/onet/profile')
      .then(r => {
        setOnetProfile(r.data.profil);
        if (!r.data.profil) {
          // Show prompt after short delay for better UX
          setTimeout(() => setShowOnetPrompt(true), 800);
        }
      })
      .catch(() => {
        setTimeout(() => setShowOnetPrompt(true), 800);
      })
      .finally(() => setOnetChecked(true));
  }, []);

  const handleOnetComplete = (result) => {
    setShowOnetTest(false);
    setOnetProfile(result);
    setShowOnetPrompt(false);
  };

  const handleRetakeOnet = () => {
    setShowOnetTest(true);
  };

  // Full-screen O*NET test
  if (showOnetTest) {
    return (
      <OnetTest
        onComplete={handleOnetComplete}
        onSkip={() => setShowOnetTest(false)}
      />
    );
  }

  return (
    <Layout onRetakeOnet={handleRetakeOnet}>
      {/* O*NET Prompt Popup */}
      {showOnetPrompt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,32,68,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 36, maxWidth: 460, width: '100%',
            textAlign: 'center', boxShadow: '0 20px 60px rgba(15,32,68,0.25)',
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎯</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f2044', margin: '0 0 8px' }}>
              Découvrez votre profil de carrière !
            </h3>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
              Passez le test O*NET pour obtenir votre <strong>roadmap personnalisée par IA</strong> basée sur vos intérêts professionnels.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { label: '⚡ Découverte', time: '~3 min', questions: '10 questions' },
                { label: '🔍 Exploration', time: '~5 min', questions: '30 questions' },
                { label: '🎯 Profil Complet', time: '~8 min', questions: '60 questions' },
              ].map(opt => (
                <div key={opt.label} style={{
                  padding: '10px 14px', background: '#f8fafc', borderRadius: 10,
                  border: '1px solid #e2e8f0', fontSize: 13, color: '#475569',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span>{opt.questions} · {opt.time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setShowOnetPrompt(false); setShowOnetTest(true); }}
              style={{
                width: '100%', padding: '12px', background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', marginBottom: 10,
              }}
            >
              Commencer le test maintenant
            </button>
            <button
              onClick={() => setShowOnetPrompt(false)}
              style={{
                width: '100%', padding: '10px', background: 'transparent', border: '1px solid #e2e8f0',
                borderRadius: 10, fontSize: 13, color: '#94a3b8', cursor: 'pointer',
              }}
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800">Bonjour, {user?.nom} 👋</h2>
        <p className="text-gray-500 mt-1">{user?.niveau} — {user?.filiere}</p>
        {onetProfile && (
          <div style={{
            marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: 8,
            padding: '6px 12px', fontSize: 12,
          }}>
            <span>🎯</span>
            <span style={{ fontWeight: 700, color: '#0f2044' }}>Profil O*NET : </span>
            <span style={{ color: '#92400e' }}>
              {onetProfile.primaryInterest} · {onetProfile.secondaryInterest} · {onetProfile.tertiaryInterest}
            </span>
          </div>
        )}
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
