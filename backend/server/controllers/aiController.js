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
    const result = await generateRoadmap(eleve, notes);
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
    const { message, eleveId } = req.body;
    let context = '';
    if (eleveId) {
      const eleve = await Eleve.findByPk(eleveId);
      if (eleve) context = `L'étudiant s'appelle ${eleve.nom}, niveau: ${eleve.niveau}, filière: ${eleve.filiere}.`;
    }
    const reply = await chatbot(message, context);
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getRoadmap, generateRoadmapHandler, chatbotHandler };
