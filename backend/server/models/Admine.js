const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admine = sequelize.define('Admine', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  motDePasse: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Admine' });

module.exports = Admine;
