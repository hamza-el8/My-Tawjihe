import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ matiere: '', valeur: '', coefficient: 1, periode: 'S1', type: 'Contrôle' });
  const [loading, setLoading] = useState(false);

  const fetchNotes = () => api.get(`/eleves/${user.id}/notes`).then(r => setNotes(r.data));
  useEffect(() => { fetchNotes(); }, []);

  const avg = notes.length
    ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
       notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(2)
    : '—';

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    await api.post('/notes', { ...form, eleveId: user.id });
    setForm({ matiere: '', valeur: '', coefficient: 1, periode: 'S1', type: 'Contrôle' });
    fetchNotes(); setLoading(false);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">📊 Mes Notes</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">Tableau des notes</h3>
              <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: '#fef3c7', color: '#92400e' }}>
                Moyenne: {avg}/20
              </span>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-gray-500 text-left">
                <th className="pb-2">Matière</th><th className="pb-2">Note</th><th className="pb-2">Coef.</th><th className="pb-2">Période</th><th className="pb-2">Type</th>
              </tr></thead>
              <tbody>
                {notes.map(n => (
                  <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{n.matiere}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${parseFloat(n.valeur) >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {n.valeur}/20
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">{n.coefficient}</td>
                    <td className="py-2 text-gray-500">{n.periode}</td>
                    <td className="py-2 text-gray-500">{n.type}</td>
                  </tr>
                ))}
                {!notes.length && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Aucune note</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-gray-700 mb-4">Ajouter une note</h3>
          <form onSubmit={submit} className="space-y-3">
            {[['matiere','Matière','text'],['valeur','Note /20','number'],['coefficient','Coefficient','number']].map(([k,l,t]) => (
              <div key={k}>
                <label className="text-xs font-semibold text-gray-500 uppercase">{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} required
                  min={t==='number'?0:undefined} max={k==='valeur'?20:undefined} step={t==='number'?'0.5':undefined}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Période</label>
              <select value={form.periode} onChange={e => setForm(f=>({...f,periode:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {['S1','S2','S3'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {['Contrôle','Examen','Devoir'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-2 rounded-lg text-sm">
              {loading ? '...' : 'Ajouter'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
