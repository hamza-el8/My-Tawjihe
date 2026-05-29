import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user }: { user: User }) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [generateError, setGenerateError] = useState('');
  const [confirmingRegenerate, setConfirmingRegenerate] = useState(false);

  useEffect(() => {
    apiFetch(`/roadmap/${user.id}`)
      .then((r) => {
        if (r?.parcours) {
          try { setRoadmap(JSON.parse(r.parcours)); }
          catch { setFetchError('Roadmap corrompu. Régénérez-en un nouveau.'); }
        }
      })
      .catch(() => setFetchError('Impossible de charger le roadmap.'))
      .finally(() => setFetching(false));
  }, [user.id]);

  const generate = async () => {
    setLoading(true);
    setGenerateError('');
    setConfirmingRegenerate(false);
    try {
      const data = await apiFetch('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (data.result) setRoadmap(data.result);
    } catch (e: any) {
      setGenerateError("Erreur lors de la génération. Vérifiez votre clé OpenAI dans le .env du serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div className="dash-skeleton" style={{ height:80, borderRadius:14 }} />
      {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:100, borderRadius:14 }} />)}
    </div>
  );

  if (fetchError) return (
    <div className="dash-empty" style={{ background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'60px 32px' }}>
      <div className="dash-empty-icon">⚠️</div>
      <p className="dash-empty-title">{fetchError}</p>
      <button onClick={generate} className="dash-btn dash-btn-primary" style={{ marginTop:16 }}>✨ Générer un nouveau roadmap</button>
    </div>
  );

  return (
    <div>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="dash-hero" style={{ background:'linear-gradient(135deg,#0f0c29,#302b63)', textAlign:'center', padding:'32px' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', border:'4px solid rgba(167,139,250,0.3)', borderTopColor:'#a78bfa', animation:'spin 1s linear infinite', margin:'0 auto 14px' }} />
            <p style={{ color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:15, margin:0 }}>Analyse IA en cours...</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:6 }}>Notes · Profil RIASEC · Objectifs · ~15 secondes</p>
          </div>
          {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:90, borderRadius:14 }} />)}
        </div>
      ) : !roadmap ? (
        <div className="dash-empty" style={{ background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'60px 32px', textAlign:'center' }}>
          <div className="dash-empty-icon">🧭</div>
          <p className="dash-empty-title">Aucun roadmap généré</p>
          <p className="dash-empty-desc">L'IA analysera vos notes, votre profil RIASEC et vos objectifs pour créer un parcours personnalisé.</p>
          {generateError && (
            <div style={{ margin:'16px auto', padding:'10px 16px', borderRadius:10, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:13, maxWidth:380 }}>
              {generateError}
            </div>
          )}
          <button onClick={generate} className="dash-btn dash-btn-primary" style={{ marginTop:16, padding:'11px 24px', fontSize:14 }}>
            ✨ Générer mon roadmap IA
          </button>
        </div>
      ) : (
        <>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0 }}>Roadmap Professionnel IA</h2>
            <p style={{ fontSize:12, color:'#94a3b8', marginTop:3 }}>Généré selon votre profil, vos notes et vos intérêts</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button type="button" onClick={() => setConfirmingRegenerate(true)}
              style={{ fontSize:12, color:'#7c3aed', fontWeight:700, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
              🔄 Régénérer
            </button>
            {confirmingRegenerate && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:10, background:'#eef2ff', border:'1px solid #c7d2fe' }}>
                <span style={{ fontSize:12, color:'#334155' }}>Confirmez la régénération du roadmap.</span>
                <button type="button" onClick={generate} style={{ fontSize:12, color:'#fff', background:'#4f46e5', border:'none', borderRadius:8, padding:'7px 12px', cursor:'pointer' }}>Oui</button>
                <button type="button" onClick={() => setConfirmingRegenerate(false)} style={{ fontSize:12, color:'#334155', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8, padding:'7px 12px', cursor:'pointer' }}>Annuler</button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {/* Métier */}
          <div className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🎯</div>
              <div>
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">Métier recommandé</div>
                <div className="text-xl font-black text-gray-900">{roadmap.metier}</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{roadmap.description}</p>
          </div>

          {/* Étapes */}
          {roadmap.etapes?.length > 0 && (
            <div className="dash-card p-6">
              <h3 className="dash-section-title">Étapes du parcours</h3>
              <div className="space-y-3">
                {roadmap.etapes.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{i + 1}</div>
                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Universities */}
          {roadmap.universites?.length > 0 && (
            <div className="dash-card p-5" style={{borderColor:"rgba(59,130,246,0.15)"}}>
              <h3 className="dash-section-title">🎓 Universités recommandées</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.universites.map((u: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{u}</span>
                ))}
              </div>
            </div>
          )}

          {/* Alertes */}
          {roadmap.alertes?.length > 0 && roadmap.alertes[0] !== '' && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
              <h3 className="text-sm font-bold text-amber-700 mb-3 uppercase tracking-wider">⚠️ Points d'attention</h3>
              <ul className="space-y-1.5">
                {roadmap.alertes.map((a: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2"><span className="flex-shrink-0">•</span>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Matières clés + Conseils */}
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.matieresCles?.length > 0 && (
              <div className="dash-card p-5">
                <h3 className="dash-section-title">Matières clés</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.matieresCles.map((m: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {roadmap.conseils && (
              <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
                <h3 className="dash-section-title">💡 Conseils</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{roadmap.conseils}</p>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default RoadmapPage;
