import React, { useState, useEffect } from 'react';
import { User, apiFetch } from './shared';
import { StatCard } from './Layout';

// ─── PROF DASHBOARD ───────────────────────────────────────────────────────────
function ProfDashboard({ user, initialTab = 'eleves' }: { user: User; initialTab?: 'eleves' | 'resultats' | 'creer' }) {
  const [eleves, setEleves] = useState<any[]>([]);
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
  const [formMsg, setFormMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'scoreDesc' | 'scoreAsc' | 'eleve'>('scoreDesc');
  const [expandAll, setExpandAll] = useState(false);
  const [notifStudent, setNotifStudent] = useState<any | null>(null);
  const [notifText, setNotifText] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [openResultId, setOpenResultId] = useState<number | null>(null);

  const notifTemplates = [
    { id: 'revision', label: 'Rappel de révision', text: 'Bonjour {nom}, je vous invite à revoir les notions clés et à refaire les exercices pour améliorer votre moyenne.' },
    { id: 'encouragement', label: 'Message encourageant', text: 'Bonjour {nom}, continuez vos efforts : je suis disponible pour vous aider sur les points faibles identifiés.' },
    { id: 'programme', label: 'Plan d’action', text: 'Bonjour {nom}, organisez une session de révision sur les chapitres difficiles cette semaine et refaites les exercices corrigés.' },
  ];

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    Promise.all([
      apiFetch('/prof/eleves-faibles'),
      apiFetch('/prof/stats'),
    ]).then(([el, st]) => {
      setEleves(Array.isArray(el) ? el : []);
      setResultats(Array.isArray(st.resultats) ? st.resultats : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const scoreValue = (r: any) => Number(r.score || 0);
  const filteredResultats = resultats
    .filter((r) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [r.eleveName, r.eleveEmail, r.exMatiere, r.exContenu, r.score?.toString()].some((value) =>
        String(value || '').toLowerCase().includes(query)
      );
    })
    .filter((r) => {
      const score = scoreValue(r);
      if (scoreFilter === 'low') return score < 10;
      if (scoreFilter === 'mid') return score >= 10 && score < 14;
      if (scoreFilter === 'high') return score >= 14;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'eleve') {
        return String(a.eleveName || '').localeCompare(String(b.eleveName || ''));
      }
      if (sortBy === 'scoreAsc') {
        return scoreValue(a) - scoreValue(b);
      }
      return scoreValue(b) - scoreValue(a);
    });

  const averageScore = resultats.length
    ? (resultats.reduce((sum, r) => sum + scoreValue(r), 0) / resultats.length).toFixed(1)
    : '—';

  const sendNotifToStudent = async (student: any) => {
    if (!notifText.trim()) {
      setNotifMsg('Veuillez saisir un message pour l’élève.');
      return;
    }
    setNotifLoading(true);
    setNotifMsg('');
    try {
      await apiFetch('/notifications', {
        method: 'POST',
        body: JSON.stringify({ contenu: notifText.trim(), type: 'revision', eleveId: student.id }),
      });
      setNotifMsg('✅ Notification envoyée à l’élève.');
      setNotifText('');
    } catch (err: any) {
      setNotifMsg('❌ ' + (err.message || 'Impossible d’envoyer la notification.'));
    } finally {
      setNotifLoading(false);
    }
  };

  const sendNotifToAllWeak = async () => {
    if (!notifText.trim()) {
      setNotifMsg('Veuillez saisir un message pour les élèves en difficulté.');
      return;
    }
    if (!weakStudents.length) {
      setNotifMsg('Aucun élève en difficulté à alerter.');
      return;
    }
    setNotifLoading(true);
    setNotifMsg('');
    try {
      await Promise.all(weakStudents.map((student) => apiFetch('/notifications', {
        method: 'POST',
        body: JSON.stringify({ contenu: notifText.trim(), type: 'revision', eleveId: student.id }),
      })));
      setNotifMsg(`✅ Notifications envoyées à ${weakStudents.length} élève${weakStudents.length > 1 ? 's' : ''}.`);
      setNotifText('');
    } catch (err: any) {
      setNotifMsg('❌ ' + (err.message || 'Impossible d’envoyer les notifications.'));
    } finally {
      setNotifLoading(false);
    }
  };

  const weakStudents = eleves.filter(e => parseFloat(e.moyenne) < 12);

  const createEx = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(form) });
      setFormMsg('✅ Exercice créé avec succès !');
      setForm({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || 'Erreur'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Tableau de bord</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Professeur · {(user as any).specialite || user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-2">
        <StatCard icon="👥" label="En difficulté" value={eleves.length} color="bg-rose-50 text-rose-600" />
        <StatCard icon="📊" label="Soumissions reçues" value={resultats.length} color="bg-violet-50 text-violet-600" />
        <StatCard icon="⭐" label="Moyenne" value={averageScore} color="bg-blue-50 text-blue-600" />
        <StatCard icon="⚠️" label="Sous 10/20" value={eleves.filter(e => parseFloat(e.moyenne) < 10).length} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[['eleves','👥 Élèves en difficulté'],['resultats','📊 Soumissions'],['creer','➕ Créer un exercice']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab===k ? 'active' : ''}`}
            style={tab===k ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'eleves' && weakStudents.length > 0 && (
        <div className="dash-card p-4 bg-violet-50 border border-violet-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-violet-700">Alerter les élèves en difficulté</p>
              <p className="text-xs text-violet-600">Sélectionnez un élève pour envoyer un message personnalisé ou pré-remplissez un message général.</p>
            </div>
            <button onClick={() => setNotifStudent(weakStudents[0])} className="dash-btn dash-btn-primary" style={{ minWidth: 220 }}>
              {notifStudent ? 'Modifier l’alerte' : `Alerter ${weakStudents.length} élève${weakStudents.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {tab === 'eleves' && notifStudent && (
        <div className="dash-card p-4 border border-violet-100">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">Envoyer une notification à {notifStudent.nom}</p>
            <p className="text-xs text-gray-500">Le message sera envoyé directement à l’élève lié.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            {notifTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setNotifText(template.text.replace('{nom}', notifStudent.nom))}
                className="dash-btn dash-btn-ghost text-xs"
                style={{ padding: '10px 12px', minHeight: 44 }}
              >
                {template.label}
              </button>
            ))}
          </div>
          <textarea
            value={notifText}
            onChange={(e) => setNotifText(e.target.value)}
            placeholder="Rédigez votre message d’alerte ici..."
            className="dash-input"
            style={{ minHeight: 120, resize: 'vertical' }}
          />
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 justify-end">
            <button type="button" onClick={() => { setNotifStudent(null); setNotifText(''); setNotifMsg(''); }} className="dash-btn dash-btn-ghost" style={{ minWidth: 130 }}>
              Annuler
            </button>
            <button type="button" onClick={() => sendNotifToAllWeak()} disabled={notifLoading} className="dash-btn dash-btn-secondary" style={{ minWidth: 150 }}>
              {notifLoading ? 'Envoi...' : `Alerter ${weakStudents.length} élève${weakStudents.length > 1 ? 's' : ''}`}
            </button>
            <button type="button" onClick={() => sendNotifToStudent(notifStudent)} disabled={notifLoading} className="dash-btn dash-btn-primary" style={{ minWidth: 130 }}>
              {notifLoading ? 'Envoi...' : 'Envoyer la notification'}
            </button>
          </div>
          {notifMsg && <p className="mt-3 text-sm" style={{ color: notifMsg.startsWith('✅') ? '#047857' : '#b91c1c' }}>{notifMsg}</p>}
        </div>
      )}

      {/* Élèves */}
      {tab === 'eleves' && (
        loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" /></div>
        ) : eleves.length === 0 ? (
          <div className="dash-card dash-empty">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Tous les élèves sont en bonne progression</p>
          </div>
        ) : (
          <div className="dash-card-flat overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase grid grid-cols-5 gap-2">
              <span>Élève</span><span>Niveau</span><span>Filière</span><span className="text-right">Moyenne</span><span className="text-right">Action</span>
            </div>
            {eleves.map((e: any, i: number) => (
              <div key={i} className={`grid grid-cols-5 gap-2 items-center px-5 py-4 ${i < eleves.length-1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">
                      {e.email}
                      {e.weakestSubject && (
                        <span className="ml-2">· Matière faible : <span className="font-semibold text-gray-700">{e.weakestSubject}</span></span>
                      )}
                    </div>
                    {e.weakestExercise && (
                      <div className="text-xs text-gray-500 mt-1">« {e.weakestExercise} »</div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{e.niveau || '—'}</span>
                <span className="text-xs text-gray-500">{e.filiere || '—'}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black text-right ml-auto block w-fit ${parseFloat(e.moyenne) < 10 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {e.moyenne ? `${e.moyenne}/20` : 'N/A'}
                </span>
                <div className="text-right">
                  <button onClick={() => {
                    setNotifStudent(e);
                    setNotifText(`Bonjour ${e.nom}, je vous invite à retravailler vos exercices en ${e.filiere || 'matière principale'}.`);
                    setNotifMsg('');
                  }} className="text-xs font-bold text-violet-600 hover:text-violet-800">
                    Alerter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Soumissions */}
      {tab === 'resultats' && (
        <div className="space-y-4">
          <div className="dash-card p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par élève, matière ou score..."
                className="dash-input"
                style={{ flex: 1 }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Filtrer</label>
                <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value as any)} className="dash-input w-auto">
                  <option value="all">Tous</option>
                  <option value="low">À revoir (&lt;10)</option>
                  <option value="mid">Bon (10-13)</option>
                  <option value="high">Excellent (14+)</option>
                </select>
                <label className="text-xs font-semibold text-gray-400 uppercase">Trier</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="dash-input w-auto">
                  <option value="scoreDesc">Score décroissant</option>
                  <option value="scoreAsc">Score croissant</option>
                  <option value="eleve">Élève</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">{filteredResultats.length}/{resultats.length} résultats</div>
              <button type="button" onClick={() => {
                setExpandAll(!expandAll);
                if (expandAll) setOpenResultId(null);
              }} className="text-sm font-bold text-violet-600 hover:text-violet-800">
                {expandAll ? 'Réduire tout' : 'Voir toutes les réponses'}
              </button>
            </div>
          </div>

          <div className="dash-card-flat overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Élève</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Exercice</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Score</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResultats.map((r: any, i: number) => (
                  <React.Fragment key={r.id || i}>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-semibold text-gray-800">{r.eleveName || '—'}</div>
                        <div className="text-xs text-gray-400">{r.eleveEmail}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-bold text-gray-600">{r.exMatiere}</div>
                        <div className="text-xs text-gray-400">{r.exContenu}...</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${parseFloat(r.score) >= 14 ? 'text-emerald-600 bg-emerald-50' : parseFloat(r.score) >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                          {r.score}/20
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (expandAll) {
                              setExpandAll(false);
                              return;
                            }
                            setOpenResultId(openResultId === r.id ? null : r.id);
                          }}
                          className="text-xs font-bold text-violet-600 hover:text-violet-800"
                        >
                          {expandAll ? 'Réduire tout' : openResultId === r.id ? 'Masquer réponse' : 'Voir réponse'}
                        </button>
                      </td>
                    </tr>
                    {(expandAll || openResultId === r.id) && (
                      <tr key={`${r.id}-detail`} className="bg-gray-50">
                        <td colSpan={4} className="px-5 py-4 text-sm text-gray-600">
                          <div className="mb-2 text-xs uppercase tracking-[0.12em] text-gray-500 font-semibold">Réponse de l'élève</div>
                          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} className="border border-gray-200 rounded-xl p-4 bg-white">
                            {r.reponse || 'Aucune réponse fournie.'}
                          </div>
                          {r.feedback && (
                            <div className="mt-3 text-sm text-gray-500">
                              <span className="font-semibold">Feedback IA : </span>{r.feedback}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {!filteredResultats.length && (
                  <tr><td colSpan={4} className="py-12 text-center text-gray-400 text-sm">Aucun résultat ne correspond à votre recherche.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Créer exercice */}
      {tab === 'creer' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Nouvel exercice</h3>
          {formMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${formMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{formMsg}</div>
          )}
          <form onSubmit={createEx} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Matière *</label>
              <input value={form.matiere} onChange={e => setForm(p => ({...p, matiere: e.target.value}))} required placeholder="Mathématiques"
                className="dash-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Niveau</label>
                <select value={form.niveau} onChange={e => setForm(p => ({...p, niveau: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Difficulté</label>
                <select value={form.difficulte} onChange={e => setForm(p => ({...p, difficulte: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['facile','moyen','difficile'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Énoncé *</label>
              <textarea value={form.contenu} onChange={e => setForm(p => ({...p, contenu: e.target.value}))} required rows={4} placeholder="Contenu de l'exercice..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Correction</label>
              <textarea value={form.correction} onChange={e => setForm(p => ({...p, correction: e.target.value}))} rows={3} placeholder="Correction détaillée..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              Créer l'exercice
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfDashboard;
