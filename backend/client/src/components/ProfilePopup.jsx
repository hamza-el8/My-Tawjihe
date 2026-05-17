import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Avatar({ nom, role }) {
  const initials = nom ? nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  const colors = { eleve: '#3b82f6', parent: '#10b981', professeur: '#8b5cf6', admin: '#ef4444' };
  const bg = colors[role] || '#6b7280';
  const roleLabels = { eleve: 'Étudiant', parent: 'Parent', professeur: 'Professeur', admin: 'Administrateur' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.3)'
      }}>
        {initials}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{nom}</p>
        <span style={{
          fontSize: 10, padding: '1px 6px', borderRadius: 9999,
          background: 'rgba(234,179,8,0.2)', color: '#fbbf24', fontWeight: 600
        }}>
          {roleLabels[role] || role}
        </span>
      </div>
    </div>
  );
}

export default function ProfilePopup({ onRetakeOnet }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('password');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [linkedStudent, setLinkedStudent] = useState(null);
  const [linkMsg, setLinkMsg] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const popupRef = useRef(null);

  // Fetch linked student for parent on open
  useEffect(() => {
    if (open && user?.role === 'parent') {
      api.get('/auth/linked-student')
        .then(r => setLinkedStudent(r.data.eleve))
        .catch(() => {});
    }
  }, [open, user?.role]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      setPwMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }
    if (pw.next.length < 6) {
      setPwMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }
    setPwLoading(true); setPwMsg(null);
    try {
      const { data } = await api.post('/auth/change-password', {
        currentPassword: pw.current,
        newPassword: pw.next,
      });
      setPwMsg({ type: 'success', text: data.message });
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLinkStudent = async (e) => {
    e.preventDefault();
    setLinkLoading(true); setLinkMsg(null);
    try {
      const { data } = await api.post('/auth/link-student', { eleveEmail: studentEmail });
      setLinkMsg({ type: 'success', text: data.message });
      setLinkedStudent(data.eleve);
      setStudentEmail('');
    } catch (err) {
      setLinkMsg({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setLinkLoading(false);
    }
  };

  const tabs = [
    { key: 'password', label: '🔑 Mot de passe' },
    ...(user?.role === 'parent' ? [{ key: 'student', label: '👦 Lier un élève' }] : []),
    ...(user?.role === 'professeur' ? [{ key: 'students', label: '👥 Mes élèves' }] : []),
    ...(user?.role === 'eleve' ? [{ key: 'onet', label: '🎯 Profil O*NET' }] : []),
  ];

  return (
    <div ref={popupRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <div onClick={() => setOpen(o => !o)}>
        <Avatar nom={user?.nom} role={user?.role} />
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 1000,
          background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          width: 340, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', color: '#fff' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{user?.nom}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.7 }}>{user?.email}</p>
            {user?.role === 'eleve' && user?.filiere && (
              <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.6 }}>{user.niveau} — {user.filiere}</p>
            )}
            {user?.role === 'professeur' && user?.specialite && (
              <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.6 }}>{user.specialite}</p>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: '10px 4px', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tab === t.key ? '#fff' : 'transparent',
                color: tab === t.key ? '#0f2044' : '#94a3b8',
                borderBottom: tab === t.key ? '2px solid #f59e0b' : '2px solid transparent',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: 20 }}>

            {/* ── Change password ── */}
            {tab === 'password' && (
              <form onSubmit={handleChangePassword}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  Changez votre mot de passe de connexion.
                </p>
                {pwMsg && (
                  <div style={{
                    marginBottom: 12, padding: '8px 12px', borderRadius: 8, fontSize: 12,
                    background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626',
                  }}>
                    {pwMsg.text}
                  </div>
                )}
                {[
                  { key: 'current', label: 'Mot de passe actuel' },
                  { key: 'next',    label: 'Nouveau mot de passe' },
                  { key: 'confirm', label: 'Confirmer le nouveau' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      {f.label}
                    </label>
                    <input
                      type="password"
                      value={pw[f.key]}
                      onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                      required
                      style={{
                        width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0',
                        borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box',
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={pwLoading}
                  style={{
                    width: '100%', padding: '9px', background: pwLoading ? '#fbbf24aa' : '#f59e0b',
                    color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: pwLoading ? 'not-allowed' : 'pointer', marginTop: 4,
                  }}
                >
                  {pwLoading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </form>
            )}

            {/* ── Parent: link student ── */}
            {tab === 'student' && (
              <div>
                {linkedStudent ? (
                  <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 6, textTransform: 'uppercase' }}>
                      ✅ Élève lié
                    </p>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f2044', fontSize: 14 }}>{linkedStudent.nom}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{linkedStudent.email}</p>
                    {linkedStudent.niveau && (
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{linkedStudent.niveau} — {linkedStudent.filiere}</p>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    Aucun élève lié. Entrez l'email de votre enfant pour le lier à votre compte.
                  </p>
                )}

                {linkMsg && (
                  <div style={{
                    marginBottom: 12, padding: '8px 12px', borderRadius: 8, fontSize: 12,
                    background: linkMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: linkMsg.type === 'success' ? '#16a34a' : '#dc2626',
                  }}>
                    {linkMsg.text}
                  </div>
                )}

                <form onSubmit={handleLinkStudent}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    {linkedStudent ? 'Changer d\'élève lié' : 'Email de l\'élève'}
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={e => setStudentEmail(e.target.value)}
                    required
                    placeholder="eleve@exemple.ma"
                    style={{
                      width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0',
                      borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={linkLoading}
                    style={{
                      width: '100%', padding: '9px', background: linkLoading ? '#10b98180' : '#10b981',
                      color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                      cursor: linkLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {linkLoading ? 'Recherche...' : linkedStudent ? 'Changer l\'élève lié' : 'Lier cet élève'}
                  </button>
                </form>
              </div>
            )}

            {/* ── Prof: students info ── */}
            {tab === 'students' && (
              <div>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  Gestion des élèves via le dashboard principal. Consultez la section "Élèves en difficulté" pour voir vos élèves suivis.
                </p>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 12, color: '#475569' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>💡 Conseil</p>
                  <p style={{ margin: '4px 0 0' }}>Pour ajouter un élève à votre suivi, demandez-lui de vous communiquer son email et ajoutez-le depuis la section "Élèves" du dashboard.</p>
                </div>
              </div>
            )}

            {/* ── Eleve: ONET ── */}
            {tab === 'onet' && (
              <div>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  Repasser le test O*NET pour mettre à jour votre profil de carrière.
                </p>
                <button
                  onClick={() => { setOpen(false); if (onRetakeOnet) onRetakeOnet(); }}
                  style={{
                    width: '100%', padding: '10px', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                    color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🎯 Repasser le test O*NET
                </button>
                <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                  Vos résultats précédents seront remplacés.
                </p>
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 20px' }}>
            <button
              onClick={() => { setOpen(false); logout(); }}
              style={{
                width: '100%', padding: '8px', background: '#fef2f2', color: '#dc2626',
                border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
