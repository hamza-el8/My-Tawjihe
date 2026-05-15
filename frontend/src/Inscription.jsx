import { useState } from 'react';
import './Inscription.css';

// ── Traductions UI ────────────────────────────────────────────────────────────
const UI = {
  fr: {
    dir: 'ltr',
    badge: 'Création de compte',
    leftTitle: 'Rejoignez la plateforme',
    leftDesc: 'Choisissez votre profil puis complétez les informations correspondantes.',
    role: 'Rôle',
    title: 'Inscription',
    subtitle: 'Qui êtes-vous ?',
    alreadyAccount: 'Déjà inscrit ?',
    login: 'Se connecter',
    back: '← Retour',
    formSubtitle: 'Remplissez les champs obligatoires (marqués *).',
    optional: '(optionnel)',
    submit: 'CRÉER MON COMPTE',
    submitting: 'Création en cours...',
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    successTitle: 'Compte créé avec succès !',
    successDesc: 'Vous pouvez maintenant vous connecter.',
    copyright: '© 2026 MyTawjeh',
    close: 'Fermer',
  },
  ar: {
    dir: 'rtl',
    badge: 'إنشاء حساب',
    leftTitle: 'انضم إلى المنصة',
    leftDesc: 'اختر ملفك الشخصي ثم أكمل المعلومات المطلوبة.',
    role: 'الدور',
    title: 'التسجيل',
    subtitle: 'من أنت؟',
    alreadyAccount: 'لديك حساب بالفعل؟',
    login: 'تسجيل الدخول',
    back: 'رجوع →',
    formSubtitle: 'املأ الحقول الإلزامية (المعلّمة بـ *).',
    optional: '(اختياري)',
    submit: 'إنشاء حسابي',
    submitting: 'جاري الإنشاء...',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    successTitle: 'تم إنشاء الحساب بنجاح!',
    successDesc: 'يمكنك الآن تسجيل الدخول.',
    copyright: '© 2026 MyTawjeh',
    close: 'إغلاق',
  },
};

// ── Champs par rôle (fr + ar) ─────────────────────────────────────────────────
const FIELDS = {
  etudiant: {
    perso: [
      { name: 'nom',            fr: 'Nom',               ar: 'الاسم',              type: 'text',     required: true },
      { name: 'prenom',         fr: 'Prénom',            ar: 'النسب',              type: 'text',     required: true },
      { name: 'sexe',           fr: 'Sexe',              ar: 'الجنس',              type: 'select',   required: true,
        options: { fr: ['—', 'Masculin', 'Féminin'], ar: ['—', 'ذكر', 'أنثى'] } },
      { name: 'dateNaissance',  fr: 'Date de naissance', ar: 'تاريخ الميلاد',      type: 'date',     required: true },
      { name: 'photo',          fr: 'Photo',             ar: 'الصورة',             type: 'file',     required: false },
      { name: 'cne',            fr: 'CNE / Code Massar', ar: 'رمز مسار / CNE',     type: 'text',     required: true },
      { name: 'cin',            fr: 'CIN',               ar: 'رقم البطاقة الوطنية',type: 'text',     required: false },
      { name: 'telephone',      fr: 'Téléphone',         ar: 'الهاتف',             type: 'tel',      required: true },
      { name: 'adresse',        fr: 'Adresse',           ar: 'العنوان',            type: 'text',     required: true },
      { name: 'ville',          fr: 'Ville',             ar: 'المدينة',            type: 'text',     required: true },
      { name: 'email',          fr: 'Email',             ar: 'البريد الإلكتروني',  type: 'email',    required: true },
    ],
    scolaire: [
      { name: 'numeroEtudiant', fr: 'Numéro étudiant',   ar: 'رقم الطالب',         type: 'text',     required: true },
      { name: 'filiere',        fr: 'Filière',           ar: 'الشعبة',             type: 'text',     required: true },
      { name: 'niveau',         fr: 'Niveau',            ar: 'المستوى',            type: 'text',     required: true },
      { name: 'groupe',         fr: 'Groupe / Classe',   ar: 'الفوج / القسم',      type: 'text',     required: true },
      { name: 'anneeScolaire',  fr: 'Année scolaire',    ar: 'السنة الدراسية',     type: 'text',     required: true },
      { name: 'dateInscription',fr: "Date d'inscription",ar: 'تاريخ التسجيل',      type: 'date',     required: true },
    ],
    compte: [
      { name: 'username',       fr: "Nom d'utilisateur", ar: 'اسم المستخدم',       type: 'text',     required: true },
      { name: 'password',       fr: 'Mot de passe',      ar: 'كلمة المرور',        type: 'password', required: true },
      { name: 'confirmPassword',fr: 'Confirmation mot de passe', ar: 'تأكيد كلمة المرور', type: 'password', required: true },
    ],
  },
  professeur: {
    perso: [
      { name: 'nom',            fr: 'Nom',               ar: 'الاسم',              type: 'text',     required: true },
      { name: 'prenom',         fr: 'Prénom',            ar: 'النسب',              type: 'text',     required: true },
      { name: 'sexe',           fr: 'Sexe',              ar: 'الجنس',              type: 'select',   required: true,
        options: { fr: ['—', 'Masculin', 'Féminin'], ar: ['—', 'ذكر', 'أنثى'] } },
      { name: 'dateNaissance',  fr: 'Date de naissance', ar: 'تاريخ الميلاد',      type: 'date',     required: true },
      { name: 'photo',          fr: 'Photo de profil',   ar: 'صورة الملف الشخصي',  type: 'file',     required: false },
      { name: 'cin',            fr: "CIN / Carte d'identité", ar: 'رقم البطاقة الوطنية', type: 'text', required: true },
      { name: 'telephone',      fr: 'Téléphone',         ar: 'الهاتف',             type: 'tel',      required: true },
      { name: 'adresse',        fr: 'Adresse',           ar: 'العنوان',            type: 'text',     required: true },
      { name: 'ville',          fr: 'Ville',             ar: 'المدينة',            type: 'text',     required: true },
      { name: 'email',          fr: 'Email',             ar: 'البريد الإلكتروني',  type: 'email',    required: true },
    ],
    pro: [
      { name: 'matricule',      fr: 'Matricule professeur',          ar: 'رقم الأستاذ',          type: 'text',   required: true },
      { name: 'specialite',     fr: 'Spécialité / Matière enseignée',ar: 'التخصص / المادة المدرَّسة', type: 'text', required: true },
      { name: 'departement',    fr: 'Département',                   ar: 'القسم',                type: 'text',   required: true },
      { name: 'niveauEnseigné', fr: 'Niveau enseigné',               ar: 'المستوى المدرَّس',      type: 'text',   required: true },
      { name: 'dateEmbauche',   fr: "Date d'embauche",               ar: 'تاريخ التوظيف',        type: 'date',   required: true },
      { name: 'diplome',        fr: 'Diplôme',                       ar: 'الشهادة',              type: 'text',   required: true },
      { name: 'experience',     fr: 'Expérience (années)',           ar: 'الخبرة (سنوات)',       type: 'number', required: true },
    ],
    compte: [
      { name: 'username',       fr: "Nom d'utilisateur", ar: 'اسم المستخدم',       type: 'text',     required: true },
      { name: 'password',       fr: 'Mot de passe',      ar: 'كلمة المرور',        type: 'password', required: true },
      { name: 'confirmPassword',fr: 'Confirmation mot de passe', ar: 'تأكيد كلمة المرور', type: 'password', required: true },
    ],
  },
  parent: {
    perso: [
      { name: 'nom',            fr: 'Nom',               ar: 'الاسم',              type: 'text',     required: true },
      { name: 'prenom',         fr: 'Prénom',            ar: 'النسب',              type: 'text',     required: true },
      { name: 'cin',            fr: 'CIN',               ar: 'رقم البطاقة الوطنية',type: 'text',     required: true },
      { name: 'telephone',      fr: 'Téléphone',         ar: 'الهاتف',             type: 'tel',      required: true },
      { name: 'adresse',        fr: 'Adresse',           ar: 'العنوان',            type: 'text',     required: true },
      { name: 'ville',          fr: 'Ville',             ar: 'المدينة',            type: 'text',     required: true },
      { name: 'profession',     fr: 'Profession',        ar: 'المهنة',             type: 'text',     required: false },
      { name: 'email',          fr: 'Email',             ar: 'البريد الإلكتروني',  type: 'email',    required: true },
    ],
    famille: [
      { name: 'nomEnfant',      fr: "Nom de l'enfant",   ar: 'اسم الطفل',          type: 'text',     required: true },
      { name: 'relation',       fr: "Relation avec l'étudiant", ar: 'صلة القرابة بالطالب', type: 'select', required: true,
        options: { fr: ['—', 'Père', 'Mère', 'Tuteur'], ar: ['—', 'أب', 'أم', 'وصي'] } },
    ],
    compte: [
      { name: 'username',       fr: "Nom d'utilisateur", ar: 'اسم المستخدم',       type: 'text',     required: true },
      { name: 'password',       fr: 'Mot de passe',      ar: 'كلمة المرور',        type: 'password', required: true },
      { name: 'confirmPassword',fr: 'Confirmation mot de passe', ar: 'تأكيد كلمة المرور', type: 'password', required: true },
    ],
  },
};

// ── Config rôles (fr + ar) ────────────────────────────────────────────────────
const ROLES = {
  etudiant: {
    fr: { label: 'Étudiant',   desc: 'Suivi scolaire, orientation et objectifs.' },
    ar: { label: 'طالب',       desc: 'متابعة دراسية، توجيه وأهداف.' },
    icon: '🎓',
    sections: {
      fr: [
        { key: 'perso',    title: 'INFORMATIONS PERSONNELLES', fields: FIELDS.etudiant.perso },
        { key: 'scolaire', title: 'INFORMATIONS SCOLAIRES',    fields: FIELDS.etudiant.scolaire },
        { key: 'compte',   title: 'INFORMATIONS DU COMPTE',    fields: FIELDS.etudiant.compte },
      ],
      ar: [
        { key: 'perso',    title: 'المعلومات الشخصية',  fields: FIELDS.etudiant.perso },
        { key: 'scolaire', title: 'المعلومات الدراسية', fields: FIELDS.etudiant.scolaire },
        { key: 'compte',   title: 'معلومات الحساب',     fields: FIELDS.etudiant.compte },
      ],
    },
  },
  professeur: {
    fr: { label: 'Professeur', desc: 'Espace enseignement et accompagnement.' },
    ar: { label: 'أستاذ',      desc: 'فضاء التدريس والمرافقة.' },
    icon: '👨‍🏫',
    sections: {
      fr: [
        { key: 'perso', title: 'INFORMATIONS PERSONNELLES',    fields: FIELDS.professeur.perso },
        { key: 'pro',   title: 'INFORMATIONS PROFESSIONNELLES',fields: FIELDS.professeur.pro },
        { key: 'compte',title: 'INFORMATIONS DU COMPTE',       fields: FIELDS.professeur.compte },
      ],
      ar: [
        { key: 'perso', title: 'المعلومات الشخصية',     fields: FIELDS.professeur.perso },
        { key: 'pro',   title: 'المعلومات المهنية',      fields: FIELDS.professeur.pro },
        { key: 'compte',title: 'معلومات الحساب',         fields: FIELDS.professeur.compte },
      ],
    },
  },
  parent: {
    fr: { label: 'Parent',     desc: 'Suivez le parcours de votre enfant.' },
    ar: { label: 'ولي الأمر',  desc: 'تابع مسار طفلك الدراسي.' },
    icon: '👨‍👩‍👧',
    sections: {
      fr: [
        { key: 'perso',   title: 'INFORMATIONS PERSONNELLES', fields: FIELDS.parent.perso },
        { key: 'famille', title: 'INFORMATIONS FAMILIALES',   fields: FIELDS.parent.famille },
        { key: 'compte',  title: 'INFORMATIONS DU COMPTE',    fields: FIELDS.parent.compte },
      ],
      ar: [
        { key: 'perso',   title: 'المعلومات الشخصية',  fields: FIELDS.parent.perso },
        { key: 'famille', title: 'المعلومات العائلية', fields: FIELDS.parent.famille },
        { key: 'compte',  title: 'معلومات الحساب',     fields: FIELDS.parent.compte },
      ],
    },
  },
};

// ── Composant champ ───────────────────────────────────────────────────────────
function Field({ field, lang, value, onChange }) {
  if (field.type === 'select') {
    const opts = field.options[lang];
    return (
      <select name={field.name} required={field.required} value={value || ''} onChange={onChange} className="ins-input">
        {opts.map((o) => (
          <option key={o} value={o === '—' ? '' : o}>{o}</option>
        ))}
      </select>
    );
  }
  if (field.type === 'file') {
    return <input type="file" name={field.name} accept="image/*" onChange={onChange} className="ins-input-file" />;
  }
  return (
    <input
      type={field.type}
      name={field.name}
      required={field.required}
      value={value || ''}
      onChange={onChange}
      className="ins-input"
    />
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function Inscription({ onClose, onSwitchToLogin, lang = 'fr' }) {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = UI[lang];
  const isRtl = lang === 'ar';

  const roleConfig = role ? ROLES[role] : null;
  const roleLabel  = role ? ROLES[role][lang].label : '';
  const sections   = role ? ROLES[role].sections[lang] : [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t.passwordMismatch);
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  return (
    <div
      className="ins-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div className="ins-modal" dir={t.dir}>

        {/* ── Panneau gauche ── */}
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
                {t.role} : <strong>{roleLabel}</strong>
              </div>
            )}
          </div>
          <div className="ins-left-footer">{t.copyright}</div>
        </div>

        {/* ── Panneau droit ── */}
        <div className="ins-right">
          {onClose && (
            <button className="ins-close" onClick={onClose} aria-label={t.close}>×</button>
          )}

          {/* Succès */}
          {success ? (
            <div className="ins-success">
              <div className="ins-success-icon">✅</div>
              <h3>{t.successTitle}</h3>
              <p>{t.successDesc}</p>
              <button className="ins-btn" onClick={() => { if (onClose) onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
                {t.login}
              </button>
            </div>

          /* Étape 1 : choix rôle */
          ) : !role ? (
            <>
              <h3 className="ins-title">{t.title}</h3>
              <p className="ins-subtitle">{t.subtitle}</p>

              <div className="ins-roles">
                {Object.entries(ROLES).map(([key, cfg]) => (
                  <button key={key} className="ins-role-card" onClick={() => setRole(key)}>
                    <span className="ins-role-icon">{cfg.icon}</span>
                    <span className="ins-role-label">{cfg[lang].label}</span>
                    <span className="ins-role-desc">{cfg[lang].desc}</span>
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

          /* Étape 2 : formulaire */
          ) : (
            <>
              <div className="ins-form-header">
                <button className="ins-back" onClick={() => { setRole(null); setFormData({}); }}>
                  {t.back}
                </button>
                <div>
                  <h3 className="ins-title">{t.title} — {roleLabel}</h3>
                  <p className="ins-subtitle">{t.formSubtitle}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="ins-form">
                {sections.map((section) => (
                  <div key={section.key} className="ins-section">
                    <div className="ins-section-title">{section.title}</div>
                    <div className="ins-grid">
                      {section.fields.map((field) => (
                        <div
                          key={field.name}
                          className={`ins-field ${
                            field.type === 'file' || field.name === 'adresse' ? 'ins-field-full' : ''
                          }`}
                        >
                          <label className="ins-label">
                            {field[lang]}
                            {field.required
                              ? <span className="ins-required"> *</span>
                              : <span className="ins-optional"> {t.optional}</span>
                            }
                          </label>
                          <Field field={field} lang={lang} value={formData[field.name]} onChange={handleChange} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={loading} className="ins-btn">
                  {loading ? t.submitting : t.submit}
                </button>

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
