import { useState, useEffect } from 'react';
import { User, Note, Notification, apiFetch, icons } from './shared';
import NotesEvolutionChart from './NotesEvolutionChart';
import { StatCard } from './Layout';

// ─── ELEVE DASHBOARD ──────────────────────────────────────────────────────────
function EleveDashboard({ user, setActive, onRetakeOnet }: { user: User; setActive: (s: string) => void; onRetakeOnet?: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showOnetPrompt, setShowOnetPrompt] = useState(false);
  const [onetProfile, setOnetProfile] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiFetch(`/eleves/${user.id}/notes`),
      apiFetch(`/notifications/${user.id}`),
      apiFetch('/onet/profile'),
    ]).then(([notesData, notifsData, onetData]: [any, any, any]) => {
      setNotes(Array.isArray(notesData) ? notesData : []);
      setNotifCount(Array.isArray(notifsData) ? notifsData.filter((n: Notification) => !n.lu).length : 0);
      setOnetProfile(onetData?.profil || null);
      if (!onetData?.profil) setTimeout(() => setShowOnetPrompt(true), 800);
    }).catch(() => {
      setTimeout(() => setShowOnetPrompt(true), 800);
    });
  }, [user.id]);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  const [exercicesDone, setExercicesDone] = useState(0);

  useEffect(() => {
    apiFetch(`/exercices/resultats/${user.id}`)
      .then((r: any[]) => setExercicesDone(Array.isArray(r) ? r.length : 0))
      .catch(() => {});
  }, [user.id]);

  const quick = [
    { id: 'notes',     icon: icons.notes,     label: 'Mes notes',    desc: `${notes.length} note${notes.length!==1?'s':''} enregistrée${notes.length!==1?'s':''}`, color:'#7c3aed' },
    { id: 'roadmap',   icon: icons.roadmap,   label: 'Roadmap IA',   desc: 'Générer mon parcours', color:'#2563eb' },
    { id: 'chatbot',   icon: icons.chatbot,   label: 'Assistant IA', desc: 'Posez une question', color:'#059669' },
    { id: 'exercices', icon: icons.exercices, label: 'Exercices',    desc: `${exercicesDone} fait${exercicesDone!==1?'s':''}`, color:'#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* O*NET prompt popup */}
      {showOnetPrompt && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,32,68,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(15,32,68,0.25)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#0f2044', margin:'0 0 8px' }}>Découvrez votre profil de carrière !</h3>
            <p style={{ color:'#64748b', fontSize:14, lineHeight:1.6, margin:'0 0 20px' }}>
              Passez le test O*NET pour obtenir votre <strong>roadmap personnalisée par IA</strong> basée sur vos intérêts.
            </p>
            <button onClick={() => { setShowOnetPrompt(false); if(onRetakeOnet) onRetakeOnet(); }} style={{
              width:'100%', padding:12, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff',
              border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:10,
            }}>Commencer le test maintenant</button>
            <button onClick={() => setShowOnetPrompt(false)} style={{ width:'100%', padding:10, background:'transparent', border:'1px solid #e2e8f0', borderRadius:10, fontSize:13, color:'#94a3b8', cursor:'pointer' }}>
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#a78bfa,transparent)' }} />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium mb-1">Bonjour 👋</p>
          <h2 className="text-2xl font-black mb-1">{user.nom}</h2>
          <p className="text-white/60 text-sm">{user.filiere || 'Filière non définie'} · {user.niveau || ''}</p>
          {onetProfile && (
            <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px', fontSize:12 }}>
              <span>🎯</span>
              <span style={{ fontWeight:700 }}>Profil : {onetProfile.primaryInterest} · {onetProfile.secondaryInterest} · {onetProfile.tertiaryInterest}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <StatCard icon="📊" label="Moyenne générale" value={notes.length ? `${moyenne}/20` : '—'} color="bg-violet-50 text-violet-600" />
        <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="✅" label="Exercices faits" value={exercicesDone} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon="🔔" label="Non lues" value={notifCount > 0 ? notifCount : '✓'} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="dash-section-title">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quick.map((q) => (
            <button key={q.id} onClick={() => setActive(q.id)}
              className="dash-card p-4 text-left cursor-pointer" style={{ borderTop: `3px solid ${q.color}` }}>
              <span style={{ fontSize:22, display:'block', marginBottom:8 }}>{q.icon}</span>
              <div style={{ fontSize:13, fontWeight:800, color:'#0f0c29', marginBottom:3 }}>{q.label}</div>
              <div style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}>{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent notes */}
      {notes.length > 0 && (
        <div>
          <h3 className="dash-section-title">Dernières notes</h3>
          <div className="dash-card-flat overflow-hidden">
            {notes.slice(0, 4).map((note, i) => (
              <div key={note.id} className={`flex items-center justify-between px-5 py-3.5 ${i < notes.slice(0, 4).length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-800">{note.matiere}</span>
                <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${note.valeur >= 14 ? 'text-emerald-600 bg-emerald-50' : note.valeur >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                  {note.valeur}/20
                </span>
              </div>
            ))}
            <button onClick={() => setActive('notes')} className="w-full text-center py-3 text-xs text-violet-600 font-bold hover:bg-violet-50 transition-colors">
              Voir toutes les notes →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EleveDashboard;
