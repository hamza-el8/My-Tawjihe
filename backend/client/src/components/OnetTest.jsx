import { useState } from 'react';
import api from '../api/axios';

// ── All 60 O*NET questions trilingual ─────────────────────────────────────────
const ALL_QUESTIONS = [
  // REALISTIC (R) — 1-10
  { id: 1,  cat: 'R', en: 'Build kitchen cabinets',                          fr: 'Fabriquer des meubles de cuisine',                    ar: 'صنع خزائن المطبخ' },
  { id: 2,  cat: 'R', en: 'Lay brick or tile',                               fr: 'Poser des briques ou des carreaux',                   ar: 'وضع الطوب أو البلاط' },
  { id: 3,  cat: 'R', en: 'Repair household appliances',                     fr: 'Réparer des appareils ménagers',                     ar: 'إصلاح الأجهزة المنزلية' },
  { id: 4,  cat: 'R', en: 'Raise fish in a fish hatchery',                   fr: 'Élever des poissons dans une pisciculture',           ar: 'تربية الأسماك في مفرخ' },
  { id: 5,  cat: 'R', en: 'Assemble electronic parts',                       fr: 'Assembler des composants électroniques',              ar: 'تجميع قطع إلكترونية' },
  { id: 6,  cat: 'R', en: 'Drive a truck to deliver packages',               fr: 'Conduire un camion pour livrer des colis',            ar: 'قيادة شاحنة لتوصيل الطرود' },
  { id: 7,  cat: 'R', en: 'Test the quality of parts before shipment',       fr: 'Tester la qualité des pièces avant expédition',      ar: 'اختبار جودة القطع قبل الشحن' },
  { id: 8,  cat: 'R', en: 'Repair and install locks',                        fr: 'Réparer et installer des serrures',                  ar: 'إصلاح وتركيب الأقفال' },
  { id: 9,  cat: 'R', en: 'Set up and operate machines to make products',    fr: 'Configurer et faire fonctionner des machines',       ar: 'إعداد وتشغيل الآلات لصنع المنتجات' },
  { id: 10, cat: 'R', en: 'Catch fish using nets, lines, or traps',          fr: 'Pêcher avec des filets, des lignes ou des pièges',   ar: 'صيد الأسماك بالشباك أو الخيوط أو الفخاخ' },
  // INVESTIGATIVE (I) — 11-20
  { id: 11, cat: 'I', en: 'Study the structure of the human body',           fr: 'Étudier la structure du corps humain',               ar: 'دراسة بنية جسم الإنسان' },
  { id: 12, cat: 'I', en: 'Study animal behavior',                           fr: 'Étudier le comportement animal',                     ar: 'دراسة سلوك الحيوانات' },
  { id: 13, cat: 'I', en: 'Do research on plants or animals',                fr: 'Faire des recherches sur les plantes ou les animaux', ar: 'إجراء أبحاث على النباتات أو الحيوانات' },
  { id: 14, cat: 'I', en: 'Investigate the cause of a fire',                 fr: 'Enquêter sur les causes d\'un incendie',             ar: 'التحقيق في سبب حريق' },
  { id: 15, cat: 'I', en: 'Develop a new medicine',                          fr: 'Développer un nouveau médicament',                   ar: 'تطوير دواء جديد' },
  { id: 16, cat: 'I', en: 'Study ways to reduce water pollution',            fr: 'Étudier les moyens de réduire la pollution de l\'eau',ar: 'دراسة طرق الحد من تلوث المياه' },
  { id: 17, cat: 'I', en: 'Conduct chemical experiments',                    fr: 'Mener des expériences chimiques',                    ar: 'إجراء تجارب كيميائية' },
  { id: 18, cat: 'I', en: 'Study the personalities of world leaders',        fr: 'Étudier la personnalité des leaders mondiaux',       ar: 'دراسة شخصيات القادة العالميين' },
  { id: 19, cat: 'I', en: 'Determine the exact distance between two points', fr: 'Déterminer la distance exacte entre deux points',   ar: 'تحديد المسافة الدقيقة بين نقطتين' },
  { id: 20, cat: 'I', en: 'Examine blood samples using a microscope',        fr: 'Examiner des échantillons de sang au microscope',    ar: 'فحص عينات الدم بالمجهر' },
  // ARTISTIC (A) — 21-30
  { id: 21, cat: 'A', en: 'Direct a play',                                   fr: 'Mettre en scène une pièce de théâtre',               ar: 'إخراج مسرحية' },
  { id: 22, cat: 'A', en: 'Create special effects for movies',               fr: 'Créer des effets spéciaux pour les films',           ar: 'إنشاء مؤثرات خاصة للأفلام' },
  { id: 23, cat: 'A', en: 'Write books or plays',                            fr: 'Écrire des livres ou des pièces de théâtre',         ar: 'كتابة الكتب أو المسرحيات' },
  { id: 24, cat: 'A', en: 'Play a musical instrument',                       fr: 'Jouer d\'un instrument de musique',                  ar: 'العزف على آلة موسيقية' },
  { id: 25, cat: 'A', en: 'Sing in a choir',                                 fr: 'Chanter dans une chorale',                          ar: 'الغناء في جوقة' },
  { id: 26, cat: 'A', en: 'Perform comedy routines in front of an audience', fr: 'Faire des numéros comiques devant un public',       ar: 'تقديم عروض كوميدية أمام الجمهور' },
  { id: 27, cat: 'A', en: 'Perform stunts for a movie or television show',   fr: 'Faire des cascades pour un film ou une émission TV', ar: 'القيام بمشاهد خطرة في الأفلام أو التلفزيون' },
  { id: 28, cat: 'A', en: 'Design sets for plays or movies',                 fr: 'Concevoir des décors pour des pièces ou des films',  ar: 'تصميم الديكور للمسرحيات أو الأفلام' },
  { id: 29, cat: 'A', en: 'Draw pictures',                                   fr: 'Dessiner des images',                               ar: 'رسم الصور' },
  { id: 30, cat: 'A', en: 'Paint sets for plays',                            fr: 'Peindre des décors pour des pièces de théâtre',     ar: 'رسم الخلفيات للمسرحيات' },
  // SOCIAL (S) — 31-40
  { id: 31, cat: 'S', en: 'Teach children how to read',                      fr: 'Apprendre aux enfants à lire',                      ar: 'تعليم الأطفال القراءة' },
  { id: 32, cat: 'S', en: 'Help people with personal or emotional problems',  fr: 'Aider les personnes avec des problèmes personnels', ar: 'مساعدة الناس في مشاكلهم الشخصية أو العاطفية' },
  { id: 33, cat: 'S', en: 'Teach a sign language class',                     fr: 'Enseigner la langue des signes',                    ar: 'تعليم لغة الإشارة' },
  { id: 34, cat: 'S', en: 'Help people who have problems with drugs or alcohol', fr: 'Aider les personnes souffrant de dépendances',  ar: 'مساعدة الأشخاص الذين يعانون من إدمان المخدرات أو الكحول' },
  { id: 35, cat: 'S', en: 'Do volunteer work at a non-profit organization',  fr: 'Faire du bénévolat dans une organisation à but non lucratif', ar: 'العمل التطوعي في منظمة غير ربحية' },
  { id: 36, cat: 'S', en: 'Work with mentally disabled children',            fr: 'Travailler avec des enfants handicapés mentaux',    ar: 'العمل مع الأطفال ذوي الإعاقة الذهنية' },
  { id: 37, cat: 'S', en: 'Teach an elementary school class',               fr: 'Enseigner dans une classe de primaire',              ar: 'التدريس في فصل المرحلة الابتدائية' },
  { id: 38, cat: 'S', en: 'Give career guidance to people',                  fr: 'Orienter les gens dans leur carrière',               ar: 'تقديم التوجيه المهني للناس' },
  { id: 39, cat: 'S', en: 'Supervise the activities of children at a camp', fr: 'Superviser les activités d\'enfants en camp',       ar: 'الإشراف على أنشطة الأطفال في المخيم' },
  { id: 40, cat: 'S', en: 'Help families care for ill relatives',            fr: 'Aider les familles à prendre soin de malades',      ar: 'مساعدة العائلات في رعاية ذويهم المرضى' },
  // ENTERPRISING (E) — 41-50
  { id: 41, cat: 'E', en: 'Buy and sell stocks and bonds',                   fr: 'Acheter et vendre des actions et des obligations',  ar: 'شراء وبيع الأسهم والسندات' },
  { id: 42, cat: 'E', en: 'Manage a department within a large company',      fr: 'Gérer un département dans une grande entreprise',   ar: 'إدارة قسم في شركة كبيرة' },
  { id: 43, cat: 'E', en: 'Operate a beauty salon or barbershop',            fr: 'Exploiter un salon de coiffure',                    ar: 'تشغيل صالون تجميل أو حلاقة' },
  { id: 44, cat: 'E', en: 'Manage a clothing store',                         fr: 'Gérer un magasin de vêtements',                     ar: 'إدارة متجر ملابس' },
  { id: 45, cat: 'E', en: 'Sell merchandise over the telephone',             fr: 'Vendre des marchandises par téléphone',             ar: 'بيع البضائع عبر الهاتف' },
  { id: 46, cat: 'E', en: 'Run a toy store',                                 fr: 'Gérer un magasin de jouets',                        ar: 'إدارة متجر للألعاب' },
  { id: 47, cat: 'E', en: 'Manage a supermarket',                            fr: 'Gérer un supermarché',                              ar: 'إدارة سوبرماركت' },
  { id: 48, cat: 'E', en: 'Represent a client in a lawsuit',                 fr: 'Représenter un client dans un procès',              ar: 'تمثيل عميل في دعوى قضائية' },
  { id: 49, cat: 'E', en: 'Market a new product',                            fr: 'Commercialiser un nouveau produit',                 ar: 'تسويق منتج جديد' },
  { id: 50, cat: 'E', en: 'Negotiate business contracts',                    fr: 'Négocier des contrats commerciaux',                 ar: 'التفاوض على العقود التجارية' },
  // CONVENTIONAL (C) — 51-60
  { id: 51, cat: 'C', en: 'Develop a spreadsheet using computer software',   fr: 'Créer un tableur avec un logiciel',                 ar: 'تطوير جدول بيانات باستخدام برنامج حاسوبي' },
  { id: 52, cat: 'C', en: 'Proofread records or forms',                      fr: 'Relire des dossiers ou des formulaires',            ar: 'مراجعة السجلات أو النماذج' },
  { id: 53, cat: 'C', en: 'Load computer software into a large computer network', fr: 'Charger des logiciels dans un grand réseau', ar: 'تحميل برامج الحاسوب في شبكة كبيرة' },
  { id: 54, cat: 'C', en: 'Operate a calculator',                            fr: 'Utiliser une calculatrice',                         ar: 'تشغيل آلة حاسبة' },
  { id: 55, cat: 'C', en: 'Keep shipping and receiving records',             fr: 'Tenir les registres d\'expédition et de réception', ar: 'الاحتفاظ بسجلات الشحن والاستلام' },
  { id: 56, cat: 'C', en: 'Calculate the wages of employees',               fr: 'Calculer les salaires des employés',                 ar: 'حساب أجور الموظفين' },
  { id: 57, cat: 'C', en: 'Record information from customers applying for charge accounts', fr: 'Enregistrer les informations clients', ar: 'تسجيل معلومات العملاء' },
  { id: 58, cat: 'C', en: 'Inventory supplies using a hand-held computer',   fr: 'Inventorier les fournitures avec un ordinateur portable', ar: 'جرد المستلزمات باستخدام حاسوب محمول' },
  { id: 59, cat: 'C', en: 'Transfer funds between bank accounts',            fr: 'Transférer des fonds entre des comptes bancaires',  ar: 'تحويل الأموال بين الحسابات المصرفية' },
  { id: 60, cat: 'C', en: 'Handle customers\' bank transactions',            fr: 'Gérer les transactions bancaires des clients',      ar: 'التعامل مع المعاملات المصرفية للعملاء' },
];

const LEVELS = [
  { key: 10,  label: '⚡ Découverte',       time: '~3 min',  desc: 'Questions rapides, un aperçu de vos intérêts',  count: 10  },
  { key: 30,  label: '🔍 Exploration',     time: '~5 min',  desc: 'Exploration équilibrée de vos centres d\'intérêt', count: 30 },
  { key: 60,  label: '🎯 Profil Complet',  time: '~8 min',  desc: 'Analyse complète pour un profil précis',        count: 60  },
];

const JOB_ZONES = [
  { zone: 1, label: 'Zone 1', desc: 'Peu ou pas de préparation nécessaire' },
  { zone: 2, label: 'Zone 2', desc: 'Une certaine préparation nécessaire' },
  { zone: 3, label: 'Zone 3', desc: 'Préparation modérée nécessaire' },
  { zone: 4, label: 'Zone 4', desc: 'Préparation importante nécessaire (Bac+3/5)' },
  { zone: 5, label: 'Zone 5', desc: 'Préparation extensive nécessaire (Doctorat)' },
];

const CAT_LABELS = {
  R: { fr: 'Réaliste',       ar: 'الواقعي',       en: 'Realistic',     color: '#ef4444', emoji: '🔧' },
  I: { fr: 'Investigateur',  ar: 'التحقيقي',      en: 'Investigative', color: '#3b82f6', emoji: '🔬' },
  A: { fr: 'Artistique',     ar: 'الفني',          en: 'Artistic',      color: '#ec4899', emoji: '🎨' },
  S: { fr: 'Social',         ar: 'الاجتماعي',      en: 'Social',        color: '#10b981', emoji: '🤝' },
  E: { fr: 'Entreprenant',   ar: 'الريادي',        en: 'Enterprising',  color: '#f59e0b', emoji: '💼' },
  C: { fr: 'Conventionnel',  ar: 'التقليدي',       en: 'Conventional',  color: '#8b5cf6', emoji: '📊' },
};

const LANGS = [
  { key: 'fr', label: 'Français', flag: '🇫🇷' },
  { key: 'en', label: 'English',  flag: '🇬🇧' },
  { key: 'ar', label: 'العربية',  flag: '🇲🇦' },
];

function selectQuestions(level) {
  if (level === 60) return ALL_QUESTIONS;
  const cats = ['R','I','A','S','E','C'];
  const perCat = level / 6;
  let result = [];
  for (const cat of cats) {
    const qs = ALL_QUESTIONS.filter(q => q.cat === cat);
    // evenly spaced selection
    const step = qs.length / perCat;
    for (let i = 0; i < perCat; i++) {
      result.push(qs[Math.floor(i * step)]);
    }
  }
  return result;
}

export default function OnetTest({ onComplete, onSkip }) {
  const [step, setStep] = useState('level');   // level → lang → test → results → extras → done
  const [level, setLevel] = useState(null);
  const [lang, setLang] = useState('fr');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});  // { qId: true/false }
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState(null);
  const [jobZone, setJobZone] = useState(null);
  const [dreamUni, setDreamUni] = useState('');
  const [dreamJob, setDreamJob] = useState('');
  const [saving, setSaving] = useState(false);

  const isRtl = lang === 'ar';

  const startTest = (lvl) => {
    setLevel(lvl);
    const qs = selectQuestions(lvl);
    setQuestions(qs);
    setStep('lang');
  };

  const beginQuestions = () => {
    setStep('test');
    setCurrentQ(0);
    setAnswers({});
  };

  const answer = (val) => {
    const q = questions[currentQ];
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      // Calculate scores
      const sc = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      questions.forEach(q => {
        if (answers[q.id] || (q.id === questions[currentQ].id && val)) {
          sc[q.cat]++;
        }
      });
      // fix last answer
      if (val) sc[q.cat]++;
      setScores(sc);
      setStep('results');
    }
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(c => c - 1);
  };

  const getRanked = () => {
    if (!scores) return [];
    return Object.entries(scores).sort((a, b) => b[1] - a[1]);
  };

  const handleSave = async () => {
    setSaving(true);
    const ranked = getRanked();
    try {
      await api.post('/onet/save', {
        testLevel: level,
        scores,
        primaryInterest: ranked[0]?.[0],
        secondaryInterest: ranked[1]?.[0],
        tertiaryInterest: ranked[2]?.[0],
        jobZone,
        dreamUni: dreamUni || null,
        dreamJob: dreamJob || null,
        language: lang,
      });
      if (onComplete) onComplete({ scores, ranked, jobZone, dreamUni, dreamJob });
    } catch (e) {
      alert('Erreur lors de la sauvegarde. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const progress = questions.length ? ((currentQ + 1) / questions.length) * 100 : 0;

  const box = {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    maxWidth: 560,
    margin: '0 auto',
    boxShadow: '0 4px 24px rgba(15,32,68,0.10)',
  };

  // ── Level selection ──────────────────────────────────────────────────────────
  if (step === 'level') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...box, maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f2044', margin: 0 }}>Test O*NET d'intérêts professionnels</h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
            Découvrez vos intérêts selon le modèle RIASEC pour construire votre parcours idéal.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {LEVELS.map(l => (
            <button
              key={l.key}
              onClick={() => startTest(l.key)}
              style={{
                padding: '16px 20px', borderRadius: 12, border: '2px solid #e2e8f0',
                background: '#f8fafc', cursor: 'pointer', textAlign: 'left',
                transition: 'all .2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f2044' }}>{l.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{l.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{l.count} questions</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{l.time}</div>
              </div>
            </button>
          ))}
        </div>

        {onSkip && (
          <button
            onClick={onSkip}
            style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
          >
            Plus tard →
          </button>
        )}
      </div>
    </div>
  );

  // ── Language selection ───────────────────────────────────────────────────────
  if (step === 'lang') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={box}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f2044', margin: 0 }}>Choisissez votre langue</h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>Les questions s'afficheront dans la langue sélectionnée.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
          {LANGS.map(l => (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              style={{
                padding: '16px 24px', borderRadius: 12, border: `2px solid ${lang === l.key ? '#f59e0b' : '#e2e8f0'}`,
                background: lang === l.key ? '#fffbeb' : '#f8fafc', cursor: 'pointer', fontSize: 16,
                fontWeight: lang === l.key ? 700 : 500, color: lang === l.key ? '#0f2044' : '#64748b',
              }}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={beginQuestions}
          style={{ width: '100%', padding: 12, background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          Commencer le test →
        </button>
      </div>
    </div>
  );

  // ── Questions ────────────────────────────────────────────────────────────────
  if (step === 'test') {
    const q = questions[currentQ];
    const cat = CAT_LABELS[q.cat];
    const answered = answers[q.id];
    const hasAnswer = answered !== undefined;

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} dir={isRtl ? 'rtl' : 'ltr'}>
        <div style={{ ...box, maxWidth: 540 }}>
          {/* Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
              <span>{currentQ + 1} / {questions.length}</span>
              <span style={{ color: cat.color, fontWeight: 700 }}>{cat.emoji} {cat[lang] || cat.fr}</span>
            </div>
            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#f59e0b', borderRadius: 999, transition: 'width .3s' }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 8px' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
              {lang === 'fr' ? 'Aimeriez-vous faire cela ?' : lang === 'ar' ? 'هل تودّ القيام بهذا؟' : 'Would you like to do this activity?'}
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0f2044', lineHeight: 1.4, margin: 0 }}>
              {q[lang] || q.fr}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => answer(true)}
              style={{
                flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #10b981',
                background: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
            >
              {lang === 'ar' ? '✓ نعم' : '✓ Oui'}
            </button>
            <button
              onClick={() => answer(false)}
              style={{
                flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #ef4444',
                background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
            >
              {lang === 'ar' ? '✗ لا' : '✗ Non'}
            </button>
          </div>

          {currentQ > 0 && (
            <button
              onClick={goBack}
              style={{ marginTop: 16, width: '100%', padding: 8, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
            >
              ← {lang === 'ar' ? 'رجوع' : 'Question précédente'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────────────────────────────
  if (step === 'results') {
    const ranked = getRanked();
    const [p1, p2, p3] = ranked;
    const total = questions.length / 6;

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ ...box, maxWidth: 560 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 40 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f2044', margin: '8px 0 4px' }}>Votre profil RIASEC</h2>
            <p style={{ color: '#64748b', fontSize: 13 }}>Vos 3 premières lettres forment votre code : <strong style={{ color: '#0f2044' }}>{p1[0]}{p2[0]}{p3[0]}</strong></p>
          </div>

          {/* Score bars */}
          <div style={{ marginBottom: 24 }}>
            {ranked.map(([cat, score], i) => {
              const info = CAT_LABELS[cat];
              const pct = total > 0 ? (score / total) * 100 : 0;
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: i < 3 ? 700 : 500, color: i < 3 ? info.color : '#94a3b8' }}>
                      {info.emoji} {info.fr}
                      {i === 0 && <span style={{ fontSize: 10, marginLeft: 6, background: info.color, color: '#fff', padding: '1px 5px', borderRadius: 4 }}>Primaire</span>}
                      {i === 1 && <span style={{ fontSize: 10, marginLeft: 6, background: '#f1f5f9', color: '#64748b', padding: '1px 5px', borderRadius: 4 }}>Secondaire</span>}
                      {i === 2 && <span style={{ fontSize: 10, marginLeft: 6, background: '#f1f5f9', color: '#64748b', padding: '1px 5px', borderRadius: 4 }}>Tertiaire</span>}
                    </span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>{score}/{Math.round(total)}</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: info.color, borderRadius: 999, transition: 'width .5s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Job Zone */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f2044', marginBottom: 10 }}>Quel est votre niveau d'études visé ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {JOB_ZONES.map(jz => (
                <button
                  key={jz.zone}
                  onClick={() => setJobZone(jz.zone)}
                  style={{
                    padding: '10px 14px', borderRadius: 8, border: `2px solid ${jobZone === jz.zone ? '#f59e0b' : '#e2e8f0'}`,
                    background: jobZone === jz.zone ? '#fffbeb' : '#f8fafc', cursor: 'pointer',
                    textAlign: 'left', fontSize: 13, color: jobZone === jz.zone ? '#0f2044' : '#64748b',
                    fontWeight: jobZone === jz.zone ? 700 : 400,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{jz.label}</span> — {jz.desc}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('extras')}
            disabled={!jobZone}
            style={{
              width: '100%', padding: 12, background: jobZone ? '#f59e0b' : '#e2e8f0', color: jobZone ? '#fff' : '#94a3b8',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: jobZone ? 'pointer' : 'not-allowed',
            }}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  // ── Extras (dream uni/job) ───────────────────────────────────────────────────
  if (step === 'extras') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2044,#1a3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={box}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36 }}>💭</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f2044', margin: '8px 0 4px' }}>Vos rêves (optionnel)</h2>
          <p style={{ color: '#64748b', fontSize: 13 }}>Ces informations enrichiront votre roadmap personnalisée par IA.</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            🎓 Université de rêve (optionnel)
          </label>
          <input
            type="text"
            value={dreamUni}
            onChange={e => setDreamUni(e.target.value)}
            placeholder="Ex: ENSA Marrakech, UCA, Mohamed V..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            💼 Métier de rêve (optionnel)
          </label>
          <input
            type="text"
            value={dreamJob}
            onChange={e => setDreamJob(e.target.value)}
            placeholder="Ex: Ingénieur logiciel, Médecin, Architecte..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: 13, background: saving ? '#fbbf2480' : '#f59e0b', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Sauvegarde...' : '✅ Terminer et sauvegarder mon profil'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ marginTop: 10, width: '100%', padding: 9, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
        >
          Passer les rêves et terminer →
        </button>
      </div>
    </div>
  );

  return null;
}
