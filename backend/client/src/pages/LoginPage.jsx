import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// ── Fields matched exactly to DB schema ───────────────────────────────────────
const ROLE_FIELDS = {
  eleve: [
    { name: 'nom',        label: 'Nom complet', type: 'text',     required: true,  placeholder: 'Yassine Benali' },
    { name: 'email',      label: 'Email',        type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', label: 'Mot de passe', type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'niveau',     label: 'Niveau',       type: 'select',   required: true,
      options: ['Tronc commun', '1ère Bac', 'Terminale (2ème Bac)'] },
    { name: 'filiere',    label: 'Filière',      type: 'select',   required: false,
      options: ['Sciences Maths', 'Sciences Physiques', 'Sciences de la Vie', 'Sciences Éco', 'Lettres', 'Autre'] },
    { name: 'ville',      label: 'Ville',        type: 'text',     required: false, placeholder: 'Casablanca' },
  ],
  parent: [
    { name: 'nom',        label: 'Nom complet',        type: 'text',     required: true,  placeholder: 'Mohamed Benali' },
    { name: 'email',      label: 'Email',               type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', label: 'Mot de passe',        type: 'password', required: true,  placeholder: '••••••••' },
  ],
  professeur: [
    { name: 'nom',        label: 'Nom complet',   type: 'text',     required: true,  placeholder: 'Prof. Hassan' },
    { name: 'email',      label: 'Email',          type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', label: 'Mot de passe',   type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'specialite', label: 'Spécialité',     type: 'text',     required: false, placeholder: 'Mathématiques' },
  ],
};

const ROLE_LABELS = {
  eleve:      { label: '🎓 Étudiant',   desc: 'Suivi scolaire et orientation personnalisée' },
  parent:     { label: '👨‍👩‍👧 Parent',    desc: 'Suivez le parcours scolaire de votre enfant' },
  professeur: { label: '👨‍🏫 Professeur', desc: 'Espace enseignement et accompagnement' },
};

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({});
  const [loginForm, setLoginForm] = useState({ email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleRedirect = (r) => {
    if (r === 'admin') return '/admin';
    if (r === 'professeur') return '/prof';
    return `/${r}`;
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // No role sent — backend auto-detects from all tables
      const { data } = await api.post('/auth/login', {
        email: loginForm.email,
        motDePasse: loginForm.motDePasse,
      });
      login(data.user, data.token);
      navigate(roleRedirect(data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', { role, ...form });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const fields = role ? ROLE_FIELDS[role] : [];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6e 100%)' }}>
      <div className="card w-full max-w-md p-8" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-black" style={{ color: '#0f2044' }}>Mowajih AI</h1>
          <p className="text-gray-500 text-sm mt-1">Plateforme d'orientation intelligente</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {[['login', 'Connexion'], ['register', 'Inscription']].map(([m, l]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setRole(null); setSuccess(false); setForm({}); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${mode === m ? 'btn-gold' : 'bg-gray-50 text-gray-600'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <>
            {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                <input type="email" value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="email@exemple.ma" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Mot de passe</label>
                <input type="password" value={loginForm.motDePasse}
                  onChange={e => setLoginForm(f => ({ ...f, motDePasse: e.target.value }))}
                  required className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="••••••••" />
              </div>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400">ou</span></div>
              </div>

              <button type="button" disabled className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuer avec Google
                <span className="text-gray-300 text-xs ml-1">(bientôt disponible)</span>
              </button>

              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3 rounded-lg text-sm transition-all disabled:opacity-60">
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
              <p className="font-semibold mb-1">Comptes de test <span className="font-mono">(mdp: password)</span></p>
              <p>Étudiant: yassine@test.ma | Parent: parent@test.ma</p>
              <p>Prof: hassan@test.ma | Admin: admin@mowajih.ma</p>
            </div>
          </>
        )}

        {/* ── REGISTER ── */}
        {mode === 'register' && (
          <>
            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-gray-800 mb-2">Compte créé avec succès !</h3>
                <p className="text-gray-500 text-sm mb-6">Vous pouvez maintenant vous connecter.</p>
                <button onClick={() => { setMode('login'); setSuccess(false); setRole(null); setForm({}); }}
                  className="btn-gold px-6 py-2 rounded-lg text-sm">Se connecter →</button>
              </div>
            ) : !role ? (
              <>
                <p className="text-sm text-gray-500 mb-4 text-center">Qui êtes-vous ?</p>
                {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700">{error}</div>}
                <div className="space-y-3">
                  {Object.entries(ROLE_LABELS).map(([key, cfg]) => (
                    <button key={key} onClick={() => { setRole(key); setForm({}); setError(''); }}
                      className="w-full p-4 border border-gray-200 rounded-xl text-left hover:border-yellow-400 hover:bg-yellow-50 transition-all group">
                      <p className="font-semibold text-gray-800 group-hover:text-yellow-700">{cfg.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cfg.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => { setRole(null); setForm({}); setError(''); }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Retour</button>
                  <span className="text-sm font-semibold text-gray-700">{ROLE_LABELS[role].label}</span>
                </div>
                {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                  {fields.map(f => (
                    <div key={f.name}>
                      <label className="text-xs font-semibold text-gray-500 uppercase">
                        {f.label}
                        {!f.required && <span className="text-gray-300 normal-case font-normal ml-1">(optionnel)</span>}
                      </label>
                      {f.type === 'select' ? (
                        <select value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                          required={f.required} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                          <option value="">Sélectionner...</option>
                          {f.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                          required={f.required} placeholder={f.placeholder}
                          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      )}
                    </div>
                  ))}
                  <button type="submit" disabled={loading}
                    className="btn-gold w-full py-3 rounded-lg text-sm transition-all disabled:opacity-60">
                    {loading ? 'Création en cours...' : 'Créer mon compte'}
                  </button>
                </form>
                {role === 'eleve' && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    🎯 Après inscription, passez le test O*NET pour votre profil de carrière.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
