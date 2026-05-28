const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProfilOnet = sequelize.define('ProfilOnet', {
  eleveId:          { type: DataTypes.INTEGER, allowNull: false },
  testLevel:        DataTypes.INTEGER,
  scoresR:          { type: DataTypes.INTEGER, defaultValue: 0 },
  scoresI:          { type: DataTypes.INTEGER, defaultValue: 0 },
  scoresA:          { type: DataTypes.INTEGER, defaultValue: 0 },
  scoresS:          { type: DataTypes.INTEGER, defaultValue: 0 },
  scoresE:          { type: DataTypes.INTEGER, defaultValue: 0 },
  scoresC:          { type: DataTypes.INTEGER, defaultValue: 0 },
  primaryInterest:  DataTypes.STRING,
  secondaryInterest: DataTypes.STRING,
  tertiaryInterest: DataTypes.STRING,
  jobZone:          DataTypes.INTEGER,
  dreamUni:         DataTypes.STRING,
  dreamJob:         DataTypes.STRING,
  language:         { type: DataTypes.STRING, defaultValue: 'fr' },
  completedAt:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'ProfilOnet',
  timestamps: false,
});

module.exports = ProfilOnet;