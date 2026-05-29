const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const ResultatExercice = require('../models/ResultatExercice');
const Exercice = require('../models/Exercice');
const { Op } = require('sequelize');

const getElevesFaibles = async (req, res) => {
  try {
    const exercices = await Exercice.findAll({ where: { professeurId: req.user.id } });
    const exerciceIds = exercices.map(e => e.id);
    if (!exerciceIds.length) return res.json([]);

    const resultats = await ResultatExercice.findAll({
      where: { exerciceId: { [Op.in]: exerciceIds } },
      include: [{ model: Exercice, as: 'exercice', attributes: ['matiere', 'contenu'] }],
    });

    const byEleve = {};
    resultats.forEach(r => {
      const score = parseFloat(r.score || 0);
      if (!byEleve[r.eleveId]) byEleve[r.eleveId] = { total: 0, count: 0, worst: null };
      byEleve[r.eleveId].total += score;
      byEleve[r.eleveId].count += 1;
      if (!byEleve[r.eleveId].worst || score < byEleve[r.eleveId].worst.score) {
        byEleve[r.eleveId].worst = {
          score,
          matiere: r.exercice?.matiere || 'Inconnue',
          contenu: String(r.exercice?.contenu || 'Aucun détail').slice(0, 80),
        };
      }
    });

    const faibleIds = Object.entries(byEleve)
      .filter(([, d]) => d.count > 0 && (d.total / d.count) < 12)
      .map(([id]) => parseInt(id, 10));

    if (!faibleIds.length) return res.json([]);

    const eleves = await Eleve.findAll({
      where: { id: { [Op.in]: faibleIds } },
      attributes: ['id', 'nom', 'email', 'niveau', 'filiere'],
    });

    const result = eleves.map(e => {
      const stats = byEleve[e.id];
      const avg = stats ? stats.total / stats.count : null;
      return {
        ...e.toJSON(),
        moyenne: avg !== null ? avg.toFixed(1) : null,
        weakestSubject: stats?.worst?.matiere || '—',
        weakestExercise: stats?.worst?.contenu || '—',
        weakestScore: stats?.worst?.score != null ? stats.worst.score.toFixed(1) : null,
      };
    });

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
