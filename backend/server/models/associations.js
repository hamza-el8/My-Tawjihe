// ─── Centralized Model Associations ─────────────────────────────────────────────
// This file defines all relationships between models.
// It must be required AFTER all model files are loaded.

const Eleve = require('./Eleve');
const Parent = require('./Parent');
const Professeur = require('./Professeur');
const Admine = require('./Admine');
const Note = require('./Note');
const Exercice = require('./Exercice');
const ResultatExercice = require('./ResultatExercice');
const Roadmap = require('./Roadmap');
const Metier = require('./Metier');
const Concours = require('./Concours');
const Annale = require('./Annale');
const Notification = require('./Notification');

// ── Parent → Eleve ──────────────────────────────────────────────────────────────
Parent.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });
Eleve.hasOne(Parent, { foreignKey: 'eleveId', as: 'parent' });

// ── Eleve → Notes ───────────────────────────────────────────────────────────────
Eleve.hasMany(Note, { foreignKey: 'eleveId', as: 'notes' });
Note.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });

// ── Eleve → Resultats Exercice ──────────────────────────────────────────────────
Eleve.hasMany(ResultatExercice, { foreignKey: 'eleveId', as: 'resultats' });
ResultatExercice.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });

// ── Exercice → Resultats ────────────────────────────────────────────────────────
Exercice.hasMany(ResultatExercice, { foreignKey: 'exerciceId', as: 'resultats' });
ResultatExercice.belongsTo(Exercice, { foreignKey: 'exerciceId', as: 'exercice' });

// ── Professeur → Exercices ──────────────────────────────────────────────────────
Professeur.hasMany(Exercice, { foreignKey: 'professeurId', as: 'exercices' });
Exercice.belongsTo(Professeur, { foreignKey: 'professeurId', as: 'professeur' });

// ── Eleve → Roadmaps ────────────────────────────────────────────────────────────
Eleve.hasMany(Roadmap, { foreignKey: 'eleveId', as: 'roadmaps' });
Roadmap.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });

// ── Metier → Roadmaps ───────────────────────────────────────────────────────────
Metier.hasMany(Roadmap, { foreignKey: 'metierId', as: 'roadmaps' });
Roadmap.belongsTo(Metier, { foreignKey: 'metierId', as: 'metier' });

// ── Concours → Annales ──────────────────────────────────────────────────────────
Concours.hasMany(Annale, { foreignKey: 'concoursId', as: 'annales' });
Annale.belongsTo(Concours, { foreignKey: 'concoursId', as: 'concours' });

// ── Eleve → Notifications ───────────────────────────────────────────────────────
Eleve.hasMany(Notification, { foreignKey: 'eleveId', as: 'notifications' });
Notification.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });

// ── Admine → Notifications ──────────────────────────────────────────────────────
Admine.hasMany(Notification, { foreignKey: 'admineId', as: 'notifications' });
Notification.belongsTo(Admine, { foreignKey: 'admineId', as: 'admine' });

module.exports = { Eleve, Parent, Professeur, Admine, Note, Exercice, ResultatExercice, Roadmap, Metier, Concours, Annale, Notification };