import { useState, useEffect } from 'react';
import { User, Exercice, apiFetch, diffColor } from './shared';

// ─── EXERCICES PAGE ───────────────────────────────────────────────────────────
function ExercicesPage({ user }: { user: User }) {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [selected, setSelected] = useState<Exercice | null>(null);
  const [reponse, setReponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string; correction: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterMatiere, setFilterMatiere] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');

  const matieres = [...new Set(exercices.map(e => e.matiere))];

  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Fetch completed exercises for badge display
    if (user.role === 'eleve') {
      apiFetch(`/exercices/resultats/${user.id}`)
        .then((r: any[]) => setDoneIds(new Set(Array.isArray(r) ? r.map((x: any) => x.exerciceId) : [])))
        .catch(() => {});
    }
  }, [user.id]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterMatiere) params.set('matiere', filterMatiere);
    if (filterDiff) params.set('difficulte', filterDiff);
    if (filterNiveau) params.set('niveau', filterNiveau);
    apiFetch(`/exercices?${params}`)
      .then(data => setExercices(Array.isArray(data) ? data : []))
      .catch(() => setExercices([]))
      .finally(() => setLoading(false));
  }, [filterMatiere, filterDiff, filterNiveau]);

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const data = await apiFetch(`/exercices/${selected.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ reponse, eleveId: user.id }),
      });
      setResult({ score: data.score, feedback: data.feedback, correction: data.correction });
      setSubmitted(true);
    } catch (e: any) {
      alert('Erreur: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const diffColor = (d: string) =>
    d === 'Facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : d === 'Moyen' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div>
      {selected ? (
        <div>
          <button onClick={() => { setSelected(null); setSubmitted(false); setReponse(''); setResult(null); }}
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#7c3aed', fontWeight:600, background:'none', border:'none', cursor:'pointer', marginBottom:20, padding:0 }}>
            ← Retour aux exercices
          </button>
          <div className="dash-card p-6">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(selected.difficulte)}`}>{selected.difficulte}</span>
              <span style={{ fontSize:13, color:'#94a3b8' }}>{selected.matiere} · {selected.niveau}</span>
            </div>

            <div style={{ background:'#f8f7ff', borderRadius:12, padding:16, marginBottom:20, fontSize:14, color:'#334155', lineHeight:1.7, whiteSpace:'pre-wrap', border:'1px solid rgba(124,58,237,0.08)' }}>
              {selected.contenu}
            </div>

            {!submitted ? (
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>
                  Votre réponse — l'IA corrigera automatiquement
                </label>
                <textarea
                  value={reponse}
                  onChange={e => setReponse(e.target.value)}
                  placeholder="Écrivez votre réponse ici... L'IA l'analysera et vous donnera un score et des conseils."
                  rows={5}
                  className="dash-input"
                  style={{ resize:'vertical', marginBottom:14 }}
                />
                <button onClick={submit} disabled={!reponse.trim() || submitting} className="dash-btn dash-btn-primary" style={{ width:'100%', justifyContent:'center', padding:'11px', fontSize:14 }}>
                  {submitting ? '🤖 Correction IA en cours...' : '✅ Soumettre ma réponse'}
                </button>
              </div>
            ) : result ? (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Score */}
                <div style={{
                  display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                  borderRadius:14, background: result.score >= 14 ? '#f0fdf4' : result.score >= 10 ? '#eff6ff' : '#fef2f2',
                  border: `1px solid ${result.score >= 14 ? '#bbf7d0' : result.score >= 10 ? '#bfdbfe' : '#fecaca'}`,
                }}>
                  <div style={{ fontSize:36, fontWeight:900, color: result.score >= 14 ? '#16a34a' : result.score >= 10 ? '#1d4ed8' : '#dc2626' }}>
                    {result.score}<span style={{ fontSize:16, opacity:.6 }}>/20</span>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#334155', marginBottom:4 }}>Score attribué par l'IA</p>
                    <p style={{ fontSize:13, color:'#64748b', lineHeight:1.5 }}>{result.feedback}</p>
                  </div>
                </div>

                {/* Correction */}
                {result.correction && (
                  <div style={{ background:'#f8f7ff', borderRadius:12, padding:16, border:'1px solid rgba(124,58,237,0.12)' }}>
                    <p style={{ fontSize:11, fontWeight:800, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Correction officielle</p>
                    <p style={{ fontSize:13.5, color:'#334155', lineHeight:1.7 }}>{result.correction}</p>
                  </div>
                )}

                <button onClick={() => { setSubmitted(false); setReponse(''); setResult(null); }} className="dash-btn dash-btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
                  Réessayer cet exercice
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
            <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0, marginRight:8 }}>Exercices</h2>
            <select value={filterMatiere} onChange={e => setFilterMatiere(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Toutes matières</option>
              {matieres.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Toutes difficultés</option>
              {['facile','moyen','difficile'].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
            </select>
            <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Tous niveaux</option>
              {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(n => <option key={n}>{n}</option>)}
            </select>
            {(filterMatiere||filterDiff||filterNiveau) && (
              <button onClick={() => { setFilterMatiere(''); setFilterDiff(''); setFilterNiveau(''); }} style={{ fontSize:12, color:'#94a3b8', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>✕ Réinitialiser</button>
            )}
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
              {[1,2,3,4,5,6].map(i => <div key={i} className="dash-skeleton" style={{ height:120, borderRadius:14 }} />)}
            </div>
          ) : exercices.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">📝</div>
              <p className="dash-empty-title">Aucun exercice disponible</p>
              <p className="dash-empty-desc">Essayez de modifier les filtres ou revenez plus tard.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
              {exercices.map(ex => (
                <button key={ex.id} onClick={() => { setSelected(ex); setSubmitted(false); setReponse(''); setResult(null); }}
                  className="dash-card p-5 text-left cursor-pointer" style={{ width:'100%' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(ex.difficulte)}`}>{ex.difficulte}</span>
                    <span style={{ fontSize:11, color:'#94a3b8' }}>{ex.niveau}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0f0c29', marginBottom:6 }}>{ex.matiere}</div>
                  <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {ex.contenu.substring(0, 100)}...
                  </p>
                  <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'#7c3aed', fontWeight:700 }}>🤖 Correction IA</span>
                    {doneIds.has(ex.id) && (
                      <span style={{ fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:999, background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }}>✓ Fait</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExercicesPage;
