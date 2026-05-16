const Eleve = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Parent = require('../models/Parent');

const getUsers = async (req, res) => {
  const [eleves, profs, parents] = await Promise.all([
    Eleve.findAll({ attributes: { exclude: ['motDePasse'] } }),
    Professeur.findAll({ attributes: { exclude: ['motDePasse'] } }),
    Parent.findAll({ attributes: { exclude: ['motDePasse'] } }),
  ]);
  res.json({ eleves, profs, parents });
};

const deleteUser = async (req, res) => {
  const { role, id } = req.params;
  const models = { eleve: Eleve, professeur: Professeur, parent: Parent };
  await models[role]?.destroy({ where: { id } });
  res.json({ message: 'Utilisateur supprimé' });
};

module.exports = { getUsers, deleteUser };
