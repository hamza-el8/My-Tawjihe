import { useState, useEffect, FormEvent } from 'react';
import { User, Note, Notification, apiFetch } from './shared';
import NotesEvolutionChart from './NotesEvolutionChart';
import { StatCard } from './Layout';

export default function ParentDashboard({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [linkedEleve, setLinkedEleve] = useState<{ id: number; nom: string; email: string; niveau?: string; filiere?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [parentNotifs, setParentNotifs] = useState<Notification[]>([]);
  const [tab, setTab] = useState<'notes' | 'notifs'>('notes');
  const [linkEmail, setLinkEmail] = useState('');
  const [linkMsg, setLinkMsg] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [unlinkMsg, setUnlinkMsg] = useState('');

  const loadLinkedData = async (eleveId: number) => {
    const [notesData, notifsData] = await Promise.all([
      apiFetch(`/eleves/${eleveId}/notes`),
      apiFetch(`/notifications/${eleveId}`),
    ]);
    setNotes(Array.isArray(notesData) ? notesData : []);
    setParentNotifs(Array.isArray(notifsData) ? notifsData : []);
  };

  useEffect(() => {
    apiFetch('/auth/linked-student')
      .then(async (r) => {
        setLinkedEleve(r.eleve);
        if (r.eleve) {
          await loadLinkedData(r.eleve.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const linkStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!linkEmail.trim()) {
      setLinkMsg('Veuillez saisir l’email de l’élève.');
      return;
    }
    setLinkLoading(true);
    setLinkMsg('');
    try {
      const res = await apiFetch('/auth/link-student', {
        method: 'POST',
        body: JSON.stringify({ eleveEmail: linkEmail.trim() }),
      });
      setLinkedEleve(res.eleve);
      setLinkEmail('');
      setShowLinkForm(false);
      setLinkMsg('✅ Élève lié avec succès !');
      if (res.eleve?.id) {
        await loadLinkedData(res.eleve.id);
      }
    } catch (e: any) {
      setLinkMsg('❌ ' + (e.message || 'Impossible de lier l’élève.'));
    } finally {
      setLinkLoading(false);
    }
  };

  const unlinkStudent = async () => {
    if (!linkedEleve) return;
    if (!window.confirm('Dissocier cet élève de votre compte ?')) return;
    setUnlinkLoading(true);
    setUnlinkMsg('');
    try {
      await apiFetch('/auth/link-student', {
        method: 'DELETE',
      });
      setLinkedEleve(null);
      setNotes([]);
      setParentNotifs([]);
      setTab('notes');
      setShowLinkForm(false);
      setLinkMsg('');
      setUnlinkMsg('✅ Élève dissocié avec succès.');
    } catch (e: any) {
      setUnlinkMsg('❌ ' + (e.message || 'Impossible de dissocier l’élève.'));
    } finally {
      setUnlinkLoading(false);
    }
  };

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) /
       notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  const lowGrades = notes.filter(n => n.valeur < 10);
  const unreadAlerts = parentNotifs.filter(n => !n.lu).length;

  const markNotificationRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      setParentNotifs(parentNotifs.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch (e) {
      // ignore failures silently for now
    }
  };

  const markAllNotificationsRead = async () => {
    const unread = parentNotifs.filter(n => !n.lu);
    await Promise.all(unread.map(n => apiFetch(`/notifications/${n.id}/read`, { method: 'PATCH' })));
    setParentNotifs(parentNotifs.map(n => ({ ...n, lu: true })));
  };

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
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👦</div>
          <p style={{ fontWeight: 800, color: '#0f0c29', fontSize: 16, marginBottom: 8 }}>Aucun élève lié</p>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 320, margin: '0 auto 20px' }}>
            Saisissez l'email de votre enfant ci-dessous pour l'associer à votre compte.
          </p>
          <form onSubmit={linkStudent} style={{ display: 'grid', gap: 12, maxWidth: 420, margin: '0 auto' }}>
            <input
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              placeholder="Email de l'élève"
              className="dash-input"
              style={{ width: '100%' }}
              required
            />
            <button type="submit" className="dash-btn dash-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {linkLoading ? '⏳ Liaison en cours...' : 'Lier mon enfant'}
            </button>
          </form>
          {linkMsg && (
            <p style={{ marginTop: 14, color: linkMsg.startsWith('✅') ? '#047857' : '#b91c1c', fontSize: 13 }}>
              {linkMsg}
            </p>
          )}
          <span style={{ display: 'inline-flex', marginTop: 18, padding: '6px 16px', borderRadius: 999, background: '#fffbeb', color: '#92400e', fontSize: 12, fontWeight: 600, border: '1px solid #fde68a' }}>
            💡 Utilisez l'email que votre enfant a utilisé pour son compte.
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 16 }}>
            <button onClick={() => setShowLinkForm((prev) => !prev)} className="dash-btn dash-btn-secondary" style={{ minWidth: 180 }}>
              {showLinkForm ? 'Masquer le formulaire' : 'Changer d’élève'}
            </button>
            <button onClick={unlinkStudent} disabled={unlinkLoading} className="dash-btn dash-btn-ghost" style={{ minWidth: 180, border: '1px solid #d1d5db', color: '#111827' }}>
              {unlinkLoading ? '⏳ Dissociation...' : 'Dissocier l’élève'}
            </button>
          </div>
          {(linkMsg || unlinkMsg) && (
            <p style={{ marginTop: 12, color: linkMsg.startsWith('✅') || unlinkMsg.startsWith('✅') ? '#047857' : '#b91c1c', fontSize: 13 }}>
              {linkMsg || unlinkMsg}
            </p>
          )}
          {showLinkForm && (
            <div className="dash-card p-5 mt-6" style={{ borderColor: 'rgba(16,185,129,0.12)' }}>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Relier un autre étudiant</h3>
              <form onSubmit={linkStudent} className="space-y-3">
                <input
                  type="email"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  placeholder="Email de l'élève"
                  className="dash-input"
                  required
                />
                <button type="submit" className="dash-btn dash-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {linkLoading ? '⏳ Liaison en cours...' : 'Lier cet élève'}
                </button>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon="📊" label="Moyenne" value={notes.length ? `${moyenne}/20` : '—'} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📝" label="Notes" value={notes.length} color="bg-blue-50 text-blue-600" />
            <StatCard icon="🔔" label="Alertes" value={unreadAlerts > 0 ? unreadAlerts : '✓'} color="bg-amber-50 text-amber-600" />
          </div>

          {notes.length >= 2 && <NotesEvolutionChart notes={notes} />}

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
                {unreadAlerts > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#3730a3' }}>{unreadAlerts} alerte{unreadAlerts > 1 ? 's' : ''} non lue{unreadAlerts > 1 ? 's' : ''}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#475569' }}>Marquez-les comme lues lorsque vous en avez pris connaissance.</p>
                    </div>
                    <button onClick={markAllNotificationsRead} style={{ fontSize: 12, color: '#4338ca', fontWeight: 700, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>
                      Tout marquer lu
                    </button>
                  </div>
                )}
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
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13.5, color: '#0f0c29', fontWeight: n.lu ? 400 : 600 }}>{n.contenu}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>
                          {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.lu && (
                        <button onClick={() => markNotificationRead(n.id)} style={{ fontSize: 11, color: '#4338ca', fontWeight: 700, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flexShrink: 0 }}>
                          Marquer lu
                        </button>
                      )}
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
