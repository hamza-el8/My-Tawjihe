const Exercice = require('../models/Exercice');
const ResultatExercice = require('../models/ResultatExercice');
const Notification = require('../models/Notification');

const getExercices = async (req, res) => {
  const where = {};
  if (req.query.matiere) where.matiere = req.query.matiere;
  if (req.query.difficulte) where.difficulte = req.query.difficulte;
  if (req.query.niveau) where.niveau = req.query.niveau;
  res.json(await Exercice.findAll({ where }));
};

const submitExercice = async (req, res) => {
  const { score, eleveId } = req.body;
  const resultat = await ResultatExercice.create({ score, eleveId, exerciceId: req.params.id });
  if (score < 10) {
    await Notification.create({
      contenu: `Score faible (${score}/20) sur un exercice. Pensez à réviser !`,
      type: 'revision',
      eleveId,
    });
  }
  res.status(201).json(resultat);
};

const createExercice = async (req, res) => {
  const ex = await Exercice.create({ ...req.body, professeurId: req.user.id });
  res.status(201).json(ex);
};

const getResultats = async (req, res) => {
  res.json(await ResultatExercice.findAll({ where: { eleveId: req.params.eleveId } }));
};

module.exports = { getExercices, submitExercice, createExercice, getResultats };
