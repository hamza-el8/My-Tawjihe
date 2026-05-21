import { useState } from 'react';
import { apiFetch } from './shared';

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

export default OnetTest;
