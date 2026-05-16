import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState({ eleves: [], profs: [], parents: [] });
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', eleveId: '' });
  const [tab, setTab] = useState('users');
  const [msg, setMsg] = useState('');

  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data)); }, []);

  const deleteUser = async (role, id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`/admin/users/${role}/${id}`);
    api.get('/admin/users').then(r => setUsers(r.data));
  };

  const sendNotif = async e => {
    e.preventDefault();
    await api.post('/notifications', notifForm);
    setMsg('Notification envoyée !');
    setNotifForm({ contenu: '', type: 'info', eleveId: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  const total = users.eleves.length + users.profs.length + users.parents.length;

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">🛠️ Administration</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['👨‍🎓 Étudiants', users.eleves.length, 'blue'],['👨‍🏫 Professeurs', users.profs.length, 'purple'],['👨‍👩‍👧 Parents', users.parents.length, 'green']].map(([l,v,c]) => (
          <div key={l} className="card p-5 text-center">
            <p className="text-3xl font-black" style={{ color: c === 'blue' ? '#3b82f6' : c === 'purple' ? '#8b5cf6' : '#10b981' }}>{v}</p>
            <p className="text-sm text-gray-500 mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {[['users','👥 Utilisateurs'],['notifs','🔔 Notifications']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab===k ? 'btn-gold' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="space-y-6">
          {[['eleve', users.eleves, '👨‍🎓'], ['professeur', users.profs, '👨‍🏫'], ['parent', users.parents, '👨‍👩‍👧']].map(([role, list, icon]) => (
            <div key={role} className="card p-6">
              <h3 className="font-bold text-gray-700 mb-4">{icon} {role.charAt(0).toUpperCase()+role.slice(1)}s ({list.length})</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b text-gray-500 text-left">
                  <th className="pb-2">Nom</th><th className="pb-2">Email</th><th className="pb-2">Action</th>
                </tr></thead>
                <tbody>
                  {list.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{u.nom}</td>
                      <td className="py-2 text-gray-500">{u.email}</td>
                      <td className="py-2">
                        <button onClick={() => deleteUser(role, u.id)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {!list.length && <tr><td colSpan={3} className="py-4 text-center text-gray-400">Aucun</td></tr>}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {tab === 'notifs' && (
        <div className="card p-6 max-w-lg">
          <h3 className="font-bold text-gray-700 mb-4">Envoyer une notification</h3>
          {msg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{msg}</div>}
          <form onSubmit={sendNotif} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">ID Étudiant</label>
              <select value={notifForm.eleveId} onChange={e => setNotifForm(f=>({...f,eleveId:e.target.value}))} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="">Sélectionner...</option>
                {users.eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
              <select value={notifForm.type} onChange={e => setNotifForm(f=>({...f,type:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {['info','note','revision'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
              <textarea value={notifForm.contenu} onChange={e => setNotifForm(f=>({...f,contenu:e.target.value}))} required rows={3} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
            </div>
            <button type="submit" className="btn-gold w-full py-2 rounded-lg text-sm">Envoyer</button>
          </form>
        </div>
      )}
    </Layout>
  );
}
