const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Metier = sequelize.define('Metier', {
  nom: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
}, { tableName: 'Metier' });

module.exports = Metier;
