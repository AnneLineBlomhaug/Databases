const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const VehicleType = sequelize.define('VehicleType', {
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
  tableName: 'VehicleTypes',
  timestamps: false
});

module.exports = VehicleType;
