import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lang } from './types';

const newsData = {
  fr: [
    { id: 1, image: '/hero-illustration.png', date: '15 Jan 2026', category: 'Orientation', title: 'Nouvelle fonctionnalité IA pour le matching des filières', excerpt: 'Découvrez notre algorithme amélioré qui analyse plus de 500 métiers adaptés au contexte marocain.', content: 'Notre équipe a développé un algorithme d\'IA avancé qui analyse les intérêts, compétences et résultats scolaires des étudiants pour leur proposer les filières les plus adaptées. Basé sur la base de données O*NET adaptée au contexte marocain, le système prend en compte les spécificités du système éducatif national.' },
    { id: 2, image: '/cta-image.png', date: '10 Jan 2026', category: 'Examens', title: 'Préparation Bac 2026 : Nouveaux exercices disponibles', excerpt: 'Accédez à plus de 1000 exercices corrigés par IA pour toutes les matières du Baccalauréat.', content: 'Nous avons ajouté plus de 1000 nouveaux exercices pour la préparation du Baccalauréat 2026. Toutes les matières sont couvertes : Mathématiques, Physique-Chimie, Sciences de la Vie et de la Terre, Philosophie, Histoire-Géographie, et langues étrangères. Chaque exercice est accompagné d\'une correction détaillée générée par IA.' },
    { id: 3, image: '/hero-illustration.png', date: '5 Jan 2026', category: 'Succès', title: '95% de réussite pour nos utilisateurs', excerpt: 'Les étudiants utilisant MyTawjeh ont amélioré leurs résultats de 30% en moyenne.', content: 'Une étude récente menée auprès de 5000 utilisateurs montre que 95% des étudiants qui utilisent régulièrement MyTawjeh ont amélioré leurs résultats scolaires. L\'amélioration moyenne est de 30%, avec des gains particulièrement significatifs en mathématiques et en sciences.' },
    { id: 4, image: '/cta-image.png', date: '20 Déc 2025', category: 'Partenaire', title: 'Nouveau partenariat avec le Ministère de l\'Éducation', excerpt: 'MyTawjeh devient partenaire officiel du Ministère de l\'Éducation Nationale.', content: 'Nous sommes fiers d\'annoncer notre nouveau partenariat avec le Ministère de l\'Éducation Nationale. Cette collaboration permettra de déployer MyTawjeh dans 100 lycées pilotes à travers le Maroc, touchant ainsi plus de 50 000 élèves supplémentaires.' },
    { id: 5, image: '/hero-illustration.png', date: '10 Déc 2025', category: 'Technologie', title: 'Application mobile disponible sur iOS et Android', excerpt: 'Téléchargez maintenant l\'application MyTawjeh sur votre smartphone.', content: 'L\'application mobile MyTawjeh est maintenant disponible sur l\'App Store et Google Play. Profitez de toutes les fonctionnalités de la plateforme depuis votre smartphone : orientation IA, suivi des notes, préparation aux examens, et bien plus encore.' },
    { id: 6, image: '/cta-image.png', date: '1 Déc 2025', category: 'Événement', title: 'Webinaire : Comment réussir son orientation scolaire', excerpt: 'Inscrivez-vous à notre webinaire gratuit du 15 décembre.', content: 'Rejoignez-nous le 15 décembre pour un webinaire gratuit sur l\'orientation scolaire. Nos experts partageront des conseils pratiques pour choisir la bonne filière et préparer efficacement les examens. Des sessions de questions-réponses seront également organisées.' },
  ],
  ar: [
    { id: 1, image: '/hero-illustration.png', date: '15 يناير 2026', category: 'التوجيه', title: 'ميزة ذكاء اصطناعي جديدة لمطابقة التخصصات', excerpt: 'اكتشف خوارزميتنا المحسّنة التي تحلل أكثر من 500 مهنة متكيفة مع السياق المغربي.', content: 'طور فريقنا خوارزمية ذكاء اصطناعي متقدمة تحلل اهتمامات الطلاب ومهاراتهم ونتائجهم الدراسية لاقتراح التخصصات الأنسب لهم. تعتمد على قاعدة بيانات O*NET المكيّفة مع السياق المغربي، وتأخذ في الاعتبار خصوصيات النظام التعليمي الوطني.' },
    { id: 2, image: '/cta-image.png', date: '10 يناير 2026', category: 'الامتحانات', title: 'تحضير البكالوريا 2026: تمارين جديدة متاحة', excerpt: 'الوصول إلى أكثر من 1000 تمرين مصحح بالذكاء الاصطناعي لجميع مواد البكالوريا.', content: 'أضفنا أكثر من 1000 تمرين جديد لتحضير البكالوريا 2026. جميع المواد مغطاة: الرياضيات، الفيزياء والكيمياء، علوم الحياة والأرض، الفلسفة، التاريخ والجغرافيا، واللغات الأجنبية. كل تمرين مصحوب بتصحيح مفصل يولده الذكاء الاصطناعي.' },
    { id: 3, image: '/hero-illustration.png', date: '5 يناير 2026', category: 'النجاح', title: '95% نسبة نجاح لمستخدمينا', excerpt: 'الطلاب الذين يستخدمون MyTawjeh حسّنوا نتائجهم بنسبة 30% في المتوسط.', content: 'أظهرت دراسة حديثة أجريت على 5000 مستخدم أن 95% من الطلاب الذين يستخدمون MyTawjeh بانتظام حسّنوا نتائجهم الدراسية. متوسط التحسن هو 30%، مع مكاسب ملحوظة بشكل خاص في الرياضيات والعلوم.' },
    { id: 4, image: '/cta-image.png', date: '20 ديسمبر 2025', category: 'شراكة', title: 'شراكة جديدة مع وزارة التربية الوطنية', excerpt: 'MyTawjeh تصبح شريكًا رسميًا لوزارة التربية الوطنية.', content: 'نفخر بالإعلان عن شراكتنا الجديدة مع وزارة التربية الوطنية. ستسمح هذه الشراكة بنشر MyTawjeh في 100 ثانوية نموذجية عبر المغرب، مما سيصل إلى أكثر من 50,000 تلميذ إضافي.' },
    { id: 5, image: '/hero-illustration.png', date: '10 ديسمبر 2025', category: 'التكنولوجيا', title: 'التطبيق المحمول متاح على iOS وAndroid', excerpt: 'حمّل الآن تطبيق MyTawjeh على هاتفك الذكي.', content: 'تطبيق MyTawjeh المحمول متاح الآن على App Store وGoogle Play. استمتع بجميع ميزات المنصة من هاتفك الذكي: التوجيه بالذكاء الاصطناعي، متابعة الدرجات، التحضير للامتحانات، والمزيد.' },
    { id: 6, image: '/cta-image.png', date: '1 ديسمبر 2025', category: 'فعالية', title: 'ندوة عبر الإنترنت: كيف تنجح في توجيهك الدراسي', excerpt: 'سجّل في ندوتنا المجانية ليوم 15 ديسمبر.', content: 'انضم إلينا يوم 15 ديسمبر لندوة مجانية عبر الإنترنت حول التوجيه الدراسي. سيشارك خبراؤنا نصائح عملية لاختيار التخصص المناسب والتحضير الفعال للامتحانات. كما سيتم تنظيم جلسات أسئلة وأجوبة.' },
  ]
};

export default function NewsPage({ language, setLanguage }: { language: Lang; setLanguage: (l: Lang) => void }) {
  const navigate = useNavigate();
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const news = newsData[language];
  const isRtl = language === 'ar';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} lang={language} className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <h1 className="text-2xl font-black">
                My<span className="text-purple-200">Tawjeh</span> {isRtl ? 'الأخبار' : 'Actualités'}
              </h1>
            </div>
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium hover:bg-white/30 transition-colors"
            >
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {isRtl ? 'آخر الأخبار والتحديثات' : 'Dernières actualités et mises à jour'}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {isRtl ? 'تابع آخر التطورات في منصة MyTawjeh وكن أول من يعرف عن الميزات الجديدة والشراكات والنجاحات.' : 'Suivez les dernières évolutions de la plateforme MyTawjeh et soyez les premiers informés des nouvelles fonctionnalités, partenariats et succès.'}
          </p>
        </div>

        {/* News grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{item.category}</span>
                  <span className="text-gray-500 text-sm">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                <button
                  onClick={() => setSelectedNews(item.id)}
                  className="text-purple-600 font-semibold text-sm hover:text-purple-800 transition-colors flex items-center gap-1"
                >
                  {isRtl ? 'اقرأ المزيد →' : 'Lire la suite →'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            {isRtl ? '← العودة إلى الصفحة الرئيسية' : '← Retour à la page d\'accueil'}
          </button>
        </div>
      </main>

      {/* News detail modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isRtl ? 'تفاصيل الخبر' : 'Détails de l\'actualité'}
              </h2>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {(() => {
                const newsItem = news.find(n => n.id === selectedNews);
                if (!newsItem) return null;
                return (
                  <>
                    <div className="h-64 rounded-xl overflow-hidden mb-6">
                      <img src={newsItem.image} alt={newsItem.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">{newsItem.category}</span>
                      <span className="text-gray-600">{newsItem.date}</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">{newsItem.title}</h1>
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{newsItem.content}</p>
                  </>
                );
              })()}
            </div>
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setSelectedNews(null)}
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                {isRtl ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            {isRtl ? '© 2026 MyTawjeh. جميع الحقوق محفوظة.' : '© 2026 MyTawjeh. Tous droits réservés.'}
          </p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        ↑
      </button>
    </div>
  );
}