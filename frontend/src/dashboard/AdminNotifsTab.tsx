import { useState } from 'react';
import { apiFetch } from './shared';

interface AdminNotifsTabProps {
  eleves: any[];
}

export default function AdminNotifsTab({ eleves }: AdminNotifsTabProps) {
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', eleveId: '', sendToAll: false });
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);

  const getErrorMessage = (error: any): string => {
    if (!error) return 'Une erreur est survenue';
    if (error.message === 'Invalid token') return 'Votre session a expiré. Veuillez vous reconnecter.';
    if (error.message === 'Unauthorized') return 'Vous n\'avez pas la permission.';
    if (error.status === 500) return 'Erreur serveur. Veuillez réessayer plus tard.';
    if (error.message?.includes('duplicate')) return 'Cet élément existe déjà.';
    return error.message || 'Une erreur est survenue';
  };

  const validateNotificationForm = (form: typeof notifForm): string | null => {
    if (!form.contenu.trim()) return 'Le message est requis';
    if (form.contenu.length < 5) return 'Le message doit faire au moins 5 caractères';
    if (!form.sendToAll && !form.eleveId) return 'Sélectionnez un étudiant ou cochez "Envoyer à tous"';
    return null;
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
        await Promise.all(eleves.map(eleve =>
          apiFetch('/notifications', {
            method: 'POST',
            body: JSON.stringify({ contenu: notifForm.contenu, type: notifForm.type, eleveId: eleve.id })
          })
        ));
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

  return (
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
            {eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
          </select>
        )}
        <select value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
          className="dash-input">
          {['info', 'note', 'revision'].map(t => <option key={t}>{t}</option>)}
        </select>
        <textarea value={notifForm.contenu} onChange={e => setNotifForm(f => ({ ...f, contenu: e.target.value }))} required rows={3}
          placeholder="Message de la notification..." className="dash-input" style={{resize:'none'}} />
        <button type="submit" disabled={notifLoading} className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          {notifLoading ? '⏳ Envoi...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
