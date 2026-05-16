const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Eleve = require('../models/Eleve');
const Parent = require('../models/Parent');
const Professeur = require('../models/Professeur');
const Admine = require('../models/Admine');

const MODELS = { eleve: Eleve, parent: Parent, professeur: Professeur, admin: Admine };

const register = async (req, res) => {
  const { role, nom, email, motDePasse, niveau, filiere, ville, specialite, eleveId } = req.body;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
  try {
    const hash = await bcrypt.hash(motDePasse, 10);
    const extra = role === 'eleve' ? { niveau, filiere, ville }
      : role === 'parent' ? { eleveId }
      : role === 'professeur' ? { specialite } : {};
    const user = await Model.create({ nom, email, motDePasse: hash, ...extra });
    res.status(201).json({ message: 'Compte créé', id: user.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const login = async (req, res) => {
  const { role, email, motDePasse } = req.body;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
  try {
    const user = await Model.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role, nom: user.nom, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nom: user.nom, email, role, niveau: user.niveau, filiere: user.filiere, eleveId: user.eleveId } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { register, login };
