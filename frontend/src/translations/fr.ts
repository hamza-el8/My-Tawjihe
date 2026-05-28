import type { Translation } from '../types';

export const fr: Translation = {

    direction: 'ltr',

    nav: {

      home: 'Accueil',features: 'Fonctionnalités',news: 'Actualités', testimonials: 'Avantages',

      formations: 'Types de formations',

      bacPath: 'Avant/Après Bac',

      worldMap: 'Map Mondiale',

      contact: 'Contact', login: 'Connexion', signup: 'Inscription',

    },

    hero: {

      badge: 'Bienvenue sur MyTawjeh',

      title: 'Plateforme Intelligente',

      titleAccent: "d'Orientation par IA",

      subtitle: "Découvrez votre parcours idéal grâce à l'intelligence artificielle. Orientation personnalisée, préparation aux examens et suivi de vos progrès.",

      button: 'Commencer maintenant',

      buttonSecondary: 'En savoir plus',

      stats: [

        { value: '300K+', label: 'Étudiants aidés' },

        { value: '95%', label: 'Taux de satisfaction' },

        { value: '50+', label: 'Filières couvertes' },

      ],

    },



aiEcosystem: {



  badge: 'Le futur de l’éducation intelligente',



  title1: 'Découvrez',



  title2: 'l’expérience IA',



  subtitle:

    'Une plateforme immersive pensée pour transformer l’apprentissage, le suivi scolaire et l’expérience pédagogique grâce à l’intelligence artificielle.',



  core: 'Cœur de l’éducation intelligente',



  student: {

    title: 'Étudiant',

    subtitle:

      'Construisez votre avenir grâce à une expérience IA immersive et personnalisée.',

    button: 'Créer mon espace étudiant',



    features: [

      'Mon Profil O*NET',

      'Mes Notes',

      'Exercices intelligents',

      'Roadmap IA',

      'Assistant IA',

      'Concours',

      'Annales',

      'Notifications',

      'Actualités',

    ],

  },



  parent: {

    title: 'Parent',

    subtitle:

      'Explorez toutes les fonctionnalités intelligentes dédiées aux parents.',

    button: 'Créer mon espace parent',



    features: [

      'Suivi de mon élève',

      'Moyenne générale',

      'Notes enregistrées',

      'Progression académique',

      'Dashboard parent',

    ],

  },



  teacher: {

    title: 'Professeur',

    subtitle:

      'Découvrez les fonctionnalités pédagogiques avancées de la plateforme.',

    button: 'Créer mon espace professeur',



    features: [

      'Gestion des étudiants',

      'Suivi des notes',

      'Création d’exercices',

      'Suivi des performances',

      'Notifications',

      'Dashboard intelligent',

    ],

  },

},

    news: {

      headingSmall: 'ACTUALITÉS', headingLarge: 'Dernières nouvelles',

      items: [

        { image: '/hero-illustration.png', date: '15 Jan 2026', category: 'Orientation', title: 'Nouvelle fonctionnalité IA pour le matching des filières', excerpt: 'Découvrez notre algorithme amélioré qui analyse plus de 500 métiers adaptés au contexte marocain.', id: 1 },

        { image: '/cta-image.png', date: '10 Jan 2026', category: 'Examens', title: 'Préparation Bac 2026 : Nouveaux exercices disponibles', excerpt: 'Accédez à plus de 1000 exercices corrigés par IA pour toutes les matières du Baccalauréat.', id: 2 },

        { image: '/hero-illustration.png', date: '5 Jan 2026', category: 'Succès', title: '95% de réussite pour nos utilisateurs', excerpt: 'Les étudiants utilisant MyTawjeh ont amélioré leurs résultats de 30% en moyenne.', id: 3 },

      ],

    },

    tabs: {

      headingSmall: 'NOS MODULES', headingLarge: 'Comment ça marche ?',

      description: "Explorez chaque module de la plateforme MyTawjeh conçu pour votre réussite.",

      items: [

        { label: 'Orientation Intelligente', icon: '🧭', title: "Trouvez votre voie avec l'IA", description: "Notre système analyse vos intérêts RIASEC, vos résultats scolaires et vos aspirations pour vous proposer les filières et métiers les plus adaptés au contexte marocain.", features: ['Test de personnalité RIASEC', 'Matching avec 500+ métiers', 'Adapté au contexte marocain', 'Rapport PDF personnalisé'], color: 'from-purple-500 to-indigo-600', bg: 'from-purple-50 to-indigo-50' },

        { label: 'Préparation Examens', icon: '📝', title: 'Préparez-vous aux concours', description: "Accédez à une banque d'épreuves pour le Baccalauréat, CNC, CPGE et autres concours marocains. L'IA génère des exercices adaptés à vos lacunes.", features: ['Bac, CNC, CPGE couverts', 'Exercices générés par IA', 'Corrections détaillées', 'Planning de révision'], color: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50' },

        { label: 'Tracker Les Notes', icon: '📊', title: 'Suivez vos progrès en temps réel', description: "Entrez vos notes par matière et par période. La plateforme calcule automatiquement vos moyennes, identifie vos points faibles et vous alerte en cas de baisse.", features: ['Calcul automatique des moyennes', 'Alertes intelligentes', 'Graphiques de progression', 'Comparaison avec les objectifs'], color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50' },

        { label: 'Atteindre Vos Objectifs', icon: '🎯', title: 'Définissez et atteignez vos goals', description: "Fixez vos objectifs académiques, recevez un plan d'action hebdomadaire généré par IA, et célébrez chaque étape franchie sur votre chemin vers le succès.", features: ["Plan d'action hebdomadaire", 'Rappels et notifications', 'Badges de progression', 'Coaching IA personnalisé'], color: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50' },

      ],

    },

    cta: { badge: 'Commencez gratuitement !', title: "Démocratiser l'orientation scolaire au Maroc", description: "Plus de 300 000 élèves quittent l'école chaque année sans accompagnement. MyTawjeh est l'outil accessible, gratuit et intelligent pour tous.", button: "S'inscrire gratuitement", buttonSecondary: 'Voir une démo' },

    advantages: {

      headingSmall: 'AVANTAGES', headingLarge: 'Pourquoi MyTawjeh ?',

      items: [

        { icon: '🇲🇦', title: 'Contexte Marocain', description: 'Adapté au système éducatif marocain : Bac, CNC, CPGE, Tawjihi et plus.' },

        { icon: '🤖', title: "IA de Pointe", description: "Base O*NET mondiale adaptée localement, analyse comportementale et recommandations précises." },

        { icon: '🆓', title: '100% Gratuit', description: "Accès gratuit pour tous les élèves. Notre mission : zéro élève laissé sans orientation." },

        { icon: '📱', title: 'Multi-Plateformes', description: 'Accessible depuis votre téléphone, tablette ou ordinateur, partout et à tout moment.' },

        { icon: '🔒', title: 'Données Sécurisées', description: 'Vos données personnelles sont protégées et jamais partagées avec des tiers.' },

        { icon: '🏆', title: 'Résultats Prouvés', description: "95% des étudiants ayant utilisé MyTawjeh ont amélioré leurs résultats scolaires." },

      ],

    },

    bacPath: {

      headingSmall: 'PARCOURS SCOLAIRE',

      headingLarge: 'Où en êtes-vous dans votre parcours ?',

      intro: 'Prenez un moment pour explorer les deux parcours ci-dessous — chacun regroupe des conseils et ressources adaptés à votre situation.',

      avantBac: {

        title: 'Avant Bac',

        message: 'Vous êtes encore au collège ou au lycée ? Découvrez comment choisir la bonne filière à chaque étape de votre parcours.',

        cta: 'Explorer les étapes →',

      },

      apresBac: {

        title: 'Après Bac',

        message: 'Vous avez obtenu votre Bac ou vous préparez l’enseignement supérieur ? Explorez les filières, concours et formations pour faire le bon choix d’orientation.',

      },

      avantBacDetail: {

        badge: 'SECTION 2 — AVANT BAC',

        heading: 'Choisissez votre étape',

        goal: 'Aider les élèves avant le Bac à choisir la bonne voie, étape par étape.',

        guidanceNote: 'Cliquez sur « Explorer les étapes » pour le guide complet et les établissements.',

        back: '← Retour au choix',

        cards: [

          {

            id: 'college',

            title: 'Collège',

            subtitle: 'Préparez votre passage au lycée avec les bonnes informations.',

            iconKey: 'college',

            tags: ['Choix du lycée', 'Sciences', 'Lettres', 'Technique'],

            gradient: 'from-amber-400 to-orange-500',

            bg: 'from-amber-50 via-orange-50 to-yellow-50',

            ring: 'ring-amber-200/80',

          },

          {

            id: 'tronc',

            title: 'Tronc Commun',

            subtitle: 'Comprenez les filières pour faire le bon choix en 1ère année bac.',

            iconKey: 'tronc',

            tags: ['Choisir la filière', 'Sciences Math', 'PC', 'SVT', 'Économie'],

            gradient: 'from-sky-500 to-blue-600',

            bg: 'from-sky-50 via-blue-50 to-indigo-50',

            ring: 'ring-sky-200/80',

          },

          {

            id: '1bac',

            title: '1ère Bac',

            subtitle: 'Affinez votre spécialité et préparez votre orientation.',

            iconKey: 'bac1',

            tags: ['Spécialités', 'Coefficients', 'Post-bac'],

            gradient: 'from-violet-500 to-purple-600',

            bg: 'from-violet-50 via-purple-50 to-fuchsia-50',

            ring: 'ring-violet-200/80',

          },

          {

            id: '2bac',

            title: '2ème Bac',

            subtitle: 'Année du Bac : révisions, examen national et premières candidatures.',

            iconKey: 'bac2',

            tags: ['Examen national', 'Tawjihni', 'Révisions', 'Résultats'],

            gradient: 'from-rose-500 to-pink-600',

            bg: 'from-rose-50 via-pink-50 to-red-50',

            ring: 'ring-rose-200/80',

          },

        ],

      },

      avantBacExplore: {

        breadcrumb: 'Accueil / Avant Bac',

        title: 'Parcours',

        titleAccent: 'avant le Bac',

        subtitle: 'Guide complet du collège à la Terminale : chaque étape du système marocain, les filières, les examens et les établissements pour bien vous orienter.',

        overview: 'Au Maroc, le parcours avant le Bac comprend 4 grandes étapes : 3 années de collège (1AC→3AC), le Tronc Commun au lycée, puis la 1ère et la 2ème année bac dans la filière choisie. L\'examen national du Baccalauréat clôture ce cycle.',

        stagesTitle: 'Les 4 étapes du parcours',

        careersTitle: 'Métiers à découvrir (Collège → 1ère Bac)',

        careersNote: 'Du collège à la 1ère bac, explorez des métiers concrets — armée, sécurité, technique, santé, commerce… Chaque fiche indique quand y penser et quelle filière préparer au lycée.',

        searchCareers: 'Rechercher un métier...',

        careerFiliereLabel: 'Filière à viser au lycée',

        careerAccessLabel: 'Comment y accéder',

        careerQualitiesLabel: 'Qualités utiles',

        careerStageFilters: {

          all: 'Toutes les étapes',

          college: 'Collège',

          tronc: 'Tronc Commun',

          '1bac': '1ère Bac',

        },

        careers: [

          { id: 'militaire-college', title: 'Militaire (Forces Armées)', stage: 'college', filiere: 'Sciences ou sportives — condition physique essentielle', description: 'Servir la nation dans les Forces Armées Royales : discipline, courage, esprit d\'équipe. On peut commencer à s\'y intéresser dès le collège.', qualities: ['Discipline', 'Endurance', 'Patriotisme', 'Esprit d\'équipe'], pathway: 'Après le Bac : concours officier ou sous-officier (FAR). Dès le collège : sport régulier, bon niveau scolaire et hygiène de vie.' },

          { id: 'sportif', title: 'Sportif professionnel', stage: 'college', filiere: 'Toutes — sport et études à équilibrer', description: 'Football, athlétisme, arts martiaux… Certains clubs recrutent jeunes. Il faut un entraînement sérieux très tôt.', qualities: ['Persévérance', 'Condition physique', 'Esprit d\'équipe', 'Mental fort'], pathway: 'Centres de formation de clubs, académies sportives. Garder de bonnes notes pour une carrière alternative.' },

          { id: 'mecanicien', title: 'Mécanicien automobile', stage: 'college', filiere: 'Filière technique au lycée', description: 'Réparer et entretenir voitures, motos et engins. Métier très demandé au Maroc.', qualities: ['Manuel', 'Logique', 'Précision', 'Patience'], pathway: 'Lycée technique ou OFPPT après le Bac. Au collège : viser les sciences et la filière technique.' },

          { id: 'coiffeur', title: 'Coiffeur / Esthétique', stage: 'college', filiere: 'Peu importe — créativité et contact client', description: 'Couper, colorer, conseiller en beauté. Possibilité de travailler en salon ou ouvrir le sien.', qualities: ['Créativité', 'Contact humain', 'Soin du détail', 'Hygiène'], pathway: 'Formation professionnelle (OFPPT, centres privés) accessible après le Bac ou par apprentissage.' },

          { id: 'agriculteur', title: 'Agriculteur / Agronome', stage: 'college', filiere: 'Sciences puis SVT au lycée', description: 'Cultiver la terre, élever du bétail ou moderniser l\'agriculture marocaine (serres, irrigation, bio).', qualities: ['Patience', 'Sens pratique', 'Résistance', 'Respect de la nature'], pathway: 'ISTA agricole, IAV pour agronome, ou activité familiale. Bonnes notes en SVT au lycée.' },

          { id: 'artiste', title: 'Artiste / Musicien', stage: 'college', filiere: 'Lettres ou Arts Appliqués', description: 'Chant, musique, théâtre, dessin. Carrière difficile mais possible avec talent et travail.', qualities: ['Créativité', 'Passion', 'Persévérance', 'Courage'], pathway: 'Conservatoire, écoles d\'art, réseaux sociaux. Commencer la pratique dès le collège.' },

          { id: 'gendarme', title: 'Gendarme / Agent de sécurité', stage: 'tronc', filiere: 'Lettres, Sciences ou ST — bonne condition physique', description: 'Maintenir l\'ordre, protéger les citoyens, enquêter. Métier de service public respecté.', qualities: ['Intégrité', 'Courage', 'Calme', 'Condition physique'], pathway: 'Concours de la Gendarmerie Royale ou police après le Bac. Préparer français, culture générale et sport.' },

          { id: 'pompier', title: 'Pompier / Protection civile', stage: 'tronc', filiere: 'Sciences ou ST — sport obligatoire', description: 'Secourir les personnes, éteindre les incendies, intervenir en urgence. Métier noble et physique.', qualities: ['Courage', 'Réactivité', 'Solidarité', 'Endurance'], pathway: 'Concours après Bac ou formation interne. Entraînement sportif dès le Tronc Commun.' },

          { id: 'cuisinier', title: 'Cuisinier / Hôtellerie', stage: 'tronc', filiere: 'Toutes — français et organisation', description: 'Préparer des plats, travailler en restaurant ou hôtel. Secteur touristique important au Maroc.', qualities: ['Créativité', 'Rapidité', 'Hygiène', 'Résistance au stress'], pathway: 'École hôtelière (ISTH, privées), OFPPT cuisine. Stages en été possibles dès le lycée.' },

          { id: 'electricien', title: 'Électricien', stage: 'tronc', filiere: 'Filière technique ou ST', description: 'Installer et réparer installations électriques en maison, usine ou chantier BTP.', qualities: ['Précision', 'Sécurité', 'Logique', 'Travail en hauteur'], pathway: 'CAP/BTS électricité, OFPPT. Choisir filière technique en 2ème année bac.' },

          { id: 'infirmier-tronc', title: 'Infirmier(ère)', stage: 'tronc', filiere: 'SVT (à choisir en 2ème année bac)', description: 'Soigner et accompagner les patients à l\'hôpital. Métier humain avec beaucoup d\'emplois.', qualities: ['Empathie', 'Réactivité', 'Rigueur', 'Calme'], pathway: 'IFSI après le Bac. Dès le Tronc Commun : viser SVT et de bonnes notes en sciences.' },

          { id: 'commercant', title: 'Commerçant / Vendeur', stage: 'tronc', filiere: 'Sciences Économiques ou toutes filières', description: 'Vendre, gérer une boutique ou aider dans le commerce familial. Compétences en communication et calcul.', qualities: ['Communication', 'Persuasion', 'Organisation', 'Sourire'], pathway: 'Bac économique puis BTS commerce, ou expérience terrain. Petits jobs l\'été pour découvrir.' },

          { id: 'militaire-1bac', title: 'Officier militaire (FAR)', stage: '1bac', filiere: 'Sciences Math ou PC recommandées', description: 'En 1ère bac, préparez le concours d\'officier : niveau scientifique, sport intensif, discipline.', qualities: ['Leadership', 'Discipline', 'Endurance', 'Patriotisme'], pathway: 'Concours FAR après Bac+2 ou Bac selon filière. Entraînement physique et révisions scientifiques en 1ère et 2ème bac.' },

          { id: 'medecin', title: 'Médecin', stage: '1bac', filiere: 'SVT — excellentes notes', description: 'Soigner les malades. En 1ère bac SVT, consolidez biologie et chimie pour le concours médecine.', qualities: ['Empathie', 'Rigueur', 'Endurance', 'Analyse'], pathway: 'Faculté de médecine après Bac SVT avec très bonnes notes et concours.' },

          { id: 'ingenieur', title: 'Ingénieur', stage: '1bac', filiere: 'Sciences Math A ou PC', description: 'Construire, innover en industrie, informatique, BTP. En 1ère bac, approfondir maths et physique.', qualities: ['Logique', 'Curiosité', 'Travail d\'équipe', 'Précision'], pathway: 'CPGE puis grandes écoles. Notes élevées en maths dès la 1ère bac.' },

          { id: 'technicien-1bac', title: 'Technicien spécialisé (OFPPT)', stage: '1bac', filiere: 'Technique ou ST', description: 'Métiers qualifiés en informatique, électronique, mécanique — insertion rapide après formation courte.', qualities: ['Pratique', 'Autonomie', 'Précision', 'Adaptabilité'], pathway: 'OFPPT ou lycée qualifiant après le Bac. En 1ère bac technique : stages et spécialisation.' },

          { id: 'pilote', title: 'Pilote de ligne', stage: '1bac', filiere: 'Sciences Math A + anglais', description: 'Piloter des avions civils ou militaires. Rêve exigeant : sciences, anglais et santé parfaite.', qualities: ['Concentration', 'Calme', 'Anglais', 'Condition physique'], pathway: 'École de pilotage (RAM Academy, écoles militaires) après Bac scientifique et tests médicaux.' },

          { id: 'enseignant', title: 'Enseignant', stage: '1bac', filiere: 'Lettres, Sciences ou SH selon matière', description: 'Devenir professeur de maths, français, SVT… En 1ère bac, confirmez la matière que vous aimez enseigner.', qualities: ['Patience', 'Pédagogie', 'Passion', 'Communication'], pathway: 'Licence + Master MEEF ou concours ENS. Excellents résultats dans votre matière forte.' },

          { id: 'entrepreneur', title: 'Créateur d\'entreprise', stage: '1bac', filiere: 'Sciences Économiques ou toutes', description: 'Lancer son projet (e-commerce, services, artisanat). En 1ère bac, testez des petites idées.', qualities: ['Audace', 'Créativité', 'Persévérance', 'Organisation'], pathway: 'Pas de diplôme obligatoire mais Bac éco ou gestion aide. Clubs entrepreneuriat au lycée.' },

        ],

        schoolsTitle: 'Établissements avant le Bac',

        schoolsNote: 'Liste indicative d\'établissements publics et privés. Vérifiez toujours les filières ouvertes auprès de l\'établissement.',

        searchSchools: 'Rechercher un établissement ou une ville...',

        filterAll: 'Tous',

        filterCollege: 'Collèges',

        filterLycee: 'Lycées',

        typeCollege: 'Collège',

        typeLycee: 'Lycée',

        networkPublic: 'Public',

        networkPrivate: 'Privé',

        stages: [

          {

            id: 'college',

            title: 'Collège',

            highlightTags: ['Examen régional', 'Choix lycée', '3 filières'],

            iconKey: 'college',

            gradient: 'from-amber-400 to-orange-500',

            bg: 'from-amber-50 via-orange-50 to-yellow-50',

            intro: 'Le collège marocain dure 3 ans. Vous y construisez les bases en français, arabe, maths et sciences, puis vous préparez l\'examen régional et le passage au lycée.',

            topics: [

              { title: '1ère année collège (1AC)', description: 'Adaptation au secondaire : nouvelles matières, rythme plus soutenu. Travaillez l\'organisation et les méthodes de prise de notes dès le départ.' },

              { title: '2ème année collège (2AC)', description: 'Consolidation des acquis. Les notes commencent à compter pour l\'orientation : surveillez surtout les maths, le français et les sciences.' },

              { title: '3ème année collège (3AC)', description: 'Dernière année avant le lycée. Préparez l\'examen régional et réfléchissez sérieusement à la filière souhaitée (sciences, lettres ou technique).' },

              { title: 'Examen régional', description: 'Épreuve nationale en fin de 3AC (matières principales selon le programme). Un bon résultat facilite l\'accès aux lycées réputés et renforce votre dossier.' },

              { title: 'Choix du lycée', description: 'Comparez les filières proposées, les résultats au Bac de l\'établissement, la distance et l\'ambiance. Demandez conseil à vos professeurs et aux anciens élèves.' },

              { title: 'Filière Sciences', description: 'Pour les profils à l\'aise en maths et sciences. Ouvre l\'accès aux filières scientifiques au lycée : Sciences Math, PC, SVT, Sciences et Technologies.' },

              { title: 'Filière Lettres', description: 'Idéale si vous excellez en langues, français, arabe et sciences humaines. Mène vers Lettres, Sciences Humaines, Sciences Économiques ou Arts.' },

              { title: 'Filière Technique', description: 'Orientation plus pratique (mécanique, électricité, informatique selon l\'établissement). Pont naturel vers le lycée technique ou professionnel.' },

            ],

          },

          {

            id: 'tronc',

            title: 'Tronc Commun',

            highlightTags: ['Choix filière', '10+ options', 'Décisif'],

            iconKey: 'tronc',

            gradient: 'from-sky-500 to-blue-600',

            bg: 'from-sky-50 via-blue-50 to-indigo-50',

            intro: 'Première année au lycée : enseignement commun à tous. C\'est la dernière étape avant de choisir votre filière bac pour les 2 années suivantes — un choix structurant pour votre avenir.',

            topics: [

              { title: 'Comment choisir sa filière', description: 'Croisez vos notes (surtout maths, physique, SVT, français), vos goûts et les débouchés visés. Utilisez les tests RIASEC MyTawjeh et échangez avec le prof principal.' },

              { title: 'Sciences Math A', description: 'La filière la plus exigeante. Maths approfondies, physique. Voie royale vers CPGE, grandes écoles d\'ingénieurs, médecine et filières très sélectives.' },

              { title: 'Sciences Math B', description: 'Variante scientifique avec un équilibre maths / sciences de la vie. Convient aux profils scientifiques qui envisagent SVT ou médecine.' },

              { title: 'Sciences Physiques (PC)', description: 'Physique-chimie au centre du programme. Idéal pour l\'ingénierie, la pharmacie, les sciences exactes et certaines écoles d\'architecture.' },

              { title: 'Sciences de la Vie (SVT)', description: 'Biologie, géologie, agronomie. Incontournable pour médecine, pharmacie, dentaire, sciences agronomiques et biotechnologies.' },

              { title: 'Sciences Économiques', description: 'Maths, économie, gestion et comptabilité. Porte d\'entrée vers ENCG, commerce, finance, audit et management.' },

              { title: 'Lettres & Sciences Humaines', description: 'Littérature, philosophie, langues. Pour le droit, la communication, les sciences sociales, le journalisme et l\'enseignement.' },

              { title: 'Sciences et Technologies', description: 'Approche scientifique appliquée. Bon compromis pour les études techniques, l\'informatique et certains BTS / formations spécialisées.' },

              { title: 'Arts Appliqués', description: 'Créativité, design, arts plastiques. Pour les écoles d\'art, l\'architecture d\'intérieur, le design graphique et les métiers créatifs.' },

              { title: 'Technique & professionnel', description: 'Lycées techniques et qualifiants : formation concrète vers l\'emploi ou la poursuite en BTS, DUT et formations professionnelles.' },

            ],

          },

          {

            id: '1bac',

            title: '1ère Bac',

            highlightTags: ['Spécialisation', 'Coefficients', 'Post-bac'],

            iconKey: 'bac1',

            gradient: 'from-violet-500 to-purple-600',

            bg: 'from-violet-50 via-purple-50 to-fuchsia-50',

            intro: 'Deuxième année dans votre filière : les matières se spécialisent et les coefficients deviennent déterminants. C\'est le moment de consolider votre niveau avant la Terminale.',

            topics: [

              { title: 'Confirmer votre filière', description: 'Si les résultats sont insuffisants, un changement peut encore être envisagé (selon règlement de l\'établissement). Sinon, investissez pleinement dans votre spécialité.' },

              { title: 'Matières & coefficients', description: 'Identifiez les matières à fort coefficient dans votre filière (ex. maths en SM, SVT en filière SVT). Priorisez-les dans vos révisions avec le tracker MyTawjeh.' },

              { title: 'Approfondir les spécialités', description: 'Les cours deviennent plus techniques. Travaillez en groupe, demandez des séances de rattrapage et entraînez-vous sur les annales des années précédentes.' },

              { title: 'Organisation & méthode', description: 'Établissez un planning hebdomadaire, alternez révision et repos, et fixez des objectifs par trimestre. La régularité vaut mieux que le bachotage.' },

              { title: 'Premiers pas post-bac', description: 'Renseignez-vous sur les concours (médecine, ingénieurs), les CPGE, les ENCG et les universités. Certains concours regardent déjà les notes de 1ère bac.' },

              { title: 'Enrichir votre profil', description: 'Clubs, bénévolat, olympiades, certifications en langues (anglais, français) : tout compte pour les admissions sélectives et les bourses.' },

            ],

          },

          {

            id: '2bac',

            title: '2ème Bac (Terminale)',

            highlightTags: ['Examen national', 'Tawjihni', 'Orientation'],

            iconKey: 'bac2',

            gradient: 'from-rose-500 to-pink-600',

            bg: 'from-rose-50 via-pink-50 to-red-50',

            intro: 'Dernière année avant le diplôme : l\'examen national du Baccalauréat et les premières démarches d\'orientation vers l\'enseignement supérieur ou la formation professionnelle.',

            topics: [

              { title: 'Examen national du Bac', description: 'Épreuves nationales en fin d\'année (juin). Révisez avec les annales officielles, simulez les conditions d\'examen et maîtrisez la gestion du temps.' },

              { title: 'Contrôle continu', description: 'Les notes des devoirs surveillés et examens blancs comptent dans la note finale. Ne négligez aucun trimestre, même en fin d\'année.' },

              { title: 'Plateforme Tawjihni', description: 'Après les résultats, inscrivez-vous sur Tawjihni pour formuler vos vœux (facultés, écoles, BTS…). Respectez les dates et classez vos choix par priorité.' },

              { title: 'Révisions intensives', description: 'Plan de révision par matière, fiches de synthèse, groupes de travail. Ciblez d\'abord les matières à fort coefficient et vos points faibles identifiés sur MyTawjeh.' },

              { title: 'Gestion du stress', description: 'Sommeil régulier, pauses, activité physique. Parlez à vos proches ou à un conseiller si l\'anxiété devient envahissante — c\'est normal, vous n\'êtes pas seul.' },

              { title: 'Après les résultats', description: 'Admis : validez votre inscription dans les délais. Non admis : sessions de rattrapage, réorientation ou année de renforcement selon votre situation et vos objectifs.' },

            ],

          },

        ],

        schools: [

          { name: 'Collège Ibn Khaldoun', city: 'Rabat', type: 'college', network: 'public', stageLabel: 'Collège' },

          { name: 'Collège Al Qods', city: 'Casablanca', type: 'college', network: 'public', stageLabel: 'Collège' },

          { name: 'Collège Arrazi', city: 'Rabat', type: 'college', network: 'public', stageLabel: 'Collège' },

          { name: 'Collège Les Orangers', city: 'Rabat', type: 'college', network: 'private', stageLabel: 'Collège' },

          { name: 'Collège International de Casablanca', city: 'Casablanca', type: 'college', network: 'private', stageLabel: 'Collège' },

          { name: 'Lycée Mohamed V', city: 'Casablanca', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Moulay Youssef', city: 'Rabat', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Descartes', city: 'Rabat', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Ibn Sina', city: 'Meknès', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Majoma', city: 'Tanger', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Omar Ibn Al Khattab', city: 'Oujda', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée qualifiant Youssef Ibn Tachfine', city: 'Agadir', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée Qualifiant Hassan II', city: 'Fès', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Lycée d\'Excellence Benguerir', city: 'Benguerir', type: 'lycee', network: 'public', stageLabel: 'Tronc Commun — 1ère/2ème Bac' },

          { name: 'Groupe Scolaire La Résidence', city: 'Casablanca', type: 'lycee', network: 'private', stageLabel: 'Collège — Lycée' },

          { name: 'Lycée Victor Hugo', city: 'Marrakech', type: 'lycee', network: 'private', stageLabel: 'Collège — Lycée' },

          { name: 'Lycée Français Louis-Massignon', city: 'Casablanca', type: 'lycee', network: 'private', stageLabel: 'Collège — Lycée' },

          { name: 'Lycée Technique Mohammadia', city: 'Mohammedia', type: 'lycee', network: 'public', stageLabel: 'Filière technique' },

        ],

      },

    },

    formations: {

      headingSmall: 'Types de Formation', headingLarge: 'Trouvez la formation adaptée à votre projet',

      description: "Que vous souhaitiez intégrer une école d'ingénierie, une université ou suivre une formation",

      items: [

        {

          icon: '⚙️', color: 'from-emerald-500 to-teal-600', svgKey: 'engineer', title: "Ingénieur d'État", description: "Formation d'excellence en 3 à 5 ans via concours national (CNC) ou sur dossier.", tags: ['CNC', 'ENSA', 'EMI', 'ENSIAS'],

          duration: '3 à 5 ans', level: 'Bac+5', access: 'Concours CNC ou sur dossier après CPGE',

          intro: "La formation d'Ingénieur d'État est la voie royale pour les passionnés de sciences et de technologie au Maroc. Elle forme des ingénieurs polyvalents capables de concevoir, développer et gérer des projets complexes dans tous les secteurs.",

          points: ["Accès via le Concours National Commun (CNC) après 2 ans de CPGE", "Écoles phares : EMI, ENSA, ENSIAS, INPT, ENIM, EHTP", "Spécialités : Informatique, Génie Civil, Électronique, Industriel...", "Débouchés excellents : secteur privé, public, international", "Salaire moyen débutant : 8 000 – 15 000 DH/mois"],

          careers: ['Ingénieur logiciel', 'Chef de projet', 'Ingénieur civil', 'Data Engineer', 'Consultant IT'],

          emoji: '🏗️',

        },

        {

          icon: '🎓', color: 'from-violet-500 to-purple-700', svgKey: 'master_spe', title: 'Master Spécialisé', description: "Formation de spécialisation post-licence en 1 à 2 ans dans un domaine précis.", tags: ['Bac+5', 'Spécialisation'],

          duration: '1 à 2 ans', level: 'Bac+5', access: 'Sur dossier après Licence ou équivalent',

          intro: "Le Master Spécialisé est une formation professionnalisante de haut niveau qui permet d'acquérir une expertise pointue dans un domaine précis. Il est très apprécié par les recruteurs pour son orientation pratique et professionnelle.",

          points: ["Proposé par les grandes écoles et universités marocaines", "Très orienté marché du travail et compétences pratiques", "Possibilité de stage en entreprise de 4 à 6 mois", "Spécialités : Finance, Marketing Digital, Data Science, RH...", "Accessible aux titulaires d'une Licence ou d'un diplôme équivalent"],

          careers: ['Responsable marketing', 'Analyste financier', 'Data Scientist', 'Chef de produit', 'Consultant RH'],

          emoji: '📊',

        },

        {

          icon: '🏛️', color: 'from-blue-600 to-indigo-700', svgKey: 'doctorat', title: 'Doctorat', description: 'Formation de recherche de haut niveau menant au grade de docteur.', tags: ['Recherche', 'Bac+8'],

          duration: '3 à 5 ans', level: 'Bac+8', access: 'Sur dossier après Master Recherche',

          intro: "Le Doctorat est le diplôme le plus élevé du système universitaire. Il forme des chercheurs et experts capables de produire de nouvelles connaissances scientifiques. Au Maroc, il ouvre les portes de l'enseignement supérieur et de la recherche.",

          points: ["Réalisé au sein d'un Centre d'Études Doctorales (CED)", "Encadré par un directeur de thèse spécialisé", "Publication d'articles scientifiques dans des revues internationales", "Financement possible via bourses CNRST ou partenariats", "Débouchés : enseignant-chercheur, expert, R&D en entreprise"],

          careers: ['Chercheur universitaire', 'Professeur d\'enseignement supérieur', 'Expert R&D', 'Consultant scientifique'],

          emoji: '🔬',

        },

        {

          icon: '📚', color: 'from-orange-500 to-amber-500', svgKey: 'licence', title: 'Licence Professionnelle', description: 'Formation professionnalisante de 3 ans après le Bac, orientée insertion rapide.', tags: ['Bac+3', 'Professionnel'],

          duration: '3 ans', level: 'Bac+3', access: 'Baccalauréat toutes séries',

          intro: "La Licence Professionnelle est une formation universitaire de 3 ans qui combine théorie et pratique. Elle est conçue pour une insertion rapide dans le marché du travail, avec des stages obligatoires et des partenariats avec les entreprises.",

          points: ["Accessible après le Bac dans toutes les universités publiques", "Stages obligatoires en entreprise chaque année", "Spécialités variées : Commerce, Informatique, Tourisme, Droit...", "Possibilité de poursuivre en Master après la Licence", "Formation moins sélective, accessible au plus grand nombre"],

          careers: ['Assistant commercial', 'Technicien informatique', 'Chargé de communication', 'Assistant juridique'],

          emoji: '📋',

        },

        {

          icon: '🏫', color: 'from-rose-500 to-pink-600', svgKey: 'encg', title: 'Diplôme ENCG', description: "École Nationale de Commerce et de Gestion, formation en management et commerce.", tags: ['Commerce', 'Gestion', 'ENCG'],

          duration: '5 ans', level: 'Bac+5', access: 'Concours national après le Bac',

          intro: "L'ENCG (École Nationale de Commerce et de Gestion) est une grande école publique marocaine formant des cadres en management, commerce et gestion. Présente dans plusieurs villes, elle est reconnue pour la qualité de ses diplômés.",

          points: ["Réseau de 9 écoles à travers le Maroc (Casablanca, Fès, Agadir...)", "Formation en 5 ans avec spécialisation en 4ème et 5ème année", "Partenariats avec de grandes entreprises nationales et internationales", "Stages et projets professionnels intégrés au cursus", "Accès via concours national très compétitif"],

          careers: ['Manager commercial', 'Responsable marketing', 'Contrôleur de gestion', 'Entrepreneur', 'Auditeur'],

          emoji: '💼',

        },

        {

          icon: '📖', color: 'from-purple-500 to-fuchsia-600', svgKey: 'master', title: 'Master', description: 'Diplôme universitaire de niveau Bac+5 dans diverses disciplines académiques.', tags: ['Bac+5', 'Université'],

          duration: '2 ans après Licence', level: 'Bac+5', access: 'Sur dossier après Licence (Bac+3)',

          intro: "Le Master universitaire est un diplôme de 2 ans qui approfondit les connaissances dans une discipline. Il existe deux types : le Master Recherche (orienté vers le Doctorat) et le Master Professionnel (orienté vers l'emploi).",

          points: ["Deux parcours : Master Recherche et Master Professionnel", "Accès sélectif sur dossier et parfois entretien", "Mémoire de fin d'études obligatoire", "Spécialités dans toutes les disciplines : sciences, lettres, droit, économie...", "Passerelle vers le Doctorat pour le Master Recherche"],

          careers: ['Cadre d\'entreprise', 'Enseignant', 'Chercheur', 'Analyste', 'Responsable de projet'],

          emoji: '🎯',

        },

        {

          icon: '🔧', color: 'from-teal-500 to-cyan-600', svgKey: 'dut', title: 'DUT', description: 'Diplôme Universitaire de Technologie, formation technique de 2 ans après le Bac.', tags: ['Bac+2', 'Technologie'],

          duration: '2 ans', level: 'Bac+2', access: 'Baccalauréat scientifique ou technique',

          intro: "Le DUT (Diplôme Universitaire de Technologie) est une formation courte et technique de 2 ans dispensée dans les IUT (Instituts Universitaires de Technologie). Il prépare à une insertion rapide ou à la poursuite d'études.",

          points: ["Formation dispensée dans les IUT rattachés aux universités", "Très pratique avec de nombreux TP et projets", "Stages en entreprise obligatoires", "Spécialités : Informatique, Électronique, Génie Civil, Commerce...", "Possibilité de poursuivre en Licence Pro ou école d'ingénieurs"],

          careers: ['Technicien supérieur', 'Assistant ingénieur', 'Technicien informatique', 'Technicien de laboratoire'],

          emoji: '🛠️',

        },

        {

          icon: '🌍', color: 'from-sky-500 to-blue-600', svgKey: 'bachelor', title: 'Bachelor', description: "Diplôme de niveau Bac+3, souvent proposé par les écoles privées et à l'international.", tags: ['Bac+3', 'International'],

          duration: '3 ans', level: 'Bac+3', access: 'Baccalauréat + dossier ou entretien',

          intro: "Le Bachelor est un diplôme de niveau Bac+3 proposé principalement par les écoles privées et les établissements internationaux. Il offre une formation généraliste ou spécialisée avec une forte dimension internationale et pratique.",

          points: ["Proposé par les écoles privées et établissements internationaux", "Enseignement souvent en anglais ou bilingue", "Forte orientation internationale et stages à l'étranger possibles", "Spécialités : Business, Design, Informatique, Communication...", "Coût plus élevé que les formations publiques"],

          careers: ['Chef de projet junior', 'Chargé de communication', 'Business developer', 'Designer', 'Développeur web'],

          emoji: '✈️',

        },

        {

          icon: '🎯', color: 'from-indigo-500 to-blue-700', svgKey: 'deug', title: 'DEUG', description: "Diplôme d'Études Universitaires Générales, premier cycle universitaire de 2 ans.", tags: ['Bac+2', 'Université'],

          duration: '2 ans', level: 'Bac+2', access: 'Baccalauréat toutes séries',

          intro: "Le DEUG est le premier diplôme universitaire obtenu après 2 ans d'études. Il constitue une étape intermédiaire dans le cursus universitaire et permet de valider les bases académiques avant de poursuivre vers la Licence.",

          points: ["Premier diplôme du cycle universitaire marocain", "Accessible à tous les bacheliers sans sélection", "Couvre les fondamentaux de la discipline choisie", "Passerelle obligatoire vers la 3ème année de Licence", "Disciplines : Sciences, Lettres, Droit, Économie, Langues..."],

          careers: ['Poursuite vers Licence', 'Reconversion professionnelle', 'Accès à certains concours de la fonction publique'],

          emoji: '📚',

        },

        {

          icon: '🎓', color: 'from-yellow-500 to-orange-500', svgKey: 'cpge', title: 'CPGE – CNC', description: 'Classes Préparatoires aux Grandes Écoles, préparation intensive aux concours nationaux.', tags: ['MP', 'PC', 'TSI', 'CNC'],

          duration: '2 ans', level: 'Bac+2 (prépa)', access: 'Baccalauréat scientifique avec mention',

          intro: "Les Classes Préparatoires aux Grandes Écoles (CPGE) sont des formations d'élite de 2 ans qui préparent aux concours d'entrée des grandes écoles d'ingénieurs et de commerce. Exigeantes et sélectives, elles forment les meilleurs étudiants du Maroc.",

          points: ["Filières : MP (Maths-Physique), PC (Physique-Chimie), TSI (Techno)", "Accès très sélectif : mention Bien ou Très Bien au Bac recommandée", "Rythme intensif : 35 à 40h de cours par semaine", "Prépare au CNC (Concours National Commun) pour intégrer les grandes écoles", "Disponibles dans les lycées d'excellence à Casablanca, Rabat, Fès..."],

          careers: ['Ingénieur d\'État', 'Cadre supérieur', 'Chercheur', 'Entrepreneur tech'],

          emoji: '🏆',

        },

        {

          icon: '📝', color: 'from-green-500 to-emerald-600', svgKey: 'bac', title: 'Baccalauréat', description: "Diplôme national sanctionnant la fin des études secondaires, porte d'entrée vers le supérieur.", tags: ['Sciences', 'Lettres', 'Technique'],

          duration: '1 an (Terminale)', level: 'Bac', access: 'Élèves de Terminale',

          intro: "Le Baccalauréat marocain (Tawjihi) est le diplôme qui sanctionne la fin des études secondaires. Il est la clé d'entrée vers l'enseignement supérieur et conditionne l'accès aux différentes filières universitaires et grandes écoles.",

          points: ["Séries : Sciences Mathématiques, Sciences Expérimentales, Lettres, Technique...", "Examen national organisé par le Ministère de l'Éducation Nationale", "La mention obtenue influence l'accès aux formations sélectives", "Bac avec mention Très Bien : accès facilité aux CPGE et grandes écoles", "Reconnaissance internationale du diplôme marocain"],

          careers: ['Accès à toutes les formations supérieures', 'CPGE', 'Université', 'Écoles de commerce', 'Formation professionnelle'],

          emoji: '🎖️',

        },

        {

          icon: '⚙️', color: 'from-red-500 to-rose-600', svgKey: 'bts', title: 'BTS', description: 'Brevet de Technicien Supérieur, formation professionnelle de 2 ans après le Bac.', tags: ['Bac+2', 'OFPPT', 'Technique'],

          duration: '2 ans', level: 'Bac+2', access: 'Baccalauréat + dossier de candidature',

          intro: "Le BTS (Brevet de Technicien Supérieur) est une formation professionnelle courte et très opérationnelle de 2 ans. Dispensé par l'OFPPT et certains lycées, il prépare directement à l'emploi dans un secteur technique précis.",

          points: ["Proposé par l'OFPPT et les lycées techniques marocains", "Formation très pratique avec stages en entreprise", "Spécialités : Informatique, Électronique, Comptabilité, Hôtellerie...", "Insertion professionnelle rapide après l'obtention du diplôme", "Possibilité de poursuivre en Licence Professionnelle"],

          careers: ['Technicien supérieur', 'Assistant comptable', 'Technicien réseau', 'Agent de maîtrise', 'Responsable technique'],

          emoji: '🔩',

        },

        {

          icon: '🏛️', color: 'from-blue-500 to-sky-600', svgKey: 'bachelor', title: 'Bachelor/Master (combiné)', description: "Cursus intégré de 5 ans combinant Bachelor et Master dans une même école.", tags: ['Bac+5', 'Grande École'],

          duration: '5 ans', level: 'Bac+5', access: 'Concours ou dossier après le Bac',

          intro: "Le cursus Bachelor/Master combiné est proposé par certaines grandes écoles privées et publiques. Il permet d'obtenir en 5 ans un double diplôme reconnu sur le marché national et international.",

          points: ["Formation continue sans rupture entre Bachelor et Master", "Spécialisation progressive sur 5 ans", "Stages longue durée intégrés", "Réseau alumni actif et partenariats entreprises", "Reconnaissance nationale et internationale"],

          careers: ['Manager', 'Consultant', 'Chef de projet', 'Entrepreneur', 'Directeur commercial'],

          emoji: '🎓',

        },

        {

          icon: '📊', color: 'from-cyan-500 to-blue-500', svgKey: 'master_spe', title: 'International Master', description: "Master dispensé en anglais avec une forte dimension internationale.", tags: ['Bac+5', 'International', 'Anglais'],

          duration: '1 à 2 ans', level: 'Bac+5', access: 'Sur dossier + niveau anglais requis',

          intro: "L'International Master est une formation de haut niveau dispensée entièrement ou partiellement en anglais. Il prépare les étudiants à évoluer dans des environnements professionnels internationaux.",

          points: ["Enseignement en anglais ou bilingue", "Partenariats avec des universités étrangères", "Échanges académiques et stages à l'international", "Réseau professionnel mondial", "Très apprécié par les multinationales"],

          careers: ['Manager international', 'Consultant global', 'Business analyst', 'Chargé de développement international'],

          emoji: '🌐',

        },

        {

          icon: '🔬', color: 'from-violet-600 to-indigo-700', svgKey: 'doctorat', title: 'Doctorat en médecine', description: "Formation médicale de 7 ans menant au diplôme de Docteur en Médecine.", tags: ['Médecine', 'Bac+7', 'Santé'],

          duration: '7 ans', level: 'Bac+7', access: 'Concours d\'accès aux études médicales',

          intro: "Le Doctorat en Médecine est une formation longue et exigeante de 7 ans dispensée dans les Facultés de Médecine et de Pharmacie du Maroc. Il forme des médecins généralistes et spécialistes.",

          points: ["Accès via concours très sélectif après le Bac", "Facultés à Casablanca, Rabat, Fès, Marrakech, Oujda", "Formation clinique dans les CHU (Centres Hospitaliers Universitaires)", "Possibilité de spécialisation après le diplôme", "Débouchés : médecin généraliste, spécialiste, chercheur"],

          careers: ['Médecin généraliste', 'Médecin spécialiste', 'Chercheur médical', 'Médecin urgentiste'],

          emoji: '🏥',

        },

        {

          icon: '💼', color: 'from-amber-500 to-yellow-500', svgKey: 'encg', title: 'MBA', description: "Master of Business Administration, formation executive en management.", tags: ['Bac+5', 'Management', 'Executive'],

          duration: '1 à 2 ans', level: 'Bac+5', access: 'Expérience professionnelle + dossier',

          intro: "Le MBA (Master of Business Administration) est une formation executive destinée aux professionnels souhaitant accélérer leur carrière en management. Il est proposé par plusieurs grandes écoles marocaines et internationales.",

          points: ["Destiné aux professionnels avec expérience", "Enseignement en français et/ou anglais", "Études de cas réels et projets d'entreprise", "Réseau professionnel de haut niveau", "Spécialités : Finance, Marketing, Stratégie, RH..."],

          careers: ['Directeur général', 'Directeur financier', 'Directeur marketing', 'Entrepreneur', 'Consultant senior'],

          emoji: '👔',

        },

        {

          icon: '🔧', color: 'from-teal-600 to-green-600', svgKey: 'dut', title: 'Technicien Spécialisé', description: "Formation technique spécialisée de 2 ans dispensée par l'OFPPT.", tags: ['Bac+2', 'OFPPT', 'Spécialisé'],

          duration: '2 ans', level: 'Bac+2', access: 'Baccalauréat ou équivalent',

          intro: "Le diplôme de Technicien Spécialisé est une formation professionnelle de 2 ans dispensée par l'OFPPT. Il prépare à des métiers techniques précis avec une forte composante pratique.",

          points: ["Dispensé dans les ISTA (Instituts Spécialisés de Technologie Appliquée)", "Formation très pratique orientée métier", "Spécialités : Développement informatique, Réseaux, Électrotechnique...", "Stages en entreprise obligatoires", "Insertion professionnelle rapide"],

          careers: ['Développeur web', 'Technicien réseau', 'Électrotechnicien', 'Technicien de maintenance'],

          emoji: '⚡',

        },

        {

          icon: '📚', color: 'from-orange-600 to-red-500', svgKey: 'licence', title: 'Licence Sciences et Techniques', description: "Licence axée sur les sciences appliquées et les technologies.", tags: ['Bac+3', 'Sciences', 'Technique'],

          duration: '3 ans', level: 'Bac+3', access: 'Baccalauréat scientifique',

          intro: "La Licence Sciences et Techniques (LST) est une formation universitaire de 3 ans qui combine enseignements scientifiques fondamentaux et applications technologiques. Elle prépare à l'insertion professionnelle ou à la poursuite en Master.",

          points: ["Proposée dans les Facultés des Sciences et Techniques (FST)", "Équilibre entre théorie scientifique et pratique technologique", "Projets de fin d'études en partenariat avec des entreprises", "Passerelle vers les Masters scientifiques et techniques", "Spécialités : Génie informatique, Génie électrique, Chimie appliquée..."],

          careers: ['Technicien supérieur', 'Ingénieur junior', 'Analyste technique', 'Chargé de projet technique'],

          emoji: '🔭',

        },

        {

          icon: '🌍', color: 'from-sky-600 to-cyan-500', svgKey: 'bachelor', title: 'Maîtrise Sciences Fondamentales', description: "Formation universitaire approfondie en sciences fondamentales.", tags: ['Bac+4', 'Sciences', 'Recherche'],

          duration: '4 ans', level: 'Bac+4', access: 'Baccalauréat scientifique',

          intro: "La Maîtrise en Sciences Fondamentales est un diplôme universitaire de 4 ans qui approfondit les connaissances en mathématiques, physique, chimie ou biologie. Elle constitue une base solide pour la recherche ou l'enseignement.",

          points: ["Formation universitaire classique de 4 ans", "Accent sur les sciences pures et fondamentales", "Préparation aux concours de l'enseignement", "Passerelle vers le Master Recherche et le Doctorat", "Disciplines : Maths, Physique, Chimie, Biologie, Géologie..."],

          careers: ['Enseignant', 'Chercheur', 'Ingénieur de recherche', 'Analyste scientifique'],

          emoji: '⚗️',

        },

        {

          icon: '🎯', color: 'from-indigo-600 to-violet-700', svgKey: 'deug', title: 'Master Sciences Sociales', description: "Master en sciences humaines et sociales : sociologie, psychologie, économie.", tags: ['Bac+5', 'Sciences Sociales'],

          duration: '2 ans après Licence', level: 'Bac+5', access: 'Sur dossier après Licence en sciences humaines',

          intro: "Le Master en Sciences Sociales forme des experts en analyse sociale, économique et humaine. Il prépare aux métiers de la recherche, du conseil et du développement social.",

          points: ["Disciplines : Sociologie, Psychologie, Économie, Géographie...", "Recherche qualitative et quantitative", "Stages dans des ONG, administrations ou entreprises", "Mémoire de recherche obligatoire", "Débouchés dans le secteur public, privé et associatif"],

          careers: ['Sociologue', 'Psychologue du travail', 'Économiste', 'Chargé d\'études', 'Consultant social'],

          emoji: '🧠',

        },

        {

          icon: '🎓', color: 'from-yellow-600 to-amber-500', svgKey: 'cpge', title: 'Master Spécialisation Avancée', description: "Formation post-master de spécialisation dans un domaine d'expertise pointu.", tags: ['Bac+6', 'Expertise', 'Avancé'],

          duration: '1 an', level: 'Bac+6', access: 'Sur dossier après Master (Bac+5)',

          intro: "Le Master de Spécialisation Avancée est une formation d'un an qui permet d'acquérir une expertise très pointue dans un domaine spécifique. Il est proposé par les grandes écoles et certaines universités.",

          points: ["Formation intensive d'un an après le Master", "Très spécialisée et orientée expertise", "Projets de recherche appliquée", "Partenariats avec l'industrie", "Reconnu par les employeurs comme signe d'excellence"],

          careers: ['Expert sectoriel', 'Consultant senior', 'Directeur technique', 'Chercheur appliqué'],

          emoji: '🏅',

        },

        {

          icon: '📝', color: 'from-green-600 to-teal-500', svgKey: 'bac', title: 'Licence Sciences Juridiques', description: "Formation universitaire en droit, sciences politiques et administration.", tags: ['Bac+3', 'Droit', 'Juridique'],

          duration: '3 ans', level: 'Bac+3', access: 'Baccalauréat toutes séries',

          intro: "La Licence en Sciences Juridiques est une formation universitaire de 3 ans qui couvre le droit civil, pénal, commercial et administratif. Elle prépare aux métiers du droit et de l'administration.",

          points: ["Proposée dans les Facultés de Droit à travers le Maroc", "Couvre le droit marocain et le droit international", "Préparation aux concours de la magistrature et du notariat", "Passerelle vers le Master en droit ou les écoles de formation professionnelle", "Débouchés : avocat, notaire, magistrat, juriste d'entreprise"],

          careers: ['Avocat', 'Notaire', 'Juriste d\'entreprise', 'Magistrat', 'Conseiller juridique'],

          emoji: '⚖️',

        },

        {

          icon: '⚙️', color: 'from-rose-600 to-red-500', svgKey: 'bts', title: 'Diplôme d\'Études Supérieures Spécialisées', description: "DESS : formation professionnelle de haut niveau Bac+5 très orientée métier.", tags: ['Bac+5', 'DESS', 'Professionnel'],

          duration: '1 an après Master', level: 'Bac+5', access: 'Sur dossier après Maîtrise ou Master',

          intro: "Le DESS (Diplôme d'Études Supérieures Spécialisées) est une formation professionnelle de haut niveau qui prépare directement à l'exercice d'un métier précis. Il est très apprécié par les employeurs pour son orientation pratique.",

          points: ["Formation d'un an très professionnalisante", "Stage long en entreprise (6 mois minimum)", "Mémoire professionnel de fin d'études", "Réseau professionnel développé", "Spécialités : Finance, Droit des affaires, Informatique, Management..."],

          careers: ['Cadre supérieur', 'Directeur de département', 'Expert métier', 'Consultant spécialisé'],

          emoji: '🎯',

        },

      ],

    },

    testimonials: {

      headingSmall: 'TÉMOIGNAGES', headingLarge: 'Ce que disent nos utilisateurs',

      items: [

        { text: "MyTawjeh m'a aidé à découvrir ma passion pour l'ingénierie. Je suis maintenant en CPGE à Casablanca !", author: 'Yassine B.', role: 'Étudiant CPGE', avatar: '👨‍🎓' },

        { text: "Grâce au tracker de notes, j'ai pu identifier mes matières faibles et les améliorer avant le bac.", author: 'Fatima Z.', role: 'Bachelière 2025', avatar: '👩‍🎓' },

        { text: "L'orientation IA était très précise. Elle m'a recommandé médecine et j'ai réussi le concours d'accès !", author: 'Hamza M.', role: 'Étudiant en Médecine', avatar: '👨‍⚕️' },

      ],

    },

    contact: {

      headingSmall: 'CONTACT', headingLarge: 'Posez-nous vos', headingAccent: 'questions',

      description: "Des questions sur MyTawjeh ou besoin d'assistance ? Notre équipe est là pour vous aider.",

      email: 'contact@mytawjeh.ma', phone: '+212 5 22 00 00 00',

      namePlaceholder: 'Nom complet', emailPlaceholder: 'Votre email', messagePlaceholder: 'Votre message...',

      button: 'Envoyer le message', copyright: '© 2026 MyTawjeh. Tous droits réservés.',

    },

  };
