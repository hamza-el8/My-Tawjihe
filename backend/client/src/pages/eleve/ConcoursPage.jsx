import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function ConcoursPage() {
  const [concours, setConcours] = useState([]);
  useEffect(() => { api.get('/concours').then(r => setConcours(r.data)); }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">🏆 Concours & Bourses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concours.map(c => (
          <div key={c.id} className="card p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-2">{c.nom}</h3>
            <p className="text-gray-500 text-sm mb-4">{c.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">📅 {c.datw}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#fef3c7', color: '#92400e' }}>
                Seuil: {c.seuil}/20
              </span>
            </div>
          </div>
        ))}
        {!concours.length && <p className="text-gray-400 col-span-3 text-center py-12">Aucun concours disponible</p>}
      </div>
    </Layout>
  );
}
