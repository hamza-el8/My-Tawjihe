import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { StatCard } from './Layout';

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user }: { user: User }) {
  const [data, setData] = useState<{ eleves: any[]; profs: any[]; parents: any[] }>({ eleves: [], profs: [], parents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notifications
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', eleveId: '', sendToAll: false });
  const [notifMsg, setNotifMsg] = useState('');
  
  // Exercices
  const [exercices, setExercices] = useState<any[]>([]);
  const [exerciceForm, setExerciceForm] = useState({ id: '', matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
  const [exerciceMsg, setExerciceMsg] = useState('');
  const [exerciceSearch, setExerciceSearch] = useState('');
  
  // Annales
  const [annales, setAnnales] = useState<any[]>([]);
  const [annaleForm, setAnnaleForm] = useState({ id: '', matiere: '', annee: new Date().getFullYear().toString(), contenu: '', correction: '' });
  const [annaleMsg, setAnnaleMsg] = useState('');
  const [annaleSearch, setAnnaleSearch] = useState('');
  
  // Concours
  const [concours, setConcours] = useState<any[]>([]);
  const [concoursForm, setConcoursForm] = useState({ id: '', nom: '', seuil: '10', dateConcours: '', description: '', lien: '' });
  const [concoursMsg, setConcoursMsg] = useState('');
  const [concoursSearch, setConcoursSearch] = useState('');

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

  // Load exercices, annales, concours
  useEffect(() => {
    Promise.all([
      apiFetch('/exercices'),
      apiFetch('/annales'),
      apiFetch('/concours'),
    ]).then(([ex, an, co]) => {
      setExercices(Array.isArray(ex) ? ex : []);
      setAnnales(Array.isArray(an) ? an : []);
      setConcours(Array.isArray(co) ? co : []);
    }).catch(console.error);
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
      if (notifForm.sendToAll) {
        // Send to all students
        for (const eleve of data.eleves) {
          await apiFetch('/notifications', { 
            method: 'POST', 
            body: JSON.stringify({ contenu: notifForm.contenu, type: notifForm.type, eleveId: eleve.id }) 
          });
        }
        setNotifMsg('✅ Notification envoyée à tous les étudiants !');
      } else {
        await apiFetch('/notifications', { method: 'POST', body: JSON.stringify(notifForm) });
        setNotifMsg('✅ Notification envoyée !');
      }
      setNotifForm({ contenu: '', type: 'info', eleveId: '', sendToAll: false });
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e: any) { setNotifMsg('❌ ' + e.message); }
  };

  const addExercice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (exerciceForm.id) {
        // Update - note: backend might not support PUT, using POST instead
        await apiFetch(`/exercices/${exerciceForm.id}`, { method: 'PUT', body: JSON.stringify(exerciceForm) }).catch(() => 
          apiFetch('/exercices', { method: 'POST', body: JSON.stringify(exerciceForm) })
        );
      } else {
        await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(exerciceForm) });
      }
      const ex = await apiFetch('/exercices');
      setExercices(Array.isArray(ex) ? ex : []);
      setExerciceMsg('✅ ' + (exerciceForm.id ? 'Exercice modifié' : 'Exercice ajouté') + ' !');
      setExerciceForm({ id: '', matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
      setTimeout(() => setExerciceMsg(''), 3000);
    } catch (e: any) { setExerciceMsg('❌ ' + e.message); }
  };

  const deleteExercice = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return;
    try {
      await apiFetch(`/exercices/${id}`, { method: 'DELETE' });
      const ex = await apiFetch('/exercices');
      setExercices(Array.isArray(ex) ? ex : []);
    } catch (e: any) { setExerciceMsg('❌ ' + e.message); }
  };

  const editExercice = (ex: any) => {
    setExerciceForm({ id: ex.id, matiere: ex.matiere, niveau: ex.niveau, difficulte: ex.difficulte, contenu: ex.contenu, correction: ex.correction });
  };

  const addAnnale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (annaleForm.id) {
        await apiFetch(`/annales/${annaleForm.id}`, { method: 'PUT', body: JSON.stringify(annaleForm) }).catch(() => 
          apiFetch('/annales', { method: 'POST', body: JSON.stringify(annaleForm) })
        );
      } else {
        await apiFetch('/annales', { method: 'POST', body: JSON.stringify(annaleForm) });
      }
      const an = await apiFetch('/annales');
      setAnnales(Array.isArray(an) ? an : []);
      setAnnaleMsg('✅ ' + (annaleForm.id ? 'Annale modifiée' : 'Annale ajoutée') + ' !');
      setAnnaleForm({ id: '', matiere: '', annee: new Date().getFullYear().toString(), contenu: '', correction: '' });
      setTimeout(() => setAnnaleMsg(''), 3000);
    } catch (e: any) { setAnnaleMsg('❌ ' + e.message); }
  };

  const deleteAnnale = async (id: number) => {
    if (!confirm('Supprimer cette annale ?')) return;
    try {
      await apiFetch(`/annales/${id}`, { method: 'DELETE' });
      const an = await apiFetch('/annales');
      setAnnales(Array.isArray(an) ? an : []);
    } catch (e: any) { setAnnaleMsg('❌ ' + e.message); }
  };

  const editAnnale = (an: any) => {
    setAnnaleForm({ id: an.id, matiere: an.matiere, annee: an.annee, contenu: an.contenu, correction: an.correction });
  };

  const addConcours = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (concoursForm.id) {
        await apiFetch(`/concours/${concoursForm.id}`, { method: 'PUT', body: JSON.stringify(concoursForm) }).catch(() => 
          apiFetch('/concours', { method: 'POST', body: JSON.stringify(concoursForm) })
        );
      } else {
        await apiFetch('/concours', { method: 'POST', body: JSON.stringify(concoursForm) });
      }
      const co = await apiFetch('/concours');
      setConcours(Array.isArray(co) ? co : []);
      setConcoursMsg('✅ ' + (concoursForm.id ? 'Concours modifié' : 'Concours ajouté') + ' !');
      setConcoursForm({ id: '', nom: '', seuil: '10', dateConcours: '', description: '', lien: '' });
      setTimeout(() => setConcoursMsg(''), 3000);
    } catch (e: any) { setConcoursMsg('❌ ' + e.message); }
  };

  const deleteConcours = async (id: number) => {
    if (!confirm('Supprimer ce concours ?')) return;
    try {
      await apiFetch(`/concours/${id}`, { method: 'DELETE' });
      const co = await apiFetch('/concours');
      setConcours(Array.isArray(co) ? co : []);
    } catch (e: any) { setConcoursMsg('❌ ' + e.message); }
  };

  const editConcours = (co: any) => {
    setConcoursForm({ id: co.id, nom: co.nom, seuil: co.seuil.toString(), dateConcours: co.dateConcours, description: co.description, lien: co.lien });
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

  const filteredUsers = allUsers.filter(u => 
    u.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {[['users', '👥 Utilisateurs'], ['notifs', '🔔 Notifications'], ['exercices', '📝 Exercices'], ['annales', '📚 Annales'], ['concours', '🏆 Concours']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab === k ? 'active' : ''}`}
            style={tab === k ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
          />
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
                {filteredUsers.map((u, i) => (
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
                {!filteredUsers.length && <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Aucun utilisateur</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'notifs' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Envoyer une notification</h3>
          {notifMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${notifMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{notifMsg}</div>}
          <form onSubmit={sendNotif} className="space-y-3">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={notifForm.sendToAll} 
                onChange={e => setNotifForm(f => ({ ...f, sendToAll: e.target.checked, eleveId: e.target.checked ? '' : f.eleveId }))}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Envoyer à tous les étudiants</span>
            </label>
            {!notifForm.sendToAll && (
              <select value={notifForm.eleveId} onChange={e => setNotifForm(f => ({ ...f, eleveId: e.target.value }))} required={!notifForm.sendToAll}
                className="dash-input">
                <option value="">Sélectionner un étudiant...</option>
                {data.eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
              </select>
            )}
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

      {tab === 'exercices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Rechercher exercices..." 
              value={exerciceSearch} 
              onChange={(e) => setExerciceSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>
          
          <div className="dash-card p-6 max-w-2xl">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{exerciceForm.id ? 'Modifier' : 'Ajouter'} un exercice</h3>
            {exerciceMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${exerciceMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{exerciceMsg}</div>}
            <form onSubmit={addExercice} className="space-y-3">
              <input required placeholder="Matière" value={exerciceForm.matiere} onChange={(e) => setExerciceForm({ ...exerciceForm, matiere: e.target.value })}
                className="dash-input" />
              <select value={exerciceForm.niveau} onChange={e => setExerciceForm({ ...exerciceForm, niveau: e.target.value })}
                className="dash-input">
                <option>1ère année Bac</option>
                <option>Terminale (2ème Bac)</option>
              </select>
              <select value={exerciceForm.difficulte} onChange={e => setExerciceForm({ ...exerciceForm, difficulte: e.target.value })}
                className="dash-input">
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
              <textarea required placeholder="Énoncé de l'exercice..." value={exerciceForm.contenu} onChange={e => setExerciceForm({ ...exerciceForm, contenu: e.target.value })}
                className="dash-input" rows={3} style={{resize:'none'}} />
              <textarea required placeholder="Correction..." value={exerciceForm.correction} onChange={e => setExerciceForm({ ...exerciceForm, correction: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{exerciceForm.id ? 'Modifier' : 'Ajouter'}</button>
                {exerciceForm.id && <button type="button" onClick={() => setExerciceForm({ id: '', matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Matière</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Niveau</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Difficulté</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {exercices.filter(ex => ex.matiere.toLowerCase().includes(exerciceSearch.toLowerCase())).map(ex => (
                  <tr key={ex.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{ex.matiere}</td>
                    <td className="px-4 py-3 text-gray-500">{ex.niveau}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${ex.difficulte === 'facile' ? 'bg-emerald-100 text-emerald-700' : ex.difficulte === 'moyen' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{ex.difficulte}</span></td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <button onClick={() => editExercice(ex)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">Modifier</button>
                      <button onClick={() => deleteExercice(ex.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'annales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Rechercher annales..." 
              value={annaleSearch} 
              onChange={(e) => setAnnaleSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{annaleForm.id ? 'Modifier' : 'Ajouter'} une annale</h3>
            {annaleMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${annaleMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{annaleMsg}</div>}
            <form onSubmit={addAnnale} className="space-y-3">
              <input required placeholder="Matière" value={annaleForm.matiere} onChange={(e) => setAnnaleForm({ ...annaleForm, matiere: e.target.value })}
                className="dash-input" />
              <input type="number" min="2000" max={new Date().getFullYear()} placeholder="Année" value={annaleForm.annee} onChange={(e) => setAnnaleForm({ ...annaleForm, annee: e.target.value })}
                className="dash-input" />
              <textarea required placeholder="Énoncé..." value={annaleForm.contenu} onChange={e => setAnnaleForm({ ...annaleForm, contenu: e.target.value })}
                className="dash-input" rows={3} style={{resize:'none'}} />
              <textarea required placeholder="Correction..." value={annaleForm.correction} onChange={e => setAnnaleForm({ ...annaleForm, correction: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{annaleForm.id ? 'Modifier' : 'Ajouter'}</button>
                {annaleForm.id && <button type="button" onClick={() => setAnnaleForm({ id: '', matiere: '', annee: new Date().getFullYear().toString(), contenu: '', correction: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Matière</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Année</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {annales.filter(an => an.matiere.toLowerCase().includes(annaleSearch.toLowerCase())).map(an => (
                  <tr key={an.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{an.matiere}</td>
                    <td className="px-4 py-3 text-gray-500">{an.annee}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <button onClick={() => editAnnale(an)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">Modifier</button>
                      <button onClick={() => deleteAnnale(an.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'concours' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Rechercher concours..." 
              value={concoursSearch} 
              onChange={(e) => setConcoursSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{concoursForm.id ? 'Modifier' : 'Ajouter'} un concours</h3>
            {concoursMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${concoursMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{concoursMsg}</div>}
            <form onSubmit={addConcours} className="space-y-3">
              <input required placeholder="Nom du concours" value={concoursForm.nom} onChange={(e) => setConcoursForm({ ...concoursForm, nom: e.target.value })}
                className="dash-input" />
              <input type="number" min="0" max="20" placeholder="Seuil de réussite" value={concoursForm.seuil} onChange={(e) => setConcoursForm({ ...concoursForm, seuil: e.target.value })}
                className="dash-input" />
              <input type="date" value={concoursForm.dateConcours} onChange={(e) => setConcoursForm({ ...concoursForm, dateConcours: e.target.value })}
                className="dash-input" />
              <input placeholder="Lien (optionnel)" value={concoursForm.lien} onChange={(e) => setConcoursForm({ ...concoursForm, lien: e.target.value })}
                className="dash-input" />
              <textarea placeholder="Description..." value={concoursForm.description} onChange={e => setConcoursForm({ ...concoursForm, description: e.target.value })}
                className="dash-input" rows={2} style={{resize:'none'}} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{concoursForm.id ? 'Modifier' : 'Ajouter'}</button>
                {concoursForm.id && <button type="button" onClick={() => setConcoursForm({ id: '', nom: '', seuil: '10', dateConcours: '', description: '', lien: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
              </div>
            </form>
          </div>

          <div className="dash-card-flat overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Nom</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Seuil</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {concours.filter(co => co.nom.toLowerCase().includes(concoursSearch.toLowerCase())).map(co => (
                  <tr key={co.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{co.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{co.seuil}/20</td>
                    <td className="px-4 py-3 text-gray-500">{co.dateConcours || '—'}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <button onClick={() => editConcours(co)} className="text-xs text-blue-500 hover:text-blue-700 font-bold">Modifier</button>
                      <button onClick={() => deleteConcours(co.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
