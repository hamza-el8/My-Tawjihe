import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [linkedEleve, setLinkedEleve] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch linked student (always check backend, not just user.eleveId)
    api.get('/auth/linked-student')
      .then(r => {
        setLinkedEleve(r.data.eleve);
        if (r.data.eleve) {
          return api.get(`/eleves/${r.data.eleve.id}/notes`);
        }
      })
      .then(r => { if (r) setNotes(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = notes.length
    ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
       notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(2)
    : '—';

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">👨‍👩‍👧 Espace Parent</h2>
      <p className="text-gray-500 text-sm mb-6">
        Bienvenue, <strong>{user?.nom}</strong>. Cliquez sur votre nom dans la barre latérale pour lier votre enfant.
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      ) : !linkedEleve ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">👦</div>
          <h3 className="font-bold text-gray-700 mb-2">Aucun élève lié</h3>
          <p className="text-gray-500 text-sm mb-4">
            Cliquez sur votre nom dans la barre latérale, puis sur <strong>"Lier un élève"</strong> pour associer votre enfant à votre compte.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 inline-block">
            💡 Vous aurez besoin de l'email de votre enfant inscrit sur la plateforme.
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {/* Student info card */}
          <div className="card p-5 flex items-center gap-4">
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0,
            }}>
              {linkedEleve.nom?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-800">{linkedEleve.nom}</p>
              <p className="text-sm text-gray-500">{linkedEleve.email}</p>
              {linkedEleve.niveau && (
                <p className="text-xs text-gray-400 mt-1">{linkedEleve.niveau} — {linkedEleve.filiere}</p>
              )}
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-black" style={{ color: parseFloat(avg) >= 10 ? '#16a34a' : '#dc2626' }}>{avg}</p>
              <p className="text-xs text-gray-400">/20 moyenne</p>
            </div>
          </div>

          {/* Notes table */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-700 mb-4">📊 Notes de {linkedEleve.nom}</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-gray-500 text-left">
                <th className="pb-2">Matière</th>
                <th className="pb-2">Note</th>
                <th className="pb-2">Coeff.</th>
                <th className="pb-2">Période</th>
                <th className="pb-2">Type</th>
              </tr></thead>
              <tbody>
                {notes.map(n => (
                  <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{n.matiere}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${parseFloat(n.valeur) >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {n.valeur}/20
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">{n.coefficient}</td>
                    <td className="py-2 text-gray-500">{n.periode}</td>
                    <td className="py-2 text-gray-500">{n.type}</td>
                  </tr>
                ))}
                {!notes.length && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Aucune note disponible</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
