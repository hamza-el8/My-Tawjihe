import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ExercicesPage() {
  const { user } = useAuth();
  const [exercices, setExercices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState('');
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState({ matiere: '', difficulte: '' });

  useEffect(() => {
    api.get('/exercices', { params: filter }).then(r => setExercices(r.data));
  }, [filter]);

  const submit = async () => {
    const { data } = await api.post(`/exercices/${selected.id}/submit`, { score: parseFloat(score), eleveId: user.id });
    setResult(data);
  };

  const diffColor = { facile: 'bg-green-100 text-green-700', moyen: 'bg-yellow-100 text-yellow-700', difficile: 'bg-red-100 text-red-700' };

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">📝 Exercices</h2>
      <div className="flex gap-3 mb-6">
        <input placeholder="Filtrer par matière" value={filter.matiere} onChange={e => setFilter(f=>({...f,matiere:e.target.value}))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <select value={filter.difficulte} onChange={e => setFilter(f=>({...f,difficulte:e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Toutes difficultés</option>
          {['facile','moyen','difficile'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {selected ? (
        <div className="card p-8 max-w-2xl">
          <button onClick={() => { setSelected(null); setResult(null); setScore(''); }} className="text-sm text-blue-600 mb-4">← Retour</button>
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">{selected.matiere}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${diffColor[selected.difficulte]}`}>{selected.difficulte}</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-4">{selected.contenu}</h3>
          {result ? (
            <div className={`p-4 rounded-lg ${parseFloat(score) >= 10 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="font-bold">{parseFloat(score) >= 10 ? '✅ Bien joué !' : '⚠️ À réviser'} — Score: {score}/20</p>
              {selected.correction && <p className="text-sm mt-2 text-gray-600"><strong>Correction:</strong> {selected.correction}</p>}
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <input type="number" min={0} max={20} step={0.5} value={score} onChange={e => setScore(e.target.value)}
                placeholder="Votre score /20" className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-40" />
              <button onClick={submit} disabled={!score} className="btn-gold px-6 py-2 rounded-lg text-sm">Soumettre</button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercices.map(ex => (
            <div key={ex.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(ex)}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-gray-700">{ex.matiere}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${diffColor[ex.difficulte]}`}>{ex.difficulte}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{ex.contenu}</p>
              <p className="text-xs text-gray-400 mt-3">Niveau: {ex.niveau}</p>
            </div>
          ))}
          {!exercices.length && <p className="text-gray-400 col-span-3 text-center py-12">Aucun exercice disponible</p>}
        </div>
      )}
    </Layout>
  );
}
