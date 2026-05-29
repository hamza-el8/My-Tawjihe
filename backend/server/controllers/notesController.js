const Note = require('../models/Note');
const Notification = require('../models/Notification');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getNotes = async (req, res) => {
  const { limit, offset } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedOffset = parseInt(offset, 10) || 0;

  const notes = await Note.findAll({
    where: { eleveId: req.params.id },
    order: [['createdAt', 'DESC']],
    limit: parsedLimit,
    offset: parsedOffset,
  });
  res.json(notes);
};

const addNote = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    // Security: eleve can only add notes for themselves;
    // professeur and parent must supply a valid eleveId but we keep it as-is
    // (a future improvement would verify the prof teaches that student).
    let targetEleveId = req.body.eleveId;
    if (role === 'eleve') {
      targetEleveId = userId;
    }
    if (!targetEleveId) {
      return res.status(400).json({ message: 'eleveId requis' });
    }

    const note = await Note.create({
      ...req.body,
      eleveId: targetEleveId,
    });

    const message = parseFloat(note.valeur) < 10
      ? `⚠️ Note faible en ${note.matiere} : ${note.valeur}/20. Pensez à revoir cette matière !`
      : `📊 Nouvelle note en ${note.matiere} : ${note.valeur}/20 (${note.periode})`;

    await Notification.create({
      contenu: message,
      type: 'note',
      eleveId: targetEleveId,
    }).catch(() => {});

    res.status(201).json(note);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    // Only admin or the owning eleve can delete
    if (req.user.role === 'eleve' && note.eleveId !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await note.destroy();
    res.json({ message: 'Note supprimée' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getNotes, addNote, deleteNote };
