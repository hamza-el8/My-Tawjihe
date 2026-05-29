import { User, icons } from './shared';
import { ProfilePopup } from './ProfilePopup';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const elevMenu = [
  { id: 'dashboard',     label: 'Tableau de bord',  icon: icons.dashboard },
  { id: 'profil',        label: 'Mon Profil O*NET',  icon: '🎯' },
  { id: 'notes',         label: 'Mes Notes',         icon: icons.notes },
  { id: 'exercices',     label: 'Exercices',         icon: icons.exercices },
  { id: 'roadmap',       label: 'Roadmap IA',        icon: icons.roadmap },
  { id: 'chatbot',       label: 'Assistant IA',      icon: icons.chatbot },
  { id: 'concours',      label: 'Concours',          icon: icons.concours },
  { id: 'annales',       label: 'Annales',           icon: icons.annales },
  { id: 'notifications', label: 'Notifications',     icon: icons.notifications },
  { id: 'actualites',    label: 'Actualités',          icon: '📰' },
];
const profMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'eleves', label: 'Élèves en difficulté', icon: icons.eleves },
  { id: 'exercices', label: 'Créer exercice', icon: icons.exercices },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications },
];
const adminMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'users', label: 'Utilisateurs', icon: icons.eleves },
  { id: 'concours', label: 'Concours', icon: icons.concours },
  { id: 'notifications', label: 'Envoyer notif', icon: icons.notifications },
];
const parentMenu = [
  { id: 'dashboard',  label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'actualites', label: 'Actualités',       icon: '📰' },
];

function Sidebar({
  user, active, setActive, onLogout, mobile, onClose, onRetakeOnet,
}: {
  user: User; active: string; setActive: (s: string) => void;
  onLogout: () => void; mobile?: boolean; onClose?: () => void; onRetakeOnet?: () => void;
}) {
  const menu =
    user.role === 'eleve' ? elevMenu
    : user.role === 'professeur' ? profMenu
    : user.role === 'admin' ? adminMenu
    : parentMenu;

  const roleGradients: Record<string, string> = {
    eleve:      'linear-gradient(135deg,#7c3aed,#a855f7)',
    professeur: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    admin:      'linear-gradient(135deg,#be123c,#e11d48)',
    parent:     'linear-gradient(135deg,#047857,#10b981)',
  };

  const menuSections: Record<string, string> = {
    profil:'Orientation', notes:'Académique', roadmap:'Académique', chatbot:'Académique',
    exercices:'Académique', concours:'Ressources', annales:'Ressources',
    notifications:'Activité', actualites:'Actualités', eleves:'Gestion', users:'Gestion',
  };

  return (
    <div className="dash-sidebar" style={{ width: mobile ? '100%' : '260px' }}>
      <div className="dash-sidebar-logo">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:roleGradients[user.role], display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', flexShrink:0 }}>
              <span style={{ color:'#fff', fontWeight:900, fontSize:17 }}>M</span>
            </div>
            <span style={{ fontWeight:900, fontSize:17, color:'#fff', letterSpacing:'-0.01em' }}>
              My<span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Tawjeh</span>
            </span>
          </div>
          {mobile && onClose && (
            <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', padding:4 }}>×</button>
          )}
        </div>
      </div>

      <div className="dash-sidebar-profile">
        <ProfilePopup user={user} onLogout={onLogout} onRetakeOnet={onRetakeOnet} />
      </div>

      <nav className="dash-sidebar-nav">
        {(() => { let lastSection = ''; return menu.map((item) => {
          const section = menuSections[item.id] || '';
          // Use a local variable instead of useRef to track last section — avoids React anti-pattern of mutating refs during render
          const showSection = section && section !== lastSection;
          if (showSection) lastSection = section;
          return (
            <div key={item.id}>
              {showSection && <div className="dash-nav-section">{section}</div>}
              <button onClick={() => { setActive(item.id); onClose?.(); }} className={`dash-nav-item ${active === item.id ? 'active' : ''}`}>
                <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
                <span>{item.label}</span>
                {active === item.id && <span className="nav-dot" />}
              </button>
            </div>
          );
        }); })()}
      </nav>

      <div style={{ padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.05)', position:'relative', zIndex:1 }}>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.18)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>MyTawjeh AI · v2.0</p>
      </div>
    </div>
  );
}

export default Sidebar;
