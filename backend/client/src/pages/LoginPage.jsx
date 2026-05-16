import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ROLES = ['eleve', 'parent', 'professeur', 'admin'];

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ role: 'eleve', email: '', motDePasse: '', nom: '', niveau: '', filiere: '', ville: '', specialite: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { role: form.role, email: form.email, motDePasse: form.motDePasse });
        login(data.user, data.token);
        navigate(`/${data.user.role === 'admin' ? 'admin' : data.user.role === 'professeur' ? 'prof' : data.user.role}`);
      } else {
        await api.post('/auth/register', form);
        setMode('login');
        setError('Compte créé ! Connectez-vous.');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6e 100%)' }}>
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black" style={{ color: '#0f2044' }}>Mowajih AI</h1>
          <p className="text-gray-500 text-sm mt-1">Plateforme d'orientation intelligente</p>
        </div>

        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${mode === m ? 'btn-gold' : 'bg-gray-50 text-gray-600'}`}>
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {error && <div className={`mb-4 p-3 rounded-lg text-sm ${error.includes('créé') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Rôle</label>
            <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Nom complet</label>
              <input value={form.nom} onChange={e => set('nom', e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Votre nom" />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="email@exemple.ma" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Mot de passe</label>
            <input type="password" value={form.motDePasse} onChange={e => set('motDePasse', e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="••••••••" />
          </div>

          {mode === 'register' && form.role === 'eleve' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Niveau</label>
                  <input value={form.niveau} onChange={e => set('niveau', e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Terminale" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Filière</label>
                  <input value={form.filiere} onChange={e => set('filiere', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Sciences Maths" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Ville</label>
                <input value={form.ville} onChange={e => set('ville', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Casablanca" />
              </div>
            </>
          )}

          {mode === 'register' && form.role === 'professeur' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Spécialité</label>
              <input value={form.specialite} onChange={e => set('specialite', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Mathématiques" />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg text-sm transition-all disabled:opacity-60">
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "Créer le compte"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-semibold mb-1">Comptes de test (mot de passe: <span className="font-mono">password</span>)</p>
          <p>Étudiant: yassine@test.ma | Parent: parent@test.ma</p>
          <p>Prof: hassan@test.ma | Admin: admin@mowajih.ma</p>
        </div>
      </div>
    </div>
  );
}
