const Note = require('../models/Note');
const Notification = require('../models/Notification');

const getNotes = async (req, res) => {
  const notes = await Note.findAll({ where: { eleveId: req.params.id } });
  res.json(notes);
};

const addNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, eleveId: req.body.eleveId || req.user.id });
    await Notification.create({
      contenu: `Nouvelle note ajoutée: ${note.matiere} - ${note.valeur}/20`,
      type: 'note',
      eleveId: note.eleveId,
    });
    res.status(201).json(note);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteNote = async (req, res) => {
  await Note.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Note supprimée' });
};

module.exports = { getNotes, addNote, deleteNote };
