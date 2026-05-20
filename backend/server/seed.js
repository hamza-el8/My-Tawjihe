const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
require('./models/Eleve');
require('./models/Parent');
require('./models/Professeur');
require('./models/Admine');
require('./models/Note');
require('./models/Exercice');
require('./models/ResultatExercice');
require('./models/Roadmap');
require('./models/Metier');
require('./models/Concours');
require('./models/Annale');
require('./models/Notification');

const Eleve       = require('./models/Eleve');
const Parent      = require('./models/Parent');
const Professeur  = require('./models/Professeur');
const Admine      = require('./models/Admine');
const Note        = require('./models/Note');
const Exercice    = require('./models/Exercice');
const Concours    = require('./models/Concours');
const Annale      = require('./models/Annale');

async function seed() {
  await sequelize.sync({ force: true });
  const hash = await bcrypt.hash('password', 10);

  const admin  = await Admine.create({ nom: 'Admin Principal',  email: 'admin@mowajih.ma',  motDePasse: hash });
  const eleve1 = await Eleve.create({ nom: 'Yassine Benali',   email: 'yassine@test.ma',   niveau: 'Terminale (2ème Bac)', filiere: 'Sciences Maths',     ville: 'Casablanca', motDePasse: hash });
  const eleve2 = await Eleve.create({ nom: 'Fatima Zahra',     email: 'fatima@test.ma',    niveau: 'Terminale (2ème Bac)', filiere: 'Sciences Physiques', ville: 'Rabat',       motDePasse: hash });
  const prof   = await Professeur.create({ nom: 'Prof. Hassan', email: 'hassan@test.ma',   specialite: 'Mathématiques & Physique', motDePasse: hash });
  await Parent.create({ nom: 'Mohamed Benali', email: 'parent@test.ma', motDePasse: hash, eleveId: eleve1.id });

  // Notes spread across two periods for chart to work
  await Note.bulkCreate([
    { matiere: 'Mathématiques', valeur: 16.5, coefficient: 3, periode: 'S1', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Physique',      valeur: 14.0, coefficient: 2, periode: 'S1', type: 'Examen',   eleveId: eleve1.id },
    { matiere: 'Français',      valeur: 13.5, coefficient: 2, periode: 'S1', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Informatique',  valeur: 18.0, coefficient: 2, periode: 'S1', type: 'TP',       eleveId: eleve1.id },
    { matiere: 'Mathématiques', valeur: 17.5, coefficient: 3, periode: 'S2', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Physique',      valeur: 15.0, coefficient: 2, periode: 'S2', type: 'Examen',   eleveId: eleve1.id },
    { matiere: 'Français',      valeur: 12.0, coefficient: 2, periode: 'S2', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Mathématiques', valeur:  9.0, coefficient: 3, periode: 'S1', type: 'Contrôle', eleveId: eleve2.id },
    { matiere: 'Chimie',        valeur: 11.5, coefficient: 2, periode: 'S1', type: 'Examen',   eleveId: eleve2.id },
    { matiere: 'Physique',      valeur:  8.0, coefficient: 2, periode: 'S1', type: 'Contrôle', eleveId: eleve2.id },
  ]);

  // Exercises with real content AND detailed corrections for AI to grade against
  await Exercice.bulkCreate([
    {
      matiere: 'Mathématiques',
      niveau: 'Terminale (2ème Bac)',
      difficulte: 'moyen',
      contenu: `Résoudre l'équation du second degré : 2x² + 5x - 3 = 0
      
Montrez toutes les étapes de votre calcul (discriminant, racines, vérification).`,
      correction: `Étape 1 — Calculer le discriminant : Δ = b² - 4ac = 25 - 4×2×(-3) = 25 + 24 = 49
Étape 2 — Racines : x = (-b ± √Δ) / 2a → x₁ = (-5 + 7) / 4 = 0.5 ; x₂ = (-5 - 7) / 4 = -3
Étape 3 — Vérification : 2(0.5)² + 5(0.5) - 3 = 0.5 + 2.5 - 3 = 0 ✓ ; 2(9) + 5(-3) - 3 = 18 - 15 - 3 = 0 ✓
Réponse : S = {0.5 ; -3}`,
      professeurId: prof.id,
    },
    {
      matiere: 'Physique',
      niveau: 'Terminale (2ème Bac)',
      difficulte: 'facile',
      contenu: `Dynamique — 2ème loi de Newton

Un objet de masse m = 2 kg est soumis à une force nette F = 10 N.
1. Calculer l'accélération de l'objet.
2. Si l'objet part du repos, quelle est sa vitesse après 5 secondes ?`,
      correction: `1. D'après la 2ème loi de Newton : F = m × a → a = F/m = 10/2 = 5 m/s²
2. Mouvement uniformément accéléré depuis le repos : v = v₀ + at = 0 + 5 × 5 = 25 m/s
Réponses : a = 5 m/s² ; v(5s) = 25 m/s`,
      professeurId: prof.id,
    },
    {
      matiere: 'Mathématiques',
      niveau: 'Terminale (2ème Bac)',
      difficulte: 'difficile',
      contenu: `Limites et continuité

1. Calculer la limite : lim(x→0) [sin(x) / x]
2. Expliquer pourquoi cette limite est importante en mathématiques.
3. Utiliser le théorème des gendarmes pour démontrer le résultat.`,
      correction: `1. lim(x→0) sin(x)/x = 1 (limite fondamentale de l'analyse)
2. Cette limite est cruciale car elle permet de calculer la dérivée de sin(x) : sin'(x) = cos(x). Sans cette limite, la trigonométrie différentielle serait impossible.
3. Démonstration par les gendarmes : Pour x∈]0, π/2[, on a sin(x) < x < tan(x).
   Diviser par sin(x) : 1 < x/sin(x) < 1/cos(x)
   Donc : cos(x) < sin(x)/x < 1
   Quand x→0, cos(x)→1 et 1→1, donc par le théorème des gendarmes : sin(x)/x → 1`,
      professeurId: prof.id,
    },
    {
      matiere: 'Chimie',
      niveau: 'Terminale (2ème Bac)',
      difficulte: 'moyen',
      contenu: `Équilibre acido-basique

On dissout 0.1 mol d'acide acétique (CH₃COOH) dans 1L d'eau. Le Ka = 1.8 × 10⁻⁵.
1. Écrire l'équation de la réaction.
2. Calculer le pH de la solution.`,
      correction: `1. CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺
2. Ka = [CH₃COO⁻][H₃O⁺] / [CH₃COOH]
   Soit x = [H₃O⁺] à l'équilibre.
   Ka = x²/(0.1 - x) ≈ x²/0.1 (approximation valide car Ka << C)
   x² = Ka × 0.1 = 1.8 × 10⁻⁶
   x = [H₃O⁺] = 1.34 × 10⁻³ mol/L
   pH = -log(1.34 × 10⁻³) ≈ 2.87`,
      professeurId: prof.id,
    },
    {
      matiere: 'Informatique',
      niveau: 'Terminale (2ème Bac)',
      difficulte: 'facile',
      contenu: `Algorithmique — Tri et recherche

Écrivez en pseudocode un algorithme qui :
1. Prend un tableau de 5 entiers en entrée
2. Trouve le maximum
3. Retourne sa position (indice) dans le tableau`,
      correction: `ALGORITHME trouver_maximum(tab[])
  max ← tab[0]
  position ← 0
  POUR i DE 1 À 4 FAIRE
    SI tab[i] > max ALORS
      max ← tab[i]
      position ← i
    FIN SI
  FIN POUR
  RETOURNER position
FIN ALGORITHME

Complexité : O(n) — un seul parcours du tableau.`,
      professeurId: prof.id,
    },
  ]);

  // Concours with proper date field
  const cnc = await Concours.create({
    nom: 'CNC 2026 — Concours National Commun',
    datw: '2026-06-15',
    seuil: 14.0,
    description: 'Accès aux CPGE et grandes écoles d\'ingénieurs',
  });
  await Concours.create({ nom: 'ENSA 2026', datw: '2026-07-01', seuil: 13.5, description: 'École Nationale des Sciences Appliquées' });
  await Concours.create({ nom: 'ENCG 2026', datw: '2026-06-20', seuil: 13.0, description: 'École Nationale de Commerce et de Gestion' });
  await Concours.create({ nom: 'Médecine 2026', datw: '2026-09-10', seuil: 15.5, description: 'Concours d\'accès aux facultés de médecine' });

  // Annales with real external PDF links
  await Annale.bulkCreate([
    { annee: 2024, matiere: 'Mathématiques', fichier: 'https://www.men.gov.ma/Fr/Documents/ExamBac2024_Maths_SM.pdf', concoursId: cnc.id },
    { annee: 2024, matiere: 'Physique-Chimie', fichier: 'https://www.men.gov.ma/Fr/Documents/ExamBac2024_PC.pdf', concoursId: cnc.id },
    { annee: 2023, matiere: 'Mathématiques', fichier: 'https://www.men.gov.ma/Fr/Documents/ExamBac2023_Maths_SM.pdf', concoursId: cnc.id },
    { annee: 2023, matiere: 'Sciences de la Vie', fichier: 'https://www.men.gov.ma/Fr/Documents/ExamBac2023_SVT.pdf', concoursId: cnc.id },
  ]);

  console.log('✅ Seed completed!');
  console.log('Test accounts (password: password):');
  console.log('  Étudiant 1 : yassine@test.ma  (Terminale SM, Casablanca, 7 notes)');
  console.log('  Étudiant 2 : fatima@test.ma   (Terminale SP, Rabat, 3 notes)');
  console.log('  Parent     : parent@test.ma   (lié à Yassine)');
  console.log('  Prof       : hassan@test.ma   (5 exercices créés)');
  console.log('  Admin      : admin@mowajih.ma');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
