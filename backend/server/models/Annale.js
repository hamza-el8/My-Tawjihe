const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Annale = sequelize.define('Annale', {
  annee: DataTypes.INTEGER,
  matiere: DataTypes.STRING,
  fichier: DataTypes.STRING,
  concoursId: DataTypes.INTEGER,
}, { tableName: 'Annale' });

module.exports = Annale;
