import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ProfDashboard() {
  const { user } = useAuth();
  const [faibles, setFaibles] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [form, setForm] = useState({ matiere: '', niveau: '', difficulte: 'moyen', contenu: '', correction: '' });
  const [tab, setTab] = useState('faibles');

  useEffect(() => {
    api.get('/prof/eleves-faibles').then(r => setFaibles(r.data));
    api.get('/exercices').then(r => setExercices(r.data.filter(e => e.professeurId === user.id)));
  }, []);

  const addExercice = async e => {
    e.preventDefault();
    await api.post('/exercices', form);
    setForm({ matiere: '', niveau: '', difficulte: 'moyen', contenu: '', correction: '' });
    api.get('/exercices').then(r => setExercices(r.data.filter(ex => ex.professeurId === user.id)));
  };

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">👨‍🏫 Espace Professeur — {user?.nom}</h2>
      <div className="flex gap-2 mb-6">
        {[['faibles','⚠️ Élèves en difficulté'],['exercices','📝 Mes Exercices'],['add','➕ Ajouter Exercice']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab===k ? 'btn-gold' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'faibles' && (
        <div className="card p-6 max-w-3xl">
          <h3 className="font-bold text-gray-700 mb-4">Élèves avec moyenne &lt; 12/20</h3>
          {faibles.length ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b text-gray-500 text-left">
                <th className="pb-2">Nom</th><th className="pb-2">Email</th><th className="pb-2">Niveau</th><th className="pb-2">Filière</th>
              </tr></thead>
              <tbody>
                {faibles.map(e => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{e.nom}</td>
                    <td className="py-2 text-gray-500">{e.email}</td>
                    <td className="py-2 text-gray-500">{e.niveau}</td>
                    <td className="py-2 text-gray-500">{e.filiere}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-gray-400 text-center py-8">Aucun élève en difficulté 🎉</p>}
        </div>
      )}

      {tab === 'exercices' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercices.map(ex => (
            <div key={ex.id} className="card p-5">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-700">{ex.matiere}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{ex.difficulte}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{ex.contenu}</p>
            </div>
          ))}
          {!exercices.length && <p className="text-gray-400 col-span-3 text-center py-12">Aucun exercice créé</p>}
        </div>
      )}

      {tab === 'add' && (
        <div className="card p-6 max-w-lg">
          <h3 className="font-bold text-gray-700 mb-4">Nouvel exercice</h3>
          <form onSubmit={addExercice} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Matière</label>
                <input value={form.matiere} onChange={e => setForm(f=>({...f,matiere:e.target.value}))} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Niveau</label>
                <input value={form.niveau} onChange={e => setForm(f=>({...f,niveau:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Difficulté</label>
              <select value={form.difficulte} onChange={e => setForm(f=>({...f,difficulte:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {['facile','moyen','difficile'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Contenu</label>
              <textarea value={form.contenu} onChange={e => setForm(f=>({...f,contenu:e.target.value}))} required rows={4} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Correction</label>
              <textarea value={form.correction} onChange={e => setForm(f=>({...f,correction:e.target.value}))} rows={3} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
            </div>
            <button type="submit" className="btn-gold w-full py-2 rounded-lg text-sm">Publier l'exercice</button>
          </form>
        </div>
      )}
    </Layout>
  );
}
