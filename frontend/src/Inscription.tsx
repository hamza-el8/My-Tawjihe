import { useState } from 'react';
import type { Lang } from './types';
import './Inscription.css';
import { register } from './api';

// ── UI labels (fr + ar) ───────────────────────────────────────────────────────
const UI = {
  fr: {
    dir: 'ltr',
    badge: 'Création de compte',
    leftTitle: 'Rejoignez MyTawjeh',
    leftDesc: 'Choisissez votre profil et complétez les informations.',
    title: 'Inscription',
    subtitle: 'Qui êtes-vous ?',
    alreadyAccount: 'Déjà inscrit ?',
    login: 'Se connecter',
    back: '← Retour',
    optional: '(optionnel)',
    submit: 'CRÉER MON COMPTE',
    submitting: 'Création en cours...',
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    successTitle: 'Compte créé !',
    successDesc: 'Vous pouvez maintenant vous connecter.',
    copyright: '© 2026 MyTawjeh',
    close: '×',
    onetNote: '🎯 Après inscription, passez le test O*NET pour votre profil de carrière.',
  },
  ar: {
    dir: 'rtl',
    badge: 'إنشاء حساب',
    leftTitle: 'انضم إلى MyTawjeh',
    leftDesc: 'اختر ملفك الشخصي وأكمل المعلومات المطلوبة.',
    title: 'التسجيل',
    subtitle: 'من أنت؟',
    alreadyAccount: 'لديك حساب؟',
    login: 'تسجيل الدخول',
    back: 'رجوع →',
    optional: '(اختياري)',
    submit: 'إنشاء حسابي',
    submitting: 'جاري الإنشاء...',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    successTitle: 'تم إنشاء الحساب!',
    successDesc: 'يمكنك الآن تسجيل الدخول.',
    copyright: '© 2026 MyTawjeh',
    close: '×',
    onetNote: '🎯 بعد التسجيل، أجرِ اختبار O*NET للحصول على ملفك المهني.',
  },
};

// ── Fields matched EXACTLY to DB schema ──────────────────────────────────────
const ROLE_FIELDS = {
  eleve: [
    { name: 'nom',        fr: 'Nom complet',  ar: 'الاسم الكامل',          type: 'text',     required: true,  placeholder: 'Yassine Benali' },
    { name: 'email',      fr: 'Email',         ar: 'البريد الإلكتروني',     type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', fr: 'Mot de passe',  ar: 'كلمة المرور',           type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'confirm',    fr: 'Confirmer mdp', ar: 'تأكيد كلمة المرور',    type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'niveau',     fr: 'Niveau',        ar: 'المستوى',               type: 'select',   required: true,
      options: { fr: ['Tronc commun', '1ère Bac', 'Terminale (2ème Bac)'], ar: ['الجذع المشترك', 'الأولى باك', 'الثانية باك'] } },
    { name: 'filiere',    fr: 'Filière',       ar: 'الشعبة',                type: 'select',   required: false,
      options: { fr: ['Sciences Maths', 'Sciences Physiques', 'Sciences de la Vie', 'Sciences Éco', 'Lettres', 'Autre'],
                 ar: ['علوم رياضية', 'علوم فيزيائية', 'علوم الحياة والأرض', 'علوم اقتصادية', 'آداب', 'أخرى'] } },
    { name: 'ville',      fr: 'Ville',         ar: 'المدينة',               type: 'text',     required: false, placeholder: 'Casablanca / الدار البيضاء' },
  ],
  parent: [
    { name: 'nom',        fr: 'Nom complet',   ar: 'الاسم الكامل',          type: 'text',     required: true,  placeholder: 'Mohamed Benali' },
    { name: 'email',      fr: 'Email',          ar: 'البريد الإلكتروني',     type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', fr: 'Mot de passe',   ar: 'كلمة المرور',           type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'confirm',    fr: 'Confirmer mdp',  ar: 'تأكيد كلمة المرور',    type: 'password', required: true,  placeholder: '••••••••' },
  ],
  professeur: [
    { name: 'nom',        fr: 'Nom complet',    ar: 'الاسم الكامل',          type: 'text',     required: true,  placeholder: 'Prof. Hassan' },
    { name: 'email',      fr: 'Email',           ar: 'البريد الإلكتروني',     type: 'email',    required: true,  placeholder: 'email@exemple.ma' },
    { name: 'motDePasse', fr: 'Mot de passe',    ar: 'كلمة المرور',           type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'confirm',    fr: 'Confirmer mdp',   ar: 'تأكيد كلمة المرور',    type: 'password', required: true,  placeholder: '••••••••' },
    { name: 'specialite', fr: 'Spécialité',      ar: 'التخصص',               type: 'text',     required: false, placeholder: 'Mathématiques / الرياضيات' },
  ],
};

const ROLES_CONFIG = {
  eleve:      { fr: { label: 'Étudiant',   desc: 'Suivi scolaire et orientation IA' },   ar: { label: 'طالب',      desc: 'متابعة دراسية وتوجيه بالذكاء الاصطناعي' }, icon: '🎓', apiRole: 'eleve' },
  parent:     { fr: { label: 'Parent',     desc: 'Suivez le parcours de votre enfant' }, ar: { label: 'ولي الأمر', desc: 'تابع المسار الدراسي لطفلك' },              icon: '👨‍👩‍👧', apiRole: 'parent' },
  professeur: { fr: { label: 'Professeur', desc: 'Espace enseignement et suivi' },       ar: { label: 'أستاذ',     desc: 'فضاء التدريس والمتابعة' },                 icon: '👨‍🏫', apiRole: 'professeur' },
};

export default function Inscription({ onClose, onSwitchToLogin, lang = 'fr', defaultRole }: { onClose: () => void; onSwitchToLogin: () => void; lang: Lang; defaultRole?: 'eleve' | 'parent' | 'professeur' }) {
  const [role, setRole] = useState<string | null>(defaultRole || null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = UI[lang] || UI.fr;
  const fields = role ? ROLE_FIELDS[role] : [];
  const roleLabel = role ? ROLES_CONFIG[role][lang]?.label : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.motDePasse !== form.confirm) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      await register({ role: ROLES_CONFIG[role].apiRole, ...payload });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="ins-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div className="ins-modal" dir={t.dir}>

        {/* ── Left panel ── */}
        <div className="ins-left">
          <div className="ins-blob ins-blob-top" />
          <div className="ins-blob ins-blob-bottom" />
          <div className="ins-left-content">
            <div className="ins-logo">
              <div className="ins-logo-icon">M</div>
              <span className="ins-logo-text">MyTawjeh</span>
            </div>
            <div className="ins-badge">{t.badge}</div>
            <h2 className="ins-left-title">{t.leftTitle}</h2>
            <p className="ins-left-desc">{t.leftDesc}</p>
            {role && (
              <div className="ins-role-tag">
                {ROLES_CONFIG[role].icon} {roleLabel}
              </div>
            )}
          </div>
          <div className="ins-left-footer">{t.copyright}</div>
        </div>

        {/* ── Right panel ── */}
        <div className="ins-right">
          {onClose && (
            <button className="ins-close" onClick={onClose}>{t.close}</button>
          )}

          {/* Success */}
          {success ? (
            <div className="ins-success">
              <div className="ins-success-icon">✅</div>
              <h3>{t.successTitle}</h3>
              <p>{t.successDesc}</p>
              <button className="ins-btn" onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                {t.login}
              </button>
            </div>

          /* Step 1 — role selection */
          ) : !role ? (
            <>
              <h3 className="ins-title">{t.title}</h3>
              <p className="ins-subtitle">{t.subtitle}</p>
              <div className="ins-roles">
                {Object.entries(ROLES_CONFIG).map(([key, cfg]) => (
                  <button key={key} className="ins-role-card" onClick={() => { setRole(key); setForm({}); setError(''); }}>
                    <span className="ins-role-icon">{cfg.icon}</span>
                    <span className="ins-role-label">{cfg[lang]?.label}</span>
                    <span className="ins-role-desc">{cfg[lang]?.desc}</span>
                  </button>
                ))}
              </div>
              <p className="ins-switch">
                {t.alreadyAccount}{' '}
                <button className="ins-switch-link" onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                  {t.login}
                </button>
              </p>
            </>

          /* Step 2 — form */
          ) : (
            <>
              <div className="ins-form-header">
                <button className="ins-back" onClick={() => { setRole(null); setForm({}); setError(''); }}>{t.back}</button>
                <div>
                  <h3 className="ins-title">{t.title} — {roleLabel}</h3>
                </div>
              </div>

              {error && (
                <div style={{ margin:'0 0 14px', padding:'10px 14px', borderRadius:8, background:'#fef2f2', color:'#dc2626', fontSize:13, border:'1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="ins-form">
                <div className="ins-grid">
                  {fields.map(f => (
                    <div key={f.name} className="ins-field">
                      <label className="ins-label">
                        {f[lang] || f.fr}
                        {!f.required && <span className="ins-optional"> {t.optional}</span>}
                        {f.required && <span className="ins-required"> *</span>}
                      </label>
                      {f.type === 'select' ? (
                        <select name={f.name} required={f.required} value={form[f.name] || ''} onChange={handleChange} className="ins-input">
                          <option value="">—</option>
                          {(f.options[lang] || f.options.fr).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          name={f.name}
                          required={f.required}
                          value={form[f.name] || ''}
                          onChange={handleChange}
                          placeholder={f.placeholder || ''}
                          className="ins-input"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="ins-btn">
                  {loading ? t.submitting : t.submit}
                </button>

                {role === 'eleve' && (
                  <p style={{ fontSize:12, color:'#94a3b8', textAlign:'center', marginTop:10 }}>{t.onetNote}</p>
                )}

                <p className="ins-switch">
                  {t.alreadyAccount}{' '}
                  <button type="button" className="ins-switch-link"
                    onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                    {t.login}
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
