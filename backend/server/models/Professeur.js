const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Professeur = sequelize.define('Professeur', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  specialite: DataTypes.STRING,
  motDePasse: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Professeur' });

module.exports = Professeur;
