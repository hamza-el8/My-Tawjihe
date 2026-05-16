import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AnnalesPage() {
  const [annales, setAnnales] = useState([]);
  const [filter, setFilter] = useState({ matiere: '', annee: '' });

  useEffect(() => {
    api.get('/annales', { params: filter }).then(r => setAnnales(r.data));
  }, [filter]);

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">📚 Annales</h2>
      <div className="flex gap-3 mb-6">
        <input placeholder="Matière" value={filter.matiere} onChange={e => setFilter(f=>({...f,matiere:e.target.value}))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <input placeholder="Année" type="number" value={filter.annee} onChange={e => setFilter(f=>({...f,annee:e.target.value}))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-28" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {annales.map(a => (
          <div key={a.id} className="card p-5 flex items-center gap-4">
            <div className="text-3xl">📄</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{a.matiere}</p>
              <p className="text-sm text-gray-500">Année {a.annee}</p>
            </div>
            <button className="text-sm text-blue-600 font-semibold hover:underline">Télécharger</button>
          </div>
        ))}
        {!annales.length && <p className="text-gray-400 col-span-3 text-center py-12">Aucune annale disponible</p>}
      </div>
    </Layout>
  );
}
