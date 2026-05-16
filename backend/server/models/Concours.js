const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Concours = sequelize.define('Concours', {
  nom: { type: DataTypes.STRING, allowNull: false },
  datw: DataTypes.DATEONLY,
  seuil: DataTypes.DECIMAL(5, 2),
  description: DataTypes.TEXT,
}, { tableName: 'Concours' });

module.exports = Concours;
