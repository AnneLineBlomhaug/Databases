const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const VehicleColor = sequelize.define('VehicleColor', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'VehicleColors',
  timestamps: false
});

module.exports = VehicleColor;
