import { useState, useEffect, useRef } from 'react';

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
  datw: string;
  seuil: number;
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

// ─── PROFILE POPUP ────────────────────────────────────────────────────────────
function PasswordTab({ pw, setPw, pwMsg, pwLoading, onSubmit }: {
  pw: { current: string; next: string; confirm: string };
  setPw: React.Dispatch<React.SetStateAction<{ current: string; next: string; confirm: string }>>;
  pwMsg: { type: string; text: string } | null;
  pwLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>🔑</div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
        Modifiez votre mot de passe de connexion.
      </p>
      <button
        onClick={() => setShowForm(true)}
        style={{
          width: '100%', padding: 10,
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Changer le mot de passe
      </button>
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      {pwMsg && (
        <div style={{
          marginBottom: 10, padding: '8px 12px', borderRadius: 8, fontSize: 12,
          background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626',
        }}>{pwMsg.text}</div>
      )}
      {[
        { k: 'current', l: 'Mot de passe actuel' },
        { k: 'next',    l: 'Nouveau mot de passe' },
        { k: 'confirm', l: 'Confirmer' },
      ].map(f => (
        <div key={f.k} style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{f.l}</label>
          <input
            type="password"
            value={pw[f.k as keyof typeof pw]}
            onChange={e => setPw(p => ({ ...p, [f.k]: e.target.value }))}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: 9, background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Annuler
        </button>
        <button type="submit" disabled={pwLoading} style={{ flex: 2, padding: 9, background: pwLoading ? '#c4b5fd' : 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: pwLoading ? 'not-allowed' : 'pointer' }}>
          {pwLoading ? 'Modification...' : 'Confirmer'}
        </button>
      </div>
    </form>
  );
}
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
      {/* Trigger */}<div onClick={() => setOpen(o=>!o)} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
        <div
  onClick={() => setOpen(o=>!o)}
  style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:'6px 10px', borderRadius:10, transition:'background .2s' }}
  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
></div>
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
  { id: 'dashboard', label: 'Tableau de bord', icon: icons.dashboard },
  { id: 'notes', label: 'Mes Notes', icon: icons.notes },
  { id: 'exercices', label: 'Exercices', icon: icons.exercices },
  { id: 'roadmap', label: 'Roadmap IA', icon: icons.roadmap },
  { id: 'chatbot', label: 'Assistant IA', icon: icons.chatbot },
  { id: 'concours', label: 'Concours', icon: icons.concours },
  { id: 'annales', label: 'Annales', icon: icons.annales },
  { id: 'notifications', label: 'Notifications', icon: icons.notifications },
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

  const roleColors: Record<string, string> = {
    eleve: 'from-violet-600 to-purple-700',
    professeur: 'from-blue-600 to-indigo-700',
    admin: 'from-rose-600 to-pink-700',
    parent: 'from-emerald-600 to-teal-700',
  };
  const roleLabels: Record<string, string> = {
    eleve: 'Étudiant', professeur: 'Professeur', admin: 'Administrateur', parent: 'Parent',
  };

  return (
    <div className={`flex flex-col h-full bg-gray-950 text-white ${mobile ? '' : ''}`}
      style={{ width: mobile ? '100%' : '260px', minHeight: '100vh' }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className="font-black text-lg">
              My<span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tawjeh</span>
            </span>
          </div>
          {mobile && onClose && (
            <button onClick={onClose} className="text-white/50 hover:text-white text-xl">{icons.close}</button>
          )}
        </div>
      </div>

      {/* Profile popup — click name to open settings */}
      <div className="px-4 py-4" style={{ position:'relative', zIndex:200 }}>
        <ProfilePopup user={user} onLogout={onLogout} onRetakeOnet={onRetakeOnet} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
              active === item.id
                ? 'text-white shadow-lg'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            style={active === item.id ? {
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.15))',
              border: '1px solid rgba(139,92,246,0.3)',
            } : {}}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
            {active === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout moved to profile popup — click your name */}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title, subtitle, onMenuClick, notifCount }: {
  title: string; subtitle?: string; onMenuClick: () => void; notifCount?: number;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
          {icons.menu}
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {notifCount !== undefined && notifCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100">
          <span className="text-sm">{icons.notifications}</span>
          <span className="text-xs font-bold text-violet-700">{notifCount} non lue{notifCount > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Mes Notes</h2>
          <p className="text-sm text-gray-400">Moyenne générale : <span className="font-bold text-violet-700">{moyenneGenerale}</span></p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
        >
          <span>{icons.plus}</span> Ajouter une note
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm mb-6">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
    { role: 'assistant', content: `Bonjour ${user.nom} ! 👋 Je suis Mowajih AI, votre assistant d'orientation académique. Comment puis-je vous aider aujourd'hui ?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await apiFetch('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: msg, eleveId: user.id }),
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Désolé, une erreur s'est produite. Vérifiez votre connexion." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold ${
              msg.role === 'assistant'
                ? 'text-white'
                : 'bg-gray-200 text-gray-600'
            }`} style={msg.role === 'assistant' ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
              {msg.role === 'assistant' ? '🤖' : user.nom.charAt(0)}
            </div>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'text-white rounded-tr-sm'
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
            }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>🤖</div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Posez votre question à Mowajih AI..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none bg-gray-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
          >
            {icons.send}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user }: { user: User }) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    apiFetch(`/roadmap/${user.id}`)
      .then((r) => { if (r?.parcours) setRoadmap(JSON.parse(r.parcours)); })
      .finally(() => setFetching(false));
  }, [user.id]);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ eleveId: user.id }),
      });
      if (data.result) setRoadmap(data.result);
    } catch (e: any) {
      alert('Erreur lors de la génération : ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6 text-center text-gray-400 py-20">Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Roadmap Professionnel IA</h2>
          <p className="text-sm text-gray-400">Généré selon votre profil et vos notes</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
        >
          {loading ? '⏳ Génération...' : '🧭 Générer un roadmap'}
        </button>
      </div>

      {!roadmap ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🧭</div>
          <p className="text-gray-500 font-medium text-lg">Aucun roadmap généré</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Cliquez sur "Générer" pour obtenir votre roadmap personnalisé par IA</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Métier */}
          <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm">
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
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Étapes du parcours</h3>
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

          {/* Matières clés + Conseils */}
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.matieresCles?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Matières clés</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.matieresCles.map((m: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {roadmap.conseils && (
              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">💡 Conseils</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{roadmap.conseils}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXERCICES PAGE ───────────────────────────────────────────────────────────
function ExercicesPage({ user }: { user: User }) {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [selected, setSelected] = useState<Exercice | null>(null);
  const [score, setScore] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/exercices').then(setExercices).finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!selected || !score) return;
    await apiFetch(`/exercices/${selected.id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ score: parseFloat(score), eleveId: user.id }),
    });
    setSubmitted(true);
  };

  const diffColor = (d: string) =>
    d === 'Facile' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : d === 'Moyen' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Exercices</h2>

      {selected ? (
        <div>
          <button onClick={() => { setSelected(null); setSubmitted(false); setScore(''); }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            ← Retour aux exercices
          </button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(selected.difficulte)}`}>{selected.difficulte}</span>
              <span className="text-sm text-gray-400">{selected.matiere} · {selected.niveau}</span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 p-4 rounded-xl bg-gray-50">{selected.contenu}</div>

            {!submitted ? (
              <div className="flex items-center gap-3">
                <input type="number" min="0" max="20" step="0.5" placeholder="Votre score /20"
                  value={score} onChange={(e) => setScore(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none w-48" />
                <button onClick={submit} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  Soumettre
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4 text-sm">
                  <span>{icons.check}</span> Score soumis !
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-700 uppercase mb-2">Correction</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.correction}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : exercices.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-400 font-medium">Aucun exercice disponible</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {exercices.map((ex) => (
            <button key={ex.id} onClick={() => { setSelected(ex); setSubmitted(false); setScore(''); }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${diffColor(ex.difficulte)}`}>{ex.difficulte}</span>
                <span className="text-xs text-gray-400">{ex.niveau}</span>
              </div>
              <div className="text-sm font-bold text-gray-800 mb-1">{ex.matiere}</div>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{ex.contenu.substring(0, 100)}...</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CONCOURS PAGE ────────────────────────────────────────────────────────────
function ConcoursPage() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/concours').then(setConcours).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Concours & Bourses</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : concours.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-gray-400 font-medium">Aucun concours disponible</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {concours.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>🏆</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{c.nom}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>📅 {new Date(c.datw).toLocaleDateString('fr-FR')}</span>
                    <span>·</span>
                    <span>Seuil: <strong className="text-violet-700">{c.seuil}/20</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ user }: { user: User }) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/notifications/${user.id}`).then(setNotifs).finally(() => setLoading(false));
  }, [user.id]);

  const markRead = async (id: number) => {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, lu: true } : n)));
  };

  const typeIcon: Record<string, string> = { note: '📊', revision: '📝', info: 'ℹ️', success: '✅' };

  return (
    <div className="p-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Notifications</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-gray-400 font-medium">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <div key={n.id} className={`bg-white rounded-2xl p-4 border transition-all ${n.lu ? 'border-gray-100 opacity-60' : 'border-violet-100 shadow-sm'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${n.lu ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>{n.contenu}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {!n.lu && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-violet-600 font-bold hover:underline flex-shrink-0">Lire</button>
                )}
              </div>
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

  const quick = [
    { id: 'notes', icon: icons.notes, label: 'Mes notes', desc: 'Ajouter ou consulter' },
    { id: 'roadmap', icon: icons.roadmap, label: 'Roadmap IA', desc: 'Générer mon parcours' },
    { id: 'chatbot', icon: icons.chatbot, label: 'Assistant IA', desc: 'Poser une question' },
    { id: 'exercices', icon: icons.exercices, label: 'Exercices', desc: "S'entraîner" },
  ];

  return (
    <div className="p-6 space-y-6">
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
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📊" label="Moyenne générale" value={moyenne} color="bg-violet-50 text-violet-600" />
        <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="🔔" label="Notifications" value={notifCount} color="bg-amber-50 text-amber-600" />
        <StatCard icon="🧭" label="Mon profil" value={user.filiere || '—'} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quick.map((q) => (
            <button key={q.id} onClick={() => setActive(q.id)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
              <span className="text-2xl block mb-2">{q.icon}</span>
              <div className="text-sm font-bold text-gray-800">{q.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent notes */}
      {notes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dernières notes</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/prof/eleves-faibles').then(setEleves).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1d4ed8)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Tableau de bord</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Professeur · {user.email}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Élèves en difficulté</h3>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Chargement...</div>
        ) : eleves.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Tous les élèves sont en bonne progression</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {eleves.map((e, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < eleves.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                    {e.nom?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{e.nom}</div>
                    <div className="text-xs text-gray-400">{e.email}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600">{e.moyenne ? `${e.moyenne}/20` : 'En difficulté'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
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
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#4c0519,#be123c,#e11d48)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Administration</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Administrateur plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="🎓" label="Étudiants" value={data.eleves.length} color="bg-blue-50 text-blue-600" />
        <StatCard icon="👨‍🏫" label="Professeurs" value={data.profs.length} color="bg-purple-50 text-purple-600" />
        <StatCard icon="👨‍👩‍👧" label="Parents" value={data.parents.length} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['users', '👥 Utilisateurs'], ['notifs', '🔔 Notification']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === k ? 'text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
            style={tab === k ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Envoyer une notification</h3>
          {notifMsg && <div className={`mb-4 p-3 rounded-xl text-sm ${notifMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{notifMsg}</div>}
          <form onSubmit={sendNotif} className="space-y-3">
            <select value={notifForm.eleveId} onChange={e => setNotifForm(f => ({ ...f, eleveId: e.target.value }))} required
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              <option value="">Sélectionner un étudiant...</option>
              {data.eleves.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
            </select>
            <select value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none">
              {['info', 'note', 'revision'].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea value={notifForm.contenu} onChange={e => setNotifForm(f => ({ ...f, contenu: e.target.value }))} required rows={3}
              placeholder="Message de la notification..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-violet-400 outline-none resize-none" />
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
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#064e3b,#059669,#10b981)' }}>
        <p className="text-white/60 text-sm font-medium mb-1">Espace Parent</p>
        <h2 className="text-2xl font-black">{user.nom}</h2>
        <p className="text-white/60 text-sm mt-1">Cliquez sur votre nom dans la barre latérale pour gérer votre compte</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : !linkedEleve ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
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
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon="📊" label="Moyenne générale" value={moyenne} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📝" label="Notes enregistrées" value={notes.length} color="bg-blue-50 text-blue-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Notes de {linkedEleve.nom}</h3>
            {notes.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">Aucune note disponible</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '260px' }}>
        <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} onRetakeOnet={handleRetakeOnet} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 h-full">
            <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} mobile onClose={() => setSidebarOpen(false)} onRetakeOnet={handleRetakeOnet} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={notifCount}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
