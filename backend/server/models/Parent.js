const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Parent = sequelize.define('Parent', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  motDePasse: { type: DataTypes.STRING, allowNull: false },
  eleveId: DataTypes.INTEGER,
}, { tableName: 'Parent' });

module.exports = Parent;
