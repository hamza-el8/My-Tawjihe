import { useState, useEffect } from 'react';
import type React from 'react';
import Inscription from './Inscription';
import Dashboard from './Dashboard';
import type { Translation, Lang, BacStageIconKey, AvantBacCareerStage } from './types';
import { login as apiLogin, isAuthenticated, getStoredUser } from './api';

// ─── Translations ─────────────────────────────────────────────────────────────
const translations: Record<Lang, Translation> = {
  fr: {
    direction: 'ltr',
    nav: {
      home: 'Accueil', news: 'Actualités', testimonials: 'Avantages',
      formations: 'Types de formations',
      bacPath: 'Avant/Après Bac',
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
  },
  ar: {
    direction: 'rtl',
    nav: { home: 'الرئيسية', news: 'الأخبار', testimonials: 'المزايا', formations: 'أنواع التكوينات', bacPath: 'قبل/بعد البكالوريا', contact: 'تواصل معنا', login: 'تسجيل الدخول', signup: 'إنشاء حساب' },
    hero: {
      badge: 'مرحبًا بكم على MyTawjeh', title: 'منصة ذكية', titleAccent: 'للتوجيه الأكاديمي بالذكاء الاصطناعي',
      subtitle: 'اكتشف مسارك الأمثل بفضل الذكاء الاصطناعي. توجيه شخصي، تحضير للامتحانات ومتابعة تقدمك الدراسي.',
      button: 'ابدأ الآن', buttonSecondary: 'اعرف أكثر',
      stats: [{ value: '+300K', label: 'طالب مستفيد' }, { value: '95%', label: 'نسبة الرضا' }, { value: '+50', label: 'تخصص مغطى' }],
    },
    news: {
      headingSmall: 'الأخبار', headingLarge: 'آخر الأخبار',
      items: [
        { image: '/hero-illustration.png', date: '15 يناير 2026', category: 'التوجيه', title: 'ميزة ذكاء اصطناعي جديدة لمطابقة التخصصات', excerpt: 'اكتشف خوارزميتنا المحسّنة التي تحلل أكثر من 500 مهنة متكيفة مع السياق المغربي.', id: 1 },
        { image: '/cta-image.png', date: '10 يناير 2026', category: 'الامتحانات', title: 'تحضير البكالوريا 2026: تمارين جديدة متاحة', excerpt: 'الوصول إلى أكثر من 1000 تمرين مصحح بالذكاء الاصطناعي لجميع مواد البكالوريا.', id: 2 },
        { image: '/hero-illustration.png', date: '5 يناير 2026', category: 'النجاح', title: '95% نسبة نجاح لمستخدمينا', excerpt: 'الطلاب الذين يستخدمون MyTawjeh حسّنوا نتائجهم بنسبة 30% في المتوسط.', id: 3 },
      ],
    },
    tabs: {
      headingSmall: 'وحداتنا', headingLarge: 'كيف يعمل النظام؟', description: 'استكشف كل وحدة في منصة MyTawjeh المصممة لنجاحك.',
      items: [
        { label: 'التوجيه الذكي', icon: '🧭', title: 'اعثر على طريقك مع الذكاء الاصطناعي', description: 'يحلل نظامنا اهتماماتك RIASEC ونتائجك الدراسية وطموحاتك لاقتراح أفضل التخصصات والمهن في السياق المغربي.', features: ['اختبار الشخصية RIASEC', 'مطابقة مع 500+ مهنة', 'متكيف مع السياق المغربي', 'تقرير PDF شخصي'], color: 'from-purple-500 to-indigo-600', bg: 'from-purple-50 to-indigo-50' },
        { label: 'التحضير للامتحانات', icon: '📝', title: 'استعد للمسابقات', description: 'الوصول إلى بنك أسئلة للبكالوريا وCNC وCPGE وغيرها. يولد الذكاء الاصطناعي تمارين مكيّفة مع نقاط ضعفك.', features: ['البكالوريا، CNC، CPGE مغطاة', 'تمارين يولدها الذكاء الاصطناعي', 'تصحيحات مفصلة', 'جدول مراجعة'], color: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50' },
        { label: 'متتبع الدرجات', icon: '📊', title: 'تابع تقدمك في الوقت الفعلي', description: 'أدخل درجاتك لكل مادة وفترة. تحسب المنصة تلقائيًا معدلاتك وتحدد نقاط ضعفك وتنبهك عند الانخفاض.', features: ['حساب تلقائي للمعدلات', 'تنبيهات ذكية', 'رسوم بيانية للتقدم', 'مقارنة مع الأهداف'], color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50' },
        { label: 'تحقيق الأهداف', icon: '🎯', title: 'حدد أهدافك وحققها', description: 'ضع أهدافك الأكاديمية، واحصل على خطة عمل أسبوعية يولدها الذكاء الاصطناعي، واحتفل بكل خطوة تحققها.', features: ['خطة عمل أسبوعية', 'تذكيرات وإشعارات', 'شارات التقدم', 'تدريب ذكاء اصطناعي شخصي'], color: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50' },
      ],
    },
    cta: { badge: 'ابدأ مجانًا!', title: 'ديمقراطية التوجيه الأكاديمي في المغرب', description: 'أكثر من 300 ألف طالب يتركون المدرسة سنويًا بدون توجيه حقيقي. MyTawjeh هي الأداة المتاحة والمجانية والذكية للجميع.', button: 'اشترك مجانًا', buttonSecondary: 'شاهد العرض' },
    advantages: {
      headingSmall: 'المزايا', headingLarge: 'لماذا MyTawjeh؟',
      items: [
        { icon: '🇲🇦', title: 'السياق المغربي', description: 'متكيف مع النظام التعليمي المغربي: البكالوريا، CNC، CPGE والتوجيهي.' },
        { icon: '🤖', title: 'ذكاء اصطناعي متقدم', description: 'قاعدة بيانات O*NET العالمية المكيّفة محليًا مع تحليل سلوكي وتوصيات دقيقة.' },
        { icon: '🆓', title: 'مجاني 100%', description: 'وصول مجاني لجميع الطلاب. مهمتنا: لا طالب بدون توجيه.' },
        { icon: '📱', title: 'متعدد المنصات', description: 'متاح من هاتفك أو جهازك اللوحي أو حاسوبك في أي وقت ومكان.' },
        { icon: '🔒', title: 'بيانات آمنة', description: 'بياناتك الشخصية محمية ولا تُشارك أبدًا مع أطراف ثالثة.' },
        { icon: '🏆', title: 'نتائج مثبتة', description: '95% من الطلاب الذين استخدموا MyTawjeh حسّنوا نتائجهم الدراسية.' },
      ],
    },
    bacPath: {
      headingSmall: 'المسار الدراسي',
      headingLarge: 'أين أنت في مسارك الدراسي؟',
      intro: 'خذ لحظة لاستكشاف المسارين أدناه — كل منهما يجمع نصائح وموارد مناسبة لوضعك.',
      avantBac: {
        title: 'قبل البكالوريا',
        message: 'ما زلت في الإعدادي أو الثانوي؟ اكتشف كيف تختار المسار المناسب في كل مرحلة.',
        cta: 'استكشف المراحل ←',
      },
      apresBac: {
        title: 'بعد البكالوريا',
        message: 'حصلت على البكالوريا أو تستعد للتعليم العالي؟ استكشف الشعب والمسابقات والتكوينات لاتخاذ قرار التوجيه الصحيح.',
      },
      avantBacDetail: {
        badge: 'القسم 2 — قبل البكالوريا',
        heading: 'اختر مرحلتك',
        goal: 'مساعدة التلاميذ قبل البكالوريا على اختيار المسار الصحيح، مرحلة بمرحلة.',
        guidanceNote: 'انقر على « استكشف المراحل » للدليل الكامل والمؤسسات.',
        back: '→ العودة للاختيار',
        cards: [
          {
            id: 'college',
            title: 'الإعدادي',
            subtitle: 'استعد للانتقال إلى الثانوي بالمعلومات المناسبة.',
            iconKey: 'college',
            tags: ['اختيار الثانوية', 'علوم', 'آداب', 'تقني'],
            gradient: 'from-amber-400 to-orange-500',
            bg: 'from-amber-50 via-orange-50 to-yellow-50',
            ring: 'ring-amber-200/80',
          },
          {
            id: 'tronc',
            title: 'الجذع المشترك',
            subtitle: 'افهم الشعب لاتخاذ القرار الصحيح في السنة الأولى باك.',
            iconKey: 'tronc',
            tags: ['اختيار الشعبة', 'علوم رياضية', 'فيزياء-كيمياء', 'علوم الحياة', 'اقتصاد'],
            gradient: 'from-sky-500 to-blue-600',
            bg: 'from-sky-50 via-blue-50 to-indigo-50',
            ring: 'ring-sky-200/80',
          },
          {
            id: '1bac',
            title: 'الأولى باك',
            subtitle: 'حدّد تخصصك واستعد لتوجيهك.',
            iconKey: 'bac1',
            tags: ['التخصصات', 'المعاملات', 'ما بعد الباك'],
            gradient: 'from-violet-500 to-purple-600',
            bg: 'from-violet-50 via-purple-50 to-fuchsia-50',
            ring: 'ring-violet-200/80',
          },
          {
            id: '2bac',
            title: 'الثانية باك',
            subtitle: 'سنة البكالوريا: مراجعات، امتحان وطني وأولى الترشيحات.',
            iconKey: 'bac2',
            tags: ['الامتحان الوطني', 'توجيهني', 'مراجعات', 'النتائج'],
            gradient: 'from-rose-500 to-pink-600',
            bg: 'from-rose-50 via-pink-50 to-red-50',
            ring: 'ring-rose-200/80',
          },
        ],
      },
      avantBacExplore: {
        breadcrumb: 'الرئيسية / قبل البكالوريا',
        title: 'المسار',
        titleAccent: 'قبل البكالوريا',
        subtitle: 'دليل شامل من الإعدادي إلى الثانية باك: كل مرحلة في النظام المغربي، الشعب، الامتحانات والمؤسسات للتوجيه السليم.',
        overview: 'في المغرب، المسار قبل البكالوريا يشمل 4 مراحل: 3 سنوات إعدادية (الأولى→الثالثة إعدادي)، الجذع المشترك في الثانوي، ثم الأولى والثانية باك في الشعبة المختارة. الامتحان الوطني للبكالوريا يختتم هذا المسار.',
        stagesTitle: 'المراحل الأربع للمسار',
        careersTitle: 'مهن لاكتشافها (إعدادي → أولى باك)',
        careersNote: 'من الإعدادي إلى الأولى باك، اكتشف مهناً ملموسة — الجيش، الأمن، التقني، الصحة، التجارة… كل بطاقة تقول متى تفكر فيها وأي شعبة تحضر في الثانوي.',
        searchCareers: 'ابحث عن مهنة...',
        careerFiliereLabel: 'الشعبة المستهدفة في الثانوي',
        careerAccessLabel: 'كيف تصل لهذه المهنة',
        careerQualitiesLabel: 'الصفات المفيدة',
        careerStageFilters: {
          all: 'كل المراحل',
          college: 'الإعدادي',
          tronc: 'الجذع المشترك',
          '1bac': 'الأولى باك',
        },
        careers: [
          { id: 'militaire-college', title: 'عسكري (القوات المسلحة)', stage: 'college', filiere: 'علوم أو رياضة — لياقة بدنية ضرورية', description: 'خدمة الوطن في القوات المسلحة الملكية: انضباط، شجاعة، روح الفريق. يمكن الاهتمام بها من الإعدادي.', qualities: ['الانضباط', 'التحمل', 'الوطنية', 'العمل الجماعي'], pathway: 'بعد الباك: مباراة ضابط أو ضابط صف (FAR). من الإعدادي: رياضة منتظمة ومعدل جيد.' },
          { id: 'sportif', title: 'رياضي محترف', stage: 'college', filiere: 'كل الشعب — موازنة الرياضة والدراسة', description: 'كرة القدم، ألعاب القوى… بعض الأندية تكوّن الصغار. تدريب جاد منذ الصغر.', qualities: ['المثابرة', 'لياقة بدنية', 'روح الفريق', 'قوة ذهنية'], pathway: 'مراكز تكوين الأندية. الحفاظ على نقط جيدة كبديل.' },
          { id: 'mecanicien', title: 'ميكانيكي سيارات', stage: 'college', filiere: 'شعبة تقنية في الثانوي', description: 'إصلاح وصيانة السيارات والدراجات. مهنة مطلوبة في المغرب.', qualities: ['يدوي', 'منطق', 'دقة', 'صبر'], pathway: 'ثانوية تقنية أو OFPPT بعد الباك.' },
          { id: 'coiffeur', title: 'حلاق / تجميل', stage: 'college', filiere: 'أي شعبة — إبداع وتواصل', description: 'قص الشعر والتجميل. العمل في صالون أو فتح مشروعك.', qualities: ['إبداع', 'تواصل', 'اهتمام بالتفاصيل', 'نظافة'], pathway: 'تكوين مهني OFPPT أو مراكز خاصة بعد الباك.' },
          { id: 'agriculteur', title: 'فلاح / مهندس فلاحي', stage: 'college', filiere: 'علوم ثم علوم الحياة', description: 'زراعة الأرض، تربية المواشي أو تحديث الفلاحة المغربية.', qualities: ['صبر', 'حس عملي', 'تحمل', 'احترام الطبيعة'], pathway: 'ISTA فلاحي، IAV للمهندس الفلاحي.' },
          { id: 'artiste', title: 'فنان / موسيقي', stage: 'college', filiere: 'آداب أو فنون تطبيقية', description: 'غناء، موسيقى، مسرح، رسم. مسار صعب لكن ممكن بالموهبة والعمل.', qualities: ['إبداع', 'شغف', 'مثابرة', 'شجاعة'], pathway: 'كونسرفتوار، مدارس فن. ابدأ الممارسة من الإعدادي.' },
          { id: 'gendarme', title: 'دركي / أمن', stage: 'tronc', filiere: 'آداب أو علوم — لياقة بدنية', description: 'حفظ النظام وحماية المواطنين والتحقيق.', qualities: ['نزاهة', 'شجاعة', 'هدوء', 'لياقة'], pathway: 'مباراة الدرك الملكي أو الشرطة بعد الباك.' },
          { id: 'pompier', title: 'إطفائي / حماية مدنية', stage: 'tronc', filiere: 'علوم أو تقني — رياضة', description: 'إنقاذ الناس وإخماد الحرائق. مهنة نبيلة وبدنية.', qualities: ['شجاعة', 'سرعة', 'تضامن', 'تحمل'], pathway: 'مباراة بعد الباك أو تكوين داخلي.' },
          { id: 'cuisinier', title: 'طباخ / فندقة', stage: 'tronc', filiere: 'أي شعبة — فرنسية وتنظيم', description: 'إعداد الأطباق في مطاعم وفنادق. قطاع سياحي مهم.', qualities: ['إبداع', 'سرعة', 'نظافة', 'تحمل الضغط'], pathway: 'مدرسة فندقة، OFPPT مطبخ.' },
          { id: 'electricien', title: 'كهربائي', stage: 'tronc', filiere: 'تقني أو علوم وتكنولوجيات', description: 'تركيب وصيانة التمديدات الكهربائية.', qualities: ['دقة', 'سلامة', 'منطق', 'عمل في الأماكن المرتفعة'], pathway: 'CAP/BTS كهرباء، OFPPT.' },
          { id: 'infirmier-tronc', title: 'ممرض(ة)', stage: 'tronc', filiere: 'علوم الحياة (في الثانية باك)', description: 'العناية بالمرضى في المستشفى.', qualities: ['تعاطف', 'سرعة', 'انضباط', 'هدوء'], pathway: 'IFSI بعد الباك. من الجذع: استهدف علوم الحياة.' },
          { id: 'commercant', title: 'تاجر / بائع', stage: 'tronc', filiere: 'علوم اقتصادية أو أي شعبة', description: 'البيع وإدارة محل أو مساعدة في التجارة العائلية.', qualities: ['تواصل', 'إقناع', 'تنظيم', 'ابتسامة'], pathway: 'باك اقتصادي ثم BTS تجارة أو خبرة ميدانية.' },
          { id: 'militaire-1bac', title: 'ضابط (FAR)', stage: '1bac', filiere: 'علوم رياضية أ أو فيزياء-كيمياء', description: 'في الأولى باك، حضّر مباراة الضابط: مستوى علمي ورياضة وانضباط.', qualities: ['قيادة', 'انضباط', 'تحمل', 'وطنية'], pathway: 'مباراة FAR بعد الباك. تدريب بدني ومذاكرة علمية.' },
          { id: 'medecin', title: 'طبيب', stage: '1bac', filiere: 'علوم الحياة — معدل ممتاز', description: 'علاج المرضى. في الأولى باك SVT، قوِّ الأحياء والكيمياء.', qualities: ['تعاطف', 'دقة', 'تحمل', 'تحليل'], pathway: 'كلية الطب بعد باك SVT بمعدل عالٍ.' },
          { id: 'ingenieur', title: 'مهندس', stage: '1bac', filiere: 'علوم رياضية أ أو PC', description: 'البناء والابتكار في الصناعة والإعلاميات.', qualities: ['منطق', 'فضول', 'عمل جماعي', 'دقة'], pathway: 'تحضيرية ثم مدارس مهندسين.' },
          { id: 'technicien-1bac', title: 'تقني متخصص (OFPPT)', stage: '1bac', filiere: 'تقني أو علوم وتكنولوجيات', description: 'مهن مؤهلة في إعلاميات وإلكترونيك وميكانيك — إدماج سريع.', qualities: ['تطبيق', 'استقلالية', 'دقة', 'تكيف'], pathway: 'OFPPT أو ثانوية مؤهلة بعد الباك.' },
          { id: 'pilote', title: 'طيار', stage: '1bac', filiere: 'علوم رياضية أ + إنجليزية', description: 'قيادة طائرات مدنية أو عسكرية. حلم صعب: علوم وإنجليزية ولياقة.', qualities: ['تركيز', 'هدوء', 'إنجليزية', 'لياقة'], pathway: 'مدرسة طياران بعد باك علمي وفحوصات طبية.' },
          { id: 'enseignant', title: 'أستاذ', stage: '1bac', filiere: 'آداب أو علوم حسب المادة', description: 'أن تصبح أستاذ الرياضيات أو الفرنسية أو SVT…', qualities: ['صبر', 'بيداغوجيا', 'شغف', 'تواصل'], pathway: 'إجازة + ماستر MEEF أو مباراة ENS.' },
          { id: 'entrepreneur', title: 'مقاول مبتدئ', stage: '1bac', filiere: 'علوم اقتصادية أو أي شعبة', description: 'إطلاق مشروعك (تجارة إلكترونية، خدمات، حرفة).', qualities: ['جرأة', 'إبداع', 'مثابرة', 'تنظيم'], pathway: 'لا يلزم دبلوم لكن باك اقتصادي يساعد.' },
        ],
        schoolsTitle: 'مؤسسات قبل البكالوريا',
        schoolsNote: 'قائمة إرشادية لمؤسسات عمومية وخصوصية. تحقق دائمًا من الشعب المتاحة لدى المؤسسة.',
        searchSchools: 'ابحث عن مؤسسة أو مدينة...',
        filterAll: 'الكل',
        filterCollege: 'الإعداديات',
        filterLycee: 'الثانويات',
        typeCollege: 'إعدادي',
        typeLycee: 'ثانوي',
        networkPublic: 'عمومي',
        networkPrivate: 'خصوصي',
        stages: [
          {
            id: 'college',
            title: 'الإعدادي',
            highlightTags: ['الامتحان الجهوي', 'اختيار الثانوية', '3 مسالك'],
            iconKey: 'college',
            gradient: 'from-amber-400 to-orange-500',
            bg: 'from-amber-50 via-orange-50 to-yellow-50',
            intro: 'الإعدادي المغربي 3 سنوات. تبنون الأساس في الفرنسية والعربية والرياضيات والعلوم، ثم تستعدون للامتحان الجهوي والانتقال إلى الثانوي.',
            topics: [
              { title: 'السنة الأولى إعدادي', description: 'التكيف مع التعليم الثانوي: مواد جديدة وإيقاع أسرع. اعمل على التنظيم وطرق تدوين الدروس من البداية.' },
              { title: 'السنة الثانية إعدادي', description: 'تثبيت المكتسبات. النقط تبدأ تحسب للتوجيه: راقب الرياضيات والفرنسية والعلوم بشكل خاص.' },
              { title: 'السنة الثالثة إعدادي', description: 'آخر سنة قبل الثانوي. حضّر للامتحان الجهوي وفكّر جدياً في المسلك المرغوب (علوم، آداب أو تقني).' },
              { title: 'الامتحان الجهوي', description: 'امتحان وطني في نهاية الثالثة إعدادي. نتيجة جيدة تسهّل الولوج للثانويات المرموقة وتعزز ملفك.' },
              { title: 'اختيار الثانوية', description: 'قارن الشعب المقترحة ونتائج البكالوريا للمؤسسة والبعد والجو. استشر الأساتذة والتلاميذ السابقين.' },
              { title: 'مسلك العلوم', description: 'للمتمكنين في الرياضيات والعلوم. يفتح الطريق لشعب علوم رياضية، فيزياء-كيمياء، علوم الحياة والعلوم والتكنولوجيات.' },
              { title: 'مسلك الآداب', description: 'مثالي في اللغات والفرنسية والعربية والعلوم الإنسانية. يقود نحو الآداب، العلوم الإنسانية، الاقتصاد أو الفنون.' },
              { title: 'مسلك تقني', description: 'توجيه تطبيقي (ميكانيك، كهرباء، إعلاميات حسب المؤسسة). جسر طبيعي نحو الثانوي التقني أو المهني.' },
            ],
          },
          {
            id: 'tronc',
            title: 'الجذع المشترك',
            highlightTags: ['اختيار الشعبة', '+10 خيارات', 'حاسم'],
            iconKey: 'tronc',
            gradient: 'from-sky-500 to-blue-600',
            bg: 'from-sky-50 via-blue-50 to-indigo-50',
            intro: 'أولى سنة في الثانوي: تعليم مشترك للجميع. آخر مرحلة قبل اختيار شعبة البكالوريا للسنتين التاليتين — قرار مؤثر على مستقبلك.',
            topics: [
              { title: 'كيف تختار شعبتك', description: 'اقطع بين نقطك (الرياضيات، الفيزياء، علوم الحياة، الفرنسية) واهتماماتك والآفاق. استخدم اختبارات RIASEC في MyTawjeh.' },
              { title: 'علوم رياضية أ', description: 'الشعبة الأكثر صرامة. رياضيات معمقة وفيزياء. الطريق الملكي نحو التحضيرية ومدارس المهندسين والطب.' },
              { title: 'علوم رياضية ب', description: 'نسخة علمية بتوازن بين الرياضيات وعلوم الحياة. مناسبة للملفات العلمية المتجهة نحو SVT أو الطب.' },
              { title: 'علوم فيزيائية (PC)', description: 'الفيزياء والكيمياء في صلب البرنامج. مثالي للهندسة والصيدلة والعلوم الدقيقة.' },
              { title: 'علوم الحياة (SVT)', description: 'أحياء، جيولوجيا، فلاحة. ضروري للطب والصيدلة وطب الأسنان والعلوم الزراعية.' },
              { title: 'علوم اقتصادية', description: 'رياضيات، اقتصاد، تدبير ومحاسبة. بوابة ENCG والتجارة والمالية والتدقيق.' },
              { title: 'آداب وعلوم إنسانية', description: 'أدب، فلسفة، لغات. للقانون والإعلام والعلوم الاجتماعية والصحافة والتدريس.' },
              { title: 'علوم وتكنولوجيات', description: 'نهج علمي تطبيقي. حل وسط للتكوينات التقنية والإعلاميات وبعض مسارات BTS.' },
              { title: 'فنون تطبيقية', description: 'إبداع، تصميم، فنون تشكيلية. لمدارس الفن والعمارة الداخلية والتصميم الجرافيكي.' },
              { title: 'تقني ومهني', description: 'ثانويات تقنية ومؤهلة: تكوين ملموس نحو الشغل أو مواصلة BTS وDUT والتكوين المهني.' },
            ],
          },
          {
            id: '1bac',
            title: 'الأولى باك',
            highlightTags: ['تخصص', 'معاملات', 'ما بعد الباك'],
            iconKey: 'bac1',
            gradient: 'from-violet-500 to-purple-600',
            bg: 'from-violet-50 via-purple-50 to-fuchsia-50',
            intro: 'السنة الثانية في شعبتك: المواد تتخصص والمعاملات تصبح حاسمة. وقت تثبيت المستوى قبل السنة النهائية.',
            topics: [
              { title: 'تأكيد الشعبة', description: 'إن كانت النتائج ضعيفة، قد يُناقش تغيير الشعبة (حسب قوانين المؤسسة). وإلا استثمر كلياً في تخصصك.' },
              { title: 'المواد والمعاملات', description: 'حدد المواد ذات المعامل العالي في شعبتك (مثلاً الرياضيات في علوم رياضية). أولِها في المراجعة مع متتبع MyTawjeh.' },
              { title: 'تعميق التخصصات', description: 'الدروس تصبح أعمق. اعمل في مجموعات، اطلب دروساً إضافية وتدرّب على امتحانات السنوات السابقة.' },
              { title: 'التنظيم والمنهجية', description: 'ضع برنامجاً أسبوعياً، بدّل بين المراجعة والراحة، وحدد أهدافاً لكل فصل. الانتظام أفضل من الحشو ليلة الامتحان.' },
              { title: 'أول خطوات ما بعد الباك', description: 'اطلع على مسابقات الطب والمهندسين والتحضيرية وENCG والجامعات. بعض المسابقات تنظر لنقط الأولى باك.' },
              { title: 'إثراء الملف', description: 'نوادي، تطوع، أولمبيادات، شهادات لغوية: كل ذلك يهم في الولوج الانتقائي والمنح.' },
            ],
          },
          {
            id: '2bac',
            title: 'الثانية باك (النهائية)',
            highlightTags: ['امتحان وطني', 'توجيهني', 'التوجيه'],
            iconKey: 'bac2',
            gradient: 'from-rose-500 to-pink-600',
            bg: 'from-rose-50 via-pink-50 to-red-50',
            intro: 'آخر سنة قبل الشهادة: الامتحان الوطني للبكالوريا وأولى خطوات التوجيه نحو التعليم العالي أو التكوين المهني.',
            topics: [
              { title: 'الامتحان الوطني للبكالوريا', description: 'امتحانات وطنية في نهاية السنة (يونيو). راجع بمواضيع سنوات سابقة وحاكِ ظروف الامتحان وأتقن إدارة الوقت.' },
              { title: 'المراقبة المستمرة', description: 'نقط الفروض والامتحانات التجريبية تحسب في النتيجة النهائية. لا تهمل أي فصل، حتى في الأخير.' },
              { title: 'منصة توجيهني', description: 'بعد النتائج، سجّل على توجيهني لترشيح رغباتك (كليات، مدارس، BTS…). احترم الآجال ورتب اختياراتك حسب الأولوية.' },
              { title: 'مراجعات مكثفة', description: 'خطة مراجعة لكل مادة، ملخصات، مجموعات عمل. ركّز أولاً على المواد ذات المعامل العالي ونقاط ضعفك في MyTawjeh.' },
              { title: 'إدارة التوتر', description: 'نوم منتظم، استراحات، نشاط بدني. تحدث مع مقربين أو مستشار إن أصبح القلق طاغياً — هذا طبيعي.' },
              { title: 'بعد النتائج', description: 'ناجح: أكد تسجيلك في الآجال. راسب: دورة استدراكية، إعادة توجيه أو سنة تقوية حسب وضعك وأهدافك.' },
            ],
          },
        ],
        schools: [
          { name: 'إعدادية ابن خلدون', city: 'الرباط', type: 'college', network: 'public', stageLabel: 'إعدادي' },
          { name: 'إعدادية القدس', city: 'الدار البيضاء', type: 'college', network: 'public', stageLabel: 'إعدادي' },
          { name: 'إعدادية الرازي', city: 'الرباط', type: 'college', network: 'public', stageLabel: 'إعدادي' },
          { name: 'إعدادية البرتقال', city: 'الرباط', type: 'college', network: 'private', stageLabel: 'إعدادي' },
          { name: 'المدرسة الدولية بالدار البيضاء', city: 'الدار البيضاء', type: 'college', network: 'private', stageLabel: 'إعدادي' },
          { name: 'ثانوية محمد الخامس', city: 'الدار البيضاء', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية مولاي يوسف', city: 'الرباط', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية ديكارت', city: 'الرباط', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية ابن سينا', city: 'مكناس', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية ماجومة', city: 'طنجة', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية عمر بن الخطاب', city: 'وجدة', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية يوسف بن تاشفين', city: 'أكادير', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية الحسن الثاني', city: 'فاس', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'ثانوية التميز بنجرير', city: 'بنجرير', type: 'lycee', network: 'public', stageLabel: 'جذع مشترك — أولى/ثانية باك' },
          { name: 'مجموعة المدرسة La Résidence', city: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabel: 'إعدادي — ثانوي' },
          { name: 'ثانوية فيكتور هوغو', city: 'مراكش', type: 'lycee', network: 'private', stageLabel: 'إعدادي — ثانوي' },
          { name: 'ثانوية لويس ماسينيون', city: 'الدار البيضاء', type: 'lycee', network: 'private', stageLabel: 'إعدادي — ثانوي' },
          { name: 'ثانوية تقنية المحمدية', city: 'المحمدية', type: 'lycee', network: 'public', stageLabel: 'شعبة تقنية' },
        ],
      },
    },
    formations: {
      headingSmall: 'أنواع التكوين', headingLarge: 'ابحث عن التكوين المناسب لمشروعك',
      description: 'سواء أردت الالتحاق بمدرسة هندسية أو جامعة أو متابعة تكوين مهني',
      items: [
        {
          icon: '⚙️', color: 'from-emerald-500 to-teal-600', svgKey: 'engineer', title: 'مهندس دولة', description: 'تكوين متميز من 3 إلى 5 سنوات عبر المباراة الوطنية (CNC) أو على أساس الملف.', tags: ['CNC', 'ENSA', 'EMI', 'ENSIAS'],
          duration: '3 إلى 5 سنوات', level: 'بك+5', access: 'مباراة CNC أو على أساس الملف بعد CPGE',
          intro: 'تكوين مهندس الدولة هو المسار المتميز لعشاق العلوم والتكنولوجيا في المغرب. يُخرّج مهندسين متعددي الكفاءات قادرين على تصميم وتطوير وتسيير مشاريع معقدة في جميع القطاعات.',
          points: ['الولوج عبر المباراة الوطنية المشتركة (CNC) بعد سنتين من CPGE', 'المدارس الكبرى: EMI، ENSA، ENSIAS، INPT، ENIM، EHTP', 'التخصصات: الإعلاميات، الهندسة المدنية، الإلكترونيك، الصناعي...', 'فرص عمل ممتازة: القطاع الخاص، العام، الدولي', 'متوسط الراتب للمبتدئ: 8,000 – 15,000 درهم/شهر'],
          careers: ['مهندس برمجيات', 'مدير مشروع', 'مهندس مدني', 'مهندس بيانات', 'مستشار تقني'],
          emoji: '🏗️',
        },
        {
          icon: '🎓', color: 'from-violet-500 to-purple-700', svgKey: 'master_spe', title: 'ماستر متخصص', description: 'تكوين تخصصي بعد الإجازة من سنة إلى سنتين في مجال محدد.', tags: ['بك+5', 'تخصص'],
          duration: 'سنة إلى سنتين', level: 'بك+5', access: 'على أساس الملف بعد الإجازة أو ما يعادلها',
          intro: 'الماستر المتخصص تكوين مهني رفيع المستوى يُمكّن من اكتساب خبرة عميقة في مجال محدد. يحظى بتقدير كبير من المشغّلين لتوجهه العملي والمهني.',
          points: ['تقدمه المدارس الكبرى والجامعات المغربية', 'موجه بشكل كبير نحو سوق الشغل والكفاءات التطبيقية', 'إمكانية التدرب في المقاولات من 4 إلى 6 أشهر', 'تخصصات: المالية، التسويق الرقمي، علم البيانات، الموارد البشرية...', 'متاح لحاملي الإجازة أو ما يعادلها'],
          careers: ['مسؤول تسويق', 'محلل مالي', 'عالم بيانات', 'مدير منتج', 'مستشار موارد بشرية'],
          emoji: '📊',
        },
        {
          icon: '🏛️', color: 'from-blue-600 to-indigo-700', svgKey: 'doctorat', title: 'دكتوراه', description: 'تكوين بحثي رفيع المستوى يُفضي إلى درجة الدكتوراه.', tags: ['بحث', 'بك+8'],
          duration: '3 إلى 5 سنوات', level: 'بك+8', access: 'على أساس الملف بعد ماستر البحث',
          intro: 'الدكتوراه هي أعلى شهادة في النظام الجامعي. تُكوّن باحثين وخبراء قادرين على إنتاج معارف علمية جديدة. في المغرب، تفتح أبواب التعليم العالي والبحث العلمي.',
          points: ['تُنجز داخل مراكز الدراسات الدكتورالية (CED)', 'تحت إشراف مدير أطروحة متخصص', 'نشر مقالات علمية في مجلات دولية محكّمة', 'إمكانية التمويل عبر منح CNRST أو شراكات', 'مجالات العمل: أستاذ باحث، خبير، بحث وتطوير في المقاولات'],
          careers: ['باحث جامعي', 'أستاذ التعليم العالي', 'خبير بحث وتطوير', 'مستشار علمي'],
          emoji: '🔬',
        },
        {
          icon: '📚', color: 'from-orange-500 to-amber-500', svgKey: 'licence', title: 'إجازة مهنية', description: 'تكوين مهني لمدة 3 سنوات بعد الباك، موجه للاندماج السريع في سوق الشغل.', tags: ['بك+3', 'مهني'],
          duration: '3 سنوات', level: 'بك+3', access: 'شهادة البكالوريا بجميع شعبها',
          intro: 'الإجازة المهنية تكوين جامعي لمدة 3 سنوات يجمع بين النظرية والتطبيق. صُمّمت للاندماج السريع في سوق الشغل، مع تدريبات إلزامية وشراكات مع المقاولات.',
          points: ['متاحة بعد الباك في جميع الجامعات العمومية', 'تدريبات إلزامية في المقاولات كل سنة', 'تخصصات متنوعة: التجارة، الإعلاميات، السياحة، الحقوق...', 'إمكانية متابعة الماستر بعد الإجازة', 'تكوين أقل انتقائية، متاح للجميع'],
          careers: ['مساعد تجاري', 'تقني إعلاميات', 'مكلف بالتواصل', 'مساعد قانوني'],
          emoji: '📋',
        },
        {
          icon: '🏫', color: 'from-rose-500 to-pink-600', svgKey: 'encg', title: 'دبلوم ENCG', description: 'المدرسة الوطنية للتجارة والتسيير، تكوين في الإدارة والتجارة.', tags: ['تجارة', 'تسيير', 'ENCG'],
          duration: '5 سنوات', level: 'بك+5', access: 'مباراة وطنية بعد الباك',
          intro: 'ENCG (المدرسة الوطنية للتجارة والتسيير) مدرسة عمومية مغربية كبرى تُكوّن أطراً في التدبير والتجارة والتسيير. موجودة في عدة مدن، معروفة بجودة خريجيها.',
          points: ['شبكة من 9 مدارس عبر المغرب (الدار البيضاء، فاس، أكادير...)', 'تكوين لمدة 5 سنوات مع تخصص في السنة الرابعة والخامسة', 'شراكات مع كبرى المقاولات الوطنية والدولية', 'تدريبات ومشاريع مهنية مدمجة في المسار الدراسي', 'ولوج عبر مباراة وطنية تنافسية جداً'],
          careers: ['مدير تجاري', 'مسؤول تسويق', 'مراقب تسيير', 'رائد أعمال', 'مدقق حسابات'],
          emoji: '💼',
        },
        {
          icon: '📖', color: 'from-purple-500 to-fuchsia-600', svgKey: 'master', title: 'ماستر', description: 'شهادة جامعية من مستوى بك+5 في مختلف التخصصات الأكاديمية.', tags: ['بك+5', 'جامعة'],
          duration: 'سنتان بعد الإجازة', level: 'بك+5', access: 'على أساس الملف بعد الإجازة (بك+3)',
          intro: 'الماستر الجامعي شهادة لمدة سنتين تُعمّق المعارف في تخصص معين. يوجد نوعان: ماستر البحث (نحو الدكتوراه) وماستر المهن (نحو التشغيل).',
          points: ['مسارين: ماستر البحث وماستر المهن', 'ولوج انتقائي على أساس الملف وأحياناً مقابلة', 'بحث نهاية الدراسة إلزامي', 'تخصصات في جميع المجالات: علوم، آداب، حقوق، اقتصاد...', 'جسر نحو الدكتوراه لماستر البحث'],
          careers: ['إطار في مقاولة', 'أستاذ', 'باحث', 'محلل', 'مسؤول مشروع'],
          emoji: '🎯',
        },
        {
          icon: '🔧', color: 'from-teal-500 to-cyan-600', svgKey: 'dut', title: 'DUT', description: 'دبلوم التقنية الجامعية، تكوين تقني لمدة سنتين بعد الباك.', tags: ['بك+2', 'تكنولوجيا'],
          duration: 'سنتان', level: 'بك+2', access: 'بكالوريا علمية أو تقنية',
          intro: 'DUT (دبلوم التقنية الجامعية) تكوين قصير وتقني لمدة سنتين يُقدَّم في المعاهد الجامعية للتكنولوجيا (IUT). يُعدّ للاندماج السريع أو متابعة الدراسة.',
          points: ['تكوين يُقدَّم في IUT التابعة للجامعات', 'تطبيقي جداً مع أعمال تطبيقية ومشاريع كثيرة', 'تدريبات إلزامية في المقاولات', 'تخصصات: الإعلاميات، الإلكترونيك، الهندسة المدنية، التجارة...', 'إمكانية متابعة الإجازة المهنية أو مدرسة المهندسين'],
          careers: ['تقني سامٍ', 'مساعد مهندس', 'تقني إعلاميات', 'تقني مختبر'],
          emoji: '🛠️',
        },
        {
          icon: '🌍', color: 'from-sky-500 to-blue-600', svgKey: 'bachelor', title: 'Bachelor', description: 'شهادة من مستوى بك+3، تُقدمها المدارس الخاصة والمؤسسات الدولية.', tags: ['بك+3', 'دولي'],
          duration: '3 سنوات', level: 'بك+3', access: 'بكالوريا + ملف أو مقابلة',
          intro: 'البكالوريوس شهادة من مستوى بك+3 تُقدمها أساساً المدارس الخاصة والمؤسسات الدولية. يوفر تكويناً عاماً أو متخصصاً ذا بُعد دولي وتطبيقي قوي.',
          points: ['تُقدمه المدارس الخاصة والمؤسسات الدولية', 'التدريس غالباً بالإنجليزية أو ثنائي اللغة', 'بُعد دولي قوي وإمكانية التدرب في الخارج', 'تخصصات: الأعمال، التصميم، الإعلاميات، التواصل...', 'تكلفة أعلى من التكوينات العمومية'],
          careers: ['مدير مشروع مبتدئ', 'مكلف بالتواصل', 'مطور أعمال', 'مصمم', 'مطور ويب'],
          emoji: '✈️',
        },
        {
          icon: '🎯', color: 'from-indigo-500 to-blue-700', svgKey: 'deug', title: 'DEUG', description: 'دبلوم الدراسات الجامعية العامة، الدورة الأولى من سنتين.', tags: ['بك+2', 'جامعة'],
          duration: 'سنتان', level: 'بك+2', access: 'شهادة البكالوريا بجميع شعبها',
          intro: 'DEUG هو أول دبلوم جامعي يُحصل عليه بعد سنتين من الدراسة. يُشكّل مرحلة وسيطة في المسار الجامعي ويُمكّن من تثبيت الأسس الأكاديمية قبل متابعة الإجازة.',
          points: ['أول دبلوم في المسار الجامعي المغربي', 'متاح لجميع حاملي الباك دون انتقاء', 'يغطي أسس التخصص المختار', 'جسر إلزامي نحو السنة الثالثة من الإجازة', 'التخصصات: العلوم، الآداب، الحقوق، الاقتصاد، اللغات...'],
          careers: ['متابعة نحو الإجازة', 'إعادة التوجيه المهني', 'الولوج لبعض مباريات الوظيفة العمومية'],
          emoji: '📚',
        },
        {
          icon: '🎓', color: 'from-yellow-500 to-orange-500', svgKey: 'cpge', title: 'CPGE – CNC', description: 'الأقسام التحضيرية للمدارس العليا، تحضير مكثف للمباريات الوطنية.', tags: ['MP', 'PC', 'TSI', 'CNC'],
          duration: 'سنتان', level: 'بك+2 (تحضيري)', access: 'بكالوريا علمية بميزة',
          intro: 'الأقسام التحضيرية للمدارس العليا (CPGE) تكوينات نخبوية لمدة سنتين تُعدّ لمباريات الدخول إلى المدارس الكبرى للمهندسين والتجارة. مطلوبة وانتقائية، تُكوّن أفضل الطلاب في المغرب.',
          points: ['الشعب: MP (رياضيات-فيزياء)، PC (فيزياء-كيمياء)، TSI (تقني)', 'ولوج انتقائي جداً: ميزة حسن أو مستحسن في الباك موصى بها', 'إيقاع مكثف: 35 إلى 40 ساعة دراسة أسبوعياً', 'تُعدّ للمباراة الوطنية المشتركة (CNC) للالتحاق بالمدارس الكبرى', 'متوفرة في ثانويات التميز بالدار البيضاء والرباط وفاس...'],
          careers: ['مهندس دولة', 'إطار سامٍ', 'باحث', 'رائد أعمال تقني'],
          emoji: '🏆',
        },
        {
          icon: '📝', color: 'from-green-500 to-emerald-600', svgKey: 'bac', title: 'البكالوريا', description: 'الشهادة الوطنية التي تُتوّج الدراسة الثانوية وتفتح أبواب التعليم العالي.', tags: ['علوم', 'آداب', 'تقني'],
          duration: 'سنة (الثانوية التأهيلية)', level: 'باك', access: 'تلاميذ السنة الثانية ثانوي تأهيلي',
          intro: 'البكالوريا المغربية (التوجيهي) هي الشهادة التي تُتوّج الدراسة الثانوية. هي مفتاح الولوج إلى التعليم العالي وتُحدد إمكانية الالتحاق بمختلف المسارات الجامعية والمدارس الكبرى.',
          points: ['الشعب: العلوم الرياضية، العلوم التجريبية، الآداب، التقني...', 'امتحان وطني تنظمه وزارة التربية الوطنية', 'الميزة المحصل عليها تؤثر على الولوج للتكوينات الانتقائية', 'باك بميزة مستحسن جداً: ولوج مُيسَّر للـ CPGE والمدارس الكبرى', 'الاعتراف الدولي بالشهادة المغربية'],
          careers: ['الولوج لجميع التكوينات العليا', 'CPGE', 'الجامعة', 'مدارس التجارة', 'التكوين المهني'],
          emoji: '🎖️',
        },
        {
          icon: '⚙️', color: 'from-red-500 to-rose-600', svgKey: 'bts', title: 'BTS', description: 'شهادة التقني العالي، تكوين مهني لمدة سنتين بعد الباك.', tags: ['بك+2', 'OFPPT', 'تقني'],
          duration: 'سنتان', level: 'بك+2', access: 'بكالوريا + ملف الترشيح',
          intro: 'BTS (شهادة التقني العالي) تكوين مهني قصير وعملي جداً لمدة سنتين. تُقدمه OFPPT وبعض الثانويات التقنية، ويُعدّ مباشرة للتشغيل في قطاع تقني محدد.',
          points: ['تُقدمه OFPPT والثانويات التقنية المغربية', 'تكوين تطبيقي جداً مع تدريبات في المقاولات', 'تخصصات: الإعلاميات، الإلكترونيك، المحاسبة، الفندقة...', 'اندماج مهني سريع بعد الحصول على الشهادة', 'إمكانية متابعة الإجازة المهنية'],
          careers: ['تقني سامٍ', 'مساعد محاسب', 'تقني شبكات', 'عون تحكم', 'مسؤول تقني'],
          emoji: '🔩',
        },
        {
          icon: '🏛️', color: 'from-blue-500 to-sky-600', svgKey: 'bachelor', title: 'Bachelor/Master (مدمج)', description: 'مسار متكامل لمدة 5 سنوات يجمع بين Bachelor و Master في نفس المدرسة.', tags: ['بك+5', 'المدرسة الكبرى'],
          duration: '5 سنوات', level: 'بك+5', access: 'مباراة أو ملف بعد الباك',
          intro: 'المسار المدمج Bachelor/Master تقدمه بعض المدارس الكبرى الخاصة والعمومية. يُمكّن من الحصول في 5 سنوات على شهادة مزدوجة معترف بها محلياً ودولياً.',
          points: ['تكوين مستمر بدون انقطاع بين Bachelor و Master', 'تخصص تدريجي على مدى 5 سنوات', 'تدريبات طويلة المدة مدمجة', 'شبكة خريجين نشطة وشراكات مع المقاولات', 'اعتراف وطني ودولي'],
          careers: ['مدير', 'مستشار', 'مدير مشروع', 'رائد أعمال', 'مدير تجاري'],
          emoji: '🎓',
        },
        {
          icon: '📊', color: 'from-cyan-500 to-blue-500', svgKey: 'master_spe', title: 'International Master', description: 'ماستر يُقدّم بالإنجليزية مع بُعد دولي قوي.', tags: ['بك+5', 'دولي', 'إنجليزية'],
          duration: 'سنة إلى سنتين', level: 'بك+5', access: 'على أساس الملف + مستوى إنجليزي مطلوب',
          intro: 'International Master تكوين رفيع المستوى يُقدّم بالكامل أو جزئياً بالإنجليزية. يُعدّ الطلاب للعمل في بيئات مهنية دولية.',
          points: ['التدريس بالإنجليزية أو ثنائي اللغة', 'شراكات مع جامعات أجنبية', 'تبادلات أكاديمية وتدريبات دولية', 'شبكة مهنية عالمية', 'مقدر جداً من قبل الشركات متعددة الجنسيات'],
          careers: ['مدير دولي', 'مستشار عالمي', 'محلل أعمال', 'مكلف بالتنمية الدولية'],
          emoji: '🌐',
        },
        {
          icon: '🔬', color: 'from-violet-600 to-indigo-700', svgKey: 'doctorat', title: 'دكتوراه في الطب', description: 'تكوين طبي لمدة 7 سنوات يؤدي إلى شهادة دكتور في الطب.', tags: ['طب', 'بك+7', 'صحة'],
          duration: '7 سنوات', level: 'بك+7', access: 'مباراة الولوج للدراسات الطبية',
          intro: 'دكتوراه الطب تكوين طويل ومتطلب لمدة 7 سنوات يُقدّم في كليات الطب والصيدلة بالمغرب. يُكوّن أطباء عامين ومتخصصين.',
          points: ['الولوج عبر مباراة انتقائية جداً بعد الباك', 'كليات في الدار البيضاء، الرباط، فاس، مراكش، وجدة', 'تكوين سريري في المستشفيات الجامعية', 'إمكانية التخصص بعد الشهادة', 'مجالات العمل: طبيب عام، متخصص، باحث'],
          careers: ['طبيب عام', 'طبيب متخصص', 'باحث طبي', 'طبيب إسعاف'],
          emoji: '🏥',
        },
        {
          icon: '💼', color: 'from-amber-500 to-yellow-500', svgKey: 'encg', title: 'MBA', description: 'Master of Business Administration، تكوين تنفيذي في التدبير.', tags: ['بك+5', 'تدبير', 'تنفيذي'],
          duration: 'سنة إلى سنتين', level: 'بك+5', access: 'خبرة مهنية + ملف',
          intro: 'MBA (Master of Business Administration) تكوين تنفيذي موجه للمهنيين الراغبين في تسريع مسارهم المهني في التدبير. تقدمه عدة مدارس كبرى مغربية ودولية.',
          points: ['موجه للمهنيين ذوي الخبرة', 'التدريس بالفرنسية و/أو الإنجليزية', 'دراسات حالة حقيقية ومشاريع مقاولات', 'شبكة مهنية رفيعة المستوى', 'تخصصات: المالية، التسويق، الاستراتيجية، الموارد البشرية...'],
          careers: ['مدير عام', 'مدير مالي', 'مدير تسويق', 'رائد أعمال', 'مستشار رفيع المستوى'],
          emoji: '👔',
        },
        {
          icon: '🔧', color: 'from-teal-600 to-green-600', svgKey: 'dut', title: 'تقني متخصص', description: 'تكوين تقني متخصص لمدة سنتين تقدمه OFPPT.', tags: ['بك+2', 'OFPPT', 'متخصص'],
          duration: 'سنتان', level: 'بك+2', access: 'بكالوريا أو ما يعادلها',
          intro: 'دبلوم التقني المتخصص تكوين مهني لمدة سنتين تقدمه OFPPT. يُعد لمهن تقنية دقيقة مع مكون تطبيقي قوي.',
          points: ['يُقدّم في المعاهد المتخصصة في التكنولوجيا التطبيقية (ISTA)', 'تكوين تطبيقي جداً موجه نحو المهنة', 'تخصصات: تطوير الإعلاميات، الشبكات، الكهروتقني...', 'تدريبات إلزامية في المقاولات', 'اندماج مهني سريع'],
          careers: ['مطور ويب', 'تقني شبكات', 'كهروتقني', 'تقني صيانة'],
          emoji: '⚡',
        },
        {
          icon: '📚', color: 'from-orange-600 to-red-500', svgKey: 'licence', title: 'إجازة العلوم والتقنيات', description: 'إجازة موجهة نحو العلوم التطبيقية والتكنولوجيات.', tags: ['بك+3', 'علوم', 'تقني'],
          duration: '3 سنوات', level: 'بك+3', access: 'بكالوريا علمية',
          intro: 'إجازة العلوم والتقنيات (LST) تكوين جامعي لمدة 3 سنوات يجمع بين التعليمات العلمية الأساسية والتطبيقات التكنولوجية. تُعد للاندماج المهني أو متابعة الماستر.',
          points: ['تُقدم في كليات العلوم والتقنيات (FST)', 'توازن بين النظرية العلمية والتطبيق التكنولوجي', 'مشاريع نهاية الدراسة بالشراكة مع المقاولات', 'جسر نحو الماستر العلمي والتقني', 'تخصصات: الهندسة الإعلامية، الهندسة الكهربائية، الكيمياء التطبيقية...'],
          careers: ['تقني سامٍ', 'مهندس مبتدئ', 'محلل تقني', 'مكلف بمشروع تقني'],
          emoji: '🔭',
        },
        {
          icon: '🌍', color: 'from-sky-600 to-cyan-500', svgKey: 'bachelor', title: 'ماجستير العلوم الأساسية', description: 'تكوين جامعي معمق في العلوم الأساسية.', tags: ['بك+4', 'علوم', 'بحث'],
          duration: '4 سنوات', level: 'بك+4', access: 'بكالوريا علمية',
          intro: 'الماجستير في العلوم الأساسية شهادة جامعية لمدة 4 سنوات تُعمّق المعارف في الرياضيات، الفيزياء، الكيمياء أو الأحياء. تُشكّل قاعدة صلحة للبحث أو التعليم.',
          points: ['تكوين جامعي كلاسيكي لمدة 4 سنوات', 'تركيز على العلوم النقية والأساسية', 'التحضير لمباريات التعليم', 'جسر نحو ماستر البحث والدكتوراه', 'التخصصات: الرياضيات، الفيزياء، الكيمياء، الأحياء، الجيولوجيا...'],
          careers: ['أستاذ', 'باحث', 'مهندس بحث', 'محلل علمي'],
          emoji: '⚗️',
        },
        {
          icon: '🎯', color: 'from-indigo-600 to-violet-700', svgKey: 'deug', title: 'ماستر العلوم الاجتماعية', description: 'ماستر في العلوم الإنسانية والاجتماعية: علم الاجتماع، علم النفس، الاقتصاد.', tags: ['بك+5', 'علوم اجتماعية'],
          duration: 'سنتان بعد الإجازة', level: 'بك+5', access: 'على أساس الملف بعد إجازة في العلوم الإنسانية',
          intro: 'ماستر العلوم الاجتماعية يُكوّن خبراء في التحليل الاجتماعي والاقتصادي والإنساني. يُعد لمهن البحث والاستشارة والتنمية الاجتماعية.',
          points: ['التخصصات: علم الاجتماع، علم النفس، الاقتصاد، الجغرافيا...', 'بحث نوعي وكمي', 'تدريبات في الجمعيات، الإدارات أو المقاولات', 'بحث نهاية الدراسة إلزامي', 'مجالات العمل في القطاع العمومي، الخاص والجمعي'],
          careers: ['عالم اجتماع', 'أخصائي نفس العمل', 'اقتصادي', 'مكلف بالدراسات', 'مستشار اجتماعي'],
          emoji: '🧠',
        },
        {
          icon: '🎓', color: 'from-yellow-600 to-amber-500', svgKey: 'cpge', title: 'ماستر التخصص المتقدم', description: 'تكوين ما بعد ماستر للتخصص في مجال خبرة دقيق.', tags: ['بك+6', 'خبرة', 'متقدم'],
          duration: 'سنة', level: 'بك+6', access: 'على أساس الملف بعد الماستر (بك+5)',
          intro: 'ماستر التخصص المتقدم تكوين لمدة سنة يُمكّن من اكتساب خبرة دقيقة جداً في مجال محدد. تقدمه المدارس الكبرى وبعض الجامعات.',
          points: ['تكوين مكثف لمدة سنة بعد الماستر', 'متخصص جداً وموجه نحو الخبرة', 'مشاريع بحث تطبيقي', 'شراكات مع الصناعة', 'معترف به من المشغلين كعلامة على التميز'],
          careers: ['خبير قطاعي', 'مستشار رفيع المستوى', 'مدير تقني', 'باحث تطبيقي'],
          emoji: '🏅',
        },
        {
          icon: '📝', color: 'from-green-600 to-teal-500', svgKey: 'bac', title: 'إجازة العلوم القانونية', description: 'تكوين جامعي في القانون والعلوم السياسية والإدارة.', tags: ['بك+3', 'قانون', 'قانوني'],
          duration: '3 سنوات', level: 'بك+3', access: 'شهادة البكالوريا بجميع شعبها',
          intro: 'إجازة العلوم القانونية تكوين جامعي لمدة 3 سنوات يغطي القانون المدني، الجزائي، التجاري والإداري. تُعد لمهن القانون والإدارة.',
          points: ['تُقدم في كليات الحقوق عبر المغرب', 'تغطي القانون المغربي والقانون الدولي', 'التحضير لمباريات القضاء والعدالة', 'جسر نحو ماستر القانون أو مدارس التكوين المهني', 'مجالات العمل: محامي، عدول، قاضي، jurist مقاولة'],
          careers: ['محامي', 'عدول', 'jurist مقاولة', 'قاضي', 'مستشار قانوني'],
          emoji: '⚖️',
        },
        {
          icon: '⚙️', color: 'from-rose-600 to-red-500', svgKey: 'bts', title: 'دبلوم الدراسات العليا المتخصصة', description: 'DESS: تكوين مهني رفيع المستوى بك+5 موجه جداً نحو المهنة.', tags: ['بك+5', 'DESS', 'مهني'],
          duration: 'سنة بعد الماستر', level: 'بك+5', access: 'على أساس الملف بعد الماجستير أو الماستر',
          intro: 'DESS (دبلوم الدراسات العليا المتخصصة) تكوين مهني رفيع المستوى يُعد مباشرة لممارسة مهنة محددة. يحظى بتقدير كبير من المشغلين لتوجهه العملي.',
          points: ['تكوين لمدة سنة مهنياً جداً', 'تدريب طويل في المقاولة (6 أشهر على الأقل)', 'بحث مهني نهاية الدراسة', 'شبكة مهنية متطورة', 'تخصصات: المالية، قانون الأعمال، الإعلاميات، التدبير...'],
          careers: ['إطار سامٍ', 'مدير قسم', 'خبير مهني', 'مستشار متخصص'],
          emoji: '🎯',
        },
      ],
    },
    testimonials: {
      headingSmall: 'شهادات المستخدمين', headingLarge: 'ما يقوله مستخدمونا',
      items: [
        { text: 'ساعدني MyTawjeh في اكتشاف شغفي بالهندسة. أنا الآن في CPGE بالدار البيضاء!', author: 'ياسين ب.', role: 'طالب CPGE', avatar: '👨‍🎓' },
        { text: 'بفضل متتبع الدرجات، تمكنت من تحديد موادي الضعيفة وتحسينها قبل البكالوريا.', author: 'فاطمة ز.', role: 'حاملة البكالوريا 2025', avatar: '👩‍🎓' },
        { text: 'كان توجيه الذكاء الاصطناعي دقيقًا جدًا. أوصى لي بالطب ونجحت في مسابقة الالتحاق!', author: 'حمزة م.', role: 'طالب في الطب', avatar: '👨‍⚕️' },
      ],
    },
    contact: {
      headingSmall: 'تواصل معنا', headingLarge: 'اطرح', headingAccent: 'أسئلتك',
      description: 'هل لديك أسئلة حول MyTawjeh أو تحتاج إلى مساعدة؟ فريقنا هنا لمساعدتك.',
      email: 'contact@mytawjeh.ma', phone: '+212 5 22 00 00 00',
      namePlaceholder: 'الاسم الكامل', emailPlaceholder: 'بريدك الإلكتروني', messagePlaceholder: 'رسالتك...',
      button: 'أرسل الرسالة', copyright: '© 2026 MyTawjeh. جميع الحقوق محفوظة.',
    },
  },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const CloseIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

// ─── Formation SVG Icons ───────────────────────────────────────────────────────
const FormationIcons: Record<string, () => React.ReactElement> = {
  engineer:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>),
  master_spe: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>),
  doctorat:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5a2 2 0 00-2 2v4a2 2 0 002 2h4m0-6h10a2 2 0 012 2v4a2 2 0 01-2 2H9m0 0v-6"/></svg>),
  licence:    () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>),
  encg:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>),
  master:     () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>),
  dut:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>),
  bachelor:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>),
  deug:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>),
  cpge:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  bac:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="11" y2="11"/></svg>),
  bts:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>),
};
const SendIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-5 h-5 flex-shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function BacStageIcon({ name, className = 'w-6 h-6' }: { name: BacStageIconKey; className?: string }) {
  const icons: Record<BacStageIconKey, () => React.ReactElement> = {
    college: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
      </svg>
    ),
    tronc: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
      </svg>
    ),
    bac1: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
    bac2: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 15l-4 2V9l4-2 4 2v8l-4-2z" /><path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      </svg>
    ),
    pathAvant: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
    pathApres: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  };
  const Icon = icons[name];
  return <Icon />;
}

type CareerIconKey =
  | 'militaire' | 'sportif' | 'mecanicien' | 'coiffeur' | 'agriculteur' | 'artiste'
  | 'gendarme' | 'pompier' | 'cuisinier' | 'electricien' | 'infirmier' | 'commercant'
  | 'medecin' | 'ingenieur' | 'technicien' | 'pilote' | 'enseignant' | 'entrepreneur';

const CAREER_ICON_KEYS: CareerIconKey[] = [
  'militaire', 'sportif', 'mecanicien', 'coiffeur', 'agriculteur', 'artiste',
  'gendarme', 'pompier', 'cuisinier', 'electricien', 'infirmier', 'commercant',
  'medecin', 'ingenieur', 'technicien', 'pilote', 'enseignant', 'entrepreneur',
];

function careerIconKeyFromId(id: string): CareerIconKey {
  if (id.startsWith('militaire')) return 'militaire';
  if (id.startsWith('infirmier')) return 'infirmier';
  if (id.startsWith('technicien')) return 'technicien';
  const base = id.split('-')[0];
  return CAREER_ICON_KEYS.includes(base as CareerIconKey) ? (base as CareerIconKey) : 'entrepreneur';
}

function CareerIcon({ id, className = 'w-5 h-5' }: { id: string; className?: string }) {
  const name = careerIconKeyFromId(id);
  const icons: Record<CareerIconKey, () => React.ReactElement> = {
    militaire: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    sportif: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" /><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    mecanicien: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    coiffeur: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
    agriculteur: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 20h10" /><path d="M12 20v-8" /><path d="M12 12c-2-2.5-5-3.5-5-6a5 5 0 0110 0c0 2.5-3 3.5-5 6z" />
      </svg>
    ),
    artiste: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    gendarme: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 14.3l-4.8 2.4.9-5.3-3.9-3.8 5.4-.8L12 2z" />
        <path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
    pompier: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
      </svg>
    ),
    cuisinier: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
    electricien: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    infirmier: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />
        <path d="M12 5v6M9 8h6" />
      </svg>
    ),
    commercant: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    medecin: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    ingenieur: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    technicien: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" /><line x1="8" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="16" y2="12" />
      </svg>
    ),
    pilote: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    enseignant: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    entrepreneur: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <path d="M2 13h20" />
      </svg>
    ),
  };
  const Icon = icons[name];
  return <Icon />;
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ small, large, accent, center = true }: { small: string; large: string; accent?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">{small}</span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {large}{' '}{accent && <span className="gradient-text">{accent}</span>}
      </h2>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ language, setLanguage, t, setShowLoginModal, setShowSignupModal }: { language: Lang; setLanguage: (l: Lang) => void; t: Translation; setShowLoginModal: (s: boolean) => void; setShowSignupModal: (s: boolean) => void }) {
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
    { href: '#news', label: t.nav.news, id: 'news' },
    { href: '#advantages', label: t.nav.testimonials, id: 'advantages' },
    { href: '#formations', label: t.nav.formations, id: 'formations' },
    { href: '#bac-path', label: t.nav.bacPath, id: 'bac-path' },
    { href: '#contact', label: t.nav.contact, id: 'contact' },
  ];

  const scrollTo = (_href: string, id: string) => {
    setMobileOpen(false); setActiveSection(id);
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav dir={t.direction} className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('#top', 'top'); }} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg"><span className="text-white font-black text-lg">M</span></div>
            <span className={`font-black text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>My<span className="gradient-text">Tawjeh</span></span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }}
                className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${scrolled ? activeSection === link.id ? 'text-purple-700' : 'text-gray-700 hover:text-purple-700' : activeSection === link.id ? 'text-purple-300' : 'text-white/90 hover:text-white'} ${activeSection === link.id ? 'active' : ''}`}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${scrolled ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : 'border-white/50 text-white hover:bg-white/10'}`}>
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <button onClick={() => setShowLoginModal(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${scrolled ? 'text-purple-700 hover:bg-purple-50' : 'text-white/90 hover:bg-white/10'}`}>{t.nav.login}</button>
            <button onClick={() => setShowSignupModal(true)} className="btn-gradient text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">{t.nav.signup}</button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className={`px-2 py-1 rounded-full text-xs font-bold border ${scrolled ? 'border-purple-300 text-purple-700' : 'border-white/50 text-white'}`}>{language === 'fr' ? 'ع' : 'FR'}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}>{mobileOpen ? <CloseIcon /> : <MenuIcon />}</button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden mobile-menu-enter bg-white shadow-xl border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }} className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">{link.label}</a>
            ))}
            <div className="pt-3 flex gap-2">
              <button onClick={() => setShowLoginModal(true)} className="flex-1 text-center py-2 rounded-full border border-purple-300 text-purple-700 text-sm font-medium">{t.nav.login}</button>
              <button onClick={() => setShowSignupModal(true)} className="flex-1 text-center py-2 rounded-full btn-gradient text-white text-sm font-semibold">{t.nav.signup}</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ t }: { t: Translation }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="top" className="relative min-h-screen hero-gradient flex items-center overflow-hidden pt-16">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 opacity-20 rounded-full animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 opacity-10 rounded-full animate-blob animation-delay-4000" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />{t.hero.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {t.hero.title}{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => scrollTo('contact')} className="btn-gradient text-white px-8 py-4 rounded-full font-bold text-base shadow-xl">{t.hero.button} →</button>
              <button onClick={() => scrollTo('news')} className="px-8 py-4 rounded-full font-bold text-base text-white border-2 border-white/30 hover:bg-white/10 transition-all">{t.hero.buttonSecondary}</button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {t.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center animate-float">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/30 to-indigo-600/30 blur-3xl" />
              <img src="/hero-illustration.png" alt="AI Orientation Platform" className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10" />
              {/* <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '0.5s' }}> */}
                {/* <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div><div className="text-xs font-bold text-gray-800">Taux de réussite</div><div className="text-lg font-black gradient-text">95%</div></div>
                </div> */}
              {/* </div> */}
              {/* <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '1s' }}> */}
                {/* <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div><div className="text-xs font-bold text-gray-800">IA Active</div><div className="text-sm font-semibold text-green-500">En ligne</div></div>
                </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ─── News Carousel ────────────────────────────────────────────────────────────
function NewsCarousel({ t }: { t: Translation }) {
  const [active, setActive] = useState(0);
  const len = t.news.items.length;
  const isRtl = t.direction === 'rtl';
  useEffect(() => { const timer = setInterval(() => setActive((p) => (p + 1) % len), 5000); return () => clearInterval(timer); }, [len]);
  return (
    <section id="news" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.news.headingSmall} large={t.news.headingLarge} />
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${isRtl ? active * 100 : -active * 100}%)` }}>
              {t.news.items.map((item, i) => (
                <div key={i} className="min-w-full">
                  <div className="grid md:grid-cols-2 gap-8 items-center p-8">
                    <div className="order-2 md:order-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{item.category}</span>
                        <span className="text-gray-500 text-sm">{item.date}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 mb-6">{item.excerpt}</p>
                    </div>
                    <div className="order-1 md:order-2">
                      <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img src={item.image} alt={item.title} className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {t.news.items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`transition-all duration-300 rounded-full ${active === i ? 'w-8 h-2.5 bg-blue-600' : 'w-2.5 h-2.5 bg-blue-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection({ t, onSignup }: { t: Translation; onSignup: () => void }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl hero-gradient overflow-hidden p-10 md:p-16">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 opacity-20 rounded-full animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/25 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-5">{t.cta.badge}</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{t.cta.title}</h2>
              <p className="text-white/75 mb-8 leading-relaxed">{t.cta.description}</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={onSignup} className="bg-white text-purple-700 px-7 py-3.5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all">{t.cta.button}</button>
                <button onClick={() => scrollTo('news')} className="border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all">{t.cta.buttonSecondary}</button>
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
              <div><h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.description}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Formation Detail Modal ────────────────────────────────────────────────────
function FormationModal({ item, onClose, dir, onSignup }: { item: Translation['formations']['items'][0] | null; onClose: () => void; dir: string; onSignup: () => void }) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [item, onClose]);

  if (!item) return null;
  const isRtl = dir === 'rtl';

  const stats = [
    { label: isRtl ? 'المدة' : 'Durée', value: item.duration },
    { label: isRtl ? 'المستوى' : 'Niveau', value: item.level },
    { label: isRtl ? 'الولوج' : 'Accès', value: item.access },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" dir={dir}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-black/5">

        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 text-white`}>
              {item.svgKey && FormationIcons[item.svgKey]
                ? <span className="scale-75">{FormationIcons[item.svgKey]()}</span>
                : <span className="text-lg">{item.emoji}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">{isRtl ? 'نوع التكوين' : 'Type de formation'}</p>
              <h2 className="text-gray-900 font-semibold text-lg leading-snug">{item.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0"
            aria-label={isRtl ? 'إغلاق' : 'Fermer'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-3 flex gap-2 flex-shrink-0">
          {stats.slice(0, 2).map((s, i) => (
            <div key={i} className="flex-1 rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="text-gray-400 text-[11px] mb-0.5">{s.label}</p>
              <p className="text-gray-800 text-sm font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 flex-shrink-0">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3">
            <p className="text-gray-400 text-[11px] mb-1">{isRtl ? 'الولوج' : 'Accès'}</p>
            <p className="text-gray-800 text-sm leading-relaxed">{item.access}</p>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Body */}

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'مقدمة' : 'Introduction'}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.intro}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'ما يجب معرفته' : 'Ce qu\'il faut savoir'}</h3>
            <ul className="space-y-2">
              {item.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className={`mt-2 w-1 h-1 rounded-full bg-gradient-to-br ${item.color} flex-shrink-0`} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Débouchés */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'مجالات العمل' : 'Débouchés'}</h3>
            <div className="flex flex-wrap gap-1.5">
              {item.careers.map((career, i) => (
                <span key={i} className="px-2.5 py-1 text-xs text-gray-600 bg-gray-50 rounded-md border border-gray-100">
                  {career}
                </span>
              ))}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-gray-700 text-sm font-medium mb-1">
            {isRtl ? 'تريد معلومات أكثر؟' : 'Tu veux plus d\'infos ?'}
          </p>
          <p className="text-gray-500 text-xs mb-3">
            {isRtl ? 'توجيه شخصي مجاني على MyTawjeh' : 'Orientation personnalisée gratuite sur MyTawjeh'}
          </p>
          <button
            onClick={() => { onClose(); onSignup(); }}
            className="w-full flex items-center justify-center gap-1.5 btn-gradient text-white text-sm font-semibold py-2.5 rounded-full"
          >
            {isRtl ? 'سجّل مجاناً' : 'S\'inscrire gratuitement'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── All Formations Page ───────────────────────────────────────────────────────
function AllFormationsPage({ t, onClose, onSelect, onSignup }: {
  t: Translation;
  onClose: () => void;
  onSelect: (item: Translation['formations']['items'][0]) => void;
  onSignup: () => void;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const isRtl = t.direction === 'rtl';
  const PER_PAGE = 8;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  const filtered = t.formations.items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goToPage = (n: number) => {
    setPage(n);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>

      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white">
        <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
                {isRtl ? 'الرئيسية / التكوينات' : 'Accueil / Types de formations'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {isRtl ? 'أنواع التكوينات في المغرب' : (
                  <>Types de <span className="gradient-text">formations</span></>
                )}
              </h1>
              {!isRtl && <p className="text-gray-400 text-sm mt-1 font-light">au Maroc</p>}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors duration-300"
              aria-label={isRtl ? 'إغلاق' : 'Fermer'}
            >
              ×
            </button>
          </div>
          <div className="fp-search fp-input-wrap">
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); setAnimKey(k => k + 1); }}
              placeholder={isRtl ? 'ابحث عن تكوين...' : 'Rechercher une formation...'}
              className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {paginated.length === 0 ? (
          <p className="fp-card text-center text-gray-400 text-sm py-16" style={{ animationDelay: '0.15s' }}>
            {isRtl ? 'لا توجد نتائج' : 'Aucun résultat trouvé'}
          </p>
        ) : (
          <ul key={animKey} className="fp-grid grid grid-cols-2 gap-3">
            {paginated.map((item, i) => {
              const row = Math.floor(i / 2);
              return (
              <li
                key={item.title}
                className="fp-card-row"
                style={{ animationDelay: `${0.1 + row * 0.14}s` }}
              >
                <button
                  onClick={() => onSelect(item)}
                  className="fp-card-btn w-full h-full bg-white rounded-xl border border-gray-100 px-4 py-4 text-left"
                >
                  <span className="block text-[14px] font-semibold text-gray-800 tracking-tight leading-snug">
                    {item.title}
                  </span>
                  <span className="block text-xs text-gray-400 mt-1 font-normal">
                    {item.level}
                  </span>
                </button>
              </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-6 mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="text-xs font-medium text-gray-500 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isRtl ? 'السابق' : 'Précédent'}
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  className={`min-w-[36px] h-9 px-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    n === page
                      ? 'btn-gradient text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="text-xs font-medium text-gray-500 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isRtl ? 'التالي' : 'Suivant'}
            </button>
          </nav>
        )}
      </main>

      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="text-sm font-black text-gray-800">
            My<span className="gradient-text">Tawjeh</span>
          </span>
          <p className="text-xs text-gray-400">
            {isRtl ? '© 2026 MyTawjeh. جميع الحقوق محفوظة.' : '© 2026 MyTawjeh. Tous droits réservés.'}
          </p>
          <button
            onClick={() => { onClose(); onSignup(); }}
            className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors duration-300"
          >
            {isRtl ? 'إنشاء حساب مجاني' : 'Créer un compte gratuit'}
          </button>
        </div>
      </footer>
    </div>
  );
}

const CAREER_STAGE_GRADIENT: Record<AvantBacCareerStage, string> = {
  college: 'from-amber-400 to-orange-500',
  tronc: 'from-sky-500 to-blue-600',
  '1bac': 'from-violet-500 to-purple-600',
};

type PostBacSchool = {
  id: string;
  name: string;
  category: string;
  duration: string;
  admission: string;
  details: string;
  careers: string[];
  icon: string;
  streams: Array<'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech'>;
};

const POST_BAC_STREAMS = {
  fr: [
    { key: 'sm', label: 'Sciences Math' },
    { key: 'pc', label: 'Sciences Physiques (PC)' },
    { key: 'svt', label: 'SVT' },
    { key: 'eco', label: 'Sciences Économiques' },
    { key: 'lettres', label: 'Lettres & Sciences Humaines' },
    { key: 'tech', label: 'Sciences & Technologies / Technique' },
  ],
  ar: [
    { key: 'sm', label: 'علوم رياضية' },
    { key: 'pc', label: 'علوم فيزيائية' },
    { key: 'svt', label: 'علوم الحياة والأرض' },
    { key: 'eco', label: 'علوم اقتصادية' },
    { key: 'lettres', label: 'آداب وعلوم إنسانية' },
    { key: 'tech', label: 'علوم وتكنولوجيات / تقني' },
  ],
} as const;

const POST_BAC_SCHOOLS: Record<Lang, PostBacSchool[]> = {
  fr: [
    { id: 'encg', name: 'ENCG (Écoles Nationales de Commerce et Gestion)', category: 'Commerce & Gestion', duration: '5 ans', admission: 'Concours via TAFEM après Bac', details: 'Formation en management, finance, marketing et audit.', careers: ['Cadre marketing', 'Contrôleur de gestion', 'Business analyst'], icon: '💼', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'iscae', name: 'ISCAE', category: 'Commerce Premium', duration: '5 ans', admission: 'Concours national très compétitif', details: 'Grande école de référence en commerce et management.', careers: ['Consultant', 'Manager', 'Auditeur'], icon: '📈', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'enset', name: 'ENSET', category: 'Technologie & Enseignement technique', duration: '3 à 5 ans', admission: 'Concours/sélection selon filière', details: 'Formations en ingénierie pédagogique et techniques industrielles.', careers: ['Enseignant technique', 'Cadre industriel', 'Formateur'], icon: '🧪', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensa', name: 'ENSA (Écoles Nationales des Sciences Appliquées)', category: 'Ingénierie', duration: '5 ans', admission: 'Concours national après Bac scientifique', details: 'Cycle préparatoire intégré puis spécialisation.', careers: ['Ingénieur logiciel', 'Ingénieur industriel', 'Chef de projet'], icon: '⚙️', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensam', name: 'ENSAM (Arts et Métiers)', category: 'Ingénierie industrielle', duration: '5 ans', admission: 'Concours après Bac scientifique/technique', details: 'Spécialisée en génie mécanique, industriel et productique.', careers: ['Ingénieur mécanique', 'Ingénieur production', 'Responsable maintenance'], icon: '🏭', streams: ['sm', 'pc', 'tech'] },
    { id: 'cpge', name: 'CPGE (Classes Préparatoires)', category: 'Prépa Grandes Écoles', duration: '2 ans', admission: 'Sélection sur dossier', details: 'Voie d’excellence vers grandes écoles ingénieurs/commerce.', careers: ['Accès grandes écoles', 'Ingénierie', 'Management'], icon: '📚', streams: ['sm', 'pc', 'svt', 'eco'] },
    { id: 'medecine', name: 'Faculté de Médecine, Pharmacie, Dentaire', category: 'Santé', duration: '6 à 7 ans+', admission: 'Concours très sélectif', details: 'Parcours long pour étudiants très forts en sciences.', careers: ['Médecin', 'Pharmacien', 'Chirurgien-dentiste'], icon: '🩺', streams: ['svt', 'pc', 'sm'] },
    { id: 'fst-fs', name: 'Facultés des Sciences / FST', category: 'Université scientifique', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Licence en maths, physique, chimie, biologie, informatique.', careers: ['Recherche', 'Ingénierie', 'Data'], icon: '🎓', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'fsjes', name: 'FSJES (Droit, Éco, Gestion)', category: 'Université droit & économie', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Formations en droit privé/public, économie et gestion.', careers: ['Juriste', 'Comptable', 'Cadre administratif'], icon: '⚖️', streams: ['eco', 'lettres', 'sm', 'pc'] },
    { id: 'flsh', name: 'FLSH (Lettres et Sciences Humaines)', category: 'Université lettres', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Langues, histoire, géographie, sociologie, philosophie.', careers: ['Enseignement', 'Communication', 'Fonction publique'], icon: '📝', streams: ['lettres'] },
    { id: 'est', name: 'EST (Écoles Supérieures de Technologie)', category: 'Technologie', duration: '2 à 3 ans', admission: 'Sélection sur dossier', details: 'Formations professionnalisantes en IT, réseaux, génie élec., gestion.', careers: ['Développeur junior', 'Technicien réseau', 'Assistant manager'], icon: '💻', streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },
    { id: 'ensaad', name: 'Écoles d’Art & Design', category: 'Art, Design, Création', duration: '3 à 5 ans', admission: 'Dossier + concours/entretien', details: 'Design graphique, animation, arts visuels, UX/UI.', careers: ['Designer', 'Directeur artistique', 'Illustrateur'], icon: '🎨', streams: ['lettres', 'tech', 'eco'] },
    { id: 'architecture', name: 'Écoles d’Architecture', category: 'Architecture & Urbanisme', duration: '6 ans', admission: 'Concours + parfois dessin', details: 'Conception architecturale et techniques du bâtiment.', careers: ['Architecte', 'Urbaniste', 'Designer d’espace'], icon: '🏛️', streams: ['sm', 'pc', 'tech'] },
    { id: 'aviation', name: 'Écoles d’Aviation / Pilotage', category: 'Aéronautique', duration: '2 à 5 ans', admission: 'Tests + niveau scientifique + anglais', details: 'Formation de pilotes et techniciens aéronautiques.', careers: ['Pilote', 'Technicien avionique', 'Opérations aériennes'], icon: '✈️', streams: ['sm', 'pc'] },
    { id: 'paramedical', name: 'Instituts Paramédicaux / Kiné', category: 'Paramédical', duration: '3 à 5 ans', admission: 'Concours ou sélection', details: 'Soins infirmiers, kiné, labo, imagerie médicale.', careers: ['Infirmier(ère)', 'Kinésithérapeute', 'Technicien imagerie'], icon: '🏥', streams: ['svt', 'pc', 'sm'] },
    { id: 'ifcs', name: 'IFCS (Infirmiers et Cadres de Santé)', category: 'Santé publique', duration: '3 ans', admission: 'Concours après Bac', details: 'Instituts publics de formation en soins infirmiers.', careers: ['Infirmier polyvalent', 'Sage-femme', 'Urgences'], icon: '🧑‍⚕️', streams: ['svt', 'pc', 'sm'] },
    { id: 'tourisme', name: 'Écoles de Tourisme & Hôtellerie', category: 'Tourisme', duration: '2 à 4 ans', admission: 'Dossier/concours', details: 'Formations hôtellerie, restauration, événementiel.', careers: ['Manager hôtelier', 'Agent de voyage', 'Responsable événementiel'], icon: '🏨', streams: ['eco', 'lettres', 'tech'] },
    { id: 'journalisme', name: 'Écoles de Journalisme & Média', category: 'Média & Communication', duration: '3 à 5 ans', admission: 'Dossier, concours ou entretien', details: 'Rédaction, audiovisuel, communication digitale.', careers: ['Journaliste', 'Chargé de communication', 'Content creator'], icon: '🎙️', streams: ['lettres', 'eco'] },
    { id: 'ofppt', name: 'OFPPT / Instituts techniques', category: 'Formation Professionnelle', duration: '2 à 3 ans', admission: 'Dossier + conditions selon spécialité', details: 'Voie pratique avec insertion rapide dans plusieurs métiers.', careers: ['Technicien spécialisé', 'Support IT', 'Technicien maintenance'], icon: '🛠️', streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },
    { id: 'isitt', name: 'ISITT (Tourisme International Tanger)', category: 'Tourisme international', duration: '3 à 5 ans', admission: 'Concours + langues', details: 'Spécialisation haut niveau en management touristique.', careers: ['Manager tourisme', 'Chef produit touristique', 'Consultant travel'], icon: '🌍', streams: ['eco', 'lettres'] },
  ],
  ar: [
    { id: 'encg', name: 'المدرسة الوطنية للتجارة والتسيير ENCG', category: 'التجارة والتسيير', duration: '5 سنوات', admission: 'ولوج عبر مباراة TAFEM بعد الباك', details: 'تكوين قوي في التسويق والمالية والتدبير.', careers: ['التسويق', 'المالية', 'تحليل الأعمال'], icon: '💼', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'iscae', name: 'ISCAE', category: 'تجارة وتسيير عالي', duration: '5 سنوات', admission: 'مباراة وطنية تنافسية', details: 'مؤسسة مرجعية في التسيير والمالية.', careers: ['استشاري', 'مدير', 'مدقق مالي'], icon: '📈', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },
    { id: 'enset', name: 'ENSET', category: 'التكنولوجيا والتعليم التقني', duration: '3 إلى 5 سنوات', admission: 'مباراة/انتقاء حسب المسلك', details: 'تكوينات في الهندسة التقنية والتعليم المهني.', careers: ['أستاذ تقني', 'إطار صناعي', 'مكوّن'], icon: '🧪', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensa', name: 'المدارس الوطنية للعلوم التطبيقية ENSA', category: 'الهندسة', duration: '5 سنوات', admission: 'مباراة وطنية بعد الباك العلمي', details: 'مسار مدمج مع تخصصات هندسية متعددة.', careers: ['مهندس معلوميات', 'مهندس صناعي', 'تدبير المشاريع'], icon: '⚙️', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'ensam', name: 'ENSAM (الفنون والمهن)', category: 'الهندسة الصناعية', duration: '5 سنوات', admission: 'مباراة بعد الباك العلمي/التقني', details: 'تخصص قوي في الهندسة الميكانيكية والصناعية.', careers: ['مهندس ميكانيك', 'مهندس إنتاج', 'مسؤول صيانة'], icon: '🏭', streams: ['sm', 'pc', 'tech'] },
    { id: 'cpge', name: 'الأقسام التحضيرية CPGE', category: 'التحضير للمدارس الكبرى', duration: 'سنتان', admission: 'انتقاء حسب المعدل والملف', details: 'تكوين مكثف للتحضير لمباريات المدارس العليا.', careers: ['ولوج المدارس العليا', 'الهندسة', 'التسيير'], icon: '📚', streams: ['sm', 'pc', 'svt', 'eco'] },
    { id: 'med', name: 'كليات الطب والصيدلة وطب الأسنان', category: 'الصحة', duration: '6 إلى 7 سنوات+', admission: 'مباراة انتقائية جداً', details: 'مسار طويل يتطلب مستوى قوي في العلوم.', careers: ['طبيب', 'صيدلي', 'طبيب أسنان'], icon: '🩺', streams: ['svt', 'pc', 'sm'] },
    { id: 'fsfst', name: 'كلية العلوم / كلية العلوم والتقنيات', category: 'جامعة علمية', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'تخصصات علمية متعددة في الرياضيات والفيزياء والمعلوميات.', careers: ['بحث علمي', 'هندسة', 'تحليل بيانات'], icon: '🎓', streams: ['sm', 'pc', 'svt', 'tech'] },
    { id: 'fsjes', name: 'FSJES (القانون والاقتصاد والتدبير)', category: 'جامعة قانون واقتصاد', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك القانون والاقتصاد والتدبير.', careers: ['قانوني', 'محاسب', 'إدارة'], icon: '⚖️', streams: ['eco', 'lettres', 'sm', 'pc'] },
    { id: 'flsh', name: 'FLSH (الآداب والعلوم الإنسانية)', category: 'جامعة الآداب', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك اللغات والتاريخ والجغرافيا والفلسفة.', careers: ['التدريس', 'التواصل', 'الإدارة'], icon: '📝', streams: ['lettres'] },
    { id: 'est', name: 'المدارس العليا للتكنولوجيا EST', category: 'التكنولوجيا', duration: '2 إلى 3 سنوات', admission: 'انتقاء بالملف', details: 'تكوين تطبيقي في المعلوميات والشبكات والتدبير.', careers: ['مطور مبتدئ', 'تقني شبكات', 'مساعد إداري'], icon: '💻', streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },
    { id: 'artdesign', name: 'مدارس الفن والتصميم', category: 'فن وتصميم', duration: '3 إلى 5 سنوات', admission: 'ملف + مباراة/مقابلة', details: 'تكوين في التصميم الغرافيكي والفنون البصرية.', careers: ['مصمم', 'مخرج فني', 'رسام'], icon: '🎨', streams: ['lettres', 'tech', 'eco'] },
    { id: 'archi', name: 'مدارس الهندسة المعمارية', category: 'الهندسة المعمارية والتصميم', duration: '6 سنوات', admission: 'مباراة وقد تشمل اختبار الرسم', details: 'تكوين في التصميم المعماري والتعمير.', careers: ['مهندس معماري', 'مخطط عمراني', 'مصمم فضاءات'], icon: '🏛️', streams: ['sm', 'pc', 'tech'] },
    { id: 'aviation', name: 'مدارس الطيران', category: 'الطيران', duration: '2 إلى 5 سنوات', admission: 'اختبارات + مستوى علمي + إنجليزية', details: 'تكوين الطيارين والتقنيين في مجال الطيران.', careers: ['طيار', 'تقني طيران', 'عمليات جوية'], icon: '✈️', streams: ['sm', 'pc'] },
    { id: 'paramed', name: 'المعاهد شبه الطبية والعلاج الطبيعي', category: 'شبه طبي', duration: '3 إلى 5 سنوات', admission: 'مباراة أو انتقاء', details: 'تكوينات في التمريض والعلاج الطبيعي والمختبر.', careers: ['ممرض(ة)', 'أخصائي علاج طبيعي', 'تقني تصوير'], icon: '🏥', streams: ['svt', 'pc', 'sm'] },
    { id: 'ifcs', name: 'IFCS (معاهد التمريض وتقنيات الصحة)', category: 'الصحة العمومية', duration: '3 سنوات', admission: 'مباراة بعد الباك', details: 'تكوينات عمومية في مهن التمريض.', careers: ['ممرض متعدد الاختصاصات', 'قبالة', 'مستعجلات'], icon: '🧑‍⚕️', streams: ['svt', 'pc', 'sm'] },
    { id: 'tour', name: 'مدارس السياحة والفندقة', category: 'السياحة', duration: '2 إلى 4 سنوات', admission: 'ملف أو مباراة', details: 'تكوين في الفندقة والمطعمة وتنظيم التظاهرات.', careers: ['تدبير الفنادق', 'وكالات الأسفار', 'تنظيم الأحداث'], icon: '🏨', streams: ['eco', 'lettres', 'tech'] },
    { id: 'media', name: 'مدارس الصحافة والإعلام', category: 'الإعلام والتواصل', duration: '3 إلى 5 سنوات', admission: 'ملف أو مباراة أو مقابلة', details: 'تنمية مهارات الكتابة والإعلام الرقمي.', careers: ['صحفي', 'مسؤول تواصل', 'صانع محتوى'], icon: '🎙️', streams: ['lettres', 'eco'] },
    { id: 'ofppt', name: 'OFPPT والمعاهد التقنية', category: 'التكوين المهني', duration: '2 إلى 3 سنوات', admission: 'ملف وشروط حسب التخصص', details: 'مسار عملي للاندماج السريع في سوق الشغل.', careers: ['تقني متخصص', 'الدعم المعلوماتي', 'الصيانة'], icon: '🛠️', streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },
    { id: 'isitt', name: 'ISITT (المعهد العالي الدولي للسياحة طنجة)', category: 'السياحة الدولية', duration: '3 إلى 5 سنوات', admission: 'مباراة + لغات', details: 'تكوين عالي في تدبير السياحة والفندقة الدولية.', careers: ['مدير سياحي', 'تسويق سياحي', 'استشارة سفر'], icon: '🌍', streams: ['eco', 'lettres'] },
  ],
};

// ─── Avant Bac — page complète (style Voir Tout) ─────────────────────────────
function AllAvantBacPage({ t, onClose, onSignup }: { t: Translation; onClose: () => void; onSignup: () => void }) {
  const e = t.bacPath.avantBacExplore;
  const isRtl = t.direction === 'rtl';
  const [careerQuery, setCareerQuery] = useState('');
  const [careerFilter, setCareerFilter] = useState<AvantBacCareerStage | 'all'>('all');
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(e.stages[0]?.id ?? null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  const careerFilterKeys = ['all', 'college', 'tronc', '1bac'] as const;
  const careerStageOrder: AvantBacCareerStage[] = ['college', 'tronc', '1bac'];
  const filteredCareers = e.careers.filter((c) => {
    const matchStage = careerFilter === 'all' || c.stage === careerFilter;
    const q = careerQuery.toLowerCase();
    const matchQuery = !q || c.title.toLowerCase().includes(q) || c.filiere.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    return matchStage && matchQuery;
  });
  const careersByStage = careerStageOrder
    .map((stageId) => ({
      stageId,
      items: filteredCareers.filter((c) => c.stage === stageId),
    }))
    .filter((group) => group.items.length > 0);
  const handleSignup = () => {
    onClose();
    onSignup();
  };

  return (
    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>
      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-6 mb-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">{e.breadcrumb}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {e.title} <span className="gradient-text">{e.titleAccent}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-lg">{e.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors"
              aria-label={isRtl ? 'إغلاق' : 'Fermer'}
            >
              ×
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-12">
        <section>
          <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-5 py-4 mb-8 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">{e.overview}</p>
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{e.stagesTitle}</h2>
          <div className="avant-stages-timeline space-y-5">
            {e.stages.map((stage, i) => {
              const open = expandedStage === stage.id;
              const isLast = i === e.stages.length - 1;
              return (
                <article
                  key={stage.id}
                  className={`avant-stage-item relative fp-card ${isLast ? '' : 'pb-1'} group`}
                  style={{ animationDelay: `${0.08 + i * 0.1}s` }}
                >
                  {!isLast && <span className="avant-stage-line" aria-hidden />}
                  <div
                    className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${stage.bg} shadow-sm transition-all duration-300 ${open ? 'shadow-md ring-1 ring-black/5 border-gray-100/90' : 'border-gray-100/80 group-hover:border-violet-200 group-hover:shadow-md'}`}
                  >
                    <button
                    type="button"
                    onClick={() => setExpandedStage(open ? null : stage.id)}
                    className="w-full px-5 py-5 flex items-start gap-4 text-left"
                    aria-expanded={open}
                  >
                    <div className={`relative z-[1] flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center text-white shadow-md ring-1 ring-white/30`}>
                      <BacStageIcon name={stage.iconKey} className="w-6 h-6" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[10px] font-black text-gray-700 flex items-center justify-center shadow border border-gray-100">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-black text-gray-900">{stage.title}</h3>
                      </div>
                      {!open && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {stage.highlightTags.map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-gray-600 border border-gray-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className={`text-sm text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{stage.intro}</p>
                    </div>
                    <ChevronDownIcon className={`self-center mt-0.5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 pt-0 border-t border-white/80">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {stage.topics.map((topic, ti) => (
                          <li key={topic.title} className="flex gap-3 bg-white/85 rounded-xl px-4 py-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${stage.gradient} text-white text-xs font-black flex items-center justify-center shadow-sm`}>
                              {ti + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 mb-1 leading-snug">{topic.title}</p>
                              <p className="text-xs text-gray-600 leading-relaxed">{topic.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">
              {isRtl ? 'تحتاج مزيداً من المعلومات؟ توجيه شخصي مجاني على MyTawjeh.' : 'Tu veux plus d’infos ? Orientation personnalisée gratuite sur MyTawjeh.'}
            </p>
            <button
              type="button"
              onClick={handleSignup}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"
            >
              {isRtl ? 'إنشاء حساب مجاني' : 'Créer un compte gratuit'}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{e.careersTitle}</h2>
          <p className="text-xs text-gray-400 mb-5">{e.careersNote}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {careerFilterKeys.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setCareerFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  careerFilter === f ? 'btn-gradient text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {e.careerStageFilters[f]}
              </button>
            ))}
          </div>
          <div className="fp-search fp-input-wrap mb-5">
            <input
              type="text"
              value={careerQuery}
              onChange={(ev) => setCareerQuery(ev.target.value)}
              placeholder={e.searchCareers}
              className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          {filteredCareers.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">{isRtl ? 'لا توجد نتائج' : 'Aucun métier trouvé'}</p>
          ) : (
            <div className="space-y-8">
              {careersByStage.map(({ stageId, items }) => (
                <div key={stageId} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/70 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${CAREER_STAGE_GRADIENT[stageId]}`} aria-hidden />
                      <h3 className="text-sm font-black text-gray-800">{e.careerStageFilters[stageId]}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                      {items.length}
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((career, i) => {
                const open = expandedCareer === career.id;
                const grad = CAREER_STAGE_GRADIENT[career.stage];
                return (
                  <li key={career.id} className="fp-card" style={{ animationDelay: `${0.05 + (i % 6) * 0.06}s` }}>
                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-violet-200 transition-all h-full flex flex-col">
                      <button
                        type="button"
                        onClick={() => setExpandedCareer(open ? null : career.id)}
                        className="w-full px-4 py-4 flex items-start gap-3 text-left"
                        aria-expanded={open}
                      >
                        <span className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-md ring-1 ring-white/30`}>
                          <CareerIcon id={career.id} className="w-5 h-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm font-black text-gray-900">{career.title}</h3>
                            <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white`}>
                              {e.careerStageFilters[career.stage]}
                            </span>
                          </div>
                          <p className={`text-xs text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{career.description}</p>
                        </div>
                        <ChevronDownIcon className={`self-center text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-50 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{e.careerFiliereLabel}</p>
                            <p className="text-xs font-semibold text-indigo-600 leading-relaxed mb-2">{career.filiere}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{e.careerQualitiesLabel}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {career.qualities.map((q) => (
                                <span key={q} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                  {q}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{e.careerAccessLabel}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{career.pathway}</p>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">
              {isRtl ? 'اكتشف التخصص المناسب لك بخطة واضحة ومجانية على MyTawjeh.' : 'Découvre la spécialité qui te correspond avec un plan clair et gratuit sur MyTawjeh.'}
            </p>
            <button
              type="button"
              onClick={handleSignup}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"
            >
              {isRtl ? 'ابدأ الآن مجاناً' : 'Commencer gratuitement'}
            </button>
          </div>
        </section>

      </main>

      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-sm font-black text-gray-800">My<span className="gradient-text">Tawjeh</span></span>
            <p className="text-xs text-gray-400">{isRtl ? '© 2026 MyTawjeh' : '© 2026 MyTawjeh. Tous droits réservés.'}</p> 
            <button type="button" onClick={onClose} className="text-xs font-semibold text-violet-600 hover:text-violet-800">
              {isRtl ? 'إغلاق' : 'Fermer'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AllApresBacPage({ t, onClose, onSignup }: { t: Translation; onClose: () => void; onSignup: () => void }) {
  const isRtl = t.direction === 'rtl';
  const schools = POST_BAC_SCHOOLS[isRtl ? 'ar' : 'fr'];
  const streamOptions = POST_BAC_STREAMS[isRtl ? 'ar' : 'fr'];
  const [selectedStream, setSelectedStream] = useState<'' | 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech'>('');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(schools[0]?.id ?? null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  const filteredSchools = schools.filter((s) => {
    if (!selectedStream) return false;
    if (!s.streams.includes(selectedStream)) return false;
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.details.toLowerCase().includes(q) ||
      s.careers.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>
      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-6 mb-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">{isRtl ? 'الرئيسية / بعد الباك' : 'Accueil / Après Bac'}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {isRtl ? 'المسارات ' : 'Parcours '}<span className="gradient-text">{isRtl ? 'بعد الباك' : 'après le Bac'}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-2xl">
                {isRtl
                  ? 'دليل مبسّط لأهم المدارس والتكوينات بعد البكالوريا في المغرب، مع مدة الدراسة، شروط الولوج، والآفاق المهنية لكل مؤسسة.'
                  : 'Guide pratique des principales écoles et filières après le Bac au Maroc, avec durée, mode d’admission et débouchés pour chaque établissement.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors"
              aria-label={isRtl ? 'إغلاق' : 'Fermer'}
            >
              ×
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-7">
        <section className="rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {isRtl
              ? 'اختيار ما بعد الباك كيحتاج مقارنة واضحة: التخصص، شروط القبول، مدة الدراسة، وفرص الشغل.'
              : 'Pour bien choisir après le Bac, comparez clairement: spécialité, admission, durée des études et débouchés.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">
                {isRtl ? 'اختيار الشعبة' : 'Choisir votre branche'}
              </label>
              <select
                value={selectedStream}
                onChange={(ev) => setSelectedStream(ev.target.value as '' | 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech')}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="">{isRtl ? 'اختر الشعبة أولاً' : 'Sélectionnez d’abord votre branche'}</option>
                {streamOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="fp-search fp-input-wrap">
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">
                {isRtl ? 'بحث إضافي' : 'Recherche rapide'}
              </label>
              <input
                type="text"
                value={query}
                onChange={(ev) => setQuery(ev.target.value)}
                placeholder={isRtl ? 'ابحث عن مدرسة أو تخصص أو مهنة...' : 'Rechercher une école, une spécialité ou un débouché...'}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-5 py-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {isRtl ? 'باغي معلومات أكثر على المدارس والشعب؟ تسجّل فـ MyTawjeh وخذ توجيه مخصص ليك.' : 'Tu veux plus d’infos sur les écoles et filières ? Inscris-toi sur MyTawjeh pour une orientation personnalisée.'}
            </p>
            <button
              type="button"
              onClick={() => { onClose(); onSignup(); }}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"
            >
              {isRtl ? 'تسجيل مجاني' : 'Inscription gratuite'}
            </button>
          </div>
        </section>

        <section>
          {!selectedStream ? (
            <p className="text-center text-gray-400 text-sm py-12">
              {isRtl ? 'اختار الشعبة ديالك أولاً باش نعرضو لك المدارس المناسبة.' : 'Choisissez d’abord votre branche pour afficher les écoles adaptées.'}
            </p>
          ) : filteredSchools.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">{isRtl ? 'لا توجد نتائج' : 'Aucun établissement trouvé'}</p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-3">
                {isRtl ? `تم العثور على ${filteredSchools.length} مؤسسة مناسبة` : `${filteredSchools.length} établissements trouvés pour votre branche`}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchools.map((school, i) => {
                const open = expanded === school.id;
                return (
                  <li key={school.id} className="fp-card" style={{ animationDelay: `${0.05 + (i % 8) * 0.05}s` }}>
                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : school.id)}
                        className="w-full px-4 py-4 flex items-start gap-3 text-left"
                        aria-expanded={open}
                      >
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md">
                          {school.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm font-black text-gray-900">{school.name}</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">{school.category}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{school.duration}</span>
                          </div>
                          <p className={`text-xs text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{school.details}</p>
                        </div>
                        <ChevronDownIcon className={`self-center text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-50 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{isRtl ? 'شروط الولوج' : 'Admission'}</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{school.admission}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{isRtl ? 'الآفاق المهنية' : 'Débouchés'}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {school.careers.map((career) => (
                                <span key={career} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                  {career}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
              </ul>
            </>
          )}
        </section>
      </main>

      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="text-sm font-black text-gray-800">My<span className="gradient-text">Tawjeh</span></span>
          <button type="button" onClick={onClose} className="text-xs font-semibold text-violet-600 hover:text-violet-800">
            {isRtl ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─── Avant / Après Bac ────────────────────────────────────────────────────────
/* removed legacy avant detail
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
      >
        {d.back}
      </button>
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          {d.badge}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{d.heading}</h3>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">{d.goal}</p>
        <p className="mt-3 text-xs text-gray-400 italic">{d.guidanceNote}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {d.cards.map((card, i) => (
          <article
            key={card.id}
            className={`avant-bac-card avant-bac-enter ${delays[i + 1] ?? ''} group relative overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-br ${card.bg} p-6 md:p-7 shadow-lg ring-2 ${card.ring}`}
          >
            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-35 transition-opacity`} />
            <div className="relative flex items-start justify-between gap-3 mb-5">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} text-2xl shadow-md`}>
                {card.icon}
              </div>
              <div className="avant-bac-illus text-4xl md:text-5xl leading-none select-none" aria-hidden>
                {card.illustration}
              </div>
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">{card.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[2.5rem]">{card.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-gray-700 border border-gray-100 shadow-sm group-hover:shadow transition-shadow"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={`mt-5 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
          </article>
        ))}
      </div>
    </div>
  );
*/

function BacPathSection({ t, onSignup }: { t: Translation; onSignup: () => void }) {
  const [activePathPage, setActivePathPage] = useState<'avant' | 'apres' | null>(null);
  const pathCards = [
    { key: 'avant' as const, iconKey: 'pathAvant' as const, gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', data: t.bacPath.avantBac, clickable: true },
    { key: 'apres' as const, iconKey: 'pathApres' as const, gradient: 'from-purple-500 to-violet-600', bg: 'from-purple-50 to-violet-50', data: t.bacPath.apresBac, clickable: true },
  ];
  const openPath = (key: 'avant' | 'apres') => setActivePathPage(key);

  return (
    <>
      <section id="bac-path" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading small={t.bacPath.headingSmall} large={t.bacPath.headingLarge} />
            <p className="text-center text-gray-600 text-base max-w-2xl mx-auto -mt-6 mb-12 leading-relaxed">
              {t.bacPath.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pathCards.map(({ key, iconKey, gradient, bg, data, clickable }) => {
                const inner = (
                  <>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg mb-5`}>
                      <BacStageIcon name={iconKey} className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{data.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{data.message}</p>
                    {clickable && (
                      <span className="mt-4 inline-block text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                        {key === 'avant' ? t.bacPath.avantBac.cta : (t.direction === 'rtl' ? 'استكشاف المسارات بعد الباك →' : 'Explorer les options →')}
                      </span>
                    )}
                  </>
                );
                if (clickable) {
                  return (
                    <button key={key} type="button" onClick={() => openPath(key)} className={`group text-left w-full rounded-2xl border border-gray-100 bg-gradient-to-br ${bg} p-8 shadow-sm card-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2`}>{inner}</button>
                  );
                }
                return <div key={key} className={`rounded-2xl border border-gray-100 bg-gradient-to-br ${bg} p-8 shadow-sm`}>{inner}</div>;
              })}
            </div>
        </div>
      </section>
      {activePathPage === 'avant' && <AllAvantBacPage t={t} onClose={() => setActivePathPage(null)} onSignup={onSignup} />}
      {activePathPage === 'apres' && <AllApresBacPage t={t} onClose={() => setActivePathPage(null)} onSignup={onSignup} />}
    </>
  );
}

// ─── Formations ───────────────────────────────────────────────────────────────
function FormationsSection({ t, onSignup }: { t: Translation; onSignup: () => void }) {
  const [selected, setSelected] = useState<Translation['formations']['items'][0] | null>(null);
  const [showAllPage, setShowAllPage] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleItems = t.formations.items.slice(0, 12);

  return (
    <section id="formations" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.formations.headingSmall} large={t.formations.headingLarge} />
        <p className="text-gray-500 text-sm text-center mb-10">{t.formations.description}</p>

        {/* Accordion list */}
        <div className="space-y-3">
          {visibleItems.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{item.tags[0]}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h3>
                </div>
                <svg 
                  className={`w-5 h-5 text-orange-500 flex-shrink-0 ml-3 transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={2.5} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 pt-0">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  <button 
                    onClick={() => setSelected(item)}
                    className="mt-3 text-purple-600 text-sm font-semibold hover:text-purple-700"
                  >
                    {t.direction === 'rtl' ? 'المزيد من التفاصيل' : 'En savoir plus'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voir tout — always visible */}
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAllPage(true)}
            className="text-blue-500 font-medium text-sm hover:text-blue-700 hover:underline transition-colors"
          >
            {t.direction === 'rtl' ? 'عرض الكل' : 'Voir Tout'}
          </button>
        </div>
      </div>

      {/* All Formations Page */}
      {showAllPage && (
        <AllFormationsPage
          t={t}
          onClose={() => setShowAllPage(false)}
          onSelect={(item) => { setSelected(item); }}
          onSignup={onSignup}
        />
      )}

      {/* Detail Modal — rendered on top of everything */}
      <FormationModal item={selected} onClose={() => setSelected(null)} dir={t.direction} onSignup={onSignup} />
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection({ t }: { t: Translation }) {
  const [active, setActive] = useState(0);
  const len = t.testimonials.items.length;
  const isRtl = t.direction === 'rtl';
  useEffect(() => { const timer = setInterval(() => setActive((p) => (p + 1) % len), 4500); return () => clearInterval(timer); }, [len]);
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading small={t.testimonials.headingSmall} large={t.testimonials.headingLarge} />
        <div className="relative mt-4">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${isRtl ? active * 100 : -active * 100}%)` }}>
              {t.testimonials.items.map((item, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="testimonial-gradient rounded-3xl p-10 border border-purple-100 text-center shadow-sm">
                    <div className="text-5xl mb-5">{item.avatar}</div>
                    <p className="text-lg text-gray-700 italic leading-relaxed mb-6">{item.text}</p>
                    <div className="font-bold text-gray-900">{item.author}</div>
                    <div className="text-sm text-purple-600 font-medium">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {t.testimonials.items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`transition-all duration-300 rounded-full ${active === i ? 'w-8 h-2.5 bg-purple-600' : 'w-2.5 h-2.5 bg-purple-200'}`} />
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
    try { await fetch('http://localhost:5000/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }); } catch (_) {}
    setSent(true); setFormData({ name: '', email: '', message: '' }); setTimeout(() => setSent(false), 4000);
  };
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeading small={t.contact.headingSmall} large={t.contact.headingLarge} accent={t.contact.headingAccent} center={false} />
            <p className="text-gray-500 mb-8 leading-relaxed">{t.contact.description}</p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📧</div>
                <div><div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</div><div className="text-gray-800 font-semibold">{t.contact.email}</div></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📞</div>
                <div><div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{isRtl ? 'الهاتف' : 'Téléphone'}</div><div className="text-gray-800 font-semibold">{t.contact.phone}</div></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{isRtl ? 'تم الإرسال!' : 'Message envoyé !'}</h3>
                <p className="text-gray-500">{isRtl ? 'سنتواصل معك قريبًا.' : 'Nous vous répondrons dans les plus brefs délais.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.namePlaceholder}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t.contact.namePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.emailPlaceholder}</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t.contact.emailPlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.messagePlaceholder}</label><textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t.contact.messagePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 resize-none" /></div>
                <button type="submit" className="btn-gradient w-full text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><SendIcon />{t.contact.button}</button>
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
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="font-black text-lg text-gray-900">My<span className="gradient-text">Tawjeh</span></span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t.direction === 'rtl' ? 'منصة التوجيه الدراسي الذكي' : "Plateforme d'orientation scolaire intelligente"}</p>
          </div>
          <p className="text-sm text-gray-500 md:text-center">
            {t.direction === 'rtl' ? 'توجيه بسيط، واضح، ومهني لكل تلميذ.' : 'Une orientation simple, claire et professionnelle pour chaque élève.'}
          </p>

          <div className="text-sm text-gray-600">
            <a href="mailto:contact@mytawjeh.ma" className="hover:text-violet-700 transition-colors">contact@mytawjeh.ma</a>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 text-center md:text-left">{t.contact.copyright}</div>
      </div>
    </footer>
  );
}

// ─── LOGIN MODAL (connected to real backend) ──────────────────────────────────
function LoginModal({ isOpen, onClose, t, onSwitchToSignup, onLoginSuccess }: {
  isOpen: boolean; onClose: () => void; t: Translation;
  onSwitchToSignup: () => void; onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isRtl = t.direction === 'rtl';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Role auto-detected by backend — no need to send it
      await apiLogin(email, password);
      onClose();
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '460px' }}>
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3b1a6e 0%, #6d28d9 60%, #a855f7 100%)' }}>
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow"><span className="text-white font-black text-lg">M</span></div>
              <span className="font-black text-xl tracking-tight">MyTawjeh</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              {isRtl ? 'التوجيه الذكي' : 'Orientation Intelligente'}
            </div>
            <h2 className="text-2xl font-black leading-snug mb-3">{isRtl ? 'مساحتك الشخصية' : 'Votre espace personnel'}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{isRtl ? 'مسار مخصص، متابعة الأهداف وتوصيات الذكاء الاصطناعي.' : 'Parcours sur mesure, suivi des objectifs et recommandations IA.'}</p>
          </div>
          <div className="relative z-10 text-white/40 text-xs">© 2026 MyTawjeh</div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-lg">×</button>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{isRtl ? 'تسجيل الدخول' : 'Connexion'}</h3>
          <p className="text-sm text-purple-600 font-medium mb-5">{isRtl ? 'وصول آمن إلى حسابك' : 'Accès sécurisé à votre compte'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'E-MAIL'}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@domaine.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{isRtl ? 'كلمة المرور' : 'MOT DE PASSE'}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{error}</div>
            )}

            {/* Google Auth placeholder */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400">{isRtl ? 'أو' : 'ou'}</span></div>
            </div>
            <button type="button" disabled className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {isRtl ? 'المتابعة مع Google' : 'Continuer avec Google'}
              <span className="text-gray-300 text-xs">({isRtl ? 'قريباً' : 'bientôt'})</span>
            </button>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-70 transition-all hover:-translate-y-0.5"
              style={{ background: loading ? '#c084fc' : 'linear-gradient(90deg, #c084fc 0%, #e879f9 50%, #f472b6 100%)' }}>
              {loading ? (isRtl ? 'جاري التسجيل...' : 'Connexion en cours...') : (isRtl ? 'متابعة' : 'CONTINUER')}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            {isRtl ? 'جديد على المنصة؟ ' : 'Nouveau sur la plateforme ? '}
            <button onClick={() => { onClose(); onSwitchToSignup(); }} className="text-purple-600 font-semibold hover:underline">
              {isRtl ? 'إنشاء حساب' : 'Créer un compte'}
            </button>
          </p>

          {/* Test accounts — clickable to auto-fill */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2">
              {isRtl ? 'حسابات تجريبية — كلمة المرور:' : 'Comptes de test — mot de passe :'}{' '}
              <strong className="font-mono text-gray-600">password</strong>
              <span className="ml-1 text-gray-300">{isRtl ? '(انقر للملء)' : '(cliquer pour remplir)'}</span>
            </p>
            <div className="space-y-1">
              {[
                { role: isRtl ? 'طالب' : 'Étudiant',   email: 'yassine@test.ma',  color: '#7c3aed' },
                { role: isRtl ? 'ولي أمر' : 'Parent',   email: 'parent@test.ma',   color: '#059669' },
                { role: isRtl ? 'أستاذ' : 'Professeur', email: 'hassan@test.ma',   color: '#2563eb' },
                { role: 'Admin',                          email: 'admin@mowajih.ma', color: '#dc2626' },
              ].map(a => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => { setEmail(a.email); setPassword('password'); }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white transition-all text-left border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <span className="text-xs font-bold" style={{ color: a.color }}>{a.role}</span>
                  <span className="text-xs text-gray-400 font-mono">{a.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lang FAB ─────────────────────────────────────────────────────────────────
function LangFAB({ language, setLanguage }: { language: Lang; setLanguage: (l: Lang) => void }) {
  return (
    <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
      className="fixed bottom-6 right-6 z-50 btn-gradient text-white w-14 h-14 rounded-full shadow-2xl text-sm font-black flex items-center justify-center hover:scale-110 transition-transform border-2 border-white/30">
      {language === 'fr' ? 'ع' : 'FR'}
    </button>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [language, setLanguage] = useState<Lang>('fr');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const t = translations[language];

  // Check if already logged in on mount
  useEffect(() => {
    if (isAuthenticated() && getStoredUser()) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = t.direction;
    document.documentElement.lang = language;
  }, [language, t.direction]);

  // ── If logged in, show dashboard ──
  if (loggedIn) {
    return <Dashboard />;
  }

  // ── Otherwise show landing page ──
  return (
    <div dir={t.direction} lang={language}>
      <Navbar language={language} setLanguage={setLanguage} t={t} setShowLoginModal={setShowLoginModal} setShowSignupModal={setShowSignupModal} />
      <main>
        <HeroSection t={t} />
        <NewsCarousel t={t} />
        <CTASection t={t} onSignup={() => setShowSignupModal(true)} />
        <AdvantagesSection t={t} />
        <FormationsSection key={language} t={t} onSignup={() => setShowSignupModal(true)} />
        <BacPathSection key={`bac-${language}`} t={t} onSignup={() => setShowSignupModal(true)} />
        <TestimonialsSection t={t} />
        <ContactSection t={t} />
      </main>
      <Footer t={t} />
      <LangFAB language={language} setLanguage={setLanguage} />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        t={t}
        onSwitchToSignup={() => { setShowLoginModal(false); setShowSignupModal(true); }}
        onLoginSuccess={() => setLoggedIn(true)}
      />
      {showSignupModal && (
        <Inscription
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => { setShowSignupModal(false); setShowLoginModal(true); }}
          lang={language}
        />
      )}
    </div>
  );
}
