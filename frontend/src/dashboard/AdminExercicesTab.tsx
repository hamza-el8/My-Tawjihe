import { useState } from 'react';
import { apiFetch } from './shared';

const D = { id: '', matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' };
interface P { initialExercices: any[] }

export default function AdminExercicesTab({ initialExercices }: P) {
  const [ex, setEx] = useState<any[]>(initialExercices);
  const [f, setF] = useState(D); const [m, setM] = useState(''); const [s, setS] = useState('');
  const [ld, setLd] = useState(false); const [p, setP] = useState(1); const PP = 10;

  const v = (x: typeof D): string | null => {
    if (!x.matiere.trim()) return 'La matière est requise';
    if (!x.contenu.trim()) return "L'énoncé est requis";
    if (!x.correction.trim()) return 'La correction est requise';
    if (x.contenu.length < 10) return "L'énoncé doit faire au moins 10 caractères";
    return null;
  };

  const sub = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = v(f); if (err) { setM('❌ ' + err); return; }
    setLd(true);
    try {
      if (f.id) await apiFetch('/exercices/' + f.id, { method: 'PUT', body: JSON.stringify(f) });
      else await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(f) });
      const r = await apiFetch('/exercices'); setEx(Array.isArray(r) ? r : []);
      setM('✅ ' + (f.id ? 'Exercice modifié' : 'Exercice ajouté') + ' !');
      setF(D); setP(1); setTimeout(() => setM(''), 3000);
    } catch (e: any) { setM('❌ Erreur: ' + (e.message || '')); }
    finally { setLd(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return;
    try { await apiFetch('/exercices/' + id, { method: 'DELETE' }); const r = await apiFetch('/exercices'); setEx(Array.isArray(r) ? r : []); }
    catch (e: any) { setM('❌ ' + e.message); }
  };

  const ed = (x: any) => { setF({ id: x.id, matiere: x.matiere, niveau: x.niveau, difficulte: x.difficulte, contenu: x.contenu, correction: x.correction }); setM(''); };
  const fl = ex.filter((x: any) => x.matiere.toLowerCase().includes(s.toLowerCase()));
  const tp = Math.ceil(fl.length / PP);
const render = () => null;
export default AdminExercicesTab;
  const ed = (x: any) => { setF({ id: x.id, matiere: x.matiere, niveau: x.niveau, difficulte: x.difficulte, contenu: x.contenu, correction: x.correction }); setM(''); };
  const fl = ex.filter((x: any) => x.matiere.toLowerCase().includes(s.toLowerCase()));
  const tp = Math.ceil(fl.length / PP);

  return (
    <div className="space-y-6">
      <input type="text" placeholder="Rechercher exercices..." value={s} onChange={e => { setS(e.target.value); setP(1); }}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
      <div className="dash-card p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700">{f.id ? '\u270f\ufe0f Modifier' : 'Ajouter'} un exercice</h3>
          {f.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Mode \xe9dition</span>}
        </div>
        {m && <div className={'mb-4 p-3 rounded-xl text-sm ' + (m.startsWith('\u2705') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>{m}</div>}
        <form onSubmit={sub} className="space-y-3">
          <input required placeholder="Mati\xe8re" value={f.matiere} onChange={e => setF({...f, matiere: e.target.value})} className="dash-input" />
          <select value={f.niveau} onChange={e => setF({...f, niveau: e.target.value})} className="dash-input">
            <option>1\xe8re ann\xe9e Bac</option><option>Terminale (2\xe8me Bac)</option>
          </select>
          <select value={f.difficulte} onChange={e => setF({...f, difficulte: e.target.value})} className="dash-input">
            <option value="facile">Facile</option><option value="moyen">Moyen</option><option value="difficile">Difficile</option>
          </select>
          <textarea required placeholder="\xc9nonc\xe9..." value={f.contenu} onChange={e => setF({...f, contenu: e.target.value})} className="dash-input" rows={3} style={{resize:'none'}} />
          <textarea required placeholder="Correction..." value={f.correction} onChange={e => setF({...f, correction: e.target.value})} className="dash-input" rows={2} style={{resize:'none'}} />
          <div className="flex gap-2">
            <button type="submit" disabled={ld} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)'}}>
              {ld ? '\u23f3 En cours...' : (f.id ? 'Modifier' : 'Ajouter')}
            </button>
            {f.id && <button type="button" onClick={() => { setF(D); setM(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
          </div>
        </form>
      </div>
      <div className="dash-card-flat overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-bold text-gray-600">Mati\xe8re</th><th className="text-left px-4 py-3 font-bold text-gray-600">Niveau</th><th className="text-left px-4 py-3 font-bold text-gray-600">Difficult\xe9</th><th className="px-4 py-3" /></tr></thead>
          <tbody className="divide-y">
            {fl.slice((p - 1) * PP, p * PP).map((x: any) => (
              <tr key={x.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{x.matiere}</td>
                <td className="px-4 py-3 text-gray-500">{x.niveau}</td>
                <td className="px-4 py-3">
                  <span className={'px-2 py-1 rounded text-xs font-bold ' + (x.difficulte === 'facile' ? 'bg-emerald-100 text-emerald-700' : x.difficulte === 'moyen' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>{x.difficulte}</span>
                </td>
                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <button onClick={() => ed(x)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">Modifier</button>
                  <button onClick={() => del(x.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tp > 1 && (
          <div className="p-4 flex gap-2 justify-center border-t">
            {Array.from({ length: tp }).map((_, i) => (
              <button key={i} onClick={() => setP(i + 1)}
                className={'px-3 py-1 rounded text-xs font-bold ' + (p === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600')}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
