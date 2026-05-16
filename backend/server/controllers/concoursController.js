const Concours = require('../models/Concours');
const Annale = require('../models/Annale');

const getConcours = async (req, res) => res.json(await Concours.findAll());
const createConcours = async (req, res) => res.status(201).json(await Concours.create(req.body));

const getAnnales = async (req, res) => {
  const where = {};
  if (req.query.matiere) where.matiere = req.query.matiere;
  if (req.query.annee) where.annee = req.query.annee;
  res.json(await Annale.findAll({ where }));
};
const createAnnale = async (req, res) => res.status(201).json(await Annale.create(req.body));

module.exports = { getConcours, createConcours, getAnnales, createAnnale };
