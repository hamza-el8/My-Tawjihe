import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { StatCard } from './Layout';

// ─── PROF DASHBOARD ───────────────────────────────────────────────────────────
function ProfDashboard({ user }: { user: User }) {
  const [eleves, setEleves] = useState<any[]>([]);
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('eleves');
  const [form, setForm] = useState({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch('/prof/eleves-faibles'),
      apiFetch('/prof/stats'),
    ]).then(([el, st]) => {
      setEleves(Array.isArray(el) ? el : []);
      setResultats(Array.isArray(st.resultats) ? st.resultats : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const createEx = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(form) });
      setFormMsg('✅ Exercice créé avec succès !');
      setForm({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || 'Erreur'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Tableau de bord</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Professeur · {(user as any).specialite || user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <StatCard icon="👥" label="En difficulté" value={eleves.length} color="bg-rose-50 text-rose-600" />
        <StatCard icon="📊" label="Soumissions reçues" value={resultats.length} color="bg-violet-50 text-violet-600" />
        <StatCard icon="⚠️" label="Sous 10/20" value={eleves.filter(e => parseFloat(e.moyenne) < 10).length} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[['eleves','👥 Élèves en difficulté'],['resultats','📊 Soumissions'],['creer','➕ Créer un exercice']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab===k ? 'active' : ''}`}
            style={tab===k ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {/* Élèves */}
      {tab === 'eleves' && (
        loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" /></div>
        ) : eleves.length === 0 ? (
          <div className="dash-card dash-empty">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Tous les élèves sont en bonne progression</p>
          </div>
        ) : (
          <div className="dash-card-flat overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase grid grid-cols-4 gap-2">
              <span>Élève</span><span>Niveau</span><span>Filière</span><span className="text-right">Moyenne</span>
            </div>
            {eleves.map((e: any, i: number) => (
              <div key={i} className={`grid grid-cols-4 gap-2 items-center px-5 py-4 ${i < eleves.length-1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">{e.email}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{e.niveau || '—'}</span>
                <span className="text-xs text-gray-500">{e.filiere || '—'}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black text-right ml-auto block w-fit ${parseFloat(e.moyenne) < 10 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {e.moyenne ? `${e.moyenne}/20` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Soumissions */}
      {tab === 'resultats' && (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Élève</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Exercice</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resultats.map((r: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-semibold text-gray-800">{r.eleveName || '—'}</div>
                    <div className="text-xs text-gray-400">{r.eleveEmail}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-xs font-bold text-gray-600">{r.exMatiere}</div>
                    <div className="text-xs text-gray-400">{r.exContenu}...</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${parseFloat(r.score) >= 14 ? 'text-emerald-600 bg-emerald-50' : parseFloat(r.score) >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                      {r.score}/20
                    </span>
                  </td>
                </tr>
              ))}
              {!resultats.length && (
                <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">Aucune soumission reçue pour l'instant</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Créer exercice */}
      {tab === 'creer' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Nouvel exercice</h3>
          {formMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${formMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{formMsg}</div>
          )}
          <form onSubmit={createEx} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Matière *</label>
              <input value={form.matiere} onChange={e => setForm(p => ({...p, matiere: e.target.value}))} required placeholder="Mathématiques"
                className="dash-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Niveau</label>
                <select value={form.niveau} onChange={e => setForm(p => ({...p, niveau: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Difficulté</label>
                <select value={form.difficulte} onChange={e => setForm(p => ({...p, difficulte: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['facile','moyen','difficile'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Énoncé *</label>
              <textarea value={form.contenu} onChange={e => setForm(p => ({...p, contenu: e.target.value}))} required rows={4} placeholder="Contenu de l'exercice..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Correction</label>
              <textarea value={form.correction} onChange={e => setForm(p => ({...p, correction: e.target.value}))} rows={3} placeholder="Correction détaillée..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              Créer l'exercice
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfDashboard;
