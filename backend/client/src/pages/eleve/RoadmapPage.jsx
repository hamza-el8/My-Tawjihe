import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/roadmap/${user.id}`).then(r => { if (r.data) setRoadmap(r.data); });
  }, []);

  const generate = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/roadmap/generate', { eleveId: user.id });
      setRoadmap(data.roadmap);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la génération');
    } finally { setLoading(false); }
  };

  const parsed = roadmap?.parcours ? (() => { try { return JSON.parse(roadmap.parcours); } catch { return null; } })() : null;

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">🗺️ Roadmap IA Personnalisée</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {!parsed ? (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="font-bold text-gray-800 mb-2">Générez votre roadmap</h3>
          <p className="text-gray-500 text-sm mb-6">L'IA analysera votre profil et vos notes pour créer un parcours personnalisé.</p>
          <button onClick={generate} disabled={loading} className="btn-gold px-8 py-3 rounded-lg">
            {loading ? '⏳ Génération en cours...' : '✨ Générer ma Roadmap'}
          </button>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="card p-6" style={{ borderLeft: '4px solid #c9a227' }}>
            <h3 className="text-xl font-black text-gray-800 mb-1">🎯 {parsed.metier}</h3>
            <p className="text-gray-600">{parsed.description}</p>
          </div>

          {parsed.etapes && (
            <div className="card p-6">
              <h4 className="font-bold text-gray-700 mb-4">📋 Étapes recommandées</h4>
              <ol className="space-y-3">
                {parsed.etapes.map((e, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: '#c9a227' }}>{i+1}</span>
                    <span className="text-gray-700 text-sm pt-1">{e}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {parsed.matieresCles && (
            <div className="card p-6">
              <h4 className="font-bold text-gray-700 mb-3">📚 Matières clés</h4>
              <div className="flex flex-wrap gap-2">
                {parsed.matieresCles.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: '#fef3c7', color: '#92400e' }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          {parsed.conseils && (
            <div className="card p-6 bg-blue-50">
              <h4 className="font-bold text-blue-800 mb-2">💡 Conseils</h4>
              <p className="text-blue-700 text-sm">{parsed.conseils}</p>
            </div>
          )}

          <button onClick={generate} disabled={loading} className="btn-gold px-6 py-2 rounded-lg text-sm">
            {loading ? '⏳...' : '🔄 Régénérer'}
          </button>
        </div>
      )}
    </Layout>
  );
}
