const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ResultatExercice = sequelize.define('ResultatExercice', {
  score:      { type: DataTypes.DECIMAL(5, 2) },
  reponse:    { type: DataTypes.TEXT },
  feedback:   { type: DataTypes.TEXT },
  eleveId:    { type: DataTypes.INTEGER, allowNull: false },
  exerciceId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'ResultatExercice',
  indexes: [{ unique: true, fields: ['eleveId', 'exerciceId'] }],
});

module.exports = ResultatExercice;
