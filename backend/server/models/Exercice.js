const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercice = sequelize.define('Exercice', {
  matiere: { type: DataTypes.STRING, allowNull: false },
  niveau: DataTypes.STRING,
  difficulte: { type: DataTypes.ENUM('facile', 'moyen', 'difficile'), defaultValue: 'moyen' },
  contenu: { type: DataTypes.TEXT, allowNull: false },
  correction: DataTypes.TEXT,
  professeurId: DataTypes.INTEGER,
}, { tableName: 'Exercice' });

module.exports = Exercice;
