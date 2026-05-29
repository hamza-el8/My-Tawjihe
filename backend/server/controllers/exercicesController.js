const Exercice = require('../models/Exercice');
const ResultatExercice = require('../models/ResultatExercice');
const Notification = require('../models/Notification');
const { chatbot } = require('../services/aiService');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getExercices = async (req, res) => {
  const where = {};
  if (req.query.matiere) where.matiere = req.query.matiere;
  if (req.query.difficulte) where.difficulte = req.query.difficulte;
  if (req.query.niveau) where.niveau = req.query.niveau;

  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  res.json(await Exercice.findAll({ where, limit, offset, order: [['createdAt', 'DESC']] }));
};

// AI auto-correction — upsert so retries don't inflate count
const submitExercice = async (req, res) => {
  try {
    const { reponse } = req.body;

    // Security: always use the authenticated user's own ID
    const eleveId = req.user.id;

    const exercice = await Exercice.findByPk(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    let score = null;
    let feedback = '';

    if (reponse && exercice.correction) {
      const prompt = `Tu es un professeur corrigeant une copie. Réponds UNIQUEMENT avec un JSON valide sans markdown:\n\nExercice: ${exercice.contenu}\nCorrection officielle: ${exercice.correction}\nRéponse de l'élève: ${reponse}\n\n{"score": <0 à 20>, "feedback": "<commentaire bref et encourageant, max 2 phrases en français>"}`;

      try {
        const aiResponse = await chatbot(prompt, '');
        const clean = aiResponse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        score = Math.min(20, Math.max(0, parseFloat(parsed.score) || 0));
        feedback = parsed.feedback || '';
      } catch {
        score = 0;
        feedback = 'Correction automatique indisponible. Score basé sur la tentative.';
      }
    } else {
      score = parseFloat(req.body.score) || 0;
      feedback = '';
    }

    const [resultat, created] = await ResultatExercice.upsert({
      score,
      reponse: reponse || '',
      feedback,
      eleveId,
      exerciceId: req.params.id,
    }, { returning: true });

    if (created || score < 10) {
      await Notification.create({
        contenu: score < 10
          ? `📝 Score de ${score}/20 en ${exercice.matiere}. ${feedback || 'Continuez à pratiquer !'}`
          : `✅ Exercice de ${exercice.matiere} complété : ${score}/20 !`,
        type: score < 10 ? 'revision' : 'info',
        eleveId,
      }).catch(() => {});
    }

    res.status(201).json({ resultat, score, feedback, correction: exercice.correction });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createExercice = async (req, res) => {
  try {
    const ex = await Exercice.create({ ...req.body, professeurId: req.user.id });
    res.status(201).json(ex);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateExercice = async (req, res) => {
  try {
    const exercice = await Exercice.findByPk(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });
    await exercice.update(req.body);
    res.json(exercice);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getResultats = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;
  res.json(await ResultatExercice.findAll({
    where: { eleveId: req.params.eleveId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  }));
};

module.exports = { getExercices, submitExercice, createExercice, getResultats };
