import { useState, useEffect } from 'react';
import { Concours, apiFetch } from './shared';

// ─── CONCOURS PAGE ────────────────────────────────────────────────────────────
function ConcoursPage() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [annales, setAnnales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'concours'|'annales'>('concours');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    Promise.all([apiFetch('/concours'), apiFetch('/annales')])
      .then(([c, a]) => { setConcours(Array.isArray(c)?c:[]); setAnnales(Array.isArray(a)?a:[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const getCountdown = (dateStr: string) => {
    const target = new Date(dateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { label: 'Passé', color: '#94a3b8', urgent: false };
    const days = Math.ceil(diff / 86400000);
    if (days <= 7)  return { label: `${days}j restant${days>1?'s':''}`, color: '#dc2626', urgent: true };
    if (days <= 30) return { label: `${days} jours`, color: '#f59e0b', urgent: false };
    if (days <= 90) return { label: `${days} jours`, color: '#7c3aed', urgent: false };
    return { label: `~${Math.floor(days/30)} mois`, color: '#10b981', urgent: false };
  };

  return (
    <div>
      <div className="dash-tabs">
        {[['concours','🏆 Concours'],['annales','📚 Annales']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`dash-tab ${tab===k?'active':''}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:110, borderRadius:14 }} />)}
        </div>
      ) : tab === 'concours' ? (
        concours.length === 0 ? (
          <div className="dash-empty"><div className="dash-empty-icon">🏆</div><p className="dash-empty-title">Aucun concours disponible</p></div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {concours.map(c => {
              const cd = getCountdown(c.dateConcours || '');
              return (
                <div key={c.id} className="dash-card p-5">
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🏆</div>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontWeight:800, color:'#0f0c29', fontSize:15, marginBottom:6 }}>{c.nom}</h3>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, color:'#64748b' }}>
                          📅 {c.dateConcours ? new Date(c.dateConcours).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
                        </span>
                        <span style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>Seuil: {c.seuil}/20</span>
                      </div>
                    </div>
                  </div>
                  {/* Countdown badge */}
                  <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{
                      fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:999,
                      background: cd.urgent ? '#fef2f2' : '#f8f7ff',
                      color: cd.color,
                      border: `1px solid ${cd.urgent ? '#fecaca' : 'rgba(124,58,237,0.15)'}`,
                      animation: cd.urgent ? 'pulse 2s infinite' : 'none',
                    }}>
                      ⏱ {cd.label}
                    </span>
                    {c.lien && (
                      <a href={c.lien} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                        En savoir plus →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        annales.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">📚</div>
            <p className="dash-empty-title">Aucune annale disponible</p>
            <p className="dash-empty-desc">Les annales seront ajoutées par l'administration prochainement.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {annales.map((a: any) => (
              <div key={a.id} className="dash-card p-5">
                <div style={{ fontSize:32, marginBottom:10 }}>📄</div>
                <h3 style={{ fontWeight:800, color:'#0f0c29', fontSize:14, marginBottom:4 }}>{a.titre || a.nom}</h3>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>{a.annee} · {a.matiere || a.concours}</div>
                {a.fichier ? (
                  <a href={a.fichier} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px', borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                    📥 Télécharger le PDF
                  </a>
                ) : (
                  <div style={{ padding:'8px', borderRadius:8, background:'#f8f7ff', color:'#94a3b8', fontSize:12, textAlign:'center', border:'1px dashed #e2e8f0' }}>
                    Fichier non disponible
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ConcoursPage;
