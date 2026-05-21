const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Concours = sequelize.define('Concours', {
  nom:         { type: DataTypes.STRING, allowNull: false },
  datw:        { type: DataTypes.DATEONLY },
  seuil:       { type: DataTypes.DECIMAL(5, 2) },
  description: { type: DataTypes.TEXT },
  lien:        { type: DataTypes.STRING },
}, { tableName: 'Concours' });

module.exports = Concours;
