const Exercice = require('../models/Exercice');
const ResultatExercice = require('../models/ResultatExercice');
const Notification = require('../models/Notification');
const { chatbot } = require('../services/aiService');

const getExercices = async (req, res) => {
  const where = {};
  if (req.query.matiere) where.matiere = req.query.matiere;
  if (req.query.difficulte) where.difficulte = req.query.difficulte;
  if (req.query.niveau) where.niveau = req.query.niveau;
  res.json(await Exercice.findAll({ where }));
};

// AI auto-correction
const submitExercice = async (req, res) => {
  try {
    const { reponse, eleveId } = req.body;
    const exercice = await Exercice.findByPk(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    let score = null;
    let feedback = '';

    if (reponse && exercice.correction) {
      // Ask AI to grade the answer
      const prompt = `Tu es un professeur qui corrige une copie d'élève. 

Exercice: ${exercice.contenu}
Correction officielle: ${exercice.correction}
Réponse de l'élève: ${reponse}

Évalue la réponse et réponds UNIQUEMENT avec un JSON valide:
{"score": <nombre entre 0 et 20>, "feedback": "<commentaire bref et encourageant en français, max 2 phrases>"}`;

      try {
        const aiResponse = await chatbot(prompt, '');
        const clean = aiResponse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        score = Math.min(20, Math.max(0, parseFloat(parsed.score) || 0));
        feedback = parsed.feedback || '';
      } catch {
        // Fallback: manual score if AI fails
        score = req.body.score || 0;
        feedback = 'Correction manuelle.';
      }
    } else {
      score = parseFloat(req.body.score) || 0;
      feedback = '';
    }

    const resultat = await ResultatExercice.create({
      score,
      eleveId,
      exerciceId: req.params.id,
    });

    if (score < 10) {
      await Notification.create({
        contenu: `📝 Score de ${score}/20 en ${exercice.matiere}. ${feedback || 'Continuez à pratiquer !'}`,
        type: 'revision',
        eleveId,
      });
    }

    res.status(201).json({ resultat, score, feedback, correction: exercice.correction });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createExercice = async (req, res) => {
  const ex = await Exercice.create({ ...req.body, professeurId: req.user.id });
  res.status(201).json(ex);
};

const getResultats = async (req, res) => {
  res.json(await ResultatExercice.findAll({ where: { eleveId: req.params.eleveId } }));
};

module.exports = { getExercices, submitExercice, createExercice, getResultats };
