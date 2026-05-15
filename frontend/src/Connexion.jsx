import { useState } from 'react';
import './Connexion.css';

export default function Connexion({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Connexion réussie !');
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="cx-overlay" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className="cx-modal">

        {/* ── Panneau gauche violet ── */}
        <div className="cx-left">
          <div className="cx-blob cx-blob-top" />
          <div className="cx-blob cx-blob-bottom" />

          <div className="cx-left-content">
            <div className="cx-logo">
              <div className="cx-logo-icon">M</div>
              <span className="cx-logo-text">MyTawjeh</span>
            </div>

            <div className="cx-badge">Orientation Intelligente</div>

            <h2 className="cx-left-title">Votre espace personnel</h2>
            <p className="cx-left-desc">
              Parcours sur mesure, suivi des objectifs et recommandations IA — pensé pour les étudiants au Maroc.
            </p>
          </div>

          <div className="cx-left-footer">© 2026 MyTawjeh</div>
        </div>

        {/* ── Panneau droit blanc ── */}
        <div className="cx-right">
          {/* Bouton fermer */}
          {onClose && (
            <button className="cx-close" onClick={onClose} aria-label="Fermer">×</button>
          )}

          <h3 className="cx-title">Connexion</h3>
          <p className="cx-subtitle">Accès sécurisé à votre compte</p>

          <form onSubmit={handleSubmit} className="cx-form">
            {/* Email */}
            <div className="cx-field">
              <label className="cx-label">E-MAIL PROFESSIONNEL OU PERSONNEL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@domaine.com"
                className="cx-input"
              />
            </div>

            {/* Mot de passe */}
            <div className="cx-field">
              <label className="cx-label">MOT DE PASSE</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="cx-input"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="cx-row">
              <label className="cx-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="cx-checkbox"
                />
                <span>Se souvenir de cet appareil</span>
              </label>
              <button type="button" className="cx-forgot">Mot de passe oublié ?</button>
            </div>

            {/* Bouton continuer */}
            <button type="submit" disabled={loading} className="cx-btn">
              {loading ? 'Connexion en cours...' : 'CONTINUER'}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="cx-switch">
            Nouveau sur la plateforme ?{' '}
            <button
              className="cx-switch-link"
              onClick={() => { if (onClose) onClose(); if (onSwitchToSignup) onSwitchToSignup(); }}
            >
              Créer un compte
            </button>
          </p>

          <p className="cx-legal">
            Connexion sécurisée — en vous connectant vous acceptez
          </p>
        </div>

      </div>
    </div>
  );
}
