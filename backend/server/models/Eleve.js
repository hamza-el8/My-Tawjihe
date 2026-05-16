const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Eleve = sequelize.define('Eleve', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  niveau: { type: DataTypes.STRING, allowNull: false },
  filiere: DataTypes.STRING,
  ville: DataTypes.STRING,
  motDePasse: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Eleve' });

module.exports = Eleve;
