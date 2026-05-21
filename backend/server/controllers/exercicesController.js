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

// AI auto-correction — upsert so retries don't inflate count
const submitExercice = async (req, res) => {
  try {
    const { reponse, eleveId } = req.body;
    const exercice = await Exercice.findByPk(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    let score = null;
    let feedback = '';

    if (reponse && exercice.correction) {
      const prompt = `Tu es un professeur corrigeant une copie. Réponds UNIQUEMENT avec un JSON valide sans markdown:

Exercice: ${exercice.contenu}
Correction officielle: ${exercice.correction}
Réponse de l'élève: ${reponse}

{"score": <0 à 20>, "feedback": "<commentaire bref et encourageant, max 2 phrases en français>"}`;

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

    // Upsert — update if already submitted, insert if first time
    const [resultat, created] = await ResultatExercice.upsert({
      score,
      reponse: reponse || '',
      feedback,
      eleveId,
      exerciceId: req.params.id,
    }, { returning: true });

    // Notify only on first submission or if score improved
    if (created || score < 10) {
      await Notification.create({
        contenu: score < 10
          ? `📝 Score de ${score}/20 en ${exercice.matiere}. ${feedback || 'Continuez à pratiquer !'}`
          : `✅ Exercice de ${exercice.matiere} complété : ${score}/20 !`,
        type: score < 10 ? 'revision' : 'info',
        eleveId,
      }).catch(() => {}); // silent — don't fail submission if notif fails
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

const getResultats = async (req, res) => {
  res.json(await ResultatExercice.findAll({ where: { eleveId: req.params.eleveId } }));
};

module.exports = { getExercices, submitExercice, createExercice, getResultats };
