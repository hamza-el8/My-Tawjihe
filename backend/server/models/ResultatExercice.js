const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ResultatExercice = sequelize.define('ResultatExercice', {
  score: DataTypes.DECIMAL(5, 2),
  eleveId: { type: DataTypes.INTEGER, allowNull: false },
  exerciceId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'ResultatExercice' });

module.exports = ResultatExercice;
