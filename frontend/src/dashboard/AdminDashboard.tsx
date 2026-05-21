import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user }: { user: User }) {
  const [data, setData] = useState<{ eleves: any[]; profs: any[]; parents: any[] }>({ eleves: [], profs: [], parents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', eleveId: '' });
  const [notifMsg, setNotifMsg] = useState('');
  const [tab, setTab] = useState('users');

  useEffect(() => {
    apiFetch('/admin/users')
      .then((r) => {
        setData({
          eleves: Array.isArray(r.eleves) ? r.eleves : [],
          profs: Array.isArray(r.profs) ? r.profs : [],
          parents: Array.isArray(r.parents) ? r.parents : [],
        });
      })
      .catch((e) => setError(e.message || 'Impossible de charger les utilisateurs'))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (role: string, id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch(`/admin/users/${role}/${id}`, { method: 'DELETE' });
      const r = await apiFetch('/admin/users');
      setData({
        eleves: Array.isArray(r.eleves) ? r.eleves : [],
        profs: Array.isArray(r.profs) ? r.profs : [],
        parents: Array.isArray(r.parents) ? r.parents : [],
      });
    } catch (e: any) { alert(e.message); }
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/notifications', { method: 'POST', body: JSON.stringify(notifForm) });
      setNotifMsg('✅ Notification envoyée !');
      setNotifForm({ contenu: '', type: 'info', eleveId: '' });
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e: any) { setNotifMsg('❌ ' + e.message); }
  };

  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      <p className="text-gray-400 text-sm">Chargement du panneau d'administration...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-rose-600 font-semibold text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Réessayer</button>
    </div>
  );

  const allUsers = [
    ...data.eleves.map(u => ({ ...u, role: 'eleve' })),
    ...data.profs.map(u => ({ ...u, role: 'professeur' })),
    ...data.parents.map(u => ({ ...u, role: 'parent' })),
  ];

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c0519,#be123c,#e11d48)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Administration</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Administrateur plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <StatCard icon="🎓" label="Étudiants" value={data.eleves.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="👨‍🏫" label="Professeurs" value={data.profs.length} color="bg-purple-50 text-purple-600" />
        <StatCard icon="👨‍👩‍👧" label="Parents" value={data.parents.length} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[['users', '👥 Utilisateurs'], ['notifs', '🔔 Notification']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab === k ? 'active' : ''}`}
            style={tab === k ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Nom</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allUsers.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{u.nom}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 capitalize">{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => deleteUser(u.role, u.id)} className="text-xs text-rose-400 hover:text-rose-600 font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
              {!allUsers.length && <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Aucun utilisateur</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notifs' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Envoyer une notification</h3>
          {notifMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${notifMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{notifMsg}</div>}
          <form onSubmit={sendNotif} className="space-y-3">
            <select value={notifForm.eleveId} onChange={e => setNotifForm(f => ({ ...f, eleveId: e.target.value }))} required
              className="dash-input">
              <option value="">Sélectionner un étudiant...</option>
              {data.eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
            <select value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
              className="dash-input">
              {['info', 'note', 'revision'].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea value={notifForm.contenu} onChange={e => setNotifForm(f => ({ ...f, contenu: e.target.value }))} required rows={3}
              placeholder="Message de la notification..." className="dash-input" style={{resize:'none'}} />
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
