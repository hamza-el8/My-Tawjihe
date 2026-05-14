import { useState, useEffect } from 'react';
import type { Translation, Lang } from './types';

// ─── Translations ────────────────────────────────────────────────────────────
const translations: Record<Lang, Translation> = {
  fr: {
    direction: 'ltr',
    nav: {
      home: 'Accueil',
      services: 'Services',
      courses: 'Nos Services',
      testimonials: 'Avantages',
      contact: 'Contact',
      login: 'Connexion',
      signup: 'Inscription',
    },
    hero: {
      badge: 'Bienvenue sur MyTawjeh',
      title: 'Plateforme Intelligente',
      titleAccent: "d'Orientation par IA",
      subtitle:
        "Découvrez votre parcours idéal grâce à l'intelligence artificielle. Orientation personnalisée, préparation aux examens et suivi de vos progrès.",
      button: 'Commencer maintenant',
      buttonSecondary: 'En savoir plus',
      stats: [
        { value: '300K+', label: 'Étudiants aidés' },
        { value: '95%', label: 'Taux de satisfaction' },
        { value: '50+', label: 'Filières couvertes' },
      ],
    },
    services: {
      headingSmall: 'NOS SERVICES',
      headingLarge: 'Ce que vous pouvez obtenir',
      description:
        "Une plateforme intelligente qui combine orientation, apprentissage et suivi scolaire pour aider les étudiants à réussir.",
      items: [
        {
          icon: '🧭',
          title: 'Orientation Intelligente',
          description:
            "Découvrez les filières et métiers adaptés à votre profil grâce à l'IA basée sur vos intérêts et compétences.",
          color: 'from-purple-500 to-indigo-600',
        },
        {
          icon: '📝',
          title: 'Préparation Examens',
          description:
            'Accédez à des épreuves personnalisées, des corrections par IA et des plans de révision adaptés.',
          color: 'from-blue-500 to-cyan-600',
        },
        {
          icon: '📊',
          title: 'Tracker Les Notes',
          description:
            'Suivez vos notes en temps réel avec calcul automatique des moyennes et alertes intelligentes.',
          color: 'from-emerald-500 to-teal-600',
        },
        {
          icon: '🎯',
          title: 'Atteindre Vos Objectifs',
          description:
            "Définissez vos objectifs, recevez un plan d'action personnalisé et mesurez vos progrès.",
          color: 'from-rose-500 to-pink-600',
        },
      ],
    },
    tabs: {
      headingSmall: 'NOS MODULES',
      headingLarge: 'Comment ça marche ?',
      description: "Explorez chaque module de la plateforme MyTawjeh conçu pour votre réussite.",
      items: [
        {
          label: 'Orientation Intelligente',
          icon: '🧭',
          title: "Trouvez votre voie avec l'IA",
          description:
            "Notre système analyse vos intérêts RIASEC, vos résultats scolaires et vos aspirations pour vous proposer les filières et métiers les plus adaptés au contexte marocain.",
          features: ['Test de personnalité RIASEC', 'Matching avec 500+ métiers', 'Adapté au contexte marocain', 'Rapport PDF personnalisé'],
          color: 'from-purple-500 to-indigo-600',
          bg: 'from-purple-50 to-indigo-50',
        },
        {
          label: 'Préparation Examens',
          icon: '📝',
          title: 'Préparez-vous aux concours',
          description:
            "Accédez à une banque d'épreuves pour le Baccalauréat, CNC, CPGE et autres concours marocains. L'IA génère des exercices adaptés à vos lacunes.",
          features: ['Bac, CNC, CPGE couverts', 'Exercices générés par IA', 'Corrections détaillées', 'Planning de révision'],
          color: 'from-blue-500 to-cyan-600',
          bg: 'from-blue-50 to-cyan-50',
        },
        {
          label: 'Tracker Les Notes',
          icon: '📊',
          title: 'Suivez vos progrès en temps réel',
          description:
            "Entrez vos notes par matière et par période. La plateforme calcule automatiquement vos moyennes, identifie vos points faibles et vous alerte en cas de baisse.",
          features: ['Calcul automatique des moyennes', 'Alertes intelligentes', 'Graphiques de progression', 'Comparaison avec les objectifs'],
          color: 'from-emerald-500 to-teal-600',
          bg: 'from-emerald-50 to-teal-50',
        },
        {
          label: 'Atteindre Vos Objectifs',
          icon: '🎯',
          title: 'Définissez et atteignez vos goals',
          description:
            "Fixez vos objectifs académiques, recevez un plan d'action hebdomadaire généré par IA, et célébrez chaque étape franchie sur votre chemin vers le succès.",
          features: ["Plan d'action hebdomadaire", 'Rappels et notifications', 'Badges de progression', 'Coaching IA personnalisé'],
          color: 'from-rose-500 to-pink-600',
          bg: 'from-rose-50 to-pink-50',
        },
      ],
    },
    cta: {
      badge: 'Commencez gratuitement !',
      title: "Démocratiser l'orientation scolaire au Maroc",
      description:
        "Plus de 300 000 élèves quittent l'école chaque année sans accompagnement. MyTawjeh est l'outil accessible, gratuit et intelligent pour tous.",
      button: "S'inscrire gratuitement",
      buttonSecondary: 'Voir une démo',
    },
    advantages: {
      headingSmall: 'AVANTAGES',
      headingLarge: 'Pourquoi MyTawjeh ?',
      items: [
        { icon: '🇲🇦', title: 'Contexte Marocain', description: 'Adapté au système éducatif marocain : Bac, CNC, CPGE, Tawjihi et plus.' },
        { icon: '🤖', title: "IA de Pointe", description: "Base O*NET mondiale adaptée localement, analyse comportementale et recommandations précises." },
        { icon: '🆓', title: '100% Gratuit', description: "Accès gratuit pour tous les élèves. Notre mission : zéro élève laissé sans orientation." },
        { icon: '📱', title: 'Multi-Plateformes', description: 'Accessible depuis votre téléphone, tablette ou ordinateur, partout et à tout moment.' },
        { icon: '🔒', title: 'Données Sécurisées', description: 'Vos données personnelles sont protégées et jamais partagées avec des tiers.' },
        { icon: '🏆', title: 'Résultats Prouvés', description: "95% des étudiants ayant utilisé MyTawjeh ont amélioré leurs résultats scolaires." },
      ],
    },
    testimonials: {
      headingSmall: 'TÉMOIGNAGES',
      headingLarge: 'Ce que disent nos utilisateurs',
      items: [
        { text: "MyTawjeh m'a aidé à découvrir ma passion pour l'ingénierie. Je suis maintenant en CPGE à Casablanca !", author: 'Yassine B.', role: 'Étudiant CPGE', avatar: '👨‍🎓' },
        { text: "Grâce au tracker de notes, j'ai pu identifier mes matières faibles et les améliorer avant le bac.", author: 'Fatima Z.', role: 'Bachelière 2025', avatar: '👩‍🎓' },
        { text: "L'orientation IA était très précise. Elle m'a recommandé médecine et j'ai réussi le concours d'accès !", author: 'Hamza M.', role: 'Étudiant en Médecine', avatar: '👨‍⚕️' },
      ],
    },
    contact: {
      headingSmall: 'CONTACT',
      headingLarge: 'Posez-nous vos',
      headingAccent: 'questions',
      description: "Des questions sur MyTawjeh ou besoin d'assistance ? Notre équipe est là pour vous aider.",
      email: 'contact@mytawjeh.ma',
      phone: '+212 5 22 00 00 00',
      namePlaceholder: 'Nom complet',
      emailPlaceholder: 'Votre email',
      messagePlaceholder: 'Votre message...',
      button: 'Envoyer le message',
      copyright: '© 2026 MyTawjeh. Tous droits réservés.',
    },
  },
  ar: {
    direction: 'rtl',
    nav: {
      home: 'الرئيسية',
      services: 'الخدمات',
      courses: 'خدماتنا',
      testimonials: 'المزايا',
      contact: 'تواصل معنا',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
    },
    hero: {
      badge: 'مرحبًا بكم على MyTawjeh',
      title: 'منصة ذكية',
      titleAccent: 'للتوجيه الأكاديمي بالذكاء الاصطناعي',
      subtitle: 'اكتشف مسارك الأمثل بفضل الذكاء الاصطناعي. توجيه شخصي، تحضير للامتحانات ومتابعة تقدمك الدراسي.',
      button: 'ابدأ الآن',
      buttonSecondary: 'اعرف أكثر',
      stats: [
        { value: '+300K', label: 'طالب مستفيد' },
        { value: '95%', label: 'نسبة الرضا' },
        { value: '+50', label: 'تخصص مغطى' },
      ],
    },
    services: {
      headingSmall: 'خدماتنا',
      headingLarge: 'ما يمكنك الحصول عليه',
      description: 'منصة ذكية تجمع بين التوجيه والتعلم والمتابعة الدراسية لمساعدة الطلاب على النجاح.',
      items: [
        { icon: '🧭', title: 'التوجيه الذكي', description: 'اكتشف التخصصات والمهن المناسبة لملفك الشخصي بفضل الذكاء الاصطناعي.', color: 'from-purple-500 to-indigo-600' },
        { icon: '📝', title: 'التحضير للامتحانات', description: 'الوصول إلى اختبارات مخصصة وتصحيحات بالذكاء الاصطناعي وخطط مراجعة.', color: 'from-blue-500 to-cyan-600' },
        { icon: '📊', title: 'متتبع الدرجات', description: 'تابع درجاتك في الوقت الفعلي مع حساب تلقائي للمعدلات والتنبيهات الذكية.', color: 'from-emerald-500 to-teal-600' },
        { icon: '🎯', title: 'تحقيق أهدافك', description: 'حدد أهدافك الأكاديمية واحصل على خطة عمل شخصية وقِس تقدمك.', color: 'from-rose-500 to-pink-600' },
      ],
    },
    tabs: {
      headingSmall: 'وحداتنا',
      headingLarge: 'كيف يعمل النظام؟',
      description: 'استكشف كل وحدة في منصة MyTawjeh المصممة لنجاحك.',
      items: [
        {
          label: 'التوجيه الذكي', icon: '🧭',
          title: 'اعثر على طريقك مع الذكاء الاصطناعي',
          description: 'يحلل نظامنا اهتماماتك RIASEC ونتائجك الدراسية وطموحاتك لاقتراح أفضل التخصصات والمهن في السياق المغربي.',
          features: ['اختبار الشخصية RIASEC', 'مطابقة مع 500+ مهنة', 'متكيف مع السياق المغربي', 'تقرير PDF شخصي'],
          color: 'from-purple-500 to-indigo-600', bg: 'from-purple-50 to-indigo-50',
        },
        {
          label: 'التحضير للامتحانات', icon: '📝',
          title: 'استعد للمسابقات',
          description: 'الوصول إلى بنك أسئلة للبكالوريا وCNC وCPGE وغيرها. يولد الذكاء الاصطناعي تمارين مكيّفة مع نقاط ضعفك.',
          features: ['البكالوريا، CNC، CPGE مغطاة', 'تمارين يولدها الذكاء الاصطناعي', 'تصحيحات مفصلة', 'جدول مراجعة'],
          color: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50',
        },
        {
          label: 'متتبع الدرجات', icon: '📊',
          title: 'تابع تقدمك في الوقت الفعلي',
          description: 'أدخل درجاتك لكل مادة وفترة. تحسب المنصة تلقائيًا معدلاتك وتحدد نقاط ضعفك وتنبهك عند الانخفاض.',
          features: ['حساب تلقائي للمعدلات', 'تنبيهات ذكية', 'رسوم بيانية للتقدم', 'مقارنة مع الأهداف'],
          color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50',
        },
        {
          label: 'تحقيق الأهداف', icon: '🎯',
          title: 'حدد أهدافك وحققها',
          description: 'ضع أهدافك الأكاديمية، واحصل على خطة عمل أسبوعية يولدها الذكاء الاصطناعي، واحتفل بكل خطوة تحققها.',
          features: ['خطة عمل أسبوعية', 'تذكيرات وإشعارات', 'شارات التقدم', 'تدريب ذكاء اصطناعي شخصي'],
          color: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50',
        },
      ],
    },
    cta: {
      badge: 'ابدأ مجانًا!',
      title: 'ديمقراطية التوجيه الأكاديمي في المغرب',
      description: 'أكثر من 300 ألف طالب يتركون المدرسة سنويًا بدون توجيه حقيقي. MyTawjeh هي الأداة المتاحة والمجانية والذكية للجميع.',
      button: 'اشترك مجانًا',
      buttonSecondary: 'شاهد العرض',
    },
    advantages: {
      headingSmall: 'المزايا',
      headingLarge: 'لماذا MyTawjeh؟',
      items: [
        { icon: '🇲🇦', title: 'السياق المغربي', description: 'متكيف مع النظام التعليمي المغربي: البكالوريا، CNC، CPGE والتوجيهي.' },
        { icon: '🤖', title: 'ذكاء اصطناعي متقدم', description: 'قاعدة بيانات O*NET العالمية المكيّفة محليًا مع تحليل سلوكي وتوصيات دقيقة.' },
        { icon: '🆓', title: 'مجاني 100%', description: 'وصول مجاني لجميع الطلاب. مهمتنا: لا طالب بدون توجيه.' },
        { icon: '📱', title: 'متعدد المنصات', description: 'متاح من هاتفك أو جهازك اللوحي أو حاسوبك في أي وقت ومكان.' },
        { icon: '🔒', title: 'بيانات آمنة', description: 'بياناتك الشخصية محمية ولا تُشارك أبدًا مع أطراف ثالثة.' },
        { icon: '🏆', title: 'نتائج مثبتة', description: '95% من الطلاب الذين استخدموا MyTawjeh حسّنوا نتائجهم الدراسية.' },
      ],
    },
    testimonials: {
      headingSmall: 'شهادات المستخدمين',
      headingLarge: 'ما يقوله مستخدمونا',
      items: [
        { text: 'ساعدني MyTawjeh في اكتشاف شغفي بالهندسة. أنا الآن في CPGE بالدار البيضاء!', author: 'ياسين ب.', role: 'طالب CPGE', avatar: '👨‍🎓' },
        { text: 'بفضل متتبع الدرجات، تمكنت من تحديد موادي الضعيفة وتحسينها قبل البكالوريا.', author: 'فاطمة ز.', role: 'حاملة البكالوريا 2025', avatar: '👩‍🎓' },
        { text: 'كان توجيه الذكاء الاصطناعي دقيقًا جدًا. أوصى لي بالطب ونجحت في مسابقة الالتحاق!', author: 'حمزة م.', role: 'طالب في الطب', avatar: '👨‍⚕️' },
      ],
    },
    contact: {
      headingSmall: 'تواصل معنا',
      headingLarge: 'اطرح',
      headingAccent: 'أسئلتك',
      description: 'هل لديك أسئلة حول MyTawjeh أو تحتاج إلى مساعدة؟ فريقنا هنا لمساعدتك.',
      email: 'contact@mytawjeh.ma',
      phone: '+212 5 22 00 00 00',
      namePlaceholder: 'الاسم الكامل',
      emailPlaceholder: 'بريدك الإلكتروني',
      messagePlaceholder: 'رسالتك...',
      button: 'أرسل الرسالة',
      copyright: '© 2026 MyTawjeh. جميع الحقوق محفوظة.',
    },
  },
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

// ─── Section Heading ─────────────────────────────────────────────────────────
function SectionHeading({ small, large, accent, center = true }: { small: string; large: string; accent?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
        {small}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {large}{' '}
        {accent && <span className="gradient-text">{accent}</span>}
      </h2>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ language, setLanguage, t }: { language: Lang; setLanguage: (l: Lang) => void; t: Translation }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#top', label: t.nav.home, id: 'top' },
    { href: '#services', label: t.nav.services, id: 'services' },
    { href: '#how-it-works', label: t.nav.courses, id: 'how-it-works' },
    { href: '#advantages', label: t.nav.testimonials, id: 'advantages' },
    { href: '#contact', label: t.nav.contact, id: 'contact' },
  ];

  const scrollTo = (_href: string, id: string) => {
    setMobileOpen(false);
    setActiveSection(id);
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      dir={t.direction}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('#top', 'top'); }} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className={`font-black text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              My<span className="gradient-text">Tawjeh</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }}
                className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  scrolled
                    ? activeSection === link.id ? 'text-purple-700' : 'text-gray-700 hover:text-purple-700'
                    : activeSection === link.id ? 'text-purple-300' : 'text-white/90 hover:text-white'
                } ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Language + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                scrolled ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : 'border-white/50 text-white hover:bg-white/10'
              }`}
            >
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <a
              href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact', 'contact'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${scrolled ? 'text-purple-700 hover:bg-purple-50' : 'text-white/90 hover:bg-white/10'}`}
            >
              {t.nav.login}
            </a>
            <a
              href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact', 'contact'); }}
              className="btn-gradient text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg"
            >
              {t.nav.signup}
            </a>
          </div>

          {/* Mobile: lang + burger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className={`px-2 py-1 rounded-full text-xs font-bold border ${scrolled ? 'border-purple-300 text-purple-700' : 'border-white/50 text-white'}`}
            >
              {language === 'fr' ? 'ع' : 'FR'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mobile-menu-enter bg-white shadow-xl border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }}
                className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex gap-2">
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact', 'contact'); }} className="flex-1 text-center py-2 rounded-full border border-purple-300 text-purple-700 text-sm font-medium">
                {t.nav.login}
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact', 'contact'); }} className="flex-1 text-center py-2 rounded-full btn-gradient text-white text-sm font-semibold">
                {t.nav.signup}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection({ t }: { t: Translation }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="top" className="relative min-h-screen hero-gradient flex items-center overflow-hidden pt-16">
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 opacity-20 rounded-full animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 opacity-10 rounded-full animate-blob animation-delay-4000" />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t.hero.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {t.hero.title}{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {t.hero.titleAccent}
              </span>
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => scrollTo('contact')} className="btn-gradient text-white px-8 py-4 rounded-full font-bold text-base shadow-xl transition-all duration-300">
                {t.hero.button} →
              </button>
              <button onClick={() => scrollTo('how-it-works')} className="px-8 py-4 rounded-full font-bold text-base text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300">
                {t.hero.buttonSecondary}
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {t.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="hidden lg:flex justify-center items-center animate-float">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/30 to-indigo-600/30 blur-3xl" />
              <img src="/hero-illustration.png" alt="AI Orientation Platform" className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10" />
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{t.direction === 'rtl' ? 'نسبة النجاح' : 'Taux de réussite'}</div>
                    <div className="text-lg font-black gradient-text">95%</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{t.direction === 'rtl' ? 'الذكاء الاصطناعي' : 'IA Active'}</div>
                    <div className="text-sm font-semibold text-green-500">{t.direction === 'rtl' ? 'متصل' : 'En ligne'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServicesSection({ t }: { t: Translation }) {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.services.headingSmall} large={t.services.headingLarge} />
        <p className="text-center text-gray-500 max-w-2xl mx-auto -mt-6 mb-16">{t.services.description}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((item, i) => (
            <div key={i} className="card-lift bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-purple-200">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works (Tabs) ──────────────────────────────────────────────────────
function HowItWorksSection({ t }: { t: Translation }) {
  const [activeTab, setActiveTab] = useState(0);
  const tab = t.tabs.items[activeTab];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.tabs.headingSmall} large={t.tabs.headingLarge} />
        <p className="text-center text-gray-500 max-w-2xl mx-auto -mt-6 mb-12">{t.tabs.description}</p>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {t.tabs.items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === i ? 'tab-active text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={activeTab} className={`bg-gradient-to-br ${tab.bg} rounded-3xl p-8 md:p-12 border border-white shadow-xl animate-fade-in-up`}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tab.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                {tab.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{tab.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-8">{tab.description}</p>
              <ul className="space-y-3">
                {tab.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${tab.color} flex items-center justify-center flex-shrink-0`}>
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className={`w-56 h-56 rounded-full bg-gradient-to-br ${tab.color} opacity-10 flex items-center justify-center`}>
                <span className="text-8xl">{tab.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection({ t }: { t: Translation }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl hero-gradient overflow-hidden p-10 md:p-16">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 opacity-20 rounded-full animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/25 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-5">
                {t.cta.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{t.cta.title}</h2>
              <p className="text-white/75 mb-8 leading-relaxed">{t.cta.description}</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollTo('contact')} className="bg-white text-purple-700 px-7 py-3.5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {t.cta.button}
                </button>
                <button onClick={() => scrollTo('how-it-works')} className="border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all duration-300">
                  {t.cta.buttonSecondary}
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img src="/cta-image.png" alt="CTA" className="w-full max-w-md rounded-2xl shadow-2xl opacity-90 animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Advantages ───────────────────────────────────────────────────────────────
function AdvantagesSection({ t }: { t: Translation }) {
  return (
    <section id="advantages" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.advantages.headingSmall} large={t.advantages.headingLarge} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {t.advantages.items.map((item, i) => (
            <div key={i} className="card-lift bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex gap-5 items-start">
              <div className="text-4xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection({ t }: { t: Translation }) {
  const [active, setActive] = useState(0);
  const len = t.testimonials.items.length;
  const isRtl = t.direction === 'rtl';

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % len), 4500);
    return () => clearInterval(timer);
  }, [len]);

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.testimonials.headingSmall} large={t.testimonials.headingLarge} />
        <div className="relative mt-4">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${isRtl ? active * 100 : -active * 100}%)` }}
            >
              {t.testimonials.items.map((item, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="testimonial-gradient rounded-3xl p-10 border border-purple-100 text-center shadow-sm">
                    <div className="text-5xl mb-5">{item.avatar}</div>
                    <svg className="w-8 h-8 text-purple-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M10 8C6.134 8 3 11.134 3 15c0 3.866 3.134 7 7 7 .722 0 1.406-.115 2.052-.316C11.37 24.14 9.897 26 7.5 26H6v2h1.5C12.187 28 16 24.187 16 19.5V15c0-3.866-3.134-7-7-7zm12 0c-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7 .722 0 1.406-.115 2.052-.316C23.37 24.14 21.897 26 19.5 26H18v2h1.5C23.963 28 28 24.187 28 19.5V15c0-3.866-3.134-7-7-7z" />
                    </svg>
                    <p className="text-lg text-gray-700 italic leading-relaxed mb-6">{item.text}</p>
                    <div className="font-bold text-gray-900">{item.author}</div>
                    <div className="text-sm text-purple-600 font-medium">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {t.testimonials.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${active === i ? 'w-8 h-2.5 bg-purple-600' : 'w-2.5 h-2.5 bg-purple-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection({ t }: { t: Translation }) {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const isRtl = t.direction === 'rtl';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (_) { /* fail silently */ }
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div>
            <SectionHeading small={t.contact.headingSmall} large={t.contact.headingLarge} accent={t.contact.headingAccent} center={false} />
            <p className="text-gray-500 mb-8 leading-relaxed">{t.contact.description}</p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📧</div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</div>
                  <div className="text-gray-800 font-semibold">{t.contact.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📞</div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{isRtl ? 'الهاتف' : 'Téléphone'}</div>
                  <div className="text-gray-800 font-semibold">{t.contact.phone}</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-52">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106375.97870068637!2d-7.669876!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map"
              />
            </div>
          </div>

          {/* Right form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{isRtl ? 'تم الإرسال!' : 'Message envoyé !'}</h3>
                <p className="text-gray-500">{isRtl ? 'سنتواصل معك قريبًا.' : 'Nous vous répondrons dans les plus brefs délais.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.namePlaceholder}</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t.contact.namePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.emailPlaceholder}</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t.contact.emailPlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.messagePlaceholder}</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t.contact.messagePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 transition-all duration-200 resize-none" />
                </div>
                <button type="submit" className="btn-gradient w-full text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <SendIcon />
                  {t.contact.button}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ t }: { t: Translation }) {
  const socials = [
    { icon: '📘', href: '#', label: 'Facebook' },
    { icon: '🐦', href: '#', label: 'Twitter' },
    { icon: '💼', href: '#', label: 'LinkedIn' },
    { icon: '📸', href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-black text-lg text-white">My<span className="gradient-text">Tawjeh</span></span>
          </div>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="social-icon w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-base hover:bg-purple-600/30 hover:border-purple-500/50 transition-all">
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-center">{t.contact.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Language FAB ─────────────────────────────────────────────────────────────
function LangFAB({ language, setLanguage }: { language: Lang; setLanguage: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
      className="fixed bottom-6 right-6 z-50 btn-gradient text-white w-14 h-14 rounded-full shadow-2xl text-sm font-black flex items-center justify-center hover:scale-110 transition-transform duration-200 border-2 border-white/30"
      title={language === 'fr' ? 'Switch to Arabic' : 'Switch to French'}
    >
      {language === 'fr' ? 'ع' : 'FR'}
    </button>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [language, setLanguage] = useState<Lang>('fr');
  const t = translations[language];

  useEffect(() => {
    document.documentElement.dir = t.direction;
    document.documentElement.lang = language;
  }, [language, t.direction]);

  return (
    <div dir={t.direction} lang={language}>
      <Navbar language={language} setLanguage={setLanguage} t={t} />
      <main>
        <HeroSection t={t} />
        <ServicesSection t={t} />
        <HowItWorksSection t={t} />
        <CTASection t={t} />
        <AdvantagesSection t={t} />
        <TestimonialsSection t={t} />
        <ContactSection t={t} />
      </main>
      <Footer t={t} />
      <LangFAB language={language} setLanguage={setLanguage} />
    </div>
  );
}
