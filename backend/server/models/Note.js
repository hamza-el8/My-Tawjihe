const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Note = sequelize.define('Note', {
  matiere: { type: DataTypes.STRING, allowNull: false },
  valeur: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  coefficient: { type: DataTypes.DECIMAL(3, 1), defaultValue: 1 },
  periode: DataTypes.STRING,
  type: DataTypes.STRING,
  eleveId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'Note' });

module.exports = Note;
