const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  contenu: { type: DataTypes.TEXT, allowNull: false },
  type: DataTypes.STRING,
  lu: { type: DataTypes.BOOLEAN, defaultValue: false },
  eleveId: DataTypes.INTEGER,
  admineId: DataTypes.INTEGER,
}, { tableName: 'Notification' });

module.exports = Notification;
