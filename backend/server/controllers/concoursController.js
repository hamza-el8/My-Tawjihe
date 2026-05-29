const Concours = require('../models/Concours');
const Annale = require('../models/Annale');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getConcours = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;
  res.json(await Concours.findAll({ limit, offset, order: [['createdAt', 'DESC']] }));
};

const createConcours = async (req, res) => {
  try {
    const c = await Concours.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateConcours = async (req, res) => {
  try {
    const concours = await Concours.findByPk(req.params.id);
    if (!concours) return res.status(404).json({ message: 'Concours introuvable' });
    await concours.update(req.body);
    res.json(concours);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getAnnales = async (req, res) => {
  const where = {};
  if (req.query.matiere) where.matiere = req.query.matiere;
  if (req.query.annee) where.annee = req.query.annee;

  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  res.json(await Annale.findAll({ where, limit, offset, order: [['createdAt', 'DESC']] }));
};

const createAnnale = async (req, res) => {
  try {
    const a = await Annale.create(req.body);
    res.status(201).json(a);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateAnnale = async (req, res) => {
  try {
    const annale = await Annale.findByPk(req.params.id);
    if (!annale) return res.status(404).json({ message: 'Annale introuvable' });
    await annale.update(req.body);
    res.json(annale);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { getConcours, createConcours, updateConcours, getAnnales, createAnnale, updateAnnale };
