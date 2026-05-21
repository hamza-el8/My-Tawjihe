import { useState, useEffect } from 'react';
import { User, Note, apiFetch } from './shared';
import { StatCard } from './Layout';

export default function ParentDashboard({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [linkedEleve, setLinkedEleve] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [parentNotifs, setParentNotifs] = useState<any[]>([]);
  const [tab, setTab] = useState<'notes' | 'notifs'>('notes');

  useEffect(() => {
    apiFetch('/auth/linked-student')
      .then(r => {
        setLinkedEleve(r.eleve);
        if (r.eleve) {
          // Fetch notes AND eleve notifications for parent visibility
          return Promise.all([
            apiFetch(`/eleves/${r.eleve.id}/notes`),
            apiFetch(`/notifications/${r.eleve.id}`),
          ]);
        }
        return [[], []];
      })
      .then(([n, notifs]) => {
        setNotes(Array.isArray(n) ? n : []);
        setParentNotifs(Array.isArray(notifs) ? notifs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) /
       notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  const lowGrades = notes.filter(n => n.valeur < 10);
  const unreadAlerts = parentNotifs.filter(n => !n.lu).length;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#064e3b,#059669,#10b981)' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>Espace Parent</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{user.nom}</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
          Cliquez sur votre nom dans la barre latérale pour gérer votre compte
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '4px solid #d1fae5', borderTopColor: '#059669', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : !linkedEleve ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👦</div>
          <p style={{ fontWeight: 800, color: '#0f0c29', fontSize: 16, marginBottom: 8 }}>Aucun élève lié</p>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 320, margin: '0 auto 16px' }}>
            Cliquez sur votre <strong>nom dans la barre latérale</strong>, puis sur <strong>"Lier un élève"</strong> pour associer votre enfant.
          </p>
          <span style={{ padding: '6px 16px', borderRadius: 999, background: '#fffbeb', color: '#92400e', fontSize: 12, fontWeight: 600, border: '1px solid #fde68a' }}>
            💡 Vous aurez besoin de l'email de votre enfant inscrit sur la plateforme
          </span>
        </div>
      ) : (
        <>
          {/* Alert banner for low grades */}
          {lowGrades.length > 0 && (
            <div style={{ padding: '12px 18px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: 13 }}>
                  {lowGrades.length} matière{lowGrades.length > 1 ? 's' : ''} sous la moyenne
                </p>
                <p style={{ margin: '2px 0 0', color: '#ef4444', fontSize: 12 }}>
                  {lowGrades.map(n => `${n.matiere} (${n.valeur}/20)`).join(' · ')}
                </p>
              </div>
            </div>
          )}

          {/* Student card */}
          <div className="dash-card p-5" style={{ display: 'flex', alignItems: 'center', gap: 14, borderColor: 'rgba(16,185,129,0.15)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, flexShrink: 0 }}>
              {linkedEleve.nom?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, color: '#0f0c29', fontSize: 15, margin: 0 }}>{linkedEleve.nom}</p>
              <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0' }}>{linkedEleve.email}</p>
              {linkedEleve.niveau && (
                <p style={{ color: '#94a3b8', fontSize: 11, margin: '2px 0 0' }}>{linkedEleve.niveau} · {linkedEleve.filiere}</p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: parseFloat(moyenne) >= 10 ? '#059669' : '#dc2626', margin: 0, lineHeight: 1 }}>{moyenne}</p>
              <p style={{ color: '#94a3b8', fontSize: 11, margin: '4px 0 0' }}>/20 moy.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon="📊" label="Moyenne" value={notes.length ? `${moyenne}/20` : '—'} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📝" label="Notes" value={notes.length} color="bg-blue-50 text-blue-600" />
            <StatCard icon="🔔" label="Alertes" value={unreadAlerts > 0 ? unreadAlerts : '✓'} color="bg-amber-50 text-amber-600" />
          </div>

          {/* Tabs */}
          <div className="dash-tabs">
            <button onClick={() => setTab('notes')} className={`dash-tab ${tab === 'notes' ? 'active' : ''}`}>📊 Notes</button>
            <button onClick={() => setTab('notifs')} className={`dash-tab ${tab === 'notifs' ? 'active' : ''}`}>
              🔔 Alertes {unreadAlerts > 0 && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 999, background: '#7c3aed', color: '#fff', fontSize: 10 }}>{unreadAlerts}</span>}
            </button>
          </div>

          {/* Notes table */}
          {tab === 'notes' && (
            notes.length === 0 ? (
              <div className="dash-empty"><div className="dash-empty-icon">📊</div><p className="dash-empty-title">Aucune note disponible</p></div>
            ) : (
              <div className="dash-card-flat overflow-hidden">
                <table className="dash-table">
                  <thead><tr>
                    <th>Matière</th><th>Note</th><th>Coeff.</th><th>Période</th><th>Type</th>
                  </tr></thead>
                  <tbody>
                    {notes.map(n => (
                      <tr key={n.id}>
                        <td style={{ fontWeight: 600, color: '#0f0c29' }}>{n.matiere}</td>
                        <td>
                          <span className={`score-chip ${n.valeur >= 14 ? 'dash-badge-green' : n.valeur >= 10 ? 'dash-badge-blue' : 'dash-badge-red'}`}>
                            {n.valeur}/20
                          </span>
                        </td>
                        <td style={{ color: '#64748b' }}>{n.coefficient}</td>
                        <td style={{ color: '#64748b' }}>{n.periode}</td>
                        <td style={{ color: '#64748b' }}>{n.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Alerts for parent */}
          {tab === 'notifs' && (
            parentNotifs.length === 0 ? (
              <div className="dash-empty"><div className="dash-empty-icon">🔔</div><p className="dash-empty-title">Aucune alerte</p><p className="dash-empty-desc">Vous serez notifié si une note faible est enregistrée.</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {parentNotifs.map((n: any) => {
                  const typeIcon: Record<string, string> = { note: '📊', revision: '📝', info: 'ℹ️' };
                  return (
                    <div key={n.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderRadius: 12,
                      background: n.lu ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
                      border: n.lu ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(124,58,237,0.18)',
                      opacity: n.lu ? 0.7 : 1,
                    }}>
                      <span style={{ fontSize: 18 }}>{typeIcon[n.type] || '🔔'}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: 13.5, color: '#0f0c29', fontWeight: n.lu ? 400 : 600 }}>{n.contenu}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>
                          {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
