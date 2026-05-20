const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const ResultatExercice = require('../models/ResultatExercice');
const Exercice = require('../models/Exercice');
const { Op } = require('sequelize');

const getElevesFaibles = async (req, res) => {
  try {
    const notes = await Note.findAll();
    const byEleve = {};
    notes.forEach(n => {
      if (!byEleve[n.eleveId]) byEleve[n.eleveId] = { vals: [], weighted: 0, coeff: 0 };
      byEleve[n.eleveId].vals.push(parseFloat(n.valeur));
      byEleve[n.eleveId].weighted += parseFloat(n.valeur) * parseFloat(n.coefficient);
      byEleve[n.eleveId].coeff += parseFloat(n.coefficient);
    });
    const faibleIds = Object.entries(byEleve)
      .filter(([, d]) => d.coeff > 0 && (d.weighted / d.coeff) < 12)
      .map(([id]) => parseInt(id));

    const eleves = await Eleve.findAll({
      where: { id: { [Op.in]: faibleIds } },
      attributes: ['id', 'nom', 'email', 'niveau', 'filiere'],
    });

    // Attach computed average
    const result = eleves.map(e => ({
      ...e.toJSON(),
      moyenne: byEleve[e.id]?.coeff > 0
        ? (byEleve[e.id].weighted / byEleve[e.id].coeff).toFixed(1)
        : null,
    }));

    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getProfStats = async (req, res) => {
  try {
    const exercices = await Exercice.findAll({ where: { professeurId: req.user.id } });
    const ids = exercices.map(e => e.id);
    if (!ids.length) return res.json({ resultats: [] });

    const resultats = await ResultatExercice.findAll({ where: { exerciceId: { [Op.in]: ids } } });

    const enriched = await Promise.all(resultats.map(async r => {
      const eleve = await Eleve.findByPk(r.eleveId, { attributes: ['nom', 'email'] });
      const ex = exercices.find(e => e.id === r.exerciceId);
      return {
        ...r.toJSON(),
        eleveName: eleve?.nom,
        eleveEmail: eleve?.email,
        exMatiere: ex?.matiere,
        exContenu: ex?.contenu?.slice(0, 60),
      };
    }));

    res.json({ resultats: enriched });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const postService = async (req, res) => {
  res.status(201).json({ message: 'Service publié', data: req.body });
};

module.exports = { getElevesFaibles, getProfStats, postService };
