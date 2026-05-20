import { useState, useEffect, useRef, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  nom: string;
  email: string;
  role: 'eleve' | 'parent' | 'professeur' | 'admin';
  niveau?: string;
  filiere?: string;
  eleveId?: number;
}

interface Note {
  id: number;
  matiere: string;
  valeur: number;
  coefficient: number;
  periode: string;
  type: string;
}

interface Notification {
  id: number;
  contenu: string;
  type: string;
  lu: boolean;
  createdAt: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Exercice {
  id: number;
  matiere: string;
  niveau: string;
  difficulte: string;
  contenu: string;
  correction: string;
}

interface Concours {
  id: number;
  nom: string;
  datw?: string;
  dateConcours?: string;
  seuil: number;
  lien?: string;
  description?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api';

const apiFetch = async (path: string, opts: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts.headers as Record<string, string>),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: '◈',
  notes: '📊',
  exercices: '📝',
  roadmap: '🧭',
  chatbot: '🤖',
  concours: '🏆',
  annales: '📚',
  notifications: '🔔',
  prof: '👨‍🏫',
  eleves: '👥',
  admin: '⚙️',
  logout: '→',
  send: '↑',
  plus: '+',
  close: '×',
  check: '✓',
  star: '★',
  menu: '☰',
};

// ─── ALL 60 ONET QUESTIONS ────────────────────────────────────────────────────
const ONET_QUESTIONS = [
  { id:1,cat:'R',fr:'Fabriquer des meubles de cuisine',en:'Build kitchen cabinets',ar:'صنع خزائن المطبخ' },
  { id:2,cat:'R',fr:'Poser des briques ou carreaux',en:'Lay brick or tile',ar:'وضع الطوب أو البلاط' },
  { id:3,cat:'R',fr:'Réparer des appareils ménagers',en:'Repair household appliances',ar:'إصلاح الأجهزة المنزلية' },
  { id:4,cat:'R',fr:'Élever des poissons en pisciculture',en:'Raise fish in a hatchery',ar:'تربية الأسماك في مفرخ' },
  { id:5,cat:'R',fr:'Assembler des composants électroniques',en:'Assemble electronic parts',ar:'تجميع قطع إلكترونية' },
  { id:6,cat:'R',fr:'Conduire un camion pour livrer des colis',en:'Drive a truck to deliver packages',ar:'قيادة شاحنة لتوصيل الطرود' },
  { id:7,cat:'R',fr:'Tester la qualité des pièces avant expédition',en:'Test quality of parts before shipment',ar:'اختبار جودة القطع قبل الشحن' },
  { id:8,cat:'R',fr:'Réparer et installer des serrures',en:'Repair and install locks',ar:'إصلاح وتركيب الأقفال' },
  { id:9,cat:'R',fr:'Configurer et opérer des machines',en:'Set up and operate machines',ar:'إعداد وتشغيل الآلات' },
  { id:10,cat:'R',fr:'Pêcher avec filets ou lignes',en:'Catch fish using nets or lines',ar:'صيد الأسماك بالشباك أو الخيوط' },
  { id:11,cat:'I',fr:'Étudier la structure du corps humain',en:'Study the structure of the human body',ar:'دراسة بنية جسم الإنسان' },
  { id:12,cat:'I',fr:'Étudier le comportement animal',en:'Study animal behavior',ar:'دراسة سلوك الحيوانات' },
  { id:13,cat:'I',fr:'Faire des recherches sur les plantes',en:'Do research on plants or animals',ar:'إجراء أبحاث على النباتات' },
  { id:14,cat:'I',fr:"Enquêter sur les causes d'un incendie",en:'Investigate the cause of a fire',ar:'التحقيق في سبب حريق' },
  { id:15,cat:'I',fr:'Développer un nouveau médicament',en:'Develop a new medicine',ar:'تطوير دواء جديد' },
  { id:16,cat:'I',fr:"Étudier la réduction de la pollution de l'eau",en:'Study ways to reduce water pollution',ar:'دراسة طرق الحد من تلوث المياه' },
  { id:17,cat:'I',fr:'Mener des expériences chimiques',en:'Conduct chemical experiments',ar:'إجراء تجارب كيميائية' },
  { id:18,cat:'I',fr:'Étudier la personnalité des leaders',en:'Study the personalities of world leaders',ar:'دراسة شخصيات القادة العالميين' },
  { id:19,cat:'I',fr:'Déterminer la distance exacte entre deux points',en:'Determine the exact distance between two points',ar:'تحديد المسافة الدقيقة بين نقطتين' },
  { id:20,cat:'I',fr:'Examiner des échantillons au microscope',en:'Examine blood samples using a microscope',ar:'فحص عينات الدم بالمجهر' },
  { id:21,cat:'A',fr:'Mettre en scène une pièce de théâtre',en:'Direct a play',ar:'إخراج مسرحية' },
  { id:22,cat:'A',fr:'Créer des effets spéciaux pour films',en:'Create special effects for movies',ar:'إنشاء مؤثرات خاصة للأفلام' },
  { id:23,cat:'A',fr:'Écrire des livres ou des pièces',en:'Write books or plays',ar:'كتابة الكتب أو المسرحيات' },
  { id:24,cat:'A',fr:"Jouer d'un instrument de musique",en:'Play a musical instrument',ar:'العزف على آلة موسيقية' },
  { id:25,cat:'A',fr:'Chanter dans une chorale',en:'Sing in a choir',ar:'الغناء في جوقة' },
  { id:26,cat:'A',fr:'Faire des numéros comiques',en:'Perform comedy routines in front of an audience',ar:'تقديم عروض كوميدية أمام الجمهور' },
  { id:27,cat:'A',fr:'Faire des cascades pour un film',en:'Perform stunts for a movie or TV show',ar:'القيام بمشاهد خطرة في الأفلام' },
  { id:28,cat:'A',fr:'Concevoir des décors pour des pièces',en:'Design sets for plays or movies',ar:'تصميم الديكور للمسرحيات' },
  { id:29,cat:'A',fr:'Dessiner des images',en:'Draw pictures',ar:'رسم الصور' },
  { id:30,cat:'A',fr:'Peindre des décors pour des pièces',en:'Paint sets for plays',ar:'رسم الخلفيات للمسرحيات' },
  { id:31,cat:'S',fr:'Apprendre aux enfants à lire',en:'Teach children how to read',ar:'تعليم الأطفال القراءة' },
  { id:32,cat:'S',fr:'Aider les personnes avec des problèmes personnels',en:'Help people with personal or emotional problems',ar:'مساعدة الناس في مشاكلهم الشخصية' },
  { id:33,cat:'S',fr:'Enseigner la langue des signes',en:'Teach a sign language class',ar:'تعليم لغة الإشارة' },
  { id:34,cat:'S',fr:'Aider les personnes souffrant de dépendances',en:'Help people who have problems with drugs or alcohol',ar:'مساعدة الأشخاص الذين يعانون من إدمان' },
  { id:35,cat:'S',fr:'Faire du bénévolat dans une ONG',en:'Do volunteer work at a non-profit organization',ar:'العمل التطوعي في منظمة غير ربحية' },
  { id:36,cat:'S',fr:'Travailler avec des enfants handicapés',en:'Work with mentally disabled children',ar:'العمل مع الأطفال ذوي الإعاقة' },
  { id:37,cat:'S',fr:'Enseigner en classe de primaire',en:'Teach an elementary school class',ar:'التدريس في فصل المرحلة الابتدائية' },
  { id:38,cat:'S',fr:'Orienter les gens dans leur carrière',en:'Give career guidance to people',ar:'تقديم التوجيه المهني للناس' },
  { id:39,cat:'S',fr:"Superviser les activités d'enfants en camp",en:'Supervise the activities of children at a camp',ar:'الإشراف على أنشطة الأطفال في المخيم' },
  { id:40,cat:'S',fr:'Aider les familles à prendre soin de malades',en:'Help families care for ill relatives',ar:'مساعدة العائلات في رعاية ذويهم المرضى' },
  { id:41,cat:'E',fr:'Acheter et vendre des actions et obligations',en:'Buy and sell stocks and bonds',ar:'شراء وبيع الأسهم والسندات' },
  { id:42,cat:'E',fr:'Gérer un département dans une grande entreprise',en:'Manage a department within a large company',ar:'إدارة قسم في شركة كبيرة' },
  { id:43,cat:'E',fr:'Exploiter un salon de coiffure',en:'Operate a beauty salon or barbershop',ar:'تشغيل صالون تجميل أو حلاقة' },
  { id:44,cat:'E',fr:'Gérer un magasin de vêtements',en:'Manage a clothing store',ar:'إدارة متجر ملابس' },
  { id:45,cat:'E',fr:'Vendre des marchandises par téléphone',en:'Sell merchandise over the telephone',ar:'بيع البضائع عبر الهاتف' },
  { id:46,cat:'E',fr:'Gérer un magasin de jouets',en:'Run a toy store',ar:'إدارة متجر للألعاب' },
  { id:47,cat:'E',fr:'Gérer un supermarché',en:'Manage a supermarket',ar:'إدارة سوبرماركت' },
  { id:48,cat:'E',fr:'Représenter un client dans un procès',en:'Represent a client in a lawsuit',ar:'تمثيل عميل في دعوى قضائية' },
  { id:49,cat:'E',fr:'Commercialiser un nouveau produit',en:'Market a new product',ar:'تسويق منتج جديد' },
  { id:50,cat:'E',fr:'Négocier des contrats commerciaux',en:'Negotiate business contracts',ar:'التفاوض على العقود التجارية' },
  { id:51,cat:'C',fr:'Créer un tableur avec un logiciel',en:'Develop a spreadsheet using computer software',ar:'تطوير جدول بيانات باستخدام برنامج' },
  { id:52,cat:'C',fr:'Relire des dossiers ou des formulaires',en:'Proofread records or forms',ar:'مراجعة السجلات أو النماذج' },
  { id:53,cat:'C',fr:'Charger des logiciels dans un réseau',en:'Load computer software into a large computer network',ar:'تحميل برامج الحاسوب في شبكة كبيرة' },
  { id:54,cat:'C',fr:'Utiliser une calculatrice',en:'Operate a calculator',ar:'تشغيل آلة حاسبة' },
  { id:55,cat:'C',fr:"Tenir les registres d'expédition",en:'Keep shipping and receiving records',ar:'الاحتفاظ بسجلات الشحن والاستلام' },
  { id:56,cat:'C',fr:'Calculer les salaires des employés',en:'Calculate the wages of employees',ar:'حساب أجور الموظفين' },
  { id:57,cat:'C',fr:'Enregistrer les informations clients',en:'Record information from customers',ar:'تسجيل معلومات العملاء' },
  { id:58,cat:'C',fr:'Inventorier les fournitures avec un ordinateur',en:'Inventory supplies using a hand-held computer',ar:'جرد المستلزمات باستخدام حاسوب محمول' },
  { id:59,cat:'C',fr:'Transférer des fonds entre comptes bancaires',en:'Transfer funds between bank accounts',ar:'تحويل الأموال بين الحسابات المصرفية' },
  { id:60,cat:'C',fr:'Gérer les transactions bancaires des clients',en:"Handle customers' bank transactions",ar:'التعامل مع المعاملات المصرفية للعملاء' },
];

const CAT_INFO: Record<string, { fr: string; color: string; emoji: string }> = {
  R: { fr: 'Réaliste',      color: '#ef4444', emoji: '🔧' },
  I: { fr: 'Investigateur', color: '#3b82f6', emoji: '🔬' },
  A: { fr: 'Artistique',    color: '#ec4899', emoji: '🎨' },
  S: { fr: 'Social',        color: '#10b981', emoji: '🤝' },
  E: { fr: 'Entreprenant',  color: '#f59e0b', emoji: '💼' },
  C: { fr: 'Conventionnel', color: '#8b5cf6', emoji: '📊' },
};

const JOB_ZONES = [
  { zone: 1, desc: 'Peu ou pas de préparation' },
  { zone: 2, desc: 'Une certaine préparation' },
  { zone: 3, desc: 'Préparation modérée' },
  { zone: 4, desc: 'Bac+3/+5 nécessaire' },
  { zone: 5, desc: 'Doctorat / expertise extensive' },
];

function selectOnetQuestions(level: number) {
  if (level === 60) return ONET_QUESTIONS;
  const cats = ['R','I','A','S','E','C'];
  const perCat = level / 6;
  const result: typeof ONET_QUESTIONS = [];
  for (const cat of cats) {
    const qs = ONET_QUESTIONS.filter(q => q.cat === cat);
    const step = qs.length / perCat;
    for (let i = 0; i < perCat; i++) result.push(qs[Math.floor(i * step)]);
  }
  return result;
}

function OnetTest({ onComplete, onSkip }: { onComplete: (r: any) => void; onSkip?: () => void }) {
  const [step, setStep] = useState<'level'|'lang'|'test'|'results'|'extras'>('level');
  const [level, setLevel] = useState(0);
  const [lang, setLang] = useState<'fr'|'en'|'ar'>('fr');
  const [questions, setQuestions] = useState<typeof ONET_QUESTIONS>([]);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [cur, setCur] = useState(0);
  const [scores, setScores] = useState<Record<string,number>>({});
  const [jobZone, setJobZone] = useState(0);
  const [dreamUni, setDreamUni] = useState('');
  const [dreamJob, setDreamJob] = useState('');
  const [saving, setSaving] = useState(false);

  const LEVELS = [
    { n: 10, label: '⚡ Découverte',    time: '~3 min' },
    { n: 30, label: '🔍 Exploration',   time: '~5 min' },
    { n: 60, label: '🎯 Profil Complet',time: '~8 min' },
  ];
  const LANGS = [{ k: 'fr', label: 'Français', flag: '🇫🇷' },{ k: 'en', label: 'English', flag: '🇬🇧' },{ k: 'ar', label: 'العربية', flag: '🇲🇦' }];

  const startTest = (n: number) => {
    setLevel(n);
    setQuestions(selectOnetQuestions(n));
    setStep('lang');
  };

  const answer = (val: boolean) => {
    const q = questions[cur];
    const newAns = { ...answers, [q.id]: val };
    setAnswers(newAns);
    if (cur < questions.length - 1) {
      setCur(c => c + 1);
    } else {
      const sc: Record<string, number> = { R:0,I:0,A:0,S:0,E:0,C:0 };
      questions.forEach(qq => { if (newAns[qq.id]) sc[qq.cat]++; });
      setScores(sc);
      setStep('results');
    }
  };

  const getRanked = () => Object.entries(scores).sort((a,b) => b[1]-a[1]);

  const handleSave = async () => {
    setSaving(true);
    const ranked = getRanked();
    try {
      await apiFetch('/onet/save', { method: 'POST', body: JSON.stringify({
        testLevel: level, scores,
        primaryInterest: ranked[0]?.[0], secondaryInterest: ranked[1]?.[0], tertiaryInterest: ranked[2]?.[0],
        jobZone, dreamUni: dreamUni || null, dreamJob: dreamJob || null, language: lang,
      })});
      onComplete({ scores, ranked, jobZone, dreamUni, dreamJob });
    } catch { alert('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const box: React.CSSProperties = {
    background:'#fff', borderRadius:16, padding:32, maxWidth:540, margin:'0 auto',
    boxShadow:'0 4px 24px rgba(15,32,68,0.12)',
  };
  const wrap: React.CSSProperties = {
    minHeight:'100vh', background:'linear-gradient(135deg,#0f2044,#1a3a6e)',
    display:'flex', alignItems:'center', justifyContent:'center', padding:24,
  };

  if (step === 'level') return (
    <div style={wrap}>
      <div style={{ ...box, maxWidth:560 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:48 }}>🎯</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#0f2044', margin:'8px 0 4px' }}>Test O*NET</h2>
          <p style={{ color:'#64748b', fontSize:13 }}>Découvrez votre profil RIASEC pour construire votre parcours idéal.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
          {LEVELS.map(l => (
            <button key={l.n} onClick={() => startTest(l.n)} style={{
              padding:'16px 20px', borderRadius:12, border:'2px solid #e2e8f0', background:'#f8fafc',
              cursor:'pointer', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#7c3aed'; (e.currentTarget as HTMLElement).style.background='#f5f3ff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.background='#f8fafc'; }}>
              <div>
                <div style={{ fontWeight:700, fontSize:16, color:'#0f2044' }}>{l.label}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{l.n} questions</div>
              </div>
              <div style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>{l.time}</div>
            </button>
          ))}
        </div>
        {onSkip && <button onClick={onSkip} style={{ width:'100%', padding:10, background:'transparent', border:'1px solid #e2e8f0', borderRadius:8, color:'#94a3b8', fontSize:13, cursor:'pointer' }}>Plus tard →</button>}
      </div>
    </div>
  );

  if (step === 'lang') return (
    <div style={wrap}>
      <div style={box}>
        <h2 style={{ fontSize:18, fontWeight:800, color:'#0f2044', textAlign:'center', marginBottom:20 }}>Choisissez votre langue</h2>
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:24 }}>
          {LANGS.map(l => (
            <button key={l.k} onClick={() => setLang(l.k as any)} style={{
              padding:'14px 20px', borderRadius:12, border:`2px solid ${lang===l.k?'#7c3aed':'#e2e8f0'}`,
              background:lang===l.k?'#f5f3ff':'#f8fafc', cursor:'pointer', fontSize:15, fontWeight:lang===l.k?700:500,
            }}>{l.flag} {l.label}</button>
          ))}
        </div>
        <button onClick={() => setStep('test')} style={{ width:'100%', padding:12, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}>
          Commencer →
        </button>
      </div>
    </div>
  );

  if (step === 'test') {
    const q = questions[cur];
    const cat = CAT_INFO[q.cat];
    const progress = ((cur + 1) / questions.length) * 100;
    return (
      <div style={wrap} dir={lang==='ar'?'rtl':'ltr'}>
        <div style={box}>
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#64748b', marginBottom:6 }}>
              <span>{cur+1} / {questions.length}</span>
              <span style={{ color:cat.color, fontWeight:700 }}>{cat.emoji} {cat.fr}</span>
            </div>
            <div style={{ height:6, background:'#f1f5f9', borderRadius:999 }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius:999, transition:'width .3s' }} />
            </div>
          </div>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:12, color:'#94a3b8', marginBottom:10 }}>
              {lang==='ar'?'هل تودّ القيام بهذا؟':lang==='en'?'Would you like to do this activity?':'Aimeriez-vous faire cela ?'}
            </div>
            <p style={{ fontSize:20, fontWeight:700, color:'#0f2044', lineHeight:1.4, margin:0 }}>
              {(q as any)[lang] || q.fr}
            </p>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={() => answer(true)} style={{ flex:1, padding:14, borderRadius:12, border:'2px solid #10b981', background:'#f0fdf4', color:'#16a34a', fontWeight:700, fontSize:16, cursor:'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#10b981'; (e.currentTarget as HTMLElement).style.color='#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#f0fdf4'; (e.currentTarget as HTMLElement).style.color='#16a34a'; }}>
              {lang==='ar'?'✓ نعم':'✓ Oui'}
            </button>
            <button onClick={() => answer(false)} style={{ flex:1, padding:14, borderRadius:12, border:'2px solid #ef4444', background:'#fef2f2', color:'#dc2626', fontWeight:700, fontSize:16, cursor:'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#ef4444'; (e.currentTarget as HTMLElement).style.color='#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#fef2f2'; (e.currentTarget as HTMLElement).style.color='#dc2626'; }}>
              {lang==='ar'?'✗ لا':'✗ Non'}
            </button>
          </div>
          {cur > 0 && <button onClick={() => setCur(c=>c-1)} style={{ marginTop:12, width:'100%', padding:8, background:'transparent', border:'none', color:'#94a3b8', fontSize:12, cursor:'pointer' }}>← Question précédente</button>}
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const ranked = getRanked();
    const total = Math.round(level / 6);
    return (
      <div style={wrap}>
        <div style={{ ...box, maxWidth:560 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:40 }}>🎉</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0f2044', margin:'8px 0 4px' }}>Votre profil RIASEC</h2>
            <p style={{ color:'#64748b', fontSize:13 }}>Code : <strong style={{ color:'#7c3aed', fontSize:18 }}>{ranked[0]?.[0]}{ranked[1]?.[0]}{ranked[2]?.[0]}</strong></p>
          </div>
          <div style={{ marginBottom:20 }}>
            {ranked.map(([cat, score], i) => {
              const info = CAT_INFO[cat];
              const pct = total > 0 ? (score / total) * 100 : 0;
              return (
                <div key={cat} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                    <span style={{ fontWeight:i<3?700:500, color:i<3?info.color:'#94a3b8' }}>
                      {info.emoji} {info.fr}
                      {i===0&&<span style={{ fontSize:10, marginLeft:6, background:info.color, color:'#fff', padding:'1px 5px', borderRadius:4 }}>Primaire</span>}
                    </span>
                    <span style={{ color:'#64748b', fontSize:12 }}>{score}/{total}</span>
                  </div>
                  <div style={{ height:8, background:'#f1f5f9', borderRadius:999 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:info.color, borderRadius:999 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#0f2044', marginBottom:8 }}>Niveau d'études visé :</p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {JOB_ZONES.map(jz => (
                <button key={jz.zone} onClick={() => setJobZone(jz.zone)} style={{
                  padding:'9px 14px', borderRadius:8, border:`2px solid ${jobZone===jz.zone?'#7c3aed':'#e2e8f0'}`,
                  background:jobZone===jz.zone?'#f5f3ff':'#f8fafc', cursor:'pointer', textAlign:'left',
                  fontSize:13, fontWeight:jobZone===jz.zone?700:400, color:jobZone===jz.zone?'#0f2044':'#64748b',
                }}>
                  <strong>Zone {jz.zone}</strong> — {jz.desc}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep('extras')} disabled={!jobZone} style={{
            width:'100%', padding:12, background:jobZone?'linear-gradient(135deg,#7c3aed,#a855f7)':'#e2e8f0',
            color:jobZone?'#fff':'#94a3b8', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:jobZone?'pointer':'not-allowed',
          }}>Continuer →</button>
        </div>
      </div>
    );
  }

  if (step === 'extras') return (
    <div style={wrap}>
      <div style={box}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:36 }}>💭</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#0f2044', margin:'8px 0 4px' }}>Vos rêves (optionnel)</h2>
          <p style={{ color:'#64748b', fontSize:13 }}>Ces informations enrichiront votre roadmap IA.</p>
        </div>
        {[
          { label:'🎓 Université de rêve', val:dreamUni, set:setDreamUni, placeholder:'ENSA, UCA, Mohamed V...' },
          { label:'💼 Métier de rêve', val:dreamJob, set:setDreamJob, placeholder:'Ingénieur, Médecin, Architecte...' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:6 }}>{f.label}</label>
            <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, boxSizing:'border-box', outline:'none' }} />
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} style={{
          width:'100%', padding:13, background:saving?'#c4b5fd':'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff',
          border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:saving?'not-allowed':'pointer', marginBottom:8,
        }}>{saving?'Sauvegarde...':'✅ Terminer et sauvegarder'}</button>
        <button onClick={handleSave} disabled={saving} style={{ width:'100%', padding:9, background:'transparent', border:'none', color:'#94a3b8', fontSize:12, cursor:'pointer' }}>Passer et terminer →</button>
      </div>
    </div>
  );

  return null;
}

// ─── PASSWORD TAB ─────────────────────────────────────────────────────────────
function PasswordTab({ pw, setPw, pwMsg, pwLoading, onSubmit }: {
  pw: { current: string; next: string; confirm: string };
  setPw: React.Dispatch<React.SetStateAction<{ current: string; next: string; confirm: string }>>;
  pwMsg: { type: string; text: string } | null;
  pwLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) return (
    <div style={{ textAlign:'center', padding:'8px 0' }}>
      <div style={{ fontSize:36, marginBottom:10 }}>🔑</div>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:14 }}>Modifiez votre mot de passe de connexion.</p>
      <button
        onClick={() => setShowForm(true)}
        style={{ width:'100%', padding:10, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}
      >
        Changer le mot de passe
      </button>
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      {pwMsg && (
        <div style={{ marginBottom:10, padding:'8px 12px', borderRadius:8, fontSize:12, background:pwMsg.type==='success'?'#f0fdf4':'#fef2f2', color:pwMsg.type==='success'?'#16a34a':'#dc2626' }}>
          {pwMsg.text}
        </div>
      )}
      {[{k:'current',l:'Mot de passe actuel'},{k:'next',l:'Nouveau mot de passe'},{k:'confirm',l:'Confirmer'}].map(f => (
        <div key={f.k} style={{ marginBottom:10 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:4 }}>{f.l}</label>
          <input
            type="password"
            value={pw[f.k as keyof typeof pw]}
            onChange={e => setPw(p => ({...p, [f.k]: e.target.value}))}
            required
            placeholder="••••••••"
            style={{ width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' }}
          />
        </div>
      ))}
      <div style={{ display:'flex', gap:8 }}>
        <button type="button" onClick={() => setShowForm(false)} style={{ flex:1, padding:9, background:'#f1f5f9', color:'#64748b', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Annuler
        </button>
        <button type="submit" disabled={pwLoading} style={{ flex:2, padding:9, background:pwLoading?'#c4b5fd':'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:pwLoading?'not-allowed':'pointer' }}>
          {pwLoading ? 'Modification...' : 'Confirmer'}
        </button>
      </div>
    </form>
  );
}

// ─── PROFILE POPUP ────────────────────────────────────────────────────────────
function ProfilePopup({ user, onLogout, onRetakeOnet }: { user: User; onLogout: () => void; onRetakeOnet?: () => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('password');
  const [pw, setPw] = useState({ current:'', next:'', confirm:'' });
  const [pwMsg, setPwMsg] = useState<{ type:string; text:string }|null>(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [linkedEleve, setLinkedEleve] = useState<any>(null);
  const [linkMsg, setLinkMsg] = useState<{ type:string; text:string }|null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) {
      document.addEventListener('mousedown', handler);
      if (user.role === 'parent') {
        apiFetch('/auth/linked-student').then(r => setLinkedEleve(r.eleve)).catch(() => {});
      }
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open, user.role]);

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwMsg({ type:'error', text:'Les mots de passe ne correspondent pas' }); return; }
    if (pw.next.length < 6) { setPwMsg({ type:'error', text:'Au moins 6 caractères requis' }); return; }
    setPwLoading(true); setPwMsg(null);
    try {
      const r = await apiFetch('/auth/change-password', { method:'POST', body:JSON.stringify({ currentPassword:pw.current, newPassword:pw.next }) });
      setPwMsg({ type:'success', text: r.message });
      setPw({ current:'', next:'', confirm:'' });
    } catch(e: any) { setPwMsg({ type:'error', text:e.message }); }
    finally { setPwLoading(false); }
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkLoading(true); setLinkMsg(null);
    try {
      const r = await apiFetch('/auth/link-student', { method:'POST', body:JSON.stringify({ eleveEmail: studentEmail }) });
      setLinkMsg({ type:'success', text:r.message });
      setLinkedEleve(r.eleve);
      setStudentEmail('');
    } catch(e: any) { setLinkMsg({ type:'error', text:e.message }); }
    finally { setLinkLoading(false); }
  };

  const roleColors: Record<string,string> = { eleve:'#7c3aed', parent:'#059669', professeur:'#2563eb', admin:'#dc2626' };
  const roleLabels: Record<string,string> = { eleve:'Étudiant', parent:'Parent', professeur:'Professeur', admin:'Administrateur' };
  const initials = user.nom.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const tabs = [
    { k:'password', l:'🔑 Mot de passe' },
    ...(user.role==='parent'?[{ k:'student', l:'👦 Lier un élève' }]:[]),
    ...(user.role==='eleve'?[{ k:'onet', l:'🎯 O*NET' }]:[]),
  ];

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o=>!o)}
        style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:'6px 10px', borderRadius:10, transition:'background .2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
      >
        <div style={{
          width:36, height:36, borderRadius:'50%', background:roleColors[user.role]||'#7c3aed',
          display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13,
          border:'2px solid rgba(255,255,255,0.2)', flexShrink:0,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{user.nom}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>{roleLabels[user.role]}</div>
        </div>
        <span style={{ marginLeft:4, color:'rgba(255,255,255,0.4)', fontSize:12 }}>▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', left:0, zIndex:1000, background:'#fff',
          borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.18)', width:320, overflow:'hidden',
        }}>
          {/* Header */}
          <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#0f2044,#1a3a6e)', color:'#fff' }}>
            <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{user.nom}</p>
            <p style={{ margin:'2px 0 0', fontSize:12, opacity:.6 }}>{user.email}</p>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
            {tabs.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                flex:1, padding:'9px 4px', fontSize:11, fontWeight:600, border:'none', cursor:'pointer',
                background:tab===t.k?'#fff':'transparent', color:tab===t.k?'#0f2044':'#94a3b8',
                borderBottom:tab===t.k?'2px solid #7c3aed':'2px solid transparent',
              }}>{t.l}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:18 }}>
            {tab==='password' && (
              <PasswordTab pw={pw} setPw={setPw} pwMsg={pwMsg} pwLoading={pwLoading} onSubmit={handleChangePw} />
            )}

            {tab==='student' && (
              <div>
                {linkedEleve && (
                  <div style={{ background:'#f0fdf4', borderRadius:10, padding:12, marginBottom:14 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#16a34a', marginBottom:4, textTransform:'uppercase' }}>✅ Élève lié</p>
                    <p style={{ margin:0, fontWeight:700, color:'#0f2044', fontSize:14 }}>{linkedEleve.nom}</p>
                    <p style={{ margin:'2px 0 0', fontSize:12, color:'#64748b' }}>{linkedEleve.email}</p>
                  </div>
                )}
                {linkMsg && <div style={{ marginBottom:10, padding:'8px 12px', borderRadius:8, fontSize:12, background:linkMsg.type==='success'?'#f0fdf4':'#fef2f2', color:linkMsg.type==='success'?'#16a34a':'#dc2626' }}>{linkMsg.text}</div>}
                <form onSubmit={handleLink}>
                  <label style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:6 }}>Email de l'élève</label>
                  <input type="email" value={studentEmail} onChange={e=>setStudentEmail(e.target.value)} required placeholder="eleve@exemple.ma"
                    style={{ width:'100%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10 }} />
                  <button type="submit" disabled={linkLoading} style={{ width:'100%', padding:9, background:linkLoading?'#6ee7b7':'linear-gradient(135deg,#059669,#10b981)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:linkLoading?'not-allowed':'pointer' }}>
                    {linkLoading?'Recherche...':linkedEleve?"Changer l'élève lié":'Lier cet élève'}
                  </button>
                </form>
              </div>
            )}

            {tab==='onet' && (
              <div>
                <p style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>Repasser le test O*NET pour mettre à jour votre profil de carrière.</p>
                <button onClick={() => { setOpen(false); if(onRetakeOnet) onRetakeOnet(); }} style={{ width:'100%', padding:10, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  🎯 Repasser le test O*NET
                </button>
                <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:8 }}>Vos résultats précédents seront remplacés.</p>
              </div>
            )}
          </div>

          {/* Footer — logout */}
          <div style={{ borderTop:'1px solid #f1f5f9', padding:'12px 18px' }}>
            <button onClick={() => { setOpen(false); onLogout(); }} style={{ width:'100%', padding:8, background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const elevMenu = [
  { id: 'dashboard',     label: 'Tableau de bord',  icon: icons.dashboard },
  { id: 'profil',        label: 'Mon Profil O*NET',  icon: '🎯' },
  { id: 'notes',         label: 'Mes Notes',         icon: icons.notes },
  { id: 'exercices',     label: 'Exercices',         icon: icons.exercices },
  { id: 'roadmap',       label: 'Roadmap IA',        icon: icons.roadmap },
  { id: 'chatbot',       label: 'Assistant IA',      icon: icons.chatbot },
  { id: 'concours',      label: 'Concours',          icon: icons.concours },
  { id: 'annales',       label: 'Annales',           icon: icons.annales },
  { id: 'notifications', label: 'Notifications',     icon: icons.notifications },
  { id: 'actualites',    label: 'Actualités',          icon: '📰' },
];
const profMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'eleves', label: 'Élèves en difficulté', icon: icons.eleves },
  { id: 'exercices', label: 'Créer exercice', icon: icons.exercices },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications },
];
const adminMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'users', label: 'Utilisateurs', icon: icons.eleves },
  { id: 'concours', label: 'Concours', icon: icons.concours },
  { id: 'notifications', label: 'Envoyer notif', icon: icons.notifications },
];
const parentMenu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'suivi', label: 'Suivi de mon élève', icon: icons.notes },
];

function Sidebar({
  user, active, setActive, onLogout, mobile, onClose, onRetakeOnet,
}: {
  user: User; active: string; setActive: (s: string) => void;
  onLogout: () => void; mobile?: boolean; onClose?: () => void; onRetakeOnet?: () => void;
}) {
  const menu =
    user.role === 'eleve' ? elevMenu
    : user.role === 'professeur' ? profMenu
    : user.role === 'admin' ? adminMenu
    : parentMenu;

  const roleGradients: Record<string, string> = {
    eleve:      'linear-gradient(135deg,#7c3aed,#a855f7)',
    professeur: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    admin:      'linear-gradient(135deg,#be123c,#e11d48)',
    parent:     'linear-gradient(135deg,#047857,#10b981)',
  };

  const menuSections: Record<string, string> = {
    profil:'Orientation', notes:'Académique', roadmap:'Académique', chatbot:'Académique',
    exercices:'Académique', concours:'Ressources', annales:'Ressources',
    notifications:'Activité', actualites:'Actualités', eleves:'Gestion', users:'Gestion',
  };
  let lastSection = '';

  return (
    <div className="dash-sidebar" style={{ width: mobile ? '100%' : '260px' }}>
      <div className="dash-sidebar-logo">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:roleGradients[user.role], display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', flexShrink:0 }}>
              <span style={{ color:'#fff', fontWeight:900, fontSize:17 }}>M</span>
            </div>
            <span style={{ fontWeight:900, fontSize:17, color:'#fff', letterSpacing:'-0.01em' }}>
              My<span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Tawjeh</span>
            </span>
          </div>
          {mobile && onClose && (
            <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', padding:4 }}>×</button>
          )}
        </div>
      </div>

      <div className="dash-sidebar-profile">
        <ProfilePopup user={user} onLogout={onLogout} onRetakeOnet={onRetakeOnet} />
      </div>

      <nav className="dash-sidebar-nav">
        {menu.map((item) => {
          const section = menuSections[item.id] || '';
          const showSection = section && section !== lastSection;
          if (showSection) lastSection = section;
          return (
            <div key={item.id}>
              {showSection && <div className="dash-nav-section">{section}</div>}
              <button onClick={() => { setActive(item.id); onClose?.(); }} className={`dash-nav-item ${active === item.id ? 'active' : ''}`}>
                <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
                <span>{item.label}</span>
                {active === item.id && <span className="nav-dot" />}
              </button>
            </div>
          );
        })}
      </nav>

      <div style={{ padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.05)', position:'relative', zIndex:1 }}>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.18)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>MyTawjeh AI · v2.0</p>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title, subtitle, onMenuClick, notifCount }: {
  title: string; subtitle?: string; onMenuClick: () => void; notifCount?: number;
}) {
  return (
    <div className="dash-header">
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onMenuClick} className="lg:hidden" style={{ width:36, height:36, borderRadius:10, background:'#f5f3ff', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed' }}>
          ☰
        </button>
        <div>
          <h1 className="dash-header-title">{title}</h1>
          {subtitle && <p className="dash-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {notifCount !== undefined && notifCount > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:999, background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.08))', border:'1px solid rgba(124,58,237,0.15)' }}>
            <span style={{ fontSize:13 }}>🔔</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#7c3aed' }}>{notifCount} non lue{notifCount > 1 ? 's' : ''}</span>
          </div>
        )}
        <div style={{ width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#34d399)', boxShadow:'0 0 8px rgba(16,185,129,0.5)' }} title="Connecté" />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  const bgMap: Record<string, string> = {
    'bg-violet-50 text-violet-600':  'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.06))',
    'bg-blue-50 text-blue-600':      'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(59,130,246,0.05))',
    'bg-emerald-50 text-emerald-600':'linear-gradient(135deg,rgba(4,120,87,0.1),rgba(16,185,129,0.05))',
    'bg-rose-50 text-rose-600':      'linear-gradient(135deg,rgba(190,18,60,0.1),rgba(225,29,72,0.05))',
    'bg-amber-50 text-amber-600':    'linear-gradient(135deg,rgba(180,83,9,0.1),rgba(245,158,11,0.05))',
    'bg-purple-50 text-purple-600':  'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))',
  };
  const iconBg = bgMap[color] || 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))';
  return (
    <div className="dash-stat">
      <div className="dash-stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}

// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function NotesPage({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });

  useEffect(() => {
    apiFetch(`/eleves/${user.id}/notes`).then(setNotes).finally(() => setLoading(false));
  }, [user.id]);

  const moyenneGenerale = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(2)
    : '—';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const note = await apiFetch('/notes', {
      method: 'POST',
      body: JSON.stringify({ ...form, valeur: parseFloat(form.valeur), coefficient: parseFloat(form.coefficient), eleveId: user.id }),
    });
    setNotes([note, ...notes]);
    setShowForm(false);
    setForm({ matiere: '', valeur: '', coefficient: '1', periode: 'S1', type: 'Contrôle' });
  };

  const deleteNote = async (id: number) => {
    await apiFetch(`/notes/${id}`, { method: 'DELETE' });
    setNotes(notes.filter((n) => n.id !== id));
  };

  const colorVal = (v: number) =>
    v >= 14 ? 'text-emerald-600 bg-emerald-50' : v >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50';

  return (
    <div className="">
      {notes.length >= 2 && <div className="mb-6"><NotesEvolutionChart notes={notes} /></div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Mes Notes</h2>
          <p className="text-sm text-gray-400">Moyenne générale : <span className="font-bold text-violet-700">{moyenneGenerale}</span></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="dash-btn dash-btn-primary">
          <span>+</span> Ajouter une note
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
          <h3 className="text-sm font-bold text-gray-700 mb-4">Nouvelle note</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input required placeholder="Matière" value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input required type="number" min="0" max="20" step="0.25" placeholder="Note /20" value={form.valeur} onChange={(e) => setForm({ ...form, valeur: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <input type="number" min="1" max="5" step="0.5" placeholder="Coefficient" value={form.coefficient} onChange={(e) => setForm({ ...form, coefficient: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none" />
            <select value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>S1</option><option>S2</option><option>Annuel</option>
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option>Contrôle</option><option>Devoir</option><option>Examen</option><option>TP</option>
            </select>
            <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 font-medium">Aucune note enregistrée</p>
          <p className="text-sm text-gray-300 mt-1">Commencez par ajouter votre première note</p>
        </div>
      ) : (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Coeff.</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Période</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">{note.matiere}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${colorVal(note.valeur)}`}>
                      {note.valeur}/20
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{note.coefficient}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{note.periode}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">{note.type}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => deleteNote(note.id)} className="text-gray-300 hover:text-rose-500 transition-colors text-lg">{icons.close}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CHATBOT PAGE ─────────────────────────────────────────────────────────────
function ChatbotPage({ user }: { user: User }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Bonjour ${user.nom} ! 👋 Je suis Mowajih AI, votre assistant d'orientation personnalisé. Je connais votre profil, vos notes et vos intérêts. Comment puis-je vous aider ?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Quelle CPGE me conseilles-tu ?',
    'Comment améliorer mes maths ?',
    'Quels concours dois-je préparer ?',
    'Quel métier correspond à mon profil ?',
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      // Send full history for conversation memory
      const history = newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const data = await apiFetch('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: msg, eleveId: user.id, history }),
      });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Désolé, une erreur s'est produite. Vérifiez votre connexion et réessayez." }]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 130px)' }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 0', display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', gap:10, flexDirection: msg.role==='user'?'row-reverse':'row', padding:'0 4px' }}>
            <div style={{
              width:32, height:32, borderRadius:10, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, fontWeight:700, background: msg.role==='assistant' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9',
              color: msg.role==='assistant' ? '#fff' : '#64748b',
            }}>
              {msg.role === 'assistant' ? '🤖' : user.nom.charAt(0).toUpperCase()}
            </div>
            <div style={{
              maxWidth:'75%', padding:'12px 16px', borderRadius: msg.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              fontSize:13.5, lineHeight:1.6, whiteSpace:'pre-wrap',
              background: msg.role==='user' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#fff',
              color: msg.role==='user' ? '#fff' : '#1e293b',
              boxShadow: msg.role==='user' ? '0 4px 12px rgba(124,58,237,0.3)' : '0 2px 8px rgba(15,12,41,0.06)',
              border: msg.role==='assistant' ? '1px solid rgba(139,92,246,0.1)' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Suggestion chips — only on first load */}
        {showSuggestions && (
          <div style={{ padding:'0 4px' }}>
            <p style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Suggestions</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding:'7px 14px', borderRadius:999, fontSize:12.5, fontWeight:600, cursor:'pointer',
                  background:'rgba(124,58,237,0.08)', color:'#7c3aed', border:'1px solid rgba(124,58,237,0.2)',
                  transition:'all .15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display:'flex', gap:10, padding:'0 4px' }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>🤖</div>
            <div style={{ background:'#fff', borderRadius:'18px 18px 18px 4px', padding:'14px 18px', border:'1px solid rgba(139,92,246,0.1)', display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#c4b5fd', display:'inline-block', animation:'bounce 1s infinite' }} />
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#a78bfa', display:'inline-block', animation:'bounce 1s infinite', animationDelay:'150ms' }} />
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#7c3aed', display:'inline-block', animation:'bounce 1s infinite', animationDelay:'300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'16px 0 0', borderTop:'1px solid rgba(139,92,246,0.08)' }}>
        <div style={{ display:'flex', gap:10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Posez votre question à Mowajih AI..."
            style={{ flex:1, padding:'12px 16px', borderRadius:12, border:'1.5px solid #e2e8f0', fontSize:13.5, outline:'none', background:'#faf9ff', fontFamily:'inherit' }}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width:44, height:44, borderRadius:12, border:'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#e2e8f0',
              color: input.trim() && !loading ? '#fff' : '#94a3b8',
              fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              transition:'all .2s', boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ fontSize:11, color:'#94a3b8', marginTop:8, textAlign:'center' }}>
          Mowajih AI se souvient de votre conversation · Contexte personnalisé selon votre profil
        </p>
      </div>
    </div>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user }: { user: User }) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    apiFetch(`/roadmap/${user.id}`)
      .then((r) => {
        if (r?.parcours) {
          try { setRoadmap(JSON.parse(r.parcours)); }
          catch { setFetchError('Roadmap corrompu. Régénérez-en un nouveau.'); }
        }
      })
      .catch(() => setFetchError('Impossible de charger le roadmap.'))
      .finally(() => setFetching(false));
  }, [user.id]);

  const generate = async () => {
    setLoading(true);
    setGenerateError('');
    try {
      const data = await apiFetch('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ eleveId: user.id }),
      });
      if (data.result) setRoadmap(data.result);
    } catch (e: any) {
      setGenerateError("Erreur lors de la génération. Vérifiez votre clé OpenAI dans le .env du serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div className="dash-skeleton" style={{ height:80, borderRadius:14 }} />
      {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:100, borderRadius:14 }} />)}
    </div>
  );

  if (fetchError) return (
    <div className="dash-empty" style={{ background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'60px 32px' }}>
      <div className="dash-empty-icon">⚠️</div>
      <p className="dash-empty-title">{fetchError}</p>
      <button onClick={generate} className="dash-btn dash-btn-primary" style={{ marginTop:16 }}>✨ Générer un nouveau roadmap</button>
    </div>
  );

  return (
    <div>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="dash-hero" style={{ background:'linear-gradient(135deg,#0f0c29,#302b63)', textAlign:'center', padding:'32px' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', border:'4px solid rgba(167,139,250,0.3)', borderTopColor:'#a78bfa', animation:'spin 1s linear infinite', margin:'0 auto 14px' }} />
            <p style={{ color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:15, margin:0 }}>Analyse IA en cours...</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:6 }}>Notes · Profil RIASEC · Objectifs · ~15 secondes</p>
          </div>
          {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:90, borderRadius:14 }} />)}
        </div>
      ) : !roadmap ? (
        <div className="dash-empty" style={{ background:'rgba(255,255,255,0.9)', borderRadius:20, padding:'60px 32px', textAlign:'center' }}>
          <div className="dash-empty-icon">🧭</div>
          <p className="dash-empty-title">Aucun roadmap généré</p>
          <p className="dash-empty-desc">L'IA analysera vos notes, votre profil RIASEC et vos objectifs pour créer un parcours personnalisé.</p>
          {generateError && (
            <div style={{ margin:'16px auto', padding:'10px 16px', borderRadius:10, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:13, maxWidth:380 }}>
              {generateError}
            </div>
          )}
          <button onClick={generate} className="dash-btn dash-btn-primary" style={{ marginTop:16, padding:'11px 24px', fontSize:14 }}>
            ✨ Générer mon roadmap IA
          </button>
        </div>
      ) : (
        <>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0 }}>Roadmap Professionnel IA</h2>
            <p style={{ fontSize:12, color:'#94a3b8', marginTop:3 }}>Généré selon votre profil, vos notes et vos intérêts</p>
          </div>
          <button onClick={() => { if(window.confirm('Régénérer votre roadmap ? Le roadmap actuel sera remplacé.')) generate(); }}
            style={{ fontSize:12, color:'#7c3aed', fontWeight:700, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
            🔄 Régénérer
          </button>
        </div>
        <div className="space-y-4">
          {/* Métier */}
          <div className="dash-card p-6" style={{borderColor:"rgba(124,58,237,0.15)"}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🎯</div>
              <div>
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">Métier recommandé</div>
                <div className="text-xl font-black text-gray-900">{roadmap.metier}</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{roadmap.description}</p>
          </div>

          {/* Étapes */}
          {roadmap.etapes?.length > 0 && (
            <div className="dash-card p-6">
              <h3 className="dash-section-title">Étapes du parcours</h3>
              <div className="space-y-3">
                {roadmap.etapes.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{i + 1}</div>
                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Universities */}
          {roadmap.universites?.length > 0 && (
            <div className="dash-card p-5" style={{borderColor:"rgba(59,130,246,0.15)"}}>
              <h3 className="dash-section-title">🎓 Universités recommandées</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.universites.map((u: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{u}</span>
                ))}
              </div>
            </div>
          )}

          {/* Alertes */}
          {roadmap.alertes?.length > 0 && roadmap.alertes[0] !== '' && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
              <h3 className="text-sm font-bold text-amber-700 mb-3 uppercase tracking-wider">⚠️ Points d'attention</h3>
              <ul className="space-y-1.5">
                {roadmap.alertes.map((a: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2"><span className="flex-shrink-0">•</span>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Matières clés + Conseils */}
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.matieresCles?.length > 0 && (
              <div className="dash-card p-5">
                <h3 className="dash-section-title">Matières clés</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.matieresCles.map((m: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {roadmap.conseils && (
              <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
                <h3 className="dash-section-title">💡 Conseils</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{roadmap.conseils}</p>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}

// ─── EXERCICES PAGE ───────────────────────────────────────────────────────────
function ExercicesPage({ user }: { user: User }) {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [selected, setSelected] = useState<Exercice | null>(null);
  const [reponse, setReponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string; correction: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterMatiere, setFilterMatiere] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');

  const matieres = [...new Set(exercices.map(e => e.matiere))];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterMatiere) params.set('matiere', filterMatiere);
    if (filterDiff) params.set('difficulte', filterDiff);
    if (filterNiveau) params.set('niveau', filterNiveau);
    apiFetch(`/exercices?${params}`)
      .then(data => setExercices(Array.isArray(data) ? data : []))
      .catch(() => setExercices([]))
      .finally(() => setLoading(false));
  }, [filterMatiere, filterDiff, filterNiveau]);

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const data = await apiFetch(`/exercices/${selected.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ reponse, eleveId: user.id }),
      });
      setResult({ score: data.score, feedback: data.feedback, correction: data.correction });
      setSubmitted(true);
    } catch (e: any) {
      alert('Erreur: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const diffColor = (d: string) =>
    d === 'Facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : d === 'Moyen' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div>
      {selected ? (
        <div>
          <button onClick={() => { setSelected(null); setSubmitted(false); setReponse(''); setResult(null); }}
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#7c3aed', fontWeight:600, background:'none', border:'none', cursor:'pointer', marginBottom:20, padding:0 }}>
            ← Retour aux exercices
          </button>
          <div className="dash-card p-6">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(selected.difficulte)}`}>{selected.difficulte}</span>
              <span style={{ fontSize:13, color:'#94a3b8' }}>{selected.matiere} · {selected.niveau}</span>
            </div>

            <div style={{ background:'#f8f7ff', borderRadius:12, padding:16, marginBottom:20, fontSize:14, color:'#334155', lineHeight:1.7, whiteSpace:'pre-wrap', border:'1px solid rgba(124,58,237,0.08)' }}>
              {selected.contenu}
            </div>

            {!submitted ? (
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>
                  Votre réponse — l'IA corrigera automatiquement
                </label>
                <textarea
                  value={reponse}
                  onChange={e => setReponse(e.target.value)}
                  placeholder="Écrivez votre réponse ici... L'IA l'analysera et vous donnera un score et des conseils."
                  rows={5}
                  className="dash-input"
                  style={{ resize:'vertical', marginBottom:14 }}
                />
                <button onClick={submit} disabled={!reponse.trim() || submitting} className="dash-btn dash-btn-primary" style={{ width:'100%', justifyContent:'center', padding:'11px', fontSize:14 }}>
                  {submitting ? '🤖 Correction IA en cours...' : '✅ Soumettre ma réponse'}
                </button>
              </div>
            ) : result ? (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Score */}
                <div style={{
                  display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                  borderRadius:14, background: result.score >= 14 ? '#f0fdf4' : result.score >= 10 ? '#eff6ff' : '#fef2f2',
                  border: `1px solid ${result.score >= 14 ? '#bbf7d0' : result.score >= 10 ? '#bfdbfe' : '#fecaca'}`,
                }}>
                  <div style={{ fontSize:36, fontWeight:900, color: result.score >= 14 ? '#16a34a' : result.score >= 10 ? '#1d4ed8' : '#dc2626' }}>
                    {result.score}<span style={{ fontSize:16, opacity:.6 }}>/20</span>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#334155', marginBottom:4 }}>Score attribué par l'IA</p>
                    <p style={{ fontSize:13, color:'#64748b', lineHeight:1.5 }}>{result.feedback}</p>
                  </div>
                </div>

                {/* Correction */}
                {result.correction && (
                  <div style={{ background:'#f8f7ff', borderRadius:12, padding:16, border:'1px solid rgba(124,58,237,0.12)' }}>
                    <p style={{ fontSize:11, fontWeight:800, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Correction officielle</p>
                    <p style={{ fontSize:13.5, color:'#334155', lineHeight:1.7 }}>{result.correction}</p>
                  </div>
                )}

                <button onClick={() => { setSubmitted(false); setReponse(''); setResult(null); }} className="dash-btn dash-btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
                  Réessayer cet exercice
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
            <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0, marginRight:8 }}>Exercices</h2>
            <select value={filterMatiere} onChange={e => setFilterMatiere(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Toutes matières</option>
              {matieres.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Toutes difficultés</option>
              {['facile','moyen','difficile'].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
            </select>
            <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)} className="dash-input" style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
              <option value="">Tous niveaux</option>
              {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(n => <option key={n}>{n}</option>)}
            </select>
            {(filterMatiere||filterDiff||filterNiveau) && (
              <button onClick={() => { setFilterMatiere(''); setFilterDiff(''); setFilterNiveau(''); }} style={{ fontSize:12, color:'#94a3b8', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>✕ Réinitialiser</button>
            )}
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
              {[1,2,3,4,5,6].map(i => <div key={i} className="dash-skeleton" style={{ height:120, borderRadius:14 }} />)}
            </div>
          ) : exercices.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">📝</div>
              <p className="dash-empty-title">Aucun exercice disponible</p>
              <p className="dash-empty-desc">Essayez de modifier les filtres ou revenez plus tard.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
              {exercices.map(ex => (
                <button key={ex.id} onClick={() => { setSelected(ex); setSubmitted(false); setReponse(''); setResult(null); }}
                  className="dash-card p-5 text-left cursor-pointer" style={{ width:'100%' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(ex.difficulte)}`}>{ex.difficulte}</span>
                    <span style={{ fontSize:11, color:'#94a3b8' }}>{ex.niveau}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0f0c29', marginBottom:6 }}>{ex.matiere}</div>
                  <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {ex.contenu.substring(0, 100)}...
                  </p>
                  <div style={{ marginTop:12, fontSize:11, color:'#7c3aed', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                    🤖 Correction IA automatique
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CONCOURS PAGE ────────────────────────────────────────────────────────────
function ConcoursPage() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [annales, setAnnales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'concours'|'annales'>('concours');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    Promise.all([apiFetch('/concours'), apiFetch('/annales')])
      .then(([c, a]) => { setConcours(Array.isArray(c)?c:[]); setAnnales(Array.isArray(a)?a:[]); })
      .catch(() => {})
      .finally(() => setLoading(false));
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const getCountdown = (dateStr: string) => {
    const target = new Date(dateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { label: 'Passé', color: '#94a3b8', urgent: false };
    const days = Math.ceil(diff / 86400000);
    if (days <= 7)  return { label: `${days}j restant${days>1?'s':''}`, color: '#dc2626', urgent: true };
    if (days <= 30) return { label: `${days} jours`, color: '#f59e0b', urgent: false };
    if (days <= 90) return { label: `${days} jours`, color: '#7c3aed', urgent: false };
    return { label: `~${Math.floor(days/30)} mois`, color: '#10b981', urgent: false };
  };

  return (
    <div>
      <div className="dash-tabs">
        {[['concours','🏆 Concours'],['annales','📚 Annales']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`dash-tab ${tab===k?'active':''}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {[1,2,3].map(i => <div key={i} className="dash-skeleton" style={{ height:110, borderRadius:14 }} />)}
        </div>
      ) : tab === 'concours' ? (
        concours.length === 0 ? (
          <div className="dash-empty"><div className="dash-empty-icon">🏆</div><p className="dash-empty-title">Aucun concours disponible</p></div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {concours.map(c => {
              const cd = getCountdown(c.dateConcours || c.datw || '');
              return (
                <div key={c.id} className="dash-card p-5">
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🏆</div>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontWeight:800, color:'#0f0c29', fontSize:15, marginBottom:6 }}>{c.nom}</h3>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, color:'#64748b' }}>
                          📅 {c.dateConcours ? new Date(c.dateConcours).toLocaleDateString('fr-FR') : c.datw}
                        </span>
                        <span style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>Seuil: {c.seuil}/20</span>
                      </div>
                    </div>
                  </div>
                  {/* Countdown badge */}
                  <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{
                      fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:999,
                      background: cd.urgent ? '#fef2f2' : '#f8f7ff',
                      color: cd.color,
                      border: `1px solid ${cd.urgent ? '#fecaca' : 'rgba(124,58,237,0.15)'}`,
                      animation: cd.urgent ? 'pulse 2s infinite' : 'none',
                    }}>
                      ⏱ {cd.label}
                    </span>
                    {c.lien && (
                      <a href={c.lien} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#7c3aed', fontWeight:600, textDecoration:'none' }}>
                        En savoir plus →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        annales.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">📚</div>
            <p className="dash-empty-title">Aucune annale disponible</p>
            <p className="dash-empty-desc">Les annales seront ajoutées par l'administration prochainement.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {annales.map((a: any) => (
              <div key={a.id} className="dash-card p-5">
                <div style={{ fontSize:32, marginBottom:10 }}>📄</div>
                <h3 style={{ fontWeight:800, color:'#0f0c29', fontSize:14, marginBottom:4 }}>{a.titre || a.nom}</h3>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>{a.annee} · {a.matiere || a.concours}</div>
                {a.fichier ? (
                  <a href={a.fichier} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px', borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                    📥 Télécharger le PDF
                  </a>
                ) : (
                  <div style={{ padding:'8px', borderRadius:8, background:'#f8f7ff', color:'#94a3b8', fontSize:12, textAlign:'center', border:'1px dashed #e2e8f0' }}>
                    Fichier non disponible
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ user }: { user: User }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/notifications/${user.id}`)
      .then(data => setNotifs(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger les notifications.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const markRead = async (id: number) => {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifs.filter(n => !n.lu);
    await Promise.all(unread.map(n => apiFetch(`/notifications/${n.id}/read`, { method: 'PATCH' })));
    setNotifs(notifs.map(n => ({ ...n, lu: true })));
  };

  const typeIcon: Record<string, string> = { note:'📊', revision:'📝', info:'ℹ️', success:'✅' };
  const typeColor: Record<string, string> = { note:'rgba(29,78,216,0.08)', revision:'rgba(124,58,237,0.08)', info:'rgba(15,118,110,0.06)', success:'rgba(16,185,129,0.08)' };
  const unreadCount = notifs.filter(n => !n.lu).length;

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ display:'flex', gap:14, padding:'16px 20px', borderRadius:14, background:'rgba(255,255,255,0.9)' }}>
          <div className="dash-skeleton" style={{ width:40, height:40, borderRadius:10, flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:8, width:'80%' }} />
            <div className="dash-skeleton" style={{ height:11, borderRadius:6, width:'40%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="dash-empty">
      <div className="dash-empty-icon">⚠️</div>
      <p className="dash-empty-title">{error}</p>
      <button onClick={() => window.location.reload()} className="dash-btn dash-btn-primary" style={{ marginTop:16 }}>Réessayer</button>
    </div>
  );

  return (
    <div>
      {/* Header with mark all read */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:'#0f0c29', margin:0 }}>Notifications</h2>
          {unreadCount > 0 && (
            <span style={{ padding:'2px 10px', borderRadius:999, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff', fontSize:11, fontWeight:700 }}>
              {unreadCount} non lue{unreadCount>1?'s':''}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ fontSize:12, color:'#7c3aed', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🔔</div>
          <p className="dash-empty-title">Tout est à jour !</p>
          <p className="dash-empty-desc">Vous n'avez aucune notification pour l'instant.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {notifs.map(n => (
            <div key={n.id} style={{
              display:'flex', alignItems:'flex-start', gap:14,
              padding:'16px 18px', borderRadius:14,
              background: n.lu ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
              border: n.lu ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(124,58,237,0.18)',
              boxShadow: n.lu ? 'none' : '0 2px 12px rgba(124,58,237,0.08)',
              opacity: n.lu ? 0.65 : 1,
              transition: 'all .2s',
            }}>
              <div style={{ width:40, height:40, borderRadius:10, background: typeColor[n.type] || '#f8f7ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {typeIcon[n.type] || '🔔'}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13.5, lineHeight:1.6, color: n.lu ? '#64748b' : '#0f0c29', fontWeight: n.lu ? 400 : 600, margin:0 }}>
                  {n.contenu}
                </p>
                <p style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>
                  {new Date(n.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
              {!n.lu && (
                <button onClick={() => markRead(n.id)} style={{ fontSize:11, color:'#7c3aed', fontWeight:700, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:6, padding:'4px 10px', cursor:'pointer', flexShrink:0 }}>
                  ✓ Lu
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ELEVE DASHBOARD ──────────────────────────────────────────────────────────
function EleveDashboard({ user, setActive, onRetakeOnet }: { user: User; setActive: (s: string) => void; onRetakeOnet?: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showOnetPrompt, setShowOnetPrompt] = useState(false);
  const [onetProfile, setOnetProfile] = useState<any>(null);

  useEffect(() => {
    apiFetch(`/eleves/${user.id}/notes`).then(setNotes).catch(() => {});
    apiFetch(`/notifications/${user.id}`).then((ns: Notification[]) => setNotifCount(ns.filter((n) => !n.lu).length)).catch(() => {});
    // Check O*NET profile
    apiFetch('/onet/profile')
      .then(r => {
        setOnetProfile(r.profil);
        if (!r.profil) setTimeout(() => setShowOnetPrompt(true), 800);
      })
      .catch(() => setTimeout(() => setShowOnetPrompt(true), 800));
  }, [user.id]);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  const [exercicesDone, setExercicesDone] = useState(0);

  useEffect(() => {
    apiFetch(`/exercices/resultats/${user.id}`)
      .then((r: any[]) => setExercicesDone(Array.isArray(r) ? r.length : 0))
      .catch(() => {});
  }, [user.id]);

  const quick = [
    { id: 'notes',     icon: icons.notes,     label: 'Mes notes',    desc: `${notes.length} note${notes.length!==1?'s':''} enregistrée${notes.length!==1?'s':''}`, color:'#7c3aed' },
    { id: 'roadmap',   icon: icons.roadmap,   label: 'Roadmap IA',   desc: 'Générer mon parcours', color:'#2563eb' },
    { id: 'chatbot',   icon: icons.chatbot,   label: 'Assistant IA', desc: 'Posez une question', color:'#059669' },
    { id: 'exercices', icon: icons.exercices, label: 'Exercices',    desc: `${exercicesDone} fait${exercicesDone!==1?'s':''}`, color:'#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* O*NET prompt popup */}
      {showOnetPrompt && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,32,68,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(15,32,68,0.25)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#0f2044', margin:'0 0 8px' }}>Découvrez votre profil de carrière !</h3>
            <p style={{ color:'#64748b', fontSize:14, lineHeight:1.6, margin:'0 0 20px' }}>
              Passez le test O*NET pour obtenir votre <strong>roadmap personnalisée par IA</strong> basée sur vos intérêts.
            </p>
            <button onClick={() => { setShowOnetPrompt(false); if(onRetakeOnet) onRetakeOnet(); }} style={{
              width:'100%', padding:12, background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff',
              border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:10,
            }}>Commencer le test maintenant</button>
            <button onClick={() => setShowOnetPrompt(false)} style={{ width:'100%', padding:10, background:'transparent', border:'1px solid #e2e8f0', borderRadius:10, fontSize:13, color:'#94a3b8', cursor:'pointer' }}>
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#a78bfa,transparent)' }} />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium mb-1">Bonjour 👋</p>
          <h2 className="text-2xl font-black mb-1">{user.nom}</h2>
          <p className="text-white/60 text-sm">{user.filiere || 'Filière non définie'} · {user.niveau || ''}</p>
          {onetProfile && (
            <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px', fontSize:12 }}>
              <span>🎯</span>
              <span style={{ fontWeight:700 }}>Profil : {onetProfile.primaryInterest} · {onetProfile.secondaryInterest} · {onetProfile.tertiaryInterest}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <StatCard icon="📊" label="Moyenne générale" value={notes.length ? `${moyenne}/20` : '—'} color="bg-violet-50 text-violet-600" />
        <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="✅" label="Exercices faits" value={exercicesDone} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon="🔔" label="Non lues" value={notifCount > 0 ? notifCount : '✓'} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="dash-section-title">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quick.map((q) => (
            <button key={q.id} onClick={() => setActive(q.id)}
              className="dash-card p-4 text-left cursor-pointer" style={{ borderTop: `3px solid ${q.color}` }}>
              <span style={{ fontSize:22, display:'block', marginBottom:8 }}>{q.icon}</span>
              <div style={{ fontSize:13, fontWeight:800, color:'#0f0c29', marginBottom:3 }}>{q.label}</div>
              <div style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}>{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent notes */}
      {notes.length > 0 && (
        <div>
          <h3 className="dash-section-title">Dernières notes</h3>
          <div className="dash-card-flat overflow-hidden">
            {notes.slice(0, 4).map((note, i) => (
              <div key={note.id} className={`flex items-center justify-between px-5 py-3.5 ${i < notes.slice(0, 4).length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-800">{note.matiere}</span>
                <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${note.valeur >= 14 ? 'text-emerald-600 bg-emerald-50' : note.valeur >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                  {note.valeur}/20
                </span>
              </div>
            ))}
            <button onClick={() => setActive('notes')} className="w-full text-center py-3 text-xs text-violet-600 font-bold hover:bg-violet-50 transition-colors">
              Voir toutes les notes →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROF DASHBOARD ───────────────────────────────────────────────────────────
function ProfDashboard({ user }: { user: User }) {
  const [eleves, setEleves] = useState<any[]>([]);
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('eleves');
  const [form, setForm] = useState({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch('/prof/eleves-faibles'),
      apiFetch('/prof/stats'),
    ]).then(([el, st]) => {
      setEleves(Array.isArray(el) ? el : []);
      setResultats(Array.isArray(st.resultats) ? st.resultats : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const createEx = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiFetch('/exercices', { method: 'POST', body: JSON.stringify(form) });
      setFormMsg('✅ Exercice créé avec succès !');
      setForm({ matiere: '', niveau: 'Terminale (2ème Bac)', difficulte: 'moyen', contenu: '', correction: '' });
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || 'Erreur'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Tableau de bord</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Professeur · {(user as any).specialite || user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <StatCard icon="👥" label="En difficulté" value={eleves.length} color="bg-rose-50 text-rose-600" />
        <StatCard icon="📊" label="Soumissions reçues" value={resultats.length} color="bg-violet-50 text-violet-600" />
        <StatCard icon="⚠️" label="Sous 10/20" value={eleves.filter(e => parseFloat(e.moyenne) < 10).length} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[['eleves','👥 Élèves en difficulté'],['resultats','📊 Soumissions'],['creer','➕ Créer un exercice']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab===k ? 'active' : ''}`}
            style={tab===k ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {/* Élèves */}
      {tab === 'eleves' && (
        loading ? (
          <div className="text-center py-10"><div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" /></div>
        ) : eleves.length === 0 ? (
          <div className="dash-card dash-empty">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Tous les élèves sont en bonne progression</p>
          </div>
        ) : (
          <div className="dash-card-flat overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase grid grid-cols-4 gap-2">
              <span>Élève</span><span>Niveau</span><span>Filière</span><span className="text-right">Moyenne</span>
            </div>
            {eleves.map((e: any, i: number) => (
              <div key={i} className={`grid grid-cols-4 gap-2 items-center px-5 py-4 ${i < eleves.length-1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">{e.email}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{e.niveau || '—'}</span>
                <span className="text-xs text-gray-500">{e.filiere || '—'}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black text-right ml-auto block w-fit ${parseFloat(e.moyenne) < 10 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {e.moyenne ? `${e.moyenne}/20` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Soumissions */}
      {tab === 'resultats' && (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Élève</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Exercice</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resultats.map((r: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-semibold text-gray-800">{r.eleveName || '—'}</div>
                    <div className="text-xs text-gray-400">{r.eleveEmail}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-xs font-bold text-gray-600">{r.exMatiere}</div>
                    <div className="text-xs text-gray-400">{r.exContenu}...</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${parseFloat(r.score) >= 14 ? 'text-emerald-600 bg-emerald-50' : parseFloat(r.score) >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                      {r.score}/20
                    </span>
                  </td>
                </tr>
              ))}
              {!resultats.length && (
                <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">Aucune soumission reçue pour l'instant</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Créer exercice */}
      {tab === 'creer' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Nouvel exercice</h3>
          {formMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${formMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{formMsg}</div>
          )}
          <form onSubmit={createEx} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Matière *</label>
              <input value={form.matiere} onChange={e => setForm(p => ({...p, matiere: e.target.value}))} required placeholder="Mathématiques"
                className="dash-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Niveau</label>
                <select value={form.niveau} onChange={e => setForm(p => ({...p, niveau: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['Tronc commun','1ère Bac','Terminale (2ème Bac)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Difficulté</label>
                <select value={form.difficulte} onChange={e => setForm(p => ({...p, difficulte: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {['facile','moyen','difficile'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Énoncé *</label>
              <textarea value={form.contenu} onChange={e => setForm(p => ({...p, contenu: e.target.value}))} required rows={4} placeholder="Contenu de l'exercice..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Correction</label>
              <textarea value={form.correction} onChange={e => setForm(p => ({...p, correction: e.target.value}))} rows={3} placeholder="Correction détaillée..."
                className="dash-input" style={{resize:'none'}} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              Créer l'exercice
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user }: { user: User }) {
  const [data, setData] = useState<{ eleves: any[]; profs: any[]; parents: any[] }>({ eleves: [], profs: [], parents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifForm, setNotifForm] = useState({ contenu: '', type: 'info', eleveId: '' });
  const [notifMsg, setNotifMsg] = useState('');
  const [tab, setTab] = useState('users');

  useEffect(() => {
    apiFetch('/admin/users')
      .then((r) => {
        setData({
          eleves: Array.isArray(r.eleves) ? r.eleves : [],
          profs: Array.isArray(r.profs) ? r.profs : [],
          parents: Array.isArray(r.parents) ? r.parents : [],
        });
      })
      .catch((e) => setError(e.message || 'Impossible de charger les utilisateurs'))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (role: string, id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch(`/admin/users/${role}/${id}`, { method: 'DELETE' });
      const r = await apiFetch('/admin/users');
      setData({
        eleves: Array.isArray(r.eleves) ? r.eleves : [],
        profs: Array.isArray(r.profs) ? r.profs : [],
        parents: Array.isArray(r.parents) ? r.parents : [],
      });
    } catch (e: any) { alert(e.message); }
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/notifications', { method: 'POST', body: JSON.stringify(notifForm) });
      setNotifMsg('✅ Notification envoyée !');
      setNotifForm({ contenu: '', type: 'info', eleveId: '' });
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e: any) { setNotifMsg('❌ ' + e.message); }
  };

  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      <p className="text-gray-400 text-sm">Chargement du panneau d'administration...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-rose-600 font-semibold text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Réessayer</button>
    </div>
  );

  const allUsers = [
    ...data.eleves.map(u => ({ ...u, role: 'eleve' })),
    ...data.profs.map(u => ({ ...u, role: 'professeur' })),
    ...data.parents.map(u => ({ ...u, role: 'parent' })),
  ];

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c0519,#be123c,#e11d48)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Administration</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Administrateur plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <StatCard icon="🎓" label="Étudiants" value={data.eleves.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="👨‍🏫" label="Professeurs" value={data.profs.length} color="bg-purple-50 text-purple-600" />
        <StatCard icon="👨‍👩‍👧" label="Parents" value={data.parents.length} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[['users', '👥 Utilisateurs'], ['notifs', '🔔 Notification']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`dash-tab ${tab === k ? 'active' : ''}`}
            style={tab === k ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="dash-card-flat overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Nom</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allUsers.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{u.nom}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 capitalize">{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => deleteUser(u.role, u.id)} className="text-xs text-rose-400 hover:text-rose-600 font-medium">Supprimer</button>
                  </td>
                </tr>
              ))}
              {!allUsers.length && <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Aucun utilisateur</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notifs' && (
        <div className="dash-card p-6 max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Envoyer une notification</h3>
          {notifMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${notifMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{notifMsg}</div>}
          <form onSubmit={sendNotif} className="space-y-3">
            <select value={notifForm.eleveId} onChange={e => setNotifForm(f => ({ ...f, eleveId: e.target.value }))} required
              className="dash-input">
              <option value="">Sélectionner un étudiant...</option>
              {data.eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
            <select value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
              className="dash-input">
              {['info', 'note', 'revision'].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea value={notifForm.contenu} onChange={e => setNotifForm(f => ({ ...f, contenu: e.target.value }))} required rows={3}
              placeholder="Message de la notification..." className="dash-input" style={{resize:'none'}} />
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [linkedEleve, setLinkedEleve] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/auth/linked-student')
      .then((r) => {
        setLinkedEleve(r.eleve);
        if (r.eleve) return apiFetch(`/eleves/${r.eleve.id}/notes`);
      })
      .then((r) => { if (r) setNotes(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.valeur * n.coefficient, 0) / notes.reduce((s, n) => s + n.coefficient, 0)).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#064e3b,#059669,#10b981)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Espace Parent</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Cliquez sur votre nom dans la barre latérale pour gérer votre compte</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : !linkedEleve ? (
        <div className="dash-card dash-empty">
          <div className="text-5xl mb-4">👦</div>
          <p className="text-gray-700 font-bold mb-2">Aucun élève lié</p>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Cliquez sur votre <strong>nom dans la barre latérale</strong>, puis sur <strong>"Lier un élève"</strong> pour associer votre enfant.</p>
          <div className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            💡 Vous aurez besoin de l'email de votre enfant
          </div>
        </div>
      ) : (
        <>
          {/* Student card */}
          <div className="dash-card p-5 flex items-center gap-4" style={{borderColor:"rgba(16,185,129,0.15)"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
              {linkedEleve.nom?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{linkedEleve.nom}</p>
              <p className="text-sm text-gray-400">{linkedEleve.email}</p>
              {linkedEleve.niveau && <p className="text-xs text-gray-400 mt-0.5">{linkedEleve.niveau} · {linkedEleve.filiere}</p>}
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: parseFloat(moyenne) >= 10 ? '#059669' : '#dc2626' }}>{moyenne}</p>
              <p className="text-xs text-gray-400">/20 moy.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <StatCard icon="📊" label="Moyenne générale" value={moyenne} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
          </div>

          <div>
            <h3 className="dash-section-title">Notes de {linkedEleve.nom}</h3>
            {notes.length === 0 ? (
              <div className="dash-card dash-empty">
                <p className="text-gray-400 text-sm">Aucune note disponible</p>
              </div>
            ) : (
              <div className="dash-card-flat overflow-hidden">
                {notes.map((note, i) => (
                  <div key={note.id} className={`flex items-center justify-between px-5 py-4 ${i < notes.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{note.matiere}</div>
                      <div className="text-xs text-gray-400">{note.periode} · {note.type}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-black ${note.valeur >= 14 ? 'text-emerald-600 bg-emerald-50' : note.valeur >= 10 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50'}`}>
                      {note.valeur}/20
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ACTUALITES PAGE ─────────────────────────────────────────────────────────
// Curated + live news. Static items always shown; RSS items loaded from public API.
const STATIC_NEWS = [
  {
    id: 's1',
    titre: "Concours CNC 2026 — Calendrier officiel",
    source: "CPGE Maroc",
    date: '2025-12-01',
    emoji: '🏆',
    categorie: 'Concours',
    resume: "Le Concours National Commun (CNC) pour l'accès aux grandes écoles d'ingénieurs aura lieu du 15 au 20 juin 2026. Les inscriptions ouvrent le 1er mars 2026.",
    lien: 'https://cnc.ac.ma',
  },
  {
    id: 's2',
    titre: "ENSA — Nouvelles filières IA et Data Science 2026",
    source: "ENSA Maroc",
    date: '2025-09-10',
    emoji: '🤖',
    categorie: 'Université',
    resume: "Les Écoles Nationales des Sciences Appliquées lancent des formations en IA, Data Science et Cybersécurité. Niveau requis : 16/20 en maths au CNC.",
    lien: 'https://ensa.ac.ma',
  },
  {
    id: 's3',
    titre: "Bourses d'excellence AMCI 2026 — Candidatures ouvertes",
    source: "AMCI",
    date: '2025-11-15',
    emoji: '💰',
    categorie: 'Bourse',
    resume: "Plus de 500 bourses d'études à l'étranger pour les étudiants marocains. France, Canada, Espagne, Allemagne. Dossier avant le 28 février 2026.",
    lien: 'https://amci.ma',
  },
  {
    id: 's4',
    titre: "Réforme LMD 2026 — Ce qui change pour les étudiants",
    source: "Ministère de l'Enseignement Supérieur",
    date: '2025-08-30',
    emoji: '📋',
    categorie: 'Réforme',
    resume: "Crédits capitalisables, passerelles entre filières, et reconnaissance internationale facilitée des diplômes marocains.",
    lien: 'https://enssup.gov.ma',
  },
  {
    id: 's5',
    titre: "Guide orientation Bac+1 — Toutes les filières 2026",
    source: "Mowajih AI",
    date: '2025-10-20',
    emoji: '📚',
    categorie: 'Orientation',
    resume: "CPGE, BTS, Licence, ENSA, ENCG, Médecine — comparatif complet des débouchés, salaires et taux d'insertion par filière au Maroc.",
    lien: '#',
  },
  {
    id: 's6',
    titre: "Admission en Médecine 2026 — Nouvelles règles du concours",
    source: "Facultés de Médecine",
    date: '2025-10-05',
    emoji: '🏥',
    categorie: 'Concours',
    resume: "Le concours d'accès aux études médicales adopte un nouveau format en 2026 : QCM informatisé, coefficient science de la vie augmenté.",
    lien: 'https://men.gov.ma',
  },
];

const CATEGORIE_COLORS: Record<string, { bg: string; color: string }> = {
  Concours:   { bg: '#fff7ed', color: '#c2410c' },
  Université: { bg: '#eff6ff', color: '#1d4ed8' },
  Bourse:     { bg: '#f0fdf4', color: '#15803d' },
  Orientation:{ bg: '#fdf4ff', color: '#9333ea' },
  Réforme:    { bg: '#fff1f2', color: '#be123c' },
  Actualité:  { bg: '#f8f7ff', color: '#7c3aed' },
};

function ActualitesPage() {
  const [activeCategorie, setActiveCategorie] = useState('');
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  // Fetch live news via public RSS-to-JSON proxy (MEN Maroc)
  useEffect(() => {
    const RSS_URL = encodeURIComponent('https://men.gov.ma/fr/feed');
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=4`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.items)) {
          const items = data.items.map((item: any, i: number) => ({
            id: `live_${i}`,
            titre: item.title?.slice(0, 90) || 'Actualité',
            source: "MEN — Ministère de l'Éducation",
            date: item.pubDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            emoji: '📰',
            categorie: 'Actualité',
            resume: item.description?.replace(/<[^>]*>/g, '').slice(0, 180) || '',
            lien: item.link || '#',
          }));
          setLiveNews(items);
        }
      })
      .catch(() => {}) // Silent fail — static news always shown
      .finally(() => setLiveLoading(false));
  }, []);

  const allNews = [...(liveLoading ? [] : liveNews), ...STATIC_NEWS];
  const categories = [...new Set(allNews.map(a => a.categorie))];
  const filtered = activeCategorie ? allNews.filter(a => a.categorie === activeCategorie) : allNews;

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:22, alignItems:'center' }}>
        <button
          onClick={() => setActiveCategorie('')}
          style={{ padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'none', background: activeCategorie==='' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9', color: activeCategorie==='' ? '#fff' : '#64748b', transition:'all .15s' }}
        >
          Tout ({allNews.length})
        </button>
        {categories.map(cat => {
          const c = CATEGORIE_COLORS[cat] || { bg:'#f1f5f9', color:'#64748b' };
          const count = allNews.filter(a => a.categorie === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategorie(activeCategorie===cat ? '' : cat)} style={{
              padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'none',
              background: activeCategorie===cat ? c.color : c.bg, color: activeCategorie===cat ? '#fff' : c.color, transition:'all .15s',
            }}>{cat} ({count})</button>
          );
        })}
        {liveLoading && (
          <span style={{ fontSize:11, color:'#94a3b8', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12, height:12, borderRadius:'50%', border:'2px solid #e2e8f0', borderTopColor:'#7c3aed', animation:'spin 1s linear infinite', display:'inline-block' }} />
            Actualités en direct...
          </span>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {/* Skeleton loaders while live news loads */}
        {liveLoading && [1,2,3,4].map(i => (
          <div key={`sk_${i}`} className="dash-card p-5">
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:10, width:'30%' }} />
            <div className="dash-skeleton" style={{ height:18, borderRadius:6, marginBottom:8, width:'90%' }} />
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:6, width:'100%' }} />
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, width:'70%' }} />
          </div>
        ))}

        {filtered.map(a => {
          const c = CATEGORIE_COLORS[a.categorie] || { bg:'#f8f7ff', color:'#7c3aed' };
          return (
            <div key={a.id} className="dash-card p-5" style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:12 }}>
                <div style={{ fontSize:26 }}>{a.emoji}</div>
                <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:c.bg, color:c.color, flexShrink:0 }}>
                  {a.categorie}
                </span>
              </div>
              <h3 style={{ fontSize:14, fontWeight:800, color:'#0f0c29', lineHeight:1.4, marginBottom:8 }}>{a.titre}</h3>
              {a.resume && <p style={{ fontSize:12.5, color:'#64748b', lineHeight:1.6, flex:1, marginBottom:12 }}>{a.resume}</p>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f1f5f9', paddingTop:10 }}>
                <div>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0, fontWeight:600 }}>{a.source}</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>
                    {new Date(a.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
                {a.lien && a.lien !== '#' && (
                  <a href={a.lien} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', padding:'5px 10px', borderRadius:6, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)' }}>
                    Lire →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MON PROFIL PAGE ──────────────────────────────────────────────────────────
function MonProfilPage({ user, onRetakeOnet }: { user: User; onRetakeOnet?: () => void }) {
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/onet/profile').then(r => setProfil(r.profil)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const CAT: Record<string, { label: string; color: string; emoji: string; desc: string }> = {
    R: { label: 'Réaliste',      color: '#ef4444', emoji: '🔧', desc: 'Travail manuel, technique, concret' },
    I: { label: 'Investigateur', color: '#3b82f6', emoji: '🔬', desc: 'Recherche, analyse, sciences' },
    A: { label: 'Artistique',    color: '#ec4899', emoji: '🎨', desc: 'Créativité, expression, art' },
    S: { label: 'Social',        color: '#10b981', emoji: '🤝', desc: 'Aide, enseignement, relations humaines' },
    E: { label: 'Entreprenant',  color: '#f59e0b', emoji: '💼', desc: 'Leadership, vente, management' },
    C: { label: 'Conventionnel', color: '#8b5cf6', emoji: '📊', desc: 'Organisation, données, procédures' },
  };

  const CAREER_MAP: Record<string, string[]> = {
    RIA: ['Architecte','Designer industriel','Ingénieur mécanique'],
    RIS: ['Médecin généraliste','Vétérinaire','Infirmier spécialisé'],
    RIC: ['Ingénieur informatique','Technicien réseau','Électronicien'],
    IAS: ['Psychologue','Chercheur sciences humaines','Anthropologue'],
    IAE: ["Directeur artistique","Architecte d'intérieur",'Chef de projet créatif'],
    ISA: ['Médecin psychiatre','Conseiller pédagogique','Ergothérapeute'],
    ISE: ["Directeur d'école",'RH','Coach professionnel'],
    IEC: ["Avocat d'affaires",'Consultant','Analyste financier'],
    ASE: ['Journaliste','Chargé de communication','Relations publiques'],
    SEC: ['Gestionnaire RH','Assistant social','Coordinateur de projet'],
    ECS: ['Manager commercial','Entrepreneur','Directeur marketing'],
    CSE: ['Comptable','Contrôleur de gestion','Auditeur'],
    IRE: ["Ingénieur civil",'Géomètre','Topographe'],
    IRA: ['Médecin biologiste','Chimiste','Physicien'],
    EIS: ["Directeur d'hôpital",'Responsable qualité','Manager RH'],
  };

  const getCareerSuggestions = () => {
    if (!profil) return [];
    const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
    return CAREER_MAP[code]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}E`]
      || CAREER_MAP[`${profil.primaryInterest}${profil.secondaryInterest}S`]
      || ['Consultez votre roadmap IA pour des suggestions personnalisées'];
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );

  if (!profil) return (
    <div className="">
      <div className="dash-card dash-empty">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Aucun profil O*NET</h3>
        <p className="text-gray-400 text-sm mb-6">Passez le test pour découvrir vos intérêts professionnels et obtenir des recommandations de carrière personnalisées.</p>
        <button onClick={onRetakeOnet} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          🎯 Passer le test O*NET
        </button>
      </div>
    </div>
  );

  const code = `${profil.primaryInterest}${profil.secondaryInterest}${profil.tertiaryInterest}`;
  const testLabel = profil.testLevel === 10 ? '⚡ Découverte' : profil.testLevel === 30 ? '🔍 Exploration' : '🎯 Profil Complet';
  const careers = getCareerSuggestions();

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="dash-hero" style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed,#a855f7)' }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#fff,transparent)' }} />
        <p className="text-white/60 text-sm mb-1">Votre code RIASEC</p>
        <h2 className="text-5xl font-black tracking-widest mb-2">{code}</h2>
        <div className="flex items-center gap-3 text-white/70 text-sm flex-wrap">
          <span>{testLabel}</span>
          {profil.language && <span>· {profil.language.toUpperCase()}</span>}
          {profil.completedAt && <span>· {new Date(profil.completedAt).toLocaleDateString('fr-FR')}</span>}
        </div>
      </div>

      {/* RIASEC Bars */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Scores détaillés</h3>
        <div className="space-y-3">
          {['R','I','A','S','E','C'].map((cat) => {
            const info = CAT[cat];
            const score = profil[`scores${cat}`] || 0;
            const maxQ = Math.round((profil.testLevel || 60) / 6);
            const pct = maxQ > 0 ? (score / maxQ) * 100 : 0;
            const isPrimary = cat === profil.primaryInterest;
            const isSecondary = cat === profil.secondaryInterest;
            const isTertiary = cat === profil.tertiaryInterest;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ fontWeight: isPrimary ? 800 : 500, color: (isPrimary || isSecondary || isTertiary) ? info.color : '#94a3b8' }}>
                    {info.emoji} {info.label}
                    {isPrimary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color }}>Primaire</span>}
                    {isSecondary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color, opacity: 0.8 }}>Secondaire</span>}
                    {isTertiary && <span className="text-xs ml-2 px-1.5 py-0.5 rounded text-white" style={{ background: info.color, opacity: 0.6 }}>Tertiaire</span>}
                  </span>
                  <span className="text-gray-400 text-xs">{score}/{maxQ}</span>
                </div>
                <div className="dash-progress-track">
                  <div className="dash-progress-fill" style={{ width: `${pct}%`, background: info.color }} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Career suggestions */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Métiers suggérés pour le code {code}</h3>
        <div className="flex flex-wrap gap-2">
          {careers.map((c, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{c}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">💡 Générez votre Roadmap IA pour une analyse complète adaptée à votre profil et vos notes.</p>
      </div>

      {/* Dreams */}
      {(profil.dreamUni || profil.dreamJob) && (
        <div className="dash-card p-5" style={{borderColor:"rgba(245,158,11,0.2)"}}>
          <h3 className="dash-section-title">💭 Vos objectifs</h3>
          {profil.dreamUni && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎓</span>
              <div><p className="text-xs text-gray-400">Université de rêve</p><p className="font-bold text-gray-800">{profil.dreamUni}</p></div>
            </div>
          )}
          {profil.dreamJob && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div><p className="text-xs text-gray-400">Métier de rêve</p><p className="font-bold text-gray-800">{profil.dreamJob}</p></div>
            </div>
          )}
        </div>
      )}

      {/* Job Zone */}
      <div className="dash-card p-5">
        <h3 className="dash-section-title">Niveau d'études visé</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            {profil.jobZone}
          </div>
          <div>
            <p className="font-bold text-gray-800">Zone {profil.jobZone}</p>
            <p className="text-sm text-gray-500">{['','Peu ou pas de préparation nécessaire','Une certaine préparation nécessaire','Préparation modérée nécessaire','Bac+3/+5 nécessaire','Doctorat / expertise extensive nécessaire'][profil.jobZone] || ''}</p>
          </div>
        </div>
      </div>

      <button onClick={onRetakeOnet} className="w-full py-3 rounded-2xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
        🔄 Repasser le test O*NET (remplace les résultats actuels)
      </button>
    </div>
  );
}

// ─── NOTES EVOLUTION CHART ────────────────────────────────────────────────────
function NotesEvolutionChart({ notes }: { notes: any[] }) {
  const subjects = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    notes.forEach(n => { if (!seen.has(n.matiere)) { seen.add(n.matiere); result.push(n.matiere); } });
    return result.slice(0, 5);
  }, [notes]);

  const colors = ['#7c3aed','#10b981','#3b82f6','#f59e0b','#ec4899'];
  const W = 520, H = 170, PAD = 36;

  const bySubject = useMemo(() => {
    const map: Record<string, { y: number; idx: number }[]> = {};
    notes.forEach((n, i) => {
      if (!map[n.matiere]) map[n.matiere] = [];
      map[n.matiere].push({ y: parseFloat(n.valeur), idx: i });
    });
    return map;
  }, [notes]);

  if (notes.length < 2) return null;

  const toCoords = (idx: number, val: number) => ({
    x: PAD + (notes.length <= 1 ? (W - PAD * 2) / 2 : (idx / (notes.length - 1)) * (W - PAD * 2)),
    y: PAD + ((20 - val) / 20) * (H - PAD * 2),
  });

  return (
    <div className="dash-card p-5">
      <h3 className="dash-section-title">📈 Évolution des notes</h3>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 280 }}>
          {/* Grid */}
          {[0, 5, 10, 15, 20].map(v => {
            const cy = PAD + ((20 - v) / 20) * (H - PAD * 2);
            return (
              <g key={v}>
                <line x1={PAD} y1={cy} x2={W - PAD} y2={cy} stroke={v === 10 ? '#fde68a' : '#f1f5f9'} strokeWidth={v === 10 ? 1.5 : 1} strokeDasharray={v === 10 ? '5,3' : undefined} />
                <text x={PAD - 5} y={cy + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{v}</text>
              </g>
            );
          })}
          {/* Lines per subject */}
          {subjects.map((subj, si) => {
            const pts = bySubject[subj];
            if (!pts || pts.length < 1) return null;
            const color = colors[si % colors.length];
            let d = '';
            pts.forEach((p, i) => {
              const { x, y } = toCoords(p.idx, p.y);
              d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            });
            return (
              <g key={subj}>
                <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, i) => {
                  const { x, y } = toCoords(p.idx, p.y);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill={color} stroke="#fff" strokeWidth="2" />
                      {pts.length <= 8 && (
                        <text x={x} y={y - 8} fontSize="8" fill={color} textAnchor="middle" fontWeight="bold">{p.y}</text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {subjects.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-xs text-gray-500 font-medium">{s}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-dashed border-amber-400" />
          <span className="text-xs text-gray-400">Seuil 10</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showOnetTest, setShowOnetTest] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) { window.location.href = '/'; return; }
    const u = JSON.parse(stored);
    setUser(u);
    if (u.role === 'eleve') {
      apiFetch(`/notifications/${u.id}`)
        .then((ns: Notification[]) => setNotifCount(ns.filter((n) => !n.lu).length))
        .catch(() => {});
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  // Full-screen O*NET test
  if (showOnetTest) {
    return <OnetTest onComplete={() => setShowOnetTest(false)} onSkip={() => setShowOnetTest(false)} />;
  }

  const handleRetakeOnet = () => setShowOnetTest(true);

  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    dashboard: { title: 'Tableau de bord', subtitle: `Bienvenue, ${user.nom}` },
    profil: { title: 'Mon Profil O*NET', subtitle: 'Vos intérêts et recommandations de carrière' },
    actualites: { title: 'Actualités', subtitle: 'Éducation et orientation au Maroc' },
    notes: { title: 'Mes Notes', subtitle: 'Gérez vos résultats scolaires' },
    exercices: { title: 'Exercices', subtitle: "Entraînez-vous et progressez" },
    roadmap: { title: 'Roadmap Professionnel', subtitle: 'Votre parcours personnalisé par IA' },
    chatbot: { title: 'Assistant Mowajih IA', subtitle: 'Posez vos questions' },
    concours: { title: 'Concours & Bourses', subtitle: 'Opportunités disponibles' },
    annales: { title: 'Annales', subtitle: 'Examens et sujets passés' },
    notifications: { title: 'Notifications', subtitle: 'Vos alertes et messages' },
    eleves: { title: 'Élèves en difficulté', subtitle: 'Suivi pédagogique' },
    users: { title: 'Gestion des utilisateurs', subtitle: 'Administration plateforme' },
    suivi: { title: 'Suivi de mon élève', subtitle: 'Résultats et progression' },
  };

  const renderPage = () => {
    if (user.role === 'eleve') {
      switch (active) {
        case 'dashboard': return <EleveDashboard user={user} setActive={setActive} onRetakeOnet={handleRetakeOnet} />;
        case 'profil': return <MonProfilPage user={user} onRetakeOnet={handleRetakeOnet} />;
        case 'actualites': return <ActualitesPage />;
        case 'notes': return <NotesPage user={user} />;
        case 'exercices': return <ExercicesPage user={user} />;
        case 'roadmap': return <RoadmapPage user={user} />;
        case 'chatbot': return <ChatbotPage user={user} />;
        case 'concours': return <ConcoursPage />;
        case 'annales': return <ConcoursPage />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'professeur') {
      switch (active) {
        case 'dashboard': return <ProfDashboard user={user} />;
        case 'eleves': return <ProfDashboard user={user} />;
        case 'exercices': return <ExercicesPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'admin') {
      switch (active) {
        case 'dashboard': return <AdminDashboard user={user} />;
        case 'users': return <AdminDashboard user={user} />;
        case 'concours': return <ConcoursPage />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'parent') {
      return <ParentDashboard user={user} />;
    }
    return <div className="p-6 text-gray-400">Page en construction...</div>;
  };

  const current = pageTitles[active] || { title: active };

  return (
    <div className="dash-shell">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} onRetakeOnet={handleRetakeOnet} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }} className="lg:hidden">
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position:'relative', width:280, height:'100%' }}>
            <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} mobile onClose={() => setSidebarOpen(false)} onRetakeOnet={handleRetakeOnet} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="dash-main">
        <Header
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={notifCount}
        />
        <div className="dash-content dash-page-enter">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
