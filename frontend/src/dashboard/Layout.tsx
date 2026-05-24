// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title, subtitle, onMenuClick, notifCount }: {
  title: string; subtitle?: string; onMenuClick: () => void; notifCount?: number;
}) {
  return (
    <div className="dash-header">
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onMenuClick} className="lg:hidden" style={{ width:36, height:36, borderRadius:10, background:'#f5f3ff', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed' }}>
          ☰
        </button>
        <div>
          <h1 className="dash-header-title">{title}</h1>
          {subtitle && <p className="dash-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {notifCount !== undefined && notifCount > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:999, background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.08))', border:'1px solid rgba(124,58,237,0.15)' }}>
            <span style={{ fontSize:13 }}>🔔</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#7c3aed' }}>{notifCount} non lue{notifCount > 1 ? 's' : ''}</span>
          </div>
        )}
        <div style={{ width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#34d399)', boxShadow:'0 0 8px rgba(16,185,129,0.5)' }} title="Connecté" />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  const bgMap: Record<string, string> = {
    'bg-violet-50 text-violet-600':  'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.06))',
    'bg-blue-50 text-blue-600':      'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(59,130,246,0.05))',
    'bg-emerald-50 text-emerald-600':'linear-gradient(135deg,rgba(4,120,87,0.1),rgba(16,185,129,0.05))',
    'bg-rose-50 text-rose-600':      'linear-gradient(135deg,rgba(190,18,60,0.1),rgba(225,29,72,0.05))',
    'bg-amber-50 text-amber-600':    'linear-gradient(135deg,rgba(180,83,9,0.1),rgba(245,158,11,0.05))',
    'bg-purple-50 text-purple-600':  'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))',
  };
  const iconBg = bgMap[color] || 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))';
  return (
    <div className="dash-stat">
      <div className="dash-stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}

export { Header, StatCard };
