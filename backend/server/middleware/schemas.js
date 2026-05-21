// Validation schemas for API endpoints
const schemas = {
  // Auth schemas
  register: {
    email: { type: 'string', required: true, email: true },
    motDePasse: { type: 'string', required: true, minLength: 6 },
    role: { type: 'string', required: true, enum: ['eleve', 'professeur', 'parent', 'admin'] },
    nom: { type: 'string', required: true, minLength: 2 },
  },

  login: {
    email: { type: 'string', required: true, email: true },
    motDePasse: { type: 'string', required: true },
  },

  changePassword: {
    currentPassword: { type: 'string', required: true },
    newPassword: { type: 'string', required: true, minLength: 6 },
  },

  // Note schema
  note: {
    matiere: { type: 'string', required: true, minLength: 2 },
    valeur: { type: 'number', required: true },
    coefficient: { type: 'number', required: false },
    periode: { type: 'string', required: false },
    type: { type: 'string', required: false },
  },

  // Exercise schema
  exercice: {
    matiere: { type: 'string', required: true },
    niveau: { type: 'string', required: true },
    difficulte: { type: 'string', required: true, enum: ['facile', 'moyen', 'difficile'] },
    contenu: { type: 'string', required: true },
    correction: { type: 'string', required: true },
  },

  // Annale schema
  annale: {
    matiere: { type: 'string', required: true },
    annee: { type: 'string', required: true },
    contenu: { type: 'string', required: true },
    correction: { type: 'string', required: true },
  },

  // Concours schema
  concours: {
    nom: { type: 'string', required: true },
    seuil: { type: 'number', required: true },
    dateConcours: { type: 'string', required: false },
    description: { type: 'string', required: false },
    lien: { type: 'string', required: false },
  },

  // Notification schema
  notification: {
    contenu: { type: 'string', required: true, minLength: 3 },
    type: { type: 'string', required: true, enum: ['info', 'note', 'revision'] },
    eleveId: { type: 'string', required: false },
  },

  // Contact schema
  contact: {
    nom: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true, email: true },
    message: { type: 'string', required: true, minLength: 10 },
  },
};

module.exports = schemas;
