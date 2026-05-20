const Eleve = require('../models/Eleve');
const Note = require('../models/Note');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap, chatbot } = require('../services/aiService');

const getRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({ where: { eleveId: req.params.eleveId }, order: [['createdAt', 'DESC']] });
  res.json(roadmap);
};

const generateRoadmapHandler = async (req, res) => {
  try {
    const eleve = await Eleve.findByPk(req.body.eleveId);
    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    const notes = await Note.findAll({ where: { eleveId: eleve.id } });

    let onetProfil = null;
    try {
      const sequelize = require('../config/db');
      const [rows] = await sequelize.query(
        'SELECT * FROM ProfilOnet WHERE eleveId = ? LIMIT 1',
        { replacements: [eleve.id] }
      );
      onetProfil = rows[0] || null;
    } catch (_) {}

    const result = await generateRoadmap(eleve, notes, onetProfil);

    const roadmap = await Roadmap.create({
      eleveId: eleve.id,
      matiereCible: result.matieresCles?.join(', '),
      niveau: eleve.niveau,
      parcours: JSON.stringify(result),
    });

    res.json({ roadmap, result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const chatbotHandler = async (req, res) => {
  try {
    const { message, eleveId, history = [] } = req.body;
    let context = '';

    if (eleveId) {
      const eleve = await Eleve.findByPk(eleveId);
      if (eleve) {
        const notes = await Note.findAll({ where: { eleveId } });
        const moyenne = notes.length
          ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
             notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(1)
          : null;

        let onetText = '';
        try {
          const sequelize = require('../config/db');
          const [rows] = await sequelize.query(
            'SELECT * FROM ProfilOnet WHERE eleveId = ? LIMIT 1',
            { replacements: [eleveId] }
          );
          if (rows[0]) {
            onetText = ` Profil RIASEC: ${rows[0].primaryInterest}/${rows[0].secondaryInterest}/${rows[0].tertiaryInterest}.`;
            if (rows[0].dreamJob) onetText += ` Métier rêvé: ${rows[0].dreamJob}.`;
            if (rows[0].dreamUni) onetText += ` Université rêvée: ${rows[0].dreamUni}.`;
          }
        } catch (_) {}

        context = `Étudiant: ${eleve.nom}. Niveau: ${eleve.niveau}. Filière: ${eleve.filiere || 'non définie'}. Ville: ${eleve.ville || 'non précisée'}.${moyenne ? ` Moyenne: ${moyenne}/20.` : ''}${onetText}`;

        const faibles = notes.filter(n => parseFloat(n.valeur) < 10);
        if (faibles.length) {
          context += ` Matières en difficulté: ${faibles.map(n => `${n.matiere} (${n.valeur}/20)`).join(', ')}.`;
        }
      }
    }

    // Pass history for conversation memory (keep last 10 messages)
    const trimmedHistory = history.slice(-10);
    const reply = await chatbot(message, context, trimmedHistory);
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getRoadmap, generateRoadmapHandler, chatbotHandler };
