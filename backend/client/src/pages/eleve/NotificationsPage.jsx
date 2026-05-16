import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);

  const fetch = () => api.get(`/notifications/${user.id}`).then(r => setNotifs(r.data));
  useEffect(() => { fetch(); }, []);

  const markRead = async id => {
    await api.patch(`/notifications/${id}/read`);
    fetch();
  };

  const typeIcon = { note: '📊', revision: '⚠️', info: 'ℹ️' };

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">🔔 Notifications</h2>
      <div className="max-w-2xl space-y-3">
        {notifs.map(n => (
          <div key={n.id} className={`card p-4 flex items-start gap-4 ${!n.lu ? 'border-l-4' : ''}`} style={!n.lu ? { borderLeftColor: '#c9a227' } : {}}>
            <span className="text-2xl">{typeIcon[n.type] || '🔔'}</span>
            <div className="flex-1">
              <p className={`text-sm ${!n.lu ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{n.contenu}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('fr-MA')}</p>
            </div>
            {!n.lu && (
              <button onClick={() => markRead(n.id)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">Marquer lu</button>
            )}
          </div>
        ))}
        {!notifs.length && <p className="text-gray-400 text-center py-12">Aucune notification</p>}
      </div>
    </Layout>
  );
}
