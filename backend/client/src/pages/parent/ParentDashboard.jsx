import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user?.eleveId) api.get(`/eleves/${user.eleveId}/notes`).then(r => setNotes(r.data));
  }, []);

  const avg = notes.length
    ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
       notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(2)
    : '—';

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">👨‍👩‍👧 Espace Parent</h2>
      {!user?.eleveId ? (
        <div className="card p-8 text-center text-gray-500">Aucun enfant associé à votre compte.</div>
      ) : (
        <div className="card p-6 max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Notes de votre enfant</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: '#fef3c7', color: '#92400e' }}>
              Moyenne: {avg}/20
            </span>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-gray-500 text-left">
              <th className="pb-2">Matière</th><th className="pb-2">Note</th><th className="pb-2">Période</th><th className="pb-2">Type</th>
            </tr></thead>
            <tbody>
              {notes.map(n => (
                <tr key={n.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{n.matiere}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded font-bold ${parseFloat(n.valeur) >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {n.valeur}/20
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{n.periode}</td>
                  <td className="py-2 text-gray-500">{n.type}</td>
                </tr>
              ))}
              {!notes.length && <tr><td colSpan={4} className="py-8 text-center text-gray-400">Aucune note</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
