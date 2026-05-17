const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Eleve = require('../models/Eleve');
const Parent = require('../models/Parent');
const Professeur = require('../models/Professeur');
const Admine = require('../models/Admine');

const MODELS = { eleve: Eleve, parent: Parent, professeur: Professeur, admin: Admine };

// ── Register ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { role, nom, email, motDePasse, niveau, filiere, ville, specialite, eleveId } = req.body;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
  try {
    const hash = await bcrypt.hash(motDePasse, 10);
    const extra = role === 'eleve' ? { niveau: niveau || 'Non défini', filiere, ville }
      : role === 'parent' ? { eleveId: eleveId || null }
      : role === 'professeur' ? { specialite } : {};
    const user = await Model.create({ nom, email, motDePasse: hash, ...extra });
    res.status(201).json({ message: 'Compte créé', id: user.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// ── Login — auto role detection ───────────────────────────────────────────────
const login = async (req, res) => {
  const { email, motDePasse } = req.body;
  if (!email || !motDePasse)
    return res.status(400).json({ message: 'Email et mot de passe requis' });

  const searchOrder = [
    { model: Eleve,      role: 'eleve' },
    { model: Parent,     role: 'parent' },
    { model: Professeur, role: 'professeur' },
    { model: Admine,     role: 'admin' },
  ];

  let found = null;
  let foundRole = null;

  for (const { model, role } of searchOrder) {
    try {
      const user = await model.findOne({ where: { email } });
      if (user) { found = user; foundRole = role; break; }
    } catch (_) {}
  }

  if (!found) return res.status(404).json({ message: 'Aucun compte trouvé avec cet email' });

  const valid = await bcrypt.compare(motDePasse, found.motDePasse);
  if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign(
    { id: found.id, role: foundRole, nom: found.nom, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: found.id,
      nom: found.nom,
      email,
      role: foundRole,
      niveau: found.niveau,
      filiere: found.filiere,
      ville: found.ville,
      specialite: found.specialite,
      eleveId: found.eleveId,
    }
  });
};

// ── Change password ───────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id, role } = req.user;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });

  try {
    const user = await Model.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(currentPassword, user.motDePasse);
    if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });

    const hash = await bcrypt.hash(newPassword, 10);
    await user.update({ motDePasse: hash });
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Link student to parent ────────────────────────────────────────────────────
const linkStudent = async (req, res) => {
  const { eleveEmail } = req.body;
  const { id, role } = req.user;

  if (role !== 'parent') return res.status(403).json({ message: 'Réservé aux parents' });

  try {
    const eleve = await Eleve.findOne({ where: { email: eleveEmail } });
    if (!eleve) return res.status(404).json({ message: 'Aucun étudiant trouvé avec cet email' });

    await Parent.update({ eleveId: eleve.id }, { where: { id } });
    res.json({
      message: 'Étudiant lié avec succès',
      eleve: { id: eleve.id, nom: eleve.nom, email: eleve.email, niveau: eleve.niveau, filiere: eleve.filiere }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Get linked student for parent ─────────────────────────────────────────────
const getLinkedStudent = async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'parent') return res.status(403).json({ message: 'Réservé aux parents' });

  try {
    const parent = await Parent.findByPk(id);
    if (!parent?.eleveId) return res.json({ eleve: null });

    const eleve = await Eleve.findByPk(parent.eleveId, {
      attributes: { exclude: ['motDePasse'] }
    });
    res.json({ eleve });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Save ONET profile ─────────────────────────────────────────────────────────
const saveOnetProfile = async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'eleve') return res.status(403).json({ message: 'Réservé aux étudiants' });

  const { testLevel, scores, primaryInterest, secondaryInterest, tertiaryInterest, jobZone, dreamUni, dreamJob, language } = req.body;

  try {
    const sequelize = require('../config/db');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ProfilOnet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eleveId INTEGER NOT NULL,
        testLevel INTEGER,
        scoresR INTEGER DEFAULT 0,
        scoresI INTEGER DEFAULT 0,
        scoresA INTEGER DEFAULT 0,
        scoresS INTEGER DEFAULT 0,
        scoresE INTEGER DEFAULT 0,
        scoresC INTEGER DEFAULT 0,
        primaryInterest VARCHAR(50),
        secondaryInterest VARCHAR(50),
        tertiaryInterest VARCHAR(50),
        jobZone INTEGER,
        dreamUni VARCHAR(255),
        dreamJob VARCHAR(255),
        language VARCHAR(10) DEFAULT 'fr',
        completedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await sequelize.query(`DELETE FROM ProfilOnet WHERE eleveId = ?`, { replacements: [id] });
    await sequelize.query(`
      INSERT INTO ProfilOnet (eleveId, testLevel, scoresR, scoresI, scoresA, scoresS, scoresE, scoresC,
        primaryInterest, secondaryInterest, tertiaryInterest, jobZone, dreamUni, dreamJob, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        id, testLevel,
        scores?.R || 0, scores?.I || 0, scores?.A || 0, scores?.S || 0, scores?.E || 0, scores?.C || 0,
        primaryInterest, secondaryInterest, tertiaryInterest,
        jobZone, dreamUni || null, dreamJob || null, language || 'fr'
      ]
    });

    res.json({ message: 'Profil O*NET sauvegardé avec succès' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Get ONET profile ──────────────────────────────────────────────────────────
const getOnetProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const sequelize = require('../config/db');
    const [rows] = await sequelize.query(`SELECT * FROM ProfilOnet WHERE eleveId = ? LIMIT 1`, { replacements: [id] });
    res.json({ profil: rows[0] || null });
  } catch (e) {
    res.json({ profil: null });
  }
};

module.exports = { register, login, changePassword, linkStudent, getLinkedStudent, saveOnetProfile, getOnetProfile };
