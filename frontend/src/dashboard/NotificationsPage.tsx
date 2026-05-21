import { useState, useEffect } from 'react';
import { User, Notification, apiFetch } from './shared';

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ user }: { user: User }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/notifications/${user.id}`)
      .then(data => setNotifs(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger les notifications.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const markRead = async (id: number) => {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifs.filter(n => !n.lu);
    await Promise.all(unread.map(n => apiFetch(`/notifications/${n.id}/read`, { method: 'PATCH' })));
    setNotifs(notifs.map(n => ({ ...n, lu: true })));
  };

  const typeIcon: Record<string, string> = { note:'📊', revision:'📝', info:'ℹ️', success:'✅' };
  const typeColor: Record<string, string> = { note:'rgba(29,78,216,0.08)', revision:'rgba(124,58,237,0.08)', info:'rgba(15,118,110,0.06)', success:'rgba(16,185,129,0.08)' };
  const unreadCount = notifs.filter(n => !n.lu).length;

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ display:'flex', gap:14, padding:'16px 20px', borderRadius:14, background:'rgba(255,255,255,0.9)' }}>
          <div className="dash-skeleton" style={{ width:40, height:40, borderRadius:10, flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:8, width:'80%' }} />
            <div className="dash-skeleton" style={{ height:11, borderRadius:6, width:'40%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="dash-empty">
      <div className="dash-empty-icon">⚠️</div>
      <p className="dash-empty-title">{error}</p>
      <button onClick={() => window.location.reload()} className="dash-btn dash-btn-primary" style={{ marginTop:16 }}>Réessayer</button>
    </div>
  );

  return (
    <div>
      {/* Header with mark all read */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0 }}>Notifications</h2>
          {unreadCount > 0 && (
            <span style={{ padding:'2px 10px', borderRadius:999, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', fontSize:11, fontWeight:700 }}>
              {unreadCount} non lue{unreadCount>1?'s':''}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ fontSize:12, color:'#7c3aed', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🔔</div>
          <p className="dash-empty-title">Tout est à jour !</p>
          <p className="dash-empty-desc">Vous n'avez aucune notification pour l'instant.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {notifs.map(n => (
            <div key={n.id} style={{
              display:'flex', alignItems:'flex-start', gap:14,
              padding:'16px 18px', borderRadius:14,
              background: n.lu ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
              border: n.lu ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(124,58,237,0.18)',
              boxShadow: n.lu ? 'none' : '0 2px 12px rgba(124,58,237,0.08)',
              opacity: n.lu ? 0.65 : 1,
              transition: 'all .2s',
            }}>
              <div style={{ width:40, height:40, borderRadius:10, background: typeColor[n.type] || '#f8f7ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {typeIcon[n.type] || '🔔'}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13.5, lineHeight:1.6, color: n.lu ? '#64748b' : '#0f0c29', fontWeight: n.lu ? 400 : 600, margin:0 }}>
                  {n.contenu}
                </p>
                <p style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>
                  {new Date(n.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
              {!n.lu && (
                <button onClick={() => markRead(n.id)} style={{ fontSize:11, color:'#7c3aed', fontWeight:700, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:6, padding:'4px 10px', cursor:'pointer', flexShrink:0 }}>
                  ✓ Lu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
