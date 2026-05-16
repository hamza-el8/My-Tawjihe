const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Roadmap = sequelize.define('Roadmap', {
  matiereCible: DataTypes.STRING,
  niveau: DataTypes.STRING,
  parcours: DataTypes.TEXT,
  eleveId: { type: DataTypes.INTEGER, allowNull: false },
  metierId: DataTypes.INTEGER,
}, { tableName: 'Roadmap' });

module.exports = Roadmap;
