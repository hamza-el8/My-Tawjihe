import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';

// ─── MON PROFIL PAGE ──────────────────────────────────────────────────────────
function MonProfilPage({ user, onRetakeOnet }: { user: User; onRetakeOnet?: () => void }) {
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/onet/profile').then(r => setProfil(r.profil)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const CAT: Record<string, { label: string; color: string; emoji: string; desc: string }> = {
    R: { label: 'Réaliste',      color: '#ef4444', emoji: '🔧', desc: 'Travail manuel, technique, concret' },
    I: { label: 'Investigateur', color: '#3b82f6', emoji: '🔬', desc: 'Recherche, analyse, sciences' },
    A: { label: 'Artistique',    color: '#ec4899', emoji: '🎨', desc: 'Créativité, expression, art' },
    S: { label: 'Social',        color: '#10b981', emoji: '🤝', desc: 'Aide, enseignement, relations humaines' },
    E: { label: 'Entreprenant',  color: '#f59e0b', emoji: '💼', desc: 'Leadership, vente, management' },
    C: { label: 'Conventionnel', color: '#8b5cf6', emoji: '📊', desc: 'Organisation, données, procédures' },
  };

  const CAREER_MAP: Record<string, string[]> = {
    RIA: ['Architecte','Designer industriel','Ingénieur mécanique'],
    RIS: ['Médecin généraliste','Vétérinaire','Infirmier spécialisé'],
    RIC: ['Ingénieur informatique','Technicien réseau','Électronicien'],
    IAS: ['Psychologue','Chercheur sciences humaines','Anthropologue'],
    IAE: ["Directeur artistique","Architecte d'intérieur",'Chef de projet créatif'],
    ISA: ['Médecin psychiatre','Conseiller pédagogique','Ergothérapeute'],
    ISE: ["Directeur d'école",'RH','Coach professionnel'],
    IEC: ["Avocat d'affaires",'Consultant','Analyste financier'],
    ASE: ['Journaliste','Chargé de communication','Relations publiques'],
    SEC: ['Gestionnaire RH','Assistant social','Coordinateur de projet'],
    ECS: ['Manager commercial','Entrepreneur','Directeur marketing'],
    CSE: ['Comptable','Contrôleur de gestion','Auditeur'],
    IRE: ["Ingénieur civil",'Géomètre','Topographe'],
    IRA: ['Médecin biologiste','Chimiste','Physicien'],
    EIS: ["Directeur d'hôpital",'Responsable qualité','Manager RH'],
  };

  const getCareerSuggestions = () => {
    if (!profil) return [];
    const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
    return CAREER_MAP[code]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}E`]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}S`]
      || ['Consultez votre roadmap IA pour des suggestions personnalisées'];
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );

  if (!profil) return (
    <div className="">
      <div className="dash-card dash-empty">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Aucun profil O*NET</h3>
        <p className="text-gray-400 text-sm mb-6">Passez le test pour découvrir vos intérêts professionnels et obtenir des recommandations de carrière personnalisées.</p>
        <button onClick={onRetakeOnet} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          🎯 Passer le test O*NET
        </button>
      </div>
    </div>
  );

  const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
  const testLabel = profil.testLevel === 10 ? '⚡ Découverte' : profil.testLevel === 30 ? '🔍 Exploration' : '🎯 Profil Complet';
  const careers = getCareerSuggestions();

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#fff,transparent)' }} />
        <p className="text-white/60 text-sm mb-1">Votre code RIASEC</p>
        <h2 className="text-5xl font-black tracking-widest mb-2">{code}</h2>
        <div className="flex items-center gap-3 text-white/70 text-sm flex-wrap">
          <span>{testLabel}</span>
          {profil.language && <span>· {profil.language.toUpperCase()}</span>}
          {profil.completedAt && <span>· {new Date(profil.completedAt).toLocaleDateString('fr-FR')}</span>}
        </div>
      </div>

      {/* RIASEC Bars */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Scores détaillés</h3>
        <div className="space-y-3">
          {['R','I','A','S','E','C'].map((cat) => {
            const info = CAT[cat];
            const score = profil[`scores${cat}`] || 0;
            const maxQ = Math.round((profil.testLevel || 60) / 6);
            const pct = maxQ > 0 ? (score / maxQ) * 100 : 0;
            const isPrimary = cat === profil.primaryInterest;
            const isSecondary = cat === profil.secondaryInterest;
            const isTertiary = cat === profil.tertiaryInterest;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ fontWeight: isPrimary ? 800 : 500, color: (isPrimary || isSecondary || isTertiary) ? info.color : '#94a3b8' }}>
                    {info.emoji} {info.label}
                    {isPrimary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color }}>Primaire</span>}
                    {isSecondary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color, opacity: 0.8 }}>Secondaire</span>}
                    {isTertiary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color, opacity: 0.6 }}>Tertiaire</span>}
                  </span>
                  <span className="text-gray-400 text-xs">{score}/{maxQ}</span>
                </div>
                <div className="dash-progress-track">
                  <div className="dash-progress-fill" style={{ width: `${pct}%`, background: info.color }} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Career suggestions */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Métiers suggérés pour le code {code}</h3>
        <div className="flex flex-wrap gap-2">
          {careers.map((c, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{c}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">💡 Générez votre Roadmap IA pour une analyse complète adaptée à votre profil et vos notes.</p>
      </div>

      {/* Dreams */}
      {(profil.dreamUni || profil.dreamJob) && (
        <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
          <h3 className="dash-section-title">💭 Vos objectifs</h3>
          {profil.dreamUni && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎓</span>
              <div><p className="text-xs text-gray-400">Université de rêve</p><p className="font-bold text-gray-800">{profil.dreamUni}</p></div>
            </div>
          )}
          {profil.dreamJob && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div><p className="text-xs text-gray-400">Métier de rêve</p><p className="font-bold text-gray-800">{profil.dreamJob}</p></div>
            </div>
          )}
        </div>
      )}

      {/* Job Zone */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Niveau d'études visé</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            {profil.jobZone}
          </div>
          <div>
            <p className="font-bold text-gray-800">Zone {profil.jobZone}</p>
            <p className="text-sm text-gray-500">{['','Peu ou pas de préparation nécessaire','Une certaine préparation nécessaire','Préparation modérée nécessaire','Bac+3/+5 nécessaire','Doctorat / expertise extensive nécessaire'][profil.jobZone] || ''}</p>
          </div>
        </div>
      </div>

      <button onClick={onRetakeOnet} className="w-full py-3 rounded-2xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
        🔄 Repasser le test O*NET (remplace les résultats actuels)
      </button>
    </div>
  );
}

export default MonProfilPage;
