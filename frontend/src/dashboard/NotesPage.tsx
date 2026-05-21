import { useState, useEffect } from 'react';
import { User, Note, apiFetch, icons } from './shared';
import NotesEvolutionChart from './NotesEvolutionChart';

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
    <div className="">
      {notes.length >= 2 && <div className="mb-6"><NotesEvolutionChart notes={notes} /></div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Mes Notes</h2>
          <p className="text-sm text-gray-400">Moyenne générale : <span className="font-bold text-violet-700">{moyenneGenerale}</span></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="dash-btn dash-btn-primary">
          <span>+</span> Ajouter une note
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
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
        <div className="dash-card-flat overflow-hidden">
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

export default NotesPage;
