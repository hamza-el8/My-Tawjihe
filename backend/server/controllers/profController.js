const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const { Op } = require('sequelize');

const getElevesFaibles = async (req, res) => {
  // Students with average below 10
  const notes = await Note.findAll();
  const byEleve = {};
  notes.forEach(n => {
    if (!byEleve[n.eleveId]) byEleve[n.eleveId] = [];
    byEleve[n.eleveId].push(parseFloat(n.valeur));
  });
  const faibleIds = Object.entries(byEleve)
    .filter(([, vals]) => vals.reduce((a, b) => a + b, 0) / vals.length < 12)
    .map(([id]) => parseInt(id));
  const eleves = await Eleve.findAll({ where: { id: { [Op.in]: faibleIds } }, attributes: ['id', 'nom', 'email', 'niveau', 'filiere'] });
  res.json(eleves);
};

const postService = async (req, res) => {
  // Simplified: just return the service offer
  res.status(201).json({ message: 'Service publié', data: req.body });
};

module.exports = { getElevesFaibles, postService };
