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

const Eleve = require('./models/Eleve');
const Parent = require('./models/Parent');
const Professeur = require('./models/Professeur');
const Admine = require('./models/Admine');
const Note = require('./models/Note');
const Exercice = require('./models/Exercice');
const Concours = require('./models/Concours');
const Annale = require('./models/Annale');

async function seed() {
  await sequelize.sync({ force: true });
  const hash = await bcrypt.hash('password', 10);

  const admin = await Admine.create({ nom: 'Admin Principal', email: 'admin@mowajih.ma', motDePasse: hash });
  const eleve1 = await Eleve.create({ nom: 'Yassine Benali', email: 'yassine@test.ma', niveau: 'Terminale', filiere: 'Sciences Maths', ville: 'Casablanca', motDePasse: hash });
  const eleve2 = await Eleve.create({ nom: 'Fatima Zahra', email: 'fatima@test.ma', niveau: '2ème Bac', filiere: 'Sciences Physiques', ville: 'Rabat', motDePasse: hash });
  const prof = await Professeur.create({ nom: 'Prof. Hassan', email: 'hassan@test.ma', specialite: 'Mathématiques', motDePasse: hash });
  await Parent.create({ nom: 'Mohamed Benali', email: 'parent@test.ma', motDePasse: hash, eleveId: eleve1.id });

  await Note.bulkCreate([
    { matiere: 'Mathématiques', valeur: 16.5, coefficient: 3, periode: 'S1', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Physique', valeur: 14.0, coefficient: 2, periode: 'S1', type: 'Examen', eleveId: eleve1.id },
    { matiere: 'Français', valeur: 13.5, coefficient: 2, periode: 'S1', type: 'Contrôle', eleveId: eleve1.id },
    { matiere: 'Mathématiques', valeur: 9.0, coefficient: 3, periode: 'S1', type: 'Contrôle', eleveId: eleve2.id },
    { matiere: 'Chimie', valeur: 11.5, coefficient: 2, periode: 'S1', type: 'Examen', eleveId: eleve2.id },
  ]);

  await Exercice.bulkCreate([
    { matiere: 'Mathématiques', niveau: 'Terminale', difficulte: 'moyen', contenu: 'Résoudre: 2x² + 5x - 3 = 0', correction: 'Discriminant: 25+24=49. x1=0.5, x2=-3', professeurId: prof.id },
    { matiere: 'Physique', niveau: '2ème Bac', difficulte: 'facile', contenu: "Un objet de masse 2kg est soumis à une force de 10N. Calculer l'accélération.", correction: 'F=ma → a=F/m=10/2=5 m/s²', professeurId: prof.id },
    { matiere: 'Mathématiques', niveau: 'Terminale', difficulte: 'difficile', contenu: 'Calculer la limite de (sin x)/x quand x→0', correction: 'La limite vaut 1 (théorème des gendarmes)', professeurId: prof.id },
  ]);

  const cnc = await Concours.create({ nom: 'CNC 2026', datw: '2026-06-15', seuil: 14.0, description: 'Concours National Commun pour les CPGE' });
  await Concours.create({ nom: 'ENSA 2026', datw: '2026-07-01', seuil: 13.5, description: 'École Nationale des Sciences Appliquées' });

  await Annale.bulkCreate([
    { annee: 2025, matiere: 'Mathématiques', fichier: 'cnc_2025_maths.pdf', concoursId: cnc.id },
    { annee: 2024, matiere: 'Physique', fichier: 'cnc_2024_physique.pdf', concoursId: cnc.id },
    { annee: 2023, matiere: 'Mathématiques', fichier: 'cnc_2023_maths.pdf', concoursId: cnc.id },
  ]);

  console.log('✅ Seed completed!');
  console.log('Test accounts (password: password):');
  console.log('  Étudiant : yassine@test.ma');
  console.log('  Parent   : parent@test.ma');
  console.log('  Prof     : hassan@test.ma');
  console.log('  Admin    : admin@mowajih.ma');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
