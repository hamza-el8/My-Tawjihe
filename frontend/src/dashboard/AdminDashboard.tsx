import { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { StatCard } from './Layout';

// ─── DEFAULT VALUES & CONSTANTS ─────────────────────────────────────────────
const EXERCICE_DEFAULTS = {
  id: '',
  matiere: '',
  niveau: 'Terminale (2ème Bac)',
  difficulte: 'moyen',
  contenu: '',
  correction: ''
};

const ANNALE_DEFAULTS = {
  id: '',
  matiere: '',
  annee: new Date().getFullYear().toString(),
  contenu: '',
  correction: ''
};

const CONCOURS_DEFAULTS = {
  id: '',
  nom: '',
  seuil: '10',
  dateConcours: '',
  description: '',
  lien: ''
};

const ITEMS_PER_PAGE = 10;

// ─── VALIDATION FUNCTIONS ────────────────────────────────────────────────────
const validateExerciceForm = (form: typeof EXERCICE_DEFAULTS): string | null => {
  if (!form.matiere.trim()) return 'La matière est requise';
  if (!form.contenu.trim()) return 'L\'énoncé est requis';
  if (!form.correction.trim()) return 'La correction est requise';
  if (form.contenu.length < 10) return 'L\'énoncé doit faire au moins 10 caractères';
  if (form.correction.length < 5) return 'La correction doit faire au moins 5 caractères';
  return null;
};

const validateAnnaleForm = (form: typeof ANNALE_DEFAULTS): string | null => {
  if (!form.matiere.trim()) return 'La matière est requise';
  if (!form.contenu.trim()) return 'L\'énoncé est requis';
  if (!form.correction.trim()) return 'La correction est requise';
  const year = parseInt(form.annee);
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) 
    return 'L\'année doit être entre 2000 et ' + new Date().getFullYear();
  return null;
};

const validateConcoursForm = (form: typeof CONCOURS_DEFAULTS): string | null => {
  if (!form.nom.trim()) return 'Le nom du concours est requis';
  const seuil = parseInt(form.seuil);
  if (isNaN(seuil) || seuil < 0 || seuil > 20) return 'Le seuil doit être entre 0 et 20';
  if (form.dateConcours && new Date(form.dateConcours) < new Date()) 
    return 'La date du concours doit être dans le futur';
  return null;
};

const validateNotificationForm = (form: any): string | null => {
  if (!form.contenu.trim()) return 'Le message est requis';
  if (form.contenu.length < 5) return 'Le message doit faire au moins 5 caractères';
  if (!form.sendToAll && !form.eleveId) return 'Sélectionnez un étudiant ou cochez "Envoyer à tous"';
  return null;
};

const getErrorMessage = (error: any): string => {
  if (!error) return 'Une erreur est survenue';
  if (error.message === 'Invalid token') return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (error.message === 'Unauthorized') return 'Vous n\'avez pas la permission.';
  if (error.status === 500) return 'Erreur serveur. Veuillez réessayer plus tard.';
  if (error.message?.includes('duplicate')) return 'Cet élément existe déjà.';
  return error.message || 'Une erreur est survenue';
};

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
  const [notifLoading, setNotifLoading] = useState(false);
  
  // Exercices
  const [exercices, setExercices] = useState<any[]>([]);
  const [exerciceForm, setExerciceForm] = useState(EXERCICE_DEFAULTS);
  const [exerciceMsg, setExerciceMsg] = useState('');
  const [exerciceSearch, setExerciceSearch] = useState('');
  const [exerciceLoading, setExerciceLoading] = useState(false);
  const [exercicePage, setExercicePage] = useState(1);
  
  // Annales
  const [annales, setAnnales] = useState<any[]>([]);
  const [annaleForm, setAnnaleForm] = useState(ANNALE_DEFAULTS);
  const [annaleMsg, setAnnaleMsg] = useState('');
  const [annaleSearch, setAnnaleSearch] = useState('');
  const [annaleLoading, setAnnaleLoading] = useState(false);
  const [analePage, setAnalePage] = useState(1);
  
  // Concours
  const [concours, setConcours] = useState<any[]>([]);
  const [concoursForm, setConcoursForm] = useState(CONCOURS_DEFAULTS);
  const [concoursMsg, setConcoursMsg] = useState('');
  const [concoursSearch, setConcoursSearch] = useState('');
  const [concoursLoading, setConcoursLoading] = useState(false);
  const [concoursPage, setConcoursPage] = useState(1);

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
    }).catch((e: any) => setError(e.message || 'Impossible de charger les ressources.'));
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
    } catch (e: any) { setError(e.message || 'Impossible de supprimer l’utilisateur.'); }
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateNotificationForm(notifForm);
    if (validationError) {
      setNotifMsg('❌ ' + validationError);
      return;
    }
    setNotifLoading(true);
    try {
      if (notifForm.sendToAll) {
        await Promise.all(data.eleves.map((eleve) => apiFetch('/notifications', {
          method: 'POST',
          body: JSON.stringify({ contenu: notifForm.contenu, type: notifForm.type, eleveId: eleve.id }),
        })));
        setNotifMsg('✅ Notification envoyée à tous les étudiants !');
      } else {
        await apiFetch('/notifications', { method: 'POST', body: JSON.stringify(notifForm) });
        setNotifMsg('✅ Notification envoyée !');
      }
      setNotifForm({ contenu: '', type: 'info', eleveId: '', sendToAll: false });
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e: any) { 
      setNotifMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setNotifLoading(false);
    }
  };

  const addExercice = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateExerciceForm(exerciceForm);
    if (validationError) {
      setExerciceMsg('❌ ' + validationError);
      return;
    }
    setExerciceLoading(true);
    try {
      if (exerciceForm.id) {
        await apiFetch(`/exercices/${exerciceForm.id}`, { method: 'PUT', body: JSON.stringify(exerciceForm) });
      } else {
        await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(exerciceForm) });
      }
      const ex = await apiFetch('/exercices');
      setExercices(Array.isArray(ex) ? ex : []);
      setExerciceMsg('✅ ' + (exerciceForm.id ? 'Exercice modifié' : 'Exercice ajouté') + ' !');
      setExerciceForm(EXERCICE_DEFAULTS);
      setExercicePage(1);
      setTimeout(() => setExerciceMsg(''), 3000);
    } catch (e: any) { 
      setExerciceMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setExerciceLoading(false);
    }
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
    setExerciceMsg('');
  };

  const addAnnale = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAnnaleForm(annaleForm);
    if (validationError) {
      setAnnaleMsg('❌ ' + validationError);
      return;
    }
    setAnnaleLoading(true);
    try {
      if (annaleForm.id) {
        await apiFetch(`/annales/${annaleForm.id}`, { method: 'PUT', body: JSON.stringify(annaleForm) });
      } else {
        await apiFetch('/annales', { method: 'POST', body: JSON.stringify(annaleForm) });
      }
      const an = await apiFetch('/annales');
      setAnnales(Array.isArray(an) ? an : []);
      setAnnaleMsg('✅ ' + (annaleForm.id ? 'Annale modifiée' : 'Annale ajoutée') + ' !');
      setAnnaleForm(ANNALE_DEFAULTS);
      setAnalePage(1);
      setTimeout(() => setAnnaleMsg(''), 3000);
    } catch (e: any) { 
      setAnnaleMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setAnnaleLoading(false);
    }
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
    setAnnaleMsg('');
  };

  const addConcours = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateConcoursForm(concoursForm);
    if (validationError) {
      setConcoursMsg('❌ ' + validationError);
      return;
    }
    setConcoursLoading(true);
    try {
      if (concoursForm.id) {
        await apiFetch(`/concours/${concoursForm.id}`, { method: 'PUT', body: JSON.stringify(concoursForm) });
      } else {
        await apiFetch('/concours', { method: 'POST', body: JSON.stringify(concoursForm) });
      }
      const co = await apiFetch('/concours');
      setConcours(Array.isArray(co) ? co : []);
      setConcoursMsg('✅ ' + (concoursForm.id ? 'Concours modifié' : 'Concours ajouté') + ' !');
      setConcoursForm(CONCOURS_DEFAULTS);
      setConcoursPage(1);
      setTimeout(() => setConcoursMsg(''), 3000);
    } catch (e: any) { 
      setConcoursMsg('❌ Erreur: ' + getErrorMessage(e)); 
    } finally {
      setConcoursLoading(false);
    }
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
    setConcoursMsg('');
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
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Rechercher exercices..." 
              value={exerciceSearch} 
              onChange={(e) => setExerciceSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>
          
          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {exerciceForm.id ? '✏️ Modifier' : 'Ajouter'} un exercice
              </h3>
              {exerciceForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Mode édition</span>}
            </div>
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
                <button type="submit" disabled={exerciceLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {exerciceLoading ? '⏳ En cours...' : (exerciceForm.id ? 'Modifier' : 'Ajouter')}
                </button>
                {exerciceForm.id && <button type="button" onClick={() => { setExerciceForm(EXERCICE_DEFAULTS); setExerciceMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
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
                {exercices.filter(ex => ex.matiere.toLowerCase().includes(exerciceSearch.toLowerCase()))
                  .slice((exercicePage - 1) * ITEMS_PER_PAGE, exercicePage * ITEMS_PER_PAGE)
                  .map(ex => (
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
            {exercices.filter(ex => ex.matiere.toLowerCase().includes(exerciceSearch.toLowerCase())).length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(exercices.filter(ex => ex.matiere.toLowerCase().includes(exerciceSearch.toLowerCase())).length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setExercicePage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${exercicePage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'annales' && (
        <div className="space-y-6">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Rechercher annales..." 
              value={annaleSearch} 
              onChange={(e) => setAnnaleSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {annaleForm.id ? '✏️ Modifier' : 'Ajouter'} une annale
              </h3>
              {annaleForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Mode édition</span>}
            </div>
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
                <button type="submit" disabled={annaleLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {annaleLoading ? '⏳ En cours...' : (annaleForm.id ? 'Modifier' : 'Ajouter')}
                </button>
                {annaleForm.id && <button type="button" onClick={() => { setAnnaleForm(ANNALE_DEFAULTS); setAnnaleMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
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
                {annales.filter(an => an.matiere.toLowerCase().includes(annaleSearch.toLowerCase()))
                  .slice((analePage - 1) * ITEMS_PER_PAGE, analePage * ITEMS_PER_PAGE)
                  .map(an => (
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
            {annales.filter(an => an.matiere.toLowerCase().includes(annaleSearch.toLowerCase())).length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(annales.filter(an => an.matiere.toLowerCase().includes(annaleSearch.toLowerCase())).length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setAnalePage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${analePage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'concours' && (
        <div className="space-y-6">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Rechercher concours..." 
              value={concoursSearch} 
              onChange={(e) => setConcoursSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>

          <div className="dash-card p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">
                {concoursForm.id ? '✏️ Modifier' : 'Ajouter'} un concours
              </h3>
              {concoursForm.id && <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Mode édition</span>}
            </div>
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
                <button type="submit" disabled={concoursLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  {concoursLoading ? '⏳ En cours...' : (concoursForm.id ? 'Modifier' : 'Ajouter')}
                </button>
                {concoursForm.id && <button type="button" onClick={() => { setConcoursForm(CONCOURS_DEFAULTS); setConcoursMsg(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100">Annuler</button>}
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
                {concours.filter(co => co.nom.toLowerCase().includes(concoursSearch.toLowerCase()))
                  .slice((concoursPage - 1) * ITEMS_PER_PAGE, concoursPage * ITEMS_PER_PAGE)
                  .map(co => (
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
            {concours.filter(co => co.nom.toLowerCase().includes(concoursSearch.toLowerCase())).length > ITEMS_PER_PAGE && (
              <div className="p-4 flex gap-2 justify-center border-t">
                {Array.from({ length: Math.ceil(concours.filter(co => co.nom.toLowerCase().includes(concoursSearch.toLowerCase())).length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button key={i} onClick={() => setConcoursPage(i + 1)} 
                    className={`px-3 py-1 rounded text-xs font-bold ${concoursPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
