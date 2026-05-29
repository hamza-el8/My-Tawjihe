const Eleve = require('../models/Eleve');
const Note = require('../models/Note');
const Roadmap = require('../models/Roadmap');
const ProfilOnet = require('../models/ProfilOnet');
const { generateRoadmap, chatbot } = require('../services/aiService');

const getRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({
    where: { eleveId: req.params.eleveId },
    order: [['createdAt', 'DESC']],
  });
  res.json(roadmap);
};

const generateRoadmapHandler = async (req, res) => {
  try {
    // Security: eleve can only generate their own roadmap
    const eleveId = req.user.role === 'eleve' ? req.user.id : req.body.eleveId;
    if (!eleveId) return res.status(400).json({ message: 'eleveId requis' });

    const eleve = await Eleve.findByPk(eleveId);
    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    const notes = await Note.findAll({ where: { eleveId: eleve.id } });

    let onetProfil = null;
    try {
      onetProfil = await ProfilOnet.findOne({ where: { eleveId: eleve.id } });
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
    const { message, history = [] } = req.body;
    // eleveId from token if eleve, otherwise from body (for prof/admin reviewing a student)
    const eleveId = req.user.role === 'eleve' ? req.user.id : req.body.eleveId;

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
          const onetProfile = await ProfilOnet.findOne({ where: { eleveId } });
          if (onetProfile) {
            onetText = ` Profil RIASEC: ${onetProfile.primaryInterest}/${onetProfile.secondaryInterest}/${onetProfile.tertiaryInterest}.`;
            if (onetProfile.dreamJob) onetText += ` Métier rêvé: ${onetProfile.dreamJob}.`;
            if (onetProfile.dreamUni) onetText += ` Université rêvée: ${onetProfile.dreamUni}.`;
          }
        } catch (_) {}

        context = `Étudiant: ${eleve.nom}. Niveau: ${eleve.niveau}. Filière: ${eleve.filiere || 'non définie'}. Ville: ${eleve.ville || 'non précisée'}.${moyenne ? ` Moyenne: ${moyenne}/20.` : ''}${onetText}`;

        const faibles = notes.filter(n => parseFloat(n.valeur) < 10);
        if (faibles.length) {
          context += ` Matières en difficulté: ${faibles.map(n => `${n.matiere} (${n.valeur}/20)`).join(', ')}.`;
        }
      }
    }

    const trimmedHistory = history.slice(-10);
    const reply = await chatbot(message, context, trimmedHistory);
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getRoadmap, generateRoadmapHandler, chatbotHandler };
